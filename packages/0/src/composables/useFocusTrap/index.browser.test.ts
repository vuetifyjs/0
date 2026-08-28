import { describe, expect, it, onTestFinished } from 'vitest'
import { userEvent } from 'vitest/browser'

import { useFocusTrap } from './index'

// Utilities
import { effectScope, nextTick } from 'vue'

// Types
import type { UseFocusTrapOptions } from './index'

/**
 * Containment is the whole contract, and happy-dom implements no sequential
 * focus navigation — a synthetic Tab there only ever proves that the composable
 * moved focus itself, never that the *browser* could not move it somewhere else.
 * These cases press a real Tab in Chromium, so a leak shows up as focus landing
 * on one of the `outside-*` buttons.
 */

/**
 * A trap root flanked by tabbable elements on both sides, so focus escaping in
 * either direction has somewhere visible to land.
 */
function fixture (inner: string) {
  const container = document.createElement('div')

  container.innerHTML = `
    <button data-id="outside-before">before</button>
    <div data-id="root" tabindex="-1">${inner}</div>
    <button data-id="outside-after">after</button>
  `
  document.body.append(container)
  onTestFinished(() => container.remove())

  return (id: string) => container.querySelector<HTMLElement>(`[data-id="${id}"]`)!
}

async function trap (root: HTMLElement, options: UseFocusTrapOptions = {}) {
  const scope = effectScope()

  onTestFinished(() => scope.stop())

  const instance = scope.run(() => useFocusTrap(root, { active: true, ...options }))!

  await nextTick()

  return instance
}

describe('useFocusTrap', () => {
  it('should wrap a real Tab from the last tabbable to the first', async () => {
    const at = fixture('<button data-id="a">a</button><button data-id="b">b</button>')
    await trap(at('root'))

    at('b').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should wrap a real Shift+Tab from the first tabbable to the last', async () => {
    const at = fixture('<button data-id="a">a</button><button data-id="b">b</button>')
    await trap(at('root'))

    at('a').focus()
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')

    expect(document.activeElement).toBe(at('b'))
  })

  it('should let a real Tab move natively between the edges', async () => {
    const at = fixture(
      '<button data-id="a">a</button><button data-id="b">b</button>'
      + '<button data-id="c">c</button>',
    )
    await trap(at('root'))

    at('a').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('b'))
  })

  // The identity boundary test let this through: `x` is not `last`, so the trap
  // declined the keystroke and Chromium walked out to `outside-after`.
  it('should contain Tab from a script-focused element after the last tabbable', async () => {
    const at = fixture(
      '<button data-id="a">a</button><div data-id="x" tabindex="-1">x</div>',
    )
    await trap(at('root'))

    at('x').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should contain Shift+Tab from a script-focused element before the first tabbable', async () => {
    const at = fixture(
      '<div data-id="x" tabindex="-1">x</div><button data-id="a">a</button>',
    )
    await trap(at('root'))

    at('x').focus()
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')

    expect(document.activeElement).toBe(at('a'))
  })

  // Chromium puts only the checked radio in the tab order, so `r2` is the last
  // stop even though `r3` follows it. Counting each member as a stop computed a
  // boundary of `r3` and let Tab from `r2` leave.
  it('should contain Tab from the checked radio of a group', async () => {
    const at = fixture(
      '<button data-id="a">a</button>'
      + '<input type="radio" name="g" data-id="r1">'
      + '<input type="radio" name="g" data-id="r2" checked>'
      + '<input type="radio" name="g" data-id="r3">',
    )
    await trap(at('root'))

    at('r2').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should reach the group stop when Tab enters an unchecked group', async () => {
    const at = fixture(
      '<button data-id="a">a</button>'
      + '<input type="radio" name="g" data-id="r1">'
      + '<input type="radio" name="g" data-id="r2">',
    )
    await trap(at('root'))

    at('a').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('r1'))
  })

  // aria-disabled stays in the tab order per APG, so it is a real boundary.
  it('should treat an aria-disabled control as the boundary', async () => {
    const at = fixture(
      '<button data-id="a">a</button><button data-id="b" aria-disabled="true">b</button>',
    )
    await trap(at('root'))

    at('b').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should skip a disabled control when wrapping', async () => {
    const at = fixture(
      '<button data-id="a">a</button><button data-id="b">b</button>'
      + '<button data-id="c" disabled>c</button>',
    )
    await trap(at('root'))

    at('b').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should recover focus that escaped the root on the next Tab', async () => {
    const at = fixture('<button data-id="a">a</button><button data-id="b">b</button>')
    await trap(at('root'))

    at('outside-after').focus()
    await userEvent.keyboard('{Tab}')

    expect(document.activeElement).toBe(at('a'))
  })

  it('should restore focus to the trigger on deactivate', async () => {
    const at = fixture('<button data-id="a">a</button>')

    at('outside-before').focus()

    const instance = await trap(at('root'))

    expect(document.activeElement).toBe(at('a'))

    instance.deactivate()

    expect(document.activeElement).toBe(at('outside-before'))
  })
})

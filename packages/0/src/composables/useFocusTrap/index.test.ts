import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useFocusTrap as createFocusTrap } from './index'

// Utilities
import { effectScope, getCurrentScope, nextTick, shallowRef } from 'vue'

// useFocusTrap binds a document keydown listener through useEventListener inside
// an onScopeDispose(deactivate, true) — failSilently means calls outside any
// scope bind listeners with no teardown. Wrap the import so each test runs in a
// tracked scope, stopped in afterEach. Skip when the caller already provides a
// scope (the lifecycle tests deliberately exercise scope.stop() semantics).
const scopes: ReturnType<typeof effectScope>[] = []

function useFocusTrap (
  ...args: Parameters<typeof createFocusTrap>
): ReturnType<typeof createFocusTrap> {
  if (getCurrentScope()) return createFocusTrap(...args)
  const scope = effectScope()
  scopes.push(scope)
  return scope.run(() => createFocusTrap(...args))!
}

afterEach(() => {
  while (scopes.length > 0) {
    scopes.pop()!.stop()
  }
})

/**
 * Dispatch a Tab keydown on document and report whether the trap claimed it.
 *
 * happy-dom does not implement sequential focus navigation, so a synthetic Tab
 * never moves focus on its own. That is what makes these assertions meaningful:
 * any focus change is one the composable performed explicitly.
 */
function tab (options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    bubbles: true,
    cancelable: true,
    ...options,
  })
  document.dispatchEvent(event)
  return event
}

function press (key: string, options: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  })
  document.dispatchEvent(event)
  return event
}

function button (label: string): HTMLButtonElement {
  const el = document.createElement('button')
  el.textContent = label
  return el
}

describe('useFocusTrap', () => {
  let container: HTMLElement
  let root: HTMLElement
  let trigger: HTMLButtonElement
  let first: HTMLButtonElement
  let last: HTMLButtonElement

  beforeEach(() => {
    container = document.createElement('div')
    trigger = button('trigger')
    root = document.createElement('div')
    root.tabIndex = -1
    first = button('first')
    last = button('last')

    root.append(first, last)
    container.append(trigger, root)
    document.body.append(container)
    trigger.focus()
  })

  afterEach(() => {
    container.remove()
    document.body.focus()
  })

  describe('activation', () => {
    it('should focus the first tabbable descendant on activate', async () => {
      const trap = useFocusTrap(root)

      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(first)
    })

    it('should focus the root when there are no tabbable descendants', async () => {
      first.remove()
      last.remove()

      const trap = useFocusTrap(root)

      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(root)
    })

    it('should not move focus when initial is false', async () => {
      const trap = useFocusTrap(root, { initial: false })

      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(trigger)
    })

    it('should focus an explicit initial element', async () => {
      const trap = useFocusTrap(root, { initial: last })

      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(last)
    })

    it('should track isActive across activate and deactivate', async () => {
      const trap = useFocusTrap(root)

      expect(trap.isActive.value).toBe(false)

      trap.activate()
      await nextTick()
      expect(trap.isActive.value).toBe(true)

      trap.deactivate()
      expect(trap.isActive.value).toBe(false)
    })

    it('should not re-capture the restore target when activate is called twice', async () => {
      const trap = useFocusTrap(root)

      trap.activate()
      await nextTick()
      last.focus()
      trap.activate()
      await nextTick()

      trap.deactivate()

      expect(document.activeElement).toBe(trigger)
    })

    it('should deliver initial focus when the root mounts after activation', async () => {
      const el = shallowRef<HTMLElement | undefined>()
      const trap = useFocusTrap(el)

      trap.activate()
      await nextTick()
      expect(document.activeElement).toBe(trigger)

      el.value = root
      await nextTick()

      expect(document.activeElement).toBe(first)
    })
  })

  describe('reactive active option', () => {
    it('should activate when active is already true', async () => {
      useFocusTrap(root, { active: true })
      await nextTick()

      expect(document.activeElement).toBe(first)
    })

    it('should activate and deactivate as active flips', async () => {
      const isOpen = shallowRef(false)
      const trap = useFocusTrap(root, { active: isOpen })

      isOpen.value = true
      await nextTick()
      expect(trap.isActive.value).toBe(true)
      expect(document.activeElement).toBe(first)

      isOpen.value = false
      await nextTick()
      expect(trap.isActive.value).toBe(false)
      expect(document.activeElement).toBe(trigger)
    })

    it('should stay deactivated after deactivate while active still reads true', async () => {
      const isOpen = shallowRef(true)
      const trap = useFocusTrap(root, { active: isOpen })
      await nextTick()

      trap.deactivate()
      await nextTick()

      expect(trap.isActive.value).toBe(false)
      expect(tab().defaultPrevented).toBe(false)
    })

    it('should re-activate on the next false to true transition', async () => {
      const isOpen = shallowRef(true)
      const trap = useFocusTrap(root, { active: isOpen })
      await nextTick()

      trap.deactivate()
      isOpen.value = false
      await nextTick()
      isOpen.value = true
      await nextTick()

      expect(trap.isActive.value).toBe(true)
    })

    it('should stay inert with no active option until activate is called', async () => {
      const trap = useFocusTrap(root)
      await nextTick()

      expect(trap.isActive.value).toBe(false)
      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('tab containment', () => {
    beforeEach(async () => {
      useFocusTrap(root, { active: true })
      await nextTick()
    })

    it('should wrap Tab from the last tabbable to the first', () => {
      last.focus()

      expect(tab().defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(first)
    })

    it('should wrap Shift+Tab from the first tabbable to the last', () => {
      first.focus()

      expect(tab({ shiftKey: true }).defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(last)
    })

    it('should wrap Shift+Tab from the root itself to the last tabbable', () => {
      root.focus()

      expect(tab({ shiftKey: true }).defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(last)
    })

    it('should not intercept Tab in the middle of the list', () => {
      const middle = button('middle')
      last.before(middle)
      middle.focus()

      expect(tab().defaultPrevented).toBe(false)
      expect(document.activeElement).toBe(middle)
    })

    it('should ignore Ctrl, Alt, and Meta modified Tab', () => {
      last.focus()

      expect(tab({ ctrlKey: true }).defaultPrevented).toBe(false)
      expect(tab({ altKey: true }).defaultPrevented).toBe(false)
      expect(tab({ metaKey: true }).defaultPrevented).toBe(false)
      expect(document.activeElement).toBe(last)
    })

    it('should ignore keydown while composing', () => {
      last.focus()

      expect(tab({ isComposing: true }).defaultPrevented).toBe(false)
    })

    it('should ignore non-Tab, non-Escape keys', () => {
      last.focus()

      expect(press('ArrowDown').defaultPrevented).toBe(false)
      expect(document.activeElement).toBe(last)
    })

    it('should contain focus when an inner handler stops propagation', () => {
      root.addEventListener('keydown', event => event.stopPropagation())
      last.focus()

      expect(tab().defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(first)
    })
  })

  describe('escaped focus recovery', () => {
    beforeEach(async () => {
      useFocusTrap(root, { active: true })
      await nextTick()
    })

    it('should focus the first tabbable when Tab fires from outside the root', () => {
      document.body.focus()

      expect(tab().defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(first)
    })

    it('should focus the last tabbable when Shift+Tab fires from outside the root', () => {
      document.body.focus()

      expect(tab({ shiftKey: true }).defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(last)
    })

    it('should focus the root when focus escaped and nothing inside is tabbable', () => {
      first.remove()
      last.remove()
      document.body.focus()

      expect(tab().defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(root)
    })
  })

  describe('tabbable filtering', () => {
    async function trapWith (inner: string) {
      root.innerHTML = inner
      useFocusTrap(root, { active: true })
      await nextTick()
      return [...root.querySelectorAll<HTMLElement>('[data-id]')]
    }

    /** The wrap target on Tab-from-the-end proves which element ranked first. */
    function wrapTarget (): Element | null {
      const stops = [...root.querySelectorAll<HTMLElement>('*')]
      stops.at(-1)!.focus()
      tab()
      return document.activeElement
    }

    it('should skip disabled controls', async () => {
      const [, second] = await trapWith(
        '<button data-id="a" disabled>a</button><button data-id="b">b</button>',
      )

      expect(document.activeElement).toBe(second)
    })

    it('should skip negative tabindex values', async () => {
      const [, , third] = await trapWith(
        '<button data-id="a" tabindex="-1">a</button>'
        + '<button data-id="b" tabindex="-2">b</button>'
        + '<button data-id="c">c</button>',
      )

      expect(document.activeElement).toBe(third)
    })

    it('should include a tabindex zero div', async () => {
      const [firstStop] = await trapWith('<div data-id="a" tabindex="0">a</div>')

      expect(document.activeElement).toBe(firstStop)
    })

    it('should skip descendants of a hidden ancestor', async () => {
      const [, second] = await trapWith(
        '<div hidden><button data-id="a">a</button></div><button data-id="b">b</button>',
      )

      expect(document.activeElement).toBe(second)
    })

    it('should skip descendants of an inert ancestor', async () => {
      const [, second] = await trapWith(
        '<div inert><button data-id="a">a</button></div><button data-id="b">b</button>',
      )

      expect(document.activeElement).toBe(second)
    })

    it('should skip closed details content but keep its summary', async () => {
      await trapWith(
        '<details><summary data-id="s">s</summary><button data-id="a">a</button></details>',
      )

      expect(document.activeElement).toBe(root.querySelector('[data-id="s"]'))
    })

    it('should skip hidden inputs', async () => {
      const [, second] = await trapWith(
        '<input data-id="a" type="hidden"><input data-id="b">',
      )

      expect(document.activeElement).toBe(second)
    })

    it('should skip controls inside a disabled fieldset', async () => {
      const [, second] = await trapWith(
        '<fieldset disabled><button data-id="a">a</button></fieldset>'
        + '<button data-id="b">b</button>',
      )

      expect(document.activeElement).toBe(second)
    })

    it('should include controls inside a disabled fieldset first legend', async () => {
      const [firstStop] = await trapWith(
        '<fieldset disabled><legend><button data-id="a">a</button></legend>'
        + '<button data-id="b">b</button></fieldset>',
      )

      expect(document.activeElement).toBe(firstStop)
    })

    it('should include an anchor inside a disabled fieldset', async () => {
      const [firstStop] = await trapWith(
        '<fieldset disabled><a data-id="a" href="#x">a</a>'
        + '<button data-id="b">b</button></fieldset>',
      )

      expect(document.activeElement).toBe(firstStop)
    })

    it('should include aria-disabled controls, which stay in the tab order', async () => {
      const [firstStop] = await trapWith(
        '<button data-id="a" aria-disabled="true">a</button><button data-id="b">b</button>',
      )

      expect(document.activeElement).toBe(firstStop)
    })

    it('should skip anchors without href', async () => {
      const [, second] = await trapWith('<a data-id="a">a</a><button data-id="b">b</button>')

      expect(document.activeElement).toBe(second)
    })

    // Canary: happy-dom does not implement checkVisibility, so the composable
    // must fall through to "assume visible". A failure here means the runtime
    // grew the API and its verdict disagrees with the attribute-only checks.
    it('should treat a plain element as visible', async () => {
      const [firstStop] = await trapWith('<button data-id="a">a</button>')

      expect(document.activeElement).toBe(firstStop)
    })

    it('should skip an element whose checkVisibility returns false', async () => {
      root.innerHTML = '<button data-id="a">a</button><button data-id="b">b</button>'
      const [hidden, visible] = [...root.querySelectorAll<HTMLElement>('[data-id]')]
      hidden!.checkVisibility = () => false
      visible!.checkVisibility = () => true

      useFocusTrap(root, { active: true })
      await nextTick()

      expect(document.activeElement).toBe(visible)
    })

    it('should rank the last tabbable correctly when trailing candidates are filtered', async () => {
      await trapWith(
        '<button data-id="a">a</button><button data-id="b">b</button>'
        + '<button data-id="c" disabled>c</button>',
      )

      expect(wrapTarget()).toBe(root.querySelector('[data-id="a"]'))
    })
  })

  describe('restore', () => {
    it('should restore focus to the previously focused element', async () => {
      const trap = useFocusTrap(root)

      trap.activate()
      await nextTick()
      trap.deactivate()

      expect(document.activeElement).toBe(trigger)
    })

    it('should not restore when restore is false', async () => {
      const trap = useFocusTrap(root, { restore: false })

      trap.activate()
      await nextTick()
      trap.deactivate()

      expect(document.activeElement).toBe(first)
    })

    it('should not restore when focus already moved outside the root', async () => {
      const elsewhere = button('elsewhere')
      container.append(elsewhere)

      const trap = useFocusTrap(root)
      trap.activate()
      await nextTick()

      elsewhere.focus()
      trap.deactivate()

      expect(document.activeElement).toBe(elsewhere)
    })

    it('should blur the trapped element when the restore target was disconnected', async () => {
      const trap = useFocusTrap(root)

      trap.activate()
      await nextTick()
      trigger.remove()
      trap.deactivate()

      expect(document.activeElement).toBe(document.body)
    })

    it('should no-op on deactivate when never activated', () => {
      const trap = useFocusTrap(root)

      expect(() => trap.deactivate()).not.toThrow()
      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('escape', () => {
    it('should invoke onEscape while active and owning focus', async () => {
      const onEscape = vi.fn()
      useFocusTrap(root, { active: true, onEscape })
      await nextTick()

      press('Escape')

      expect(onEscape).toHaveBeenCalledTimes(1)
    })

    it('should not preventDefault or deactivate on its own', async () => {
      const onEscape = vi.fn()
      const trap = useFocusTrap(root, { active: true, onEscape })
      await nextTick()

      const event = press('Escape')

      expect(event.defaultPrevented).toBe(false)
      expect(trap.isActive.value).toBe(true)
    })

    it('should not invoke onEscape when focus is outside the root', async () => {
      const elsewhere = button('elsewhere')
      container.append(elsewhere)

      const onEscape = vi.fn()
      useFocusTrap(root, { active: true, onEscape })
      await nextTick()

      elsewhere.focus()
      press('Escape')

      expect(onEscape).not.toHaveBeenCalled()
    })

    it('should not invoke onEscape while inactive', async () => {
      const onEscape = vi.fn()
      useFocusTrap(root, { onEscape })
      await nextTick()

      press('Escape')

      expect(onEscape).not.toHaveBeenCalled()
    })
  })

  describe('root lifecycle', () => {
    it('should no-op with a null target', async () => {
      const trap = useFocusTrap(shallowRef(null))

      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(trigger)
      expect(tab().defaultPrevented).toBe(false)
    })

    it('should no-op with a detached root', async () => {
      const detached = document.createElement('div')
      detached.append(button('a'))

      const trap = useFocusTrap(detached)
      trap.activate()
      await nextTick()

      expect(document.activeElement).toBe(trigger)
      expect(tab().defaultPrevented).toBe(false)
    })

    it('should stop intercepting Tab once the root is removed while active', async () => {
      useFocusTrap(root, { active: true })
      await nextTick()

      root.remove()

      expect(tab().defaultPrevented).toBe(false)
    })

    it('should still restore focus after the root is removed while active', async () => {
      const trap = useFocusTrap(root, { active: true })
      await nextTick()

      root.remove()
      trap.deactivate()

      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('shadow dom', () => {
    it('should treat focus inside an open shadow root as contained', async () => {
      const host = document.createElement('div')
      root.append(host)
      const shadow = host.attachShadow({ mode: 'open' })
      const inner = button('inner')
      shadow.append(inner)

      useFocusTrap(root, { active: true })
      await nextTick()

      inner.focus()

      expect(tab().defaultPrevented).toBe(false)
    })
  })

  describe('manual binding', () => {
    it('should expose onKeydown for a consumer-owned listener', async () => {
      const trap = useFocusTrap(root, { active: true })
      await nextTick()
      last.focus()

      const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
      trap.onKeydown(event)

      expect(event.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(first)
    })
  })

  describe('scope lifecycle', () => {
    it('should restore focus when the owning scope stops while active', async () => {
      const scope = effectScope()
      const trap = scope.run(() => createFocusTrap(root, { active: true }))!
      await nextTick()
      expect(trap.isActive.value).toBe(true)

      scope.stop()

      expect(document.activeElement).toBe(trigger)
    })

    it('should stop intercepting Tab after the scope stops', async () => {
      const scope = effectScope()
      scope.run(() => createFocusTrap(root, { active: true }))
      await nextTick()

      scope.stop()
      last.focus()

      expect(tab().defaultPrevented).toBe(false)
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR safety', () => {
    it('should expose a valid API and never throw', async () => {
      const trap = useFocusTrap(root, { active: true })
      await nextTick()

      expect(trap).toHaveProperty('isActive')
      expect(trap).toHaveProperty('activate')
      expect(trap).toHaveProperty('deactivate')
      expect(trap).toHaveProperty('onKeydown')
      expect(() => trap.activate()).not.toThrow()
      expect(() => trap.deactivate()).not.toThrow()
    })
  })
})

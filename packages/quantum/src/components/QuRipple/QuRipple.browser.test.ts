import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { QuRipple } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { ReducedMotionMode } from '@vuetify/v0'
import type { VNode } from 'vue'

// A 60 x 80 host: its diagonal is a round 100, so the centred ink measures 100.
const HOST = 'position: relative; width: 60px; height: 80px; border: 0; padding: 0'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, mode?: ReducedMotionMode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  if (mode) app.use(createReducedMotionPlugin({ mode }))
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
  // The reduced-motion adapter writes the body attribute on install and never clears it.
  delete document.body.dataset.reducedMotion
})

async function settle () {
  await nextTick()
  await nextTick()
}

function button (props: Record<string, unknown> = {}, ripple: Record<string, unknown> = {}) {
  return () => h('button', { type: 'button', style: HOST, ...props }, [h(QuRipple, ripple), 'Save'])
}

function press (el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + x,
    clientY: rect.top + y,
    pointerType: 'mouse',
  }))
}

function release (el: HTMLElement, type: 'pointerup' | 'pointercancel' | 'pointerleave' = 'pointerup') {
  el.dispatchEvent(new PointerEvent(type, { bubbles: type !== 'pointerleave', button: 0 }))
}

function inks (host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('.quantum-ripple__ink')]
}

function geometry (ink: HTMLElement) {
  const size = Number.parseFloat(ink.style.width)
  return {
    x: Number.parseFloat(ink.style.left) + size / 2,
    y: Number.parseFloat(ink.style.top) + size / 2,
    size,
  }
}

describe('quRipple', () => {
  it('should render the hidden ink layer as the host child', async () => {
    const host = mount(button())
    await settle()

    const el = host.querySelector('button')!
    const ripple = el.firstElementChild as HTMLElement

    expect(ripple.classList.contains('quantum-ripple')).toBe(true)
    expect(ripple.getAttribute('aria-hidden')).toBe('true')
    expect(Object.hasOwn(ripple.dataset, 'unbounded')).toBe(false)
    expect(ripple.children.length).toBe(0)

    const style = getComputedStyle(ripple)

    expect(style.position).toBe('absolute')
    expect(style.pointerEvents).toBe('none')
    expect(style.overflow).toBe('hidden')
    expect(style.color).toBe('rgba(153, 153, 153, 0.4)')
  })

  it('should add an ink at the pointer on pointerdown', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    press(el, 10, 6)
    await settle()

    const list = inks(host)

    expect(list.length).toBe(1)
    expect(list[0].dataset.state).toBe('in')

    const { x, y, size } = geometry(list[0])

    expect(x).toBeCloseTo(10, 3)
    expect(y).toBeCloseTo(6, 3)
    // The radius reaches the farthest corner so the ink still fills the host.
    expect(size).toBeCloseTo(2 * Math.hypot(50, 74), 3)
    expect(getComputedStyle(list[0]).animationName).toBe('quantum-ripple-in')
  })

  it('should measure the origin from the padding box of a bordered host', async () => {
    const host = mount(button({ style: `${HOST}; border: 4px solid black` }))
    await settle()

    const el = host.querySelector('button')!
    press(el, 10, 6)
    await settle()

    const { x, y } = geometry(inks(host)[0])

    expect(x).toBeCloseTo(6, 3)
    expect(y).toBeCloseTo(2, 3)
  })

  it('should hold an expanded ink until pointerup, then fade and remove it', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    press(el, 30, 40)
    await settle()

    const [ink] = inks(host)

    await expect.poll(() => ink.dataset.state).toBe('hold')
    expect(inks(host).length).toBe(1)

    release(el)
    await settle()

    expect(ink.dataset.state).toBe('out')
    expect(getComputedStyle(ink).animationName).toBe('quantum-ripple-out')

    await expect.poll(() => inks(host).length).toBe(0)
  })

  it('should finish the expansion of a quick tap before fading', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    press(el, 5, 5)
    release(el)
    await settle()

    const [ink] = inks(host)

    expect(ink.dataset.state).toBe('in')

    await expect.poll(() => ink.dataset.state).toBe('out')
    await expect.poll(() => inks(host).length).toBe(0)
  })

  it('should release on pointercancel and pointerleave', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!

    for (const type of ['pointercancel', 'pointerleave'] as const) {
      press(el, 30, 40)
      await settle()

      const [ink] = inks(host)

      await expect.poll(() => ink.dataset.state).toBe('hold')

      release(el, type)
      await settle()

      expect(ink.dataset.state).toBe('out')

      await expect.poll(() => inks(host).length).toBe(0)
    }
  })

  it('should ripple from a real click and leave nothing behind', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    await userEvent.click(el)
    await settle()

    expect(inks(host).length).toBe(1)

    await expect.poll(() => inks(host).length).toBe(0)
  })

  it('should centre the ink under center', async () => {
    const host = mount(button({}, { center: true }))
    await settle()

    const el = host.querySelector('button')!
    press(el, 5, 5)
    await settle()

    const { x, y, size } = geometry(inks(host)[0])

    expect(x).toBeCloseTo(30, 3)
    expect(y).toBeCloseTo(40, 3)
    expect(size).toBeCloseTo(100, 3)
  })

  it('should expose data-unbounded and draw the 48 px circle at the centre', async () => {
    const host = mount(button({}, { unbounded: true }))
    await settle()

    const el = host.querySelector('button')!
    const ripple = el.firstElementChild as HTMLElement

    expect(Object.hasOwn(ripple.dataset, 'unbounded')).toBe(true)
    expect(getComputedStyle(ripple).overflow).toBe('visible')

    press(el, 5, 5)
    await settle()

    const { x, y, size } = geometry(inks(host)[0])

    expect(x).toBeCloseTo(30, 3)
    expect(y).toBeCloseTo(40, 3)
    expect(size).toBe(48)
  })

  it('should give a disabled host no ink', async () => {
    const host = mount(() => h('div', [
      h('button', { type: 'button', style: HOST, disabled: true }, [h(QuRipple), 'Stop']),
      h('button', { 'type': 'button', 'style': HOST, 'aria-disabled': 'true' }, [h(QuRipple), 'Stop']),
      h('button', { 'type': 'button', 'style': HOST, 'data-disabled': 'true' }, [h(QuRipple), 'Stop']),
    ]))
    await settle()

    for (const el of host.querySelectorAll('button')) {
      press(el, 30, 40)
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    }
    await settle()

    expect(inks(host).length).toBe(0)
  })

  it('should add a centred ink on Space and release it on keyup', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    el.focus()
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    // A held key repeats keydown; the ink must not multiply.
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, repeat: true }))
    await settle()

    const list = inks(host)

    expect(list.length).toBe(1)

    const { x, y, size } = geometry(list[0])

    expect(x).toBeCloseTo(30, 3)
    expect(y).toBeCloseTo(40, 3)
    expect(size).toBeCloseTo(100, 3)

    await expect.poll(() => list[0].dataset.state).toBe('hold')

    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', bubbles: true }))
    await settle()

    expect(list[0].dataset.state).toBe('hold')

    el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }))
    await settle()

    expect(list[0].dataset.state).toBe('out')

    await expect.poll(() => inks(host).length).toBe(0)
  })

  it('should release a keyboard press when the host loses focus', async () => {
    const host = mount(button(), 'never')
    await settle()

    const el = host.querySelector('button')!
    el.focus()
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()

    expect(inks(host).length).toBe(1)

    el.blur()
    await settle()

    await expect.poll(() => inks(host).length).toBe(0)
  })

  it('should remove the ink at once when the plugin reduces motion', async () => {
    const host = mount(button(), 'always')
    await settle()

    expect(document.body.dataset.reducedMotion).toBe('reduce')

    const el = host.querySelector('button')!
    press(el, 10, 10)
    await settle()

    const [ink] = inks(host)

    // The static pressed fill: no animation, the resting values are the landed state.
    expect(ink.dataset.state).toBe('in')
    expect(getComputedStyle(ink).animationName).toBe('none')
    expect(getComputedStyle(ink).opacity).toBe('1')

    release(el)
    await settle()

    expect(inks(host).length).toBe(0)
  })

  it('should follow the OS preference when no plugin is installed', async () => {
    // vitest.browser.config.ts emulates `prefers-reduced-motion: reduce`.
    expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true)

    const host = mount(button())
    await settle()

    const el = host.querySelector('button')!
    press(el, 10, 10)
    await settle()

    expect(inks(host).length).toBe(1)
    expect(getComputedStyle(inks(host)[0]).animationName).toBe('none')

    release(el)
    await settle()

    expect(inks(host).length).toBe(0)
  })
})

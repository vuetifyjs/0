import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, createRtlPlugin } from '@vuetify/v0'

// Components
import { Md1Slider } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1SliderProps } from './Md1Slider.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // Room for the value pin above the track and a fixed track length for the percent maths.
  host.style.padding = '48px 24px'
  host.style.width = '400px'
  document.body.append(host)
  const app = createApp({ render: node })
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

interface Parts {
  host: HTMLElement
  root: HTMLElement
  control: HTMLElement
  track: HTMLElement
  range: HTMLElement
  rest: HTMLElement
  thumb: HTMLElement
}

function parts (host: HTMLElement): Parts {
  return {
    host,
    root: host.querySelector<HTMLElement>('.md1-slider')!,
    control: host.querySelector<HTMLElement>('.md1-slider__control')!,
    track: host.querySelector<HTMLElement>('.md1-slider__track')!,
    range: host.querySelector<HTMLElement>('.md1-slider__range')!,
    rest: host.querySelector<HTMLElement>('.md1-slider__rest')!,
    thumb: host.querySelector<HTMLElement>('[role="slider"]')!,
  }
}

function slider (props: Md1SliderProps & Record<string, unknown> = {}, setup?: (app: App) => void): Parts {
  return parts(mount(() => h(Md1Slider, props), setup))
}

/** A slider bound to a model the test can read back. */
function bound (props: Md1SliderProps & Record<string, unknown> = {}, initial = 50, setup?: (app: App) => void) {
  const model = shallowRef(initial)
  const found = parts(mount(() => h(Md1Slider, {
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: number) => {
      model.value = value
    },
  }), setup))

  return { ...found, model }
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a colour, so assertions never guess at formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.backgroundColor = value
  document.body.append(probe)
  const result = getComputedStyle(probe).backgroundColor
  probe.remove()
  return result
}

function dot (thumb: HTMLElement): CSSStyleDeclaration {
  return getComputedStyle(thumb, '::after')
}

function centre (el: HTMLElement): { x: number, y: number } {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

/** The x coordinate at `percent` along the track. */
function at (track: HTMLElement, percent: number): number {
  const rect = track.getBoundingClientRect()
  return rect.left + rect.width * percent / 100
}

function down (el: HTMLElement, x: number, y = centre(el).y) {
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y, pointerType: 'mouse' }))
}

function move (x: number, y: number) {
  document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: x, clientY: y, pointerType: 'mouse' }))
}

function up () {
  document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
}

/**
 * The resting underline's alpha. It derives from the 6% hover token times seven, which the
 * browser stores in 8-bit steps, so it lands near 42% rather than on it.
 */
function line (field: HTMLElement): number {
  const color = getComputedStyle(field).borderBottomColor
  const match = /\/\s*([\d.]+)\)$/.exec(color) ?? /,\s*([\d.]+)\)$/.exec(color)
  return Number(match?.[1])
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
}

function never (app: App) {
  app.use(createReducedMotionPlugin({ mode: 'never' }))
}

beforeEach(() => {
  // Geometry and colour are asserted at rest; the transitions are a separate concern.
  style('.md1-slider, .md1-slider *, .md1-slider *::before, .md1-slider *::after { transition: none !important; }')
})

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quSlider', () => {
  describe('anatomy', () => {
    it('should render the group, the track and a thumb without a ripple, and nothing optional', async () => {
      const { root, track, thumb } = slider({ label: 'Volume' })
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('role')).toBe('group')
      expect(root.getAttribute('aria-label')).toBe('Volume')
      expect(root.getAttribute('dir')).toBe('ltr')
      expect(track.tagName).toBe('DIV')
      expect(track.querySelector('.md1-slider__range')!.tagName).toBe('SPAN')
      expect(thumb.classList.contains('md1-slider__thumb')).toBe(true)
      // The sliders page draws no thumb ripple and Vuetify 1.5 has none: the pressed thumb and halo are the feedback.
      expect(thumb.querySelector('.md1-ripple')).toBeNull()

      expect(root.querySelector('.md1-icon')).toBeNull()
      expect(root.querySelector('.md1-slider__ticks')).toBeNull()
      expect(root.querySelector('.md1-slider__pin')).toBeNull()
      expect(root.querySelector('input')).toBeNull()

      expect(Object.hasOwn(root.dataset, 'discrete')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'editable')).toBe(false)
    })

    it('should expose the WAI-ARIA slider attributes on the thumb', async () => {
      const { thumb } = slider({ label: 'Volume', modelValue: 30, min: 10, max: 50 })
      await settle()

      expect(thumb.getAttribute('aria-valuenow')).toBe('30')
      expect(thumb.getAttribute('aria-valuemin')).toBe('10')
      expect(thumb.getAttribute('aria-valuemax')).toBe('50')
      expect(thumb.getAttribute('aria-orientation')).toBe('horizontal')
      expect(thumb.getAttribute('aria-label')).toBe('Volume')
      expect(thumb.getAttribute('tabindex')).toBe('0')
    })

    it('should name the thumb by ariaLabel over label, and fall back to a translatable default', async () => {
      const { root, thumb } = slider({ label: 'Audio', ariaLabel: 'Media volume' })
      const fallback = slider()
      await settle()

      expect(root.getAttribute('aria-label')).toBe('Audio')
      expect(thumb.getAttribute('aria-label')).toBe('Media volume')
      expect(fallback.thumb.getAttribute('aria-label')).toBe('Slider')
    })

    it('should draw a 2 dp line, a 32 dp thumb footprint around a 12 dp dot, inside a 48 dp touch band', async () => {
      const { control, range, rest, thumb } = slider({ modelValue: 50 })
      await settle()

      expect(control.getBoundingClientRect().height).toBe(48)
      expect(range.getBoundingClientRect().height).toBe(2)
      expect(rest.getBoundingClientRect().height).toBe(2)

      const rect = thumb.getBoundingClientRect()

      expect(rect.width).toBe(32)
      expect(rect.height).toBe(32)
      expect(dot(thumb).width).toBe('12px')
      expect(dot(thumb).height).toBe('12px')
      expect(dot(thumb).borderRadius).toBe('50%')
    })

    it('should centre the thumb on the value and split the line there', async () => {
      const { track, range, rest, thumb } = slider({ modelValue: 25 })
      await settle()

      const line = track.getBoundingClientRect()
      const x = at(track, 25)

      expect(centre(thumb).x).toBeCloseTo(x, 0)
      expect(centre(thumb).y).toBeCloseTo(line.top + line.height / 2, 0)
      expect(range.getBoundingClientRect().left).toBeCloseTo(line.left, 0)
      expect(range.getBoundingClientRect().right).toBeCloseTo(x, 0)
      expect(rest.getBoundingClientRect().left).toBeCloseTo(x, 0)
      expect(rest.getBoundingClientRect().right).toBeCloseTo(line.right, 0)
    })

    it('should paint the active portion and the dot in the accent and the inactive portion at 26% black', async () => {
      const { range, rest, thumb } = slider({ modelValue: 50 })
      await settle()

      expect(getComputedStyle(range).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(dot(thumb).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
      // Flat: no shadow anywhere.
      expect(dot(thumb).boxShadow).toBe('none')
      expect(getComputedStyle(thumb).boxShadow).toBe('none')
    })

    it('should forward namespace to the track, range and thumb so a custom key still resolves', async () => {
      const { thumb, range, track, model } = bound({ namespace: 'md1:test-slider' }, 30)
      await settle()

      expect(thumb.getAttribute('aria-valuenow')).toBe('30')
      expect(range.getBoundingClientRect().right).toBeCloseTo(at(track, 30), 0)

      thumb.focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(model.value).toBe(31)
    })

    it('should submit through v0\'s hidden input when name is set', async () => {
      const { host } = slider({ name: 'volume', modelValue: 40 })
      await settle()

      const input = host.querySelector<HTMLInputElement>('input[name="volume"]')!

      expect(input).not.toBeNull()
      expect(input.value).toBe('40')
    })
  })

  describe('zero', () => {
    it('should turn the thumb into a hollow 2 dp ring at the minimum and stop the line at its edge', async () => {
      const { root, range, rest, thumb } = slider({ modelValue: 0 })
      await settle()

      expect(Object.hasOwn(root.dataset, 'zero')).toBe(true)
      expect(dot(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(dot(thumb).borderTopWidth).toBe('2px')
      expect(dot(thumb).borderTopColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(dot(thumb).width).toBe('12px')
      expect(range.getBoundingClientRect().width).toBe(0)
      expect(getComputedStyle(rest).marginLeft).toBe('6px')
    })

    it('should key the zero state on min, not on 0, and clear it above', async () => {
      const low = slider({ modelValue: 20, min: 20, max: 40 })
      const high = slider({ modelValue: 21, min: 20, max: 40 })
      await settle()

      expect(Object.hasOwn(low.root.dataset, 'zero')).toBe(true)
      expect(Object.hasOwn(high.root.dataset, 'zero')).toBe(false)
      expect(getComputedStyle(high.rest).marginLeft).toBe('0px')
    })
  })

  describe('keyboard', () => {
    it('should step with the arrows and jump with Home, End, PageUp and PageDown', async () => {
      const { thumb, model } = bound({}, 50)
      await settle()

      thumb.focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(model.value).toBe(51)

      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')

      expect(model.value).toBe(49)

      await userEvent.keyboard('{PageUp}')

      expect(model.value).toBe(59)

      await userEvent.keyboard('{PageDown}{PageDown}')

      expect(model.value).toBe(39)

      await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}')

      expect(model.value).toBe(49)

      await userEvent.keyboard('{End}')

      expect(model.value).toBe(100)

      await userEvent.keyboard('{Home}')

      expect(model.value).toBe(0)
      await settle()
      expect(thumb.getAttribute('aria-valuenow')).toBe('0')
    })

    it('should respect min, max and step', async () => {
      const { thumb, model } = bound({ min: 10, max: 50, step: 5 }, 20)
      await settle()

      thumb.focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(model.value).toBe(25)

      await userEvent.keyboard('{End}{ArrowRight}')

      expect(model.value).toBe(50)
    })

    it('should draw the 32 dp halo at 16% accent and lift the inactive line to 38% on keyboard focus', async () => {
      const { thumb, rest } = slider({ modelValue: 50 })
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(thumb)
      expect(thumb.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(thumb).backgroundColor)
        .toBe(serialize('color-mix(in srgb, rgb(255, 64, 129) 16%, transparent)'))
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should leave no halo behind after a mouse press', async () => {
      const { thumb, rest } = slider({ modelValue: 50 })
      await settle()

      await userEvent.click(thumb)
      await settle()

      expect(thumb.matches(':focus-visible')).toBe(false)
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
    })

    it('should draw the zero halo as the 12% focus overlay and the ring at 38%', async () => {
      const { thumb } = slider({ modelValue: 0 })
      await settle()

      await userEvent.tab()

      expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(dot(thumb).borderTopColor).toBe('rgba(0, 0, 0, 0.38)')
    })
  })

  describe('pointer', () => {
    it('should jump to the pressed point on the track, follow the drag and settle on release', async () => {
      const { root, track, rest, thumb, model } = bound({}, 10)
      await settle()

      const y = centre(track).y

      down(track, at(track, 75), y)
      await settle()

      expect(model.value).toBe(75)
      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(true)
      expect(thumb.dataset.state).toBe('dragging')
      // Pressed: the dot grows to 18 dp and the inactive line rises to 38%.
      expect(dot(thumb).width).toBe('18px')
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.38)')

      move(at(track, 25), y)
      await settle()

      expect(model.value).toBe(25)

      up()
      await settle()

      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(false)
      expect(dot(thumb).width).toBe('12px')
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
    })

    it('should drag from the thumb without jumping and draw no ink', async () => {
      const { root, track, thumb, model } = bound({}, 40, never)
      await settle()

      const start = centre(thumb)

      down(thumb, start.x, start.y)
      await settle()

      expect(model.value).toBe(40)
      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(true)
      expect(inks(thumb).length).toBe(0)

      move(at(track, 60), start.y)
      await settle()

      expect(model.value).toBe(60)

      up()
      await settle()

      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(false)
    })

    it('should grow the zero ring to 18 dp and keep the line clear of it while pressed', async () => {
      const { thumb, rest } = slider({ modelValue: 0 })
      await settle()

      const start = centre(thumb)

      down(thumb, start.x, start.y)
      await settle()

      expect(dot(thumb).width).toBe('18px')
      expect(dot(thumb).borderTopColor).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(rest).marginLeft).toBe('9px')

      up()
    })
  })

  describe('discrete', () => {
    it('should mark data-discrete and lay one 2 dp tick on every value, hidden until pressed', async () => {
      const { root, track } = slider({ discrete: true, step: 10, modelValue: 30 })
      await settle()

      const ticks = [...root.querySelectorAll<HTMLElement>('.md1-slider__tick')]
      const container = root.querySelector<HTMLElement>('.md1-slider__ticks')!

      expect(Object.hasOwn(root.dataset, 'discrete')).toBe(true)
      expect(container.getAttribute('aria-hidden')).toBe('true')
      expect(ticks.length).toBe(11)
      expect(ticks[0].getBoundingClientRect().width).toBe(2)
      expect(ticks[0].getBoundingClientRect().height).toBe(2)
      expect(centre(ticks[0]).x).toBeCloseTo(at(track, 0), 0)
      expect(centre(ticks[10]).x).toBeCloseTo(at(track, 100), 0)
      expect(centre(ticks[3]).x).toBeCloseTo(at(track, 30), 0)
      expect(getComputedStyle(ticks[0]).backgroundColor).toBe('rgb(0, 0, 0)')
      expect(getComputedStyle(container).opacity).toBe('0')

      down(track, at(track, 52))
      await settle()

      expect(getComputedStyle(container).opacity).toBe('1')

      up()
    })

    it('should lay the ticks on the reachable values when step does not divide the range', async () => {
      const { root, track } = slider({ discrete: true, step: 30, modelValue: 30 })
      await settle()

      const ticks = [...root.querySelectorAll<HTMLElement>('.md1-slider__tick')]

      // v0 snaps to min + n * step, so 0, 30, 60 and 90: no tick at 100.
      expect(ticks.length).toBe(4)
      expect(centre(ticks[1]).x).toBeCloseTo(at(track, 30), 0)
      expect(centre(ticks[3]).x).toBeCloseTo(at(track, 90), 0)
    })

    it('should fill the dot in the primary text ink at the minimum instead of the ring', async () => {
      const { thumb, rest } = slider({ discrete: true, step: 10, modelValue: 0 })
      await settle()

      expect(dot(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0.87)')
      expect(dot(thumb).borderTopWidth).toBe('0px')
      expect(dot(thumb).width).toBe('12px')
      expect(getComputedStyle(rest).marginLeft).toBe('0px')
    })

    it('should snap a press to the nearest tick', async () => {
      const { track, model } = bound({ discrete: true, step: 10 }, 30)
      await settle()

      down(track, at(track, 47))
      await settle()

      expect(model.value).toBe(50)

      up()
    })

    it('should swap the thumb for the 26 x 32 dp value pin while pressed, its tip 8 dp above the track', async () => {
      const { root, track, thumb } = slider({ discrete: true, step: 10, modelValue: 30 })
      await settle()

      const pin = root.querySelector<HTMLElement>('.md1-slider__pin')!

      expect(pin.getAttribute('aria-hidden')).toBe('true')
      expect(pin.textContent).toBe('30')
      expect(getComputedStyle(pin).transform).toBe('matrix(0, 0, 0, 0, 0, 0)')

      down(track, at(track, 70))
      await settle()

      expect(pin.textContent).toBe('70')
      expect(getComputedStyle(pin).transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
      expect(dot(thumb).transform).toContain('matrix(0, 0, 0, 0')

      const box = pin.getBoundingClientRect()
      const line = centre(track).y
      // The circle of the pin is 26 dp; its point reaches 26 / sqrt(2) below the centre.
      const tip = box.top + 13 + 13 * Math.SQRT2

      expect(box.width).toBe(26)
      expect(box.height).toBe(26)
      expect(line - tip).toBeCloseTo(8, 0)
      expect(tip - box.top).toBeCloseTo(31.4, 0)
      expect(centre(pin).x).toBeCloseTo(at(track, 70), 0)
      expect(getComputedStyle(pin, '::before').backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(pin).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(pin).fontSize).toBe('10px')

      up()
    })

    it('should show the pin on keyboard focus without a halo', async () => {
      const { root, thumb } = slider({ discrete: true, step: 10, modelValue: 30 })
      await settle()

      await userEvent.tab()

      const pin = root.querySelector<HTMLElement>('.md1-slider__pin')!

      expect(thumb.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(pin).transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0)')

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(pin.textContent).toBe('40')
    })

    it('should grey the pin at the minimum', async () => {
      const { root } = slider({ discrete: true, step: 10, modelValue: 0 })
      await settle()

      await userEvent.tab()

      const pin = root.querySelector<HTMLElement>('.md1-slider__pin')!

      expect(getComputedStyle(pin, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
    })
  })

  describe('icons', () => {
    it('should draw the intensity icons through Md1Icon at the ends, 24 dp and 16 dp from the track', async () => {
      const { root, control } = slider({ iconStart: 'remove', iconEnd: 'add' })
      await settle()

      const [start, end] = [...root.querySelectorAll<SVGElement>(':scope > svg.md1-icon')]

      expect(root.firstElementChild).toBe(start)
      expect(root.lastElementChild).toBe(end)
      expect([...start.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.remove)
      expect([...end.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.add)
      expect(start.getAttribute('aria-hidden')).toBe('true')
      expect(start.getBoundingClientRect().width).toBe(24)
      expect(control.getBoundingClientRect().left - start.getBoundingClientRect().right).toBe(16)
      expect(end.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(16)
      expect(getComputedStyle(start).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should drop the icons to the disabled ink', async () => {
      const { root } = slider({ iconStart: 'remove', disabled: true })
      await settle()

      expect(getComputedStyle(root.querySelector('svg')!).color).toBe('rgba(0, 0, 0, 0.26)')
    })
  })

  describe('editable', () => {
    it('should place a 24 dp numeric field 16 dp after the track, named like the slider', async () => {
      const { root, control } = slider({ editable: true, label: 'Volume', modelValue: 50 })
      await settle()

      const field = root.querySelector<HTMLElement>('.md1-slider__field')!
      const input = field.querySelector<HTMLInputElement>('input')!

      expect(Object.hasOwn(root.dataset, 'editable')).toBe(true)
      expect(root.lastElementChild).toBe(field)
      expect(input.classList.contains('md1-slider__input')).toBe(true)
      expect(input.value).toBe('50')
      expect(input.getAttribute('aria-label')).toBe('Volume')
      expect(input.getAttribute('inputmode')).toBe('decimal')
      expect(input.getBoundingClientRect().width).toBeGreaterThanOrEqual(24)
      expect(getComputedStyle(input).textAlign).toBe('end')
      expect(field.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(16)
      expect(getComputedStyle(field).borderBottomWidth).toBe('1px')
      expect(line(field)).toBeCloseTo(0.42, 1)
    })

    it('should set the exact value from the field, clamped and snapped, and show the model again on blur', async () => {
      const { root, thumb, model } = bound({ editable: true }, 50)
      await settle()

      const input = root.querySelector<HTMLInputElement>('.md1-slider__input')!

      await userEvent.fill(input, '73')
      await settle()

      expect(model.value).toBe(73)
      expect(thumb.getAttribute('aria-valuenow')).toBe('73')
      expect(getComputedStyle(root.querySelector('.md1-slider__field')!).borderBottomColor).toBe('rgb(255, 64, 129)')

      await userEvent.fill(input, '150')
      await settle()

      expect(model.value).toBe(100)
      expect(input.value).toBe('150')

      await userEvent.fill(input, 'abc')
      await settle()

      expect(model.value).toBe(100)

      input.blur()
      await settle()

      expect(input.value).toBe('100')
    })

    it('should follow the thumb live while dragging and take the accent line', async () => {
      const { root, track } = bound({ editable: true }, 50)
      await settle()

      const input = root.querySelector<HTMLInputElement>('.md1-slider__input')!
      const field = root.querySelector<HTMLElement>('.md1-slider__field')!
      const y = centre(track).y

      down(track, at(track, 30), y)
      await settle()

      expect(input.value).toBe('30')
      expect(getComputedStyle(field).borderBottomColor).toBe('rgb(255, 64, 129)')

      move(at(track, 80), y)
      await settle()

      expect(input.value).toBe('80')

      up()
      await settle()

      expect(line(field)).toBeCloseTo(0.42, 1)
    })

    it('should keep a host focus ring off the field, the accent line being its focus indicator', async () => {
      style(':focus-visible { outline: 2px solid rgb(0, 0, 255); }')
      const { root } = bound({ editable: true }, 50)
      await settle()

      const input = root.querySelector<HTMLInputElement>('.md1-slider__input')!

      await userEvent.click(input)
      await settle()

      expect(input.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(input).outlineStyle).toBe('none')
      expect(getComputedStyle(root.querySelector('.md1-slider__field')!).borderBottomColor).toBe('rgb(255, 64, 129)')
    })

    it('should warn in dev when editable is paired with discrete', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { root } = slider({ editable: true, discrete: true })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('editable'))
      // The hooks stay truthful: the warning is the correction, not a silent override.
      expect(Object.hasOwn(root.dataset, 'discrete')).toBe(true)
      expect(Object.hasOwn(root.dataset, 'editable')).toBe(true)
    })
  })

  describe('disabled', () => {
    it('should take the thumb out of the tab order and ignore keys, presses and ink', async () => {
      const { root, track, thumb, model } = bound({ disabled: true }, 40, never)
      await settle()

      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(true)
      expect(thumb.getAttribute('tabindex')).toBe('-1')
      expect(thumb.getAttribute('aria-disabled')).toBe('true')

      thumb.focus()
      await userEvent.keyboard('{ArrowRight}{End}')

      expect(model.value).toBe(40)

      down(track, at(track, 80))
      down(thumb, centre(thumb).x)
      await settle()

      expect(model.value).toBe(40)
      expect(Object.hasOwn(root.dataset, 'dragging')).toBe(false)
      expect(inks(thumb).length).toBe(0)
    })

    it('should draw no halo, no pin and no 38% line when a disabled thumb takes focus from script', async () => {
      const plain = slider({ disabled: true, modelValue: 50 })
      const discrete = slider({ disabled: true, discrete: true, step: 10, modelValue: 50 })
      await settle()

      // A keypress first, so programmatic focus counts as keyboard focus.
      await userEvent.keyboard('{Shift}')
      plain.thumb.focus()

      expect(plain.thumb.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(plain.thumb).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(plain.rest).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')

      discrete.thumb.focus()

      expect(discrete.thumb.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(discrete.root.querySelector('.md1-slider__pin')!).transform).toBe('matrix(0, 0, 0, 0, 0, 0)')
      expect(dot(discrete.thumb).width).toBe('8px')
    })

    it('should cast a bare disabled attribute to true, as a template writes it', async () => {
      // `<Md1Slider disabled />` compiles to an empty string; only a Boolean runtime prop turns that into true.
      const { root, thumb } = slider({ disabled: '' } as Record<string, unknown>)
      await settle()

      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(true)
      expect(thumb.getAttribute('tabindex')).toBe('-1')
    })

    it('should draw an 8 dp dot disconnected from the line by 2 dp gaps, all in the disabled ink', async () => {
      const { track, range, rest, thumb } = slider({ disabled: true, modelValue: 50 })
      await settle()

      const x = at(track, 50)

      expect(dot(thumb).width).toBe('8px')
      expect(dot(thumb).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(range).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(range).clipPath).toBe('inset(0px 6px 0px 0px)')
      expect(rest.getBoundingClientRect().left).toBeCloseTo(x + 6, 0)
      expect(getComputedStyle(rest).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
    })

    it('should disable the numeric field with the slider', async () => {
      const { root } = slider({ disabled: true, editable: true })
      await settle()

      const input = root.querySelector<HTMLInputElement>('.md1-slider__input')!

      expect(input.disabled).toBe(true)
      expect(getComputedStyle(input).color).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(root.querySelector('.md1-slider__field')!).borderBottomStyle).toBe('dotted')
    })
  })

  describe('rtl', () => {
    it('should mirror the axis under RTL: the minimum on the right, ArrowLeft increasing', async () => {
      const { root, track, range, rest, thumb, model } = bound({ iconStart: 'remove' }, 25, app => {
        app.use(createRtlPlugin({ default: true, target: null }))
      })
      await settle()

      expect(root.getAttribute('dir')).toBe('rtl')
      expect(centre(thumb).x).toBeCloseTo(at(track, 75), 0)
      expect(range.getBoundingClientRect().left).toBeCloseTo(at(track, 75), 0)
      expect(range.getBoundingClientRect().right).toBeCloseTo(at(track, 100), 0)
      expect(rest.getBoundingClientRect().right).toBeCloseTo(at(track, 75), 0)
      // The start icon sits on the right.
      expect(root.querySelector('svg')!.getBoundingClientRect().left).toBeGreaterThan(track.getBoundingClientRect().right)

      thumb.focus()
      await userEvent.keyboard('{ArrowLeft}')

      expect(model.value).toBe(26)
    })
  })

  describe('theme', () => {
    it('should take the dark control ink and the 30% white inactive line from the adapter sheet', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1Slider, { modelValue: 50 })]),
        h('div', { 'data-theme': 'md1-dark' }, [h(Md1Slider, { modelValue: 50, discrete: true, step: 10 })]),
      ]))
      await settle()

      const [light, dark] = [...host.querySelectorAll<HTMLElement>('.md1-slider')].map(el => parts(el.parentElement!))

      expect(getComputedStyle(light!.range).backgroundColor).toBe('rgb(255, 64, 129)')
      // Sliders take the accent hue's 200 in the dark theme (selection-controls page).
      expect(getComputedStyle(dark!.range).backgroundColor).toBe('rgb(244, 143, 177)')
      expect(getComputedStyle(dark!.rest).backgroundColor).toBe('rgba(255, 255, 255, 0.3)')
      expect(getComputedStyle(dark!.host.querySelector('.md1-slider__tick')!).backgroundColor).toBe('rgb(255, 255, 255)')
    })

    it('should set white digits on the pin in both themes and the dark focused line at 30% white', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1Slider, { modelValue: 50, discrete: true, step: 10 })]),
        h('div', { 'data-theme': 'md1-dark' }, [h(Md1Slider, { modelValue: 50, discrete: true, step: 10 })]),
      ]))
      await settle()

      const [light, dark] = [...host.querySelectorAll<HTMLElement>('.md1-slider__pin')]

      expect(getComputedStyle(light!).color).toBe('rgb(255, 255, 255)')
      // White on the Pink 200 pin as well, Vuetify 1.5's _sliders.styl:239 (about 2:1, SPEC.md Known limitations).
      expect(getComputedStyle(dark!).color).toBe('rgb(255, 255, 255)')

      const thumbs = [...host.querySelectorAll<HTMLElement>('.md1-slider__thumb')]

      await userEvent.tab()
      await userEvent.tab()

      expect(thumbs[1]!.matches(':focus-visible')).toBe(true)
      // th:168 (Vuetify 1.5's dark slider.active); the dark sheet measures about 28%.
      expect(getComputedStyle(host.querySelectorAll<HTMLElement>('.md1-slider__rest')[1]!).backgroundColor).toBe('rgba(255, 255, 255, 0.3)')
    })
  })
})

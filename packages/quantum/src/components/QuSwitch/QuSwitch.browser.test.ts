import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { QuSwitch } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuSwitchProps } from './QuSwitch.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'

/** Vuetify 1.5's pixel recipe for the 1 dp level, the switch thumb's (elevation page). */
const ELEVATION_1 = '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
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

/** A switch bound to a v-model ref. */
function toggle (props: QuSwitchProps & Record<string, unknown> = {}, initial = false, setup?: (app: App) => void) {
  const model = shallowRef(initial)
  const host = mount(() => h(QuSwitch, {
    'label': 'Wi-Fi',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: boolean | undefined) => {
      model.value = !!value
    },
  }), setup)
  const root = host.querySelector<HTMLLabelElement>('.quantum-switch')!
  const control = host.querySelector<HTMLButtonElement>('.quantum-switch__control')!
  const track = control.querySelector<HTMLElement>('.quantum-switch__track')!
  const thumb = control.querySelector<HTMLElement>('.quantum-switch__thumb')!
  return { host, root, control, track, thumb, model }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

function serialize (property: 'backgroundColor' | 'boxShadow', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

function down (el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + 30,
    clientY: rect.top + 4,
    pointerType: 'touch',
  }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.quantum-ripple__ink')]
}

/** The rendered centre of an element, in viewport x. */
function centre (el: Element): number {
  const rect = el.getBoundingClientRect()
  return rect.left + rect.width / 2
}

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

describe('quSwitch', () => {
  describe('anatomy', () => {
    it('should render a label around a role=switch button with the ripple first, the track holding the thumb, and the label', async () => {
      const { root, control, track, thumb } = toggle()
      await settle()

      expect(root.tagName).toBe('LABEL')
      expect(control.tagName).toBe('BUTTON')
      expect(control.getAttribute('role')).toBe('switch')
      expect(control.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(Object.hasOwn(control.querySelector<HTMLElement>('.quantum-ripple')!.dataset, 'unbounded')).toBe(true)
      expect(thumb.parentElement).toBe(track)
      expect(track.getAttribute('aria-hidden')).toBe('true')
      expect(thumb.getAttribute('aria-hidden')).toBe('true')
      expect(root.querySelector('.quantum-switch__label')!.textContent).toBe('Wi-Fi')
    })

    it('should name the control through aria-labelledby pointing at the inline label', async () => {
      const { root, control } = toggle()
      await settle()

      const label = root.querySelector('.quantum-switch__label')!

      expect(control.getAttribute('aria-labelledby')).toBe(label.id)
      expect(control.hasAttribute('aria-label')).toBe(false)
    })

    it('should render slot content as the label', async () => {
      const host = mount(() => h(QuSwitch, {}, () => 'Bluetooth'))
      await settle()

      expect(host.querySelector('.quantum-switch__label')!.textContent).toBe('Bluetooth')
    })

    it('should take ariaLabel when there is no visible label', async () => {
      const { root, control } = toggle({ label: undefined, ariaLabel: 'Airplane mode' })
      await settle()

      expect(root.querySelector('.quantum-switch__label')).toBeNull()
      expect(control.getAttribute('aria-label')).toBe('Airplane mode')
    })

    it('should forward a consumer aria-labelledby to the control when there is no visible label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { control } = toggle({ 'label': undefined, 'aria-labelledby': 'tile-title' })
      await settle()

      expect(control.getAttribute('aria-labelledby')).toBe('tile-title')
      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn in dev when the switch has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      toggle({ label: undefined })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuSwitch'))
    })

    it('should render the v0 hidden input when name is set, checked with the model', async () => {
      const { host, control } = toggle({ name: 'wifi' })
      await settle()

      const input = host.querySelector<HTMLInputElement>('input[name="wifi"]')!

      expect(input.checked).toBe(false)

      await userEvent.click(control)
      await settle()

      expect(input.checked).toBe(true)
    })

    it('should measure a 36 x 14 dp pill and a 20 dp round thumb overhanging it by 3 dp, 8 dp from the label', async () => {
      const { root, control, track, thumb } = toggle()
      await settle()

      const rail = track.getBoundingClientRect()
      const knob = thumb.getBoundingClientRect()
      const label = root.querySelector('.quantum-switch__label')!

      expect(rail.width).toBe(36)
      expect(rail.height).toBe(14)
      expect(getComputedStyle(track).borderTopLeftRadius).toBe('7px')
      expect(knob.width).toBe(20)
      expect(knob.height).toBe(20)
      expect(getComputedStyle(thumb).borderTopLeftRadius).toBe('50%')
      expect(rail.top - knob.top).toBe(3)
      expect(knob.bottom - rail.bottom).toBe(3)
      expect(knob.left).toBe(rail.left)
      expect(label.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(8)
      expect(root.getBoundingClientRect().height).toBe(48)
    })

    it('should rest the thumb at 1 dp', async () => {
      const { thumb } = toggle()
      await settle()

      expect(getComputedStyle(thumb).boxShadow).toBe(serialize('boxShadow', ELEVATION_1))
    })
  })

  describe('states', () => {
    it('should draw off as a Grey 50 thumb on a 38% black track', async () => {
      const { control, track, thumb } = toggle()
      await settle()

      expect(control.dataset.state).toBe('unchecked')
      expect(control.getAttribute('aria-checked')).toBe('false')
      expect(track.dataset.state).toBe('unchecked')
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(250, 250, 250)')
      expect(getComputedStyle(track).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #000000 38%, transparent)'))
    })

    it('should draw on as an accent thumb 16 dp along on the accent track at 50%', async () => {
      const { control, track, thumb } = toggle({}, true)
      await settle()

      expect(control.dataset.state).toBe('checked')
      expect(control.getAttribute('aria-checked')).toBe('true')
      expect(thumb.dataset.state).toBe('checked')
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(track).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #FF4081 50%, transparent)'))
      await expect.poll(() => thumb.getBoundingClientRect().left - track.getBoundingClientRect().left).toBe(16)
      expect(thumb.getBoundingClientRect().right).toBe(track.getBoundingClientRect().right)
    })

    it('should keep a disabled switch in position with the disabled inks: Grey 400 on a 12% track, on or off', async () => {
      const { control, track, thumb } = toggle({ disabled: true }, true)
      await settle()

      expect(control.dataset.state).toBe('checked')
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(189, 189, 189)')
      expect(getComputedStyle(track).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #000000 12%, transparent)'))
      await expect.poll(() => thumb.getBoundingClientRect().left - track.getBoundingClientRect().left).toBe(16)
    })

    it('should draw the grey focus halo on a focused disabled switch, which stays in the tab order', async () => {
      const { control } = toggle({ disabled: true }, true)
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(control)
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0.06)')
    })

    it('should be inert when disabled: Grey 400 thumb on a 12% track, disabled label text, no toggle, no ink', async () => {
      const { root, control, track, thumb, model } = toggle({ disabled: true })
      await settle()

      expect(control.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(control.dataset, 'disabled')).toBe(true)
      expect(control.hasAttribute('tabindex')).toBe(false)
      expect(getComputedStyle(thumb).backgroundColor).toBe('rgb(189, 189, 189)')
      expect(getComputedStyle(track).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #000000 12%, transparent)'))
      expect(getComputedStyle(root.querySelector('.quantum-switch__label')!).color).toBe('rgba(0, 0, 0, 0.38)')

      control.click()
      root.querySelector<HTMLElement>('.quantum-switch__label')!.click()
      down(control)
      await settle()

      expect(model.value).toBe(false)
      expect(inks(control).length).toBe(0)
    })

    it('should centre the 48 dp focus halo on the thumb and carry it with the thumb', async () => {
      const { control, thumb } = toggle()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(control)

      const rect = control.getBoundingClientRect()
      const halo = getComputedStyle(control, '::before')

      expect(halo.width).toBe('48px')
      expect(rect.left + Number.parseFloat(halo.left) + 24).toBe(centre(thumb))
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      await userEvent.keyboard(' ')
      await settle()

      expect(control.dataset.state).toBe('checked')
      await expect.poll(() => getComputedStyle(control, '::before').transform).toBe('matrix(1, 0, 0, 1, 16, 0)')
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, #FF4081 10%, transparent)'))
    })

    it('should centre the press ink on the thumb, hidden under a fine pointer', async () => {
      const { control, thumb } = toggle({}, false, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(control)
      await settle()

      const [ink] = inks(control)

      expect(ink!.style.width).toBe('48px')
      expect(centre(ink!)).toBe(centre(thumb))
      expect(getComputedStyle(control.querySelector('.quantum-ripple')!).opacity).toBe('0')

      control.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))

      await expect.poll(() => inks(control).length).toBe(0)
    })
  })

  describe('interaction', () => {
    it('should toggle the model on a click on the control and on the label text', async () => {
      const { root, control, model } = toggle()
      await settle()

      await userEvent.click(control)
      await settle()

      expect(model.value).toBe(true)

      await userEvent.click(root.querySelector('.quantum-switch__label')!)
      await settle()

      expect(model.value).toBe(false)
    })

    it('should toggle once per Space press', async () => {
      const { control, model } = toggle()
      await settle()

      control.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe(true)

      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe(false)
    })

    it('should mirror under dir="rtl": the off thumb at the right end, travelling left', async () => {
      const value = shallowRef(false)
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuSwitch, {
        'label': 'Wi-Fi',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: boolean | undefined) => {
          value.value = !!next
        },
      })]))
      await settle()

      const control = host.querySelector<HTMLElement>('.quantum-switch__control')!
      const track = host.querySelector<HTMLElement>('.quantum-switch__track')!
      const thumb = host.querySelector<HTMLElement>('.quantum-switch__thumb')!
      const label = host.querySelector<HTMLElement>('.quantum-switch__label')!

      expect(control.getBoundingClientRect().left - label.getBoundingClientRect().right).toBe(8)
      expect(thumb.getBoundingClientRect().right).toBe(track.getBoundingClientRect().right)

      const rect = control.getBoundingClientRect()

      expect(rect.left + Number.parseFloat(getComputedStyle(control, '::before').left) + 24).toBe(centre(thumb))

      await userEvent.click(control)
      await settle()

      await expect.poll(() => thumb.getBoundingClientRect().left).toBe(track.getBoundingClientRect().left)
    })
  })

  describe('theme', () => {
    it('should take the dark switch values: Grey 400 thumb on 30% white off, accent 200 on, Grey 800 on 10% disabled', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuSwitch, { label: 'Off' }),
        h(QuSwitch, { label: 'On', modelValue: true }),
        h(QuSwitch, { label: 'Disabled', disabled: true }),
        h(QuSwitch, { label: 'Disabled on', disabled: true, modelValue: true }),
      ]))
      await settle()

      const tracks = [...host.querySelectorAll<HTMLElement>('.quantum-switch__track')]
      const thumbs = [...host.querySelectorAll<HTMLElement>('.quantum-switch__thumb')]

      expect(getComputedStyle(thumbs[0]!).backgroundColor).toBe('rgb(189, 189, 189)')
      expect(getComputedStyle(tracks[0]!).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #FFFFFF 30%, transparent)'))
      expect(getComputedStyle(thumbs[1]!).backgroundColor).toBe('rgb(244, 143, 177)')
      expect(getComputedStyle(tracks[1]!).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #F48FB1 50%, transparent)'))
      expect(getComputedStyle(thumbs[2]!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(tracks[2]!).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, #FFFFFF 10%, transparent)'))
      expect(getComputedStyle(thumbs[3]!).backgroundColor).toBe('rgb(66, 66, 66)')
    })
  })
})

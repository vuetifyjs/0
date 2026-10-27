import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1Radio, Md1RadioGroup } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1RadioGroupProps } from './Md1RadioGroup.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'

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

interface Option {
  'value': string
  'label'?: string
  'disabled'?: boolean
  'ariaLabel'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'class'?: string
}

const SIZES: Option[] = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large' },
]

/** A group of radios bound to a v-model ref. */
function group (props: Md1RadioGroupProps & Record<string, unknown> = {}, options: Option[] = SIZES, initial?: string, setup?: (app: App) => void) {
  const model = shallowRef<string | undefined>(initial)
  const host = mount(() => h(Md1Radio.Group, {
    'ariaLabel': 'Size',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: unknown) => {
      model.value = value as string
    },
  }, () => options.map(option => h(Md1Radio, { key: option.value, ...option }))), setup)
  const root = host.querySelector<HTMLElement>('.md1-radio-group')!
  const controls = [...host.querySelectorAll<HTMLButtonElement>('.md1-radio__control')]
  return { host, root, controls, model }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.backgroundColor = value
  document.body.append(probe)
  const result = getComputedStyle(probe).backgroundColor
  probe.remove()
  return result
}

function down (el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + 4,
    clientY: rect.top + 4,
    pointerType: 'touch',
  }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
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

describe('quRadio', () => {
  describe('anatomy', () => {
    it('should attach Group to the root and keep the flat name', () => {
      expect(Md1Radio.Group).toBe(Md1RadioGroup)
    })

    it('should render a radiogroup of labels around role=radio buttons, the ripple first, ring, dot and label', async () => {
      const { root, controls } = group()
      await settle()

      expect(root.getAttribute('role')).toBe('radiogroup')
      expect(root.getAttribute('aria-label')).toBe('Size')
      expect(controls.length).toBe(3)

      const [first] = controls

      expect(first!.parentElement!.tagName).toBe('LABEL')
      expect(first!.parentElement!.classList.contains('md1-radio')).toBe(true)
      expect(first!.getAttribute('role')).toBe('radio')
      expect(first!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(Object.hasOwn(first!.querySelector<HTMLElement>('.md1-ripple')!.dataset, 'unbounded')).toBe(true)
      expect(first!.querySelector('.md1-radio__ring > .md1-radio__dot')).not.toBeNull()
      expect(first!.parentElement!.querySelector('.md1-radio__label')!.textContent).toBe('Small')
    })

    it('should name each radio through aria-labelledby pointing at its visible label', async () => {
      const { controls } = group()
      await settle()

      for (const control of controls) {
        const label = control.parentElement!.querySelector('.md1-radio__label')!

        expect(label.id).not.toBe('')
        expect(control.getAttribute('aria-labelledby')).toBe(label.id)
      }
    })

    it('should take ariaLabel when there is no visible label', async () => {
      const { controls } = group({}, [{ value: 'a', ariaLabel: 'Alpha' }])
      await settle()

      expect(controls[0]!.getAttribute('aria-label')).toBe('Alpha')
      expect(controls[0]!.parentElement!.querySelector('.md1-radio__label')).toBeNull()
    })

    it('should forward a consumer aria-labelledby to the control when there is no visible label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { controls } = group({}, [{ 'value': 'a', 'aria-labelledby': 'option-name' }])
      await settle()

      expect(controls[0]!.getAttribute('aria-labelledby')).toBe('option-name')
      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should put a consumer aria-describedby and aria-labelledby on the control, not the root label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { host, controls } = group({}, [{ 'value': 'a', 'aria-labelledby': 'option-name', 'aria-describedby': 'option-note', 'class': 'consumer' }])
      await settle()

      const label = host.querySelector<HTMLLabelElement>('.md1-radio')!

      expect(controls[0]!.getAttribute('aria-describedby')).toBe('option-note')
      expect(label.hasAttribute('aria-describedby')).toBe(false)
      expect(label.hasAttribute('aria-labelledby')).toBe(false)
      expect(label.classList.contains('consumer')).toBe(true)
      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn in dev when a radio has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      group({}, [{ value: 'a' }])
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1Radio'))
    })

    it('should throw, as v0 does, when a radio renders outside Md1Radio.Group', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const errors: unknown[] = []

      mount(() => h(Md1Radio, { label: 'Lonely', value: 'x' }), app => {
        app.config.errorHandler = error => {
          errors.push(error)
        }
      })
      await settle()

      // The setup error, then Vue's follow-up render error for the broken instance.
      expect(errors.length).toBeGreaterThan(0)
      expect(String(errors[0])).toContain('v0:radio:group')
      expect(warn.mock.calls.every(call => !String(call[0]).includes('[Md1Radio]'))).toBe(true)
    })

    it('should share the group name through the v0 hidden inputs, checked with the model', async () => {
      const { host, controls } = group({ name: 'size' })
      await settle()

      const inputs = [...host.querySelectorAll<HTMLInputElement>('input[name="size"]')]

      expect(inputs.length).toBe(3)
      expect(inputs.every(input => input.type === 'radio' && !input.checked)).toBe(true)

      await userEvent.click(controls[1]!)
      await settle()

      expect(inputs[1]!.checked).toBe(true)
      expect(inputs[1]!.value).toBe('m')
    })

    it('should measure a 20 dp ring with a 2 dp stroke and a 10 dp dot in a 24 dp control, 8 dp from the label', async () => {
      const { controls } = group({}, SIZES, 's')
      await settle()

      const control = controls[0]!
      const ring = control.querySelector<HTMLElement>('.md1-radio__ring')!
      const dot = control.querySelector<HTMLElement>('.md1-radio__dot')!
      const label = control.parentElement!.querySelector('.md1-radio__label')!

      expect(ring.getBoundingClientRect().width).toBe(20)
      expect(ring.getBoundingClientRect().height).toBe(20)
      expect(getComputedStyle(ring).borderTopWidth).toBe('2px')
      expect(getComputedStyle(ring).borderTopLeftRadius).toBe('50%')
      expect(dot.offsetWidth).toBe(10)
      expect(dot.offsetHeight).toBe(10)
      expect(control.getBoundingClientRect().width).toBe(24)
      expect(label.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(8)
      expect(control.parentElement!.getBoundingClientRect().height).toBe(48)
    })

    it('should stack the radios in a column of 48 dp rows', async () => {
      const { controls } = group()
      await settle()

      const [a, b] = controls.map(control => control.parentElement!.getBoundingClientRect())

      expect(b!.top - a!.top).toBe(48)
      expect(b!.left).toBe(a!.left)
    })
  })

  describe('states', () => {
    it('should draw the off ring in 54% black with no dot and the on ring and dot in the accent', async () => {
      const { controls } = group({}, SIZES, 'm')
      await settle()

      const [off, on] = controls

      expect(off!.dataset.state).toBe('unchecked')
      expect(off!.getAttribute('aria-checked')).toBe('false')
      expect(getComputedStyle(off!.querySelector('.md1-radio__ring')!).borderTopColor).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(off!.querySelector('.md1-radio__dot')!).visibility).toBe('hidden')

      expect(on!.dataset.state).toBe('checked')
      expect(on!.getAttribute('aria-checked')).toBe('true')
      await expect.poll(() => getComputedStyle(on!.querySelector('.md1-radio__ring')!).borderTopColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(on!.querySelector('.md1-radio__dot')!).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(on!.querySelector('.md1-radio__dot')!).visibility).toBe('visible')
      await expect.poll(() => getComputedStyle(on!.querySelector('.md1-radio__dot')!).transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
    })

    it('should be inert when disabled: 26% ink, disabled label text, no selection, skipped by the arrows, no ink', async () => {
      const { controls, model } = group({}, [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ])
      await settle()

      const disabled = controls[1]!

      expect(disabled.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(disabled.dataset, 'disabled')).toBe(true)
      expect(disabled.getAttribute('tabindex')).toBe('-1')
      expect(getComputedStyle(disabled.querySelector('.md1-radio__ring')!).borderTopColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(disabled.parentElement!.querySelector('.md1-radio__label')!).color).toBe('rgba(0, 0, 0, 0.38)')

      disabled.click()
      disabled.parentElement!.querySelector<HTMLElement>('.md1-radio__label')!.click()
      down(disabled)
      await settle()

      expect(model.value).toBeUndefined()
      expect(inks(disabled).length).toBe(0)

      controls[0]!.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(model.value).toBe('c')
      expect(document.activeElement).toBe(controls[2])
    })

    it('should disable every radio from the group', async () => {
      const { root, controls } = group({ disabled: true })
      await settle()

      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(true)
      expect(controls.every(control => control.getAttribute('aria-disabled') === 'true')).toBe(true)
      expect(controls.every(control => control.getAttribute('tabindex') === '-1')).toBe(true)
      expect(controls.every(control => Object.hasOwn(control.dataset, 'disabled'))).toBe(true)
      expect(getComputedStyle(controls[0]!.querySelector('.md1-radio__ring')!).borderTopColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(controls[0]!.parentElement!.querySelector('.md1-radio__label')!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should draw the 48 dp focus halo for keyboard focus: 10% accent on the selected radio', async () => {
      const { controls } = group({}, SIZES, 's')
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(controls[0])

      const halo = getComputedStyle(controls[0]!, '::before')

      expect(halo.width).toBe('48px')
      expect(halo.borderRadius).toBe('50%')
      await expect.poll(() => getComputedStyle(controls[0]!, '::before').backgroundColor)
        .toBe(serialize('color-mix(in srgb, #FF4081 10%, transparent)'))
    })

    it('should draw the press reaction as an unbounded 48 dp ink centred on the control, hidden under a fine pointer', async () => {
      const { controls } = group({}, SIZES, undefined, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const control = controls[0]!

      down(control)
      await settle()

      const [ink] = inks(control)

      expect(ink!.style.width).toBe('48px')
      expect(ink!.style.left).toBe('-12px')
      expect(getComputedStyle(control.querySelector('.md1-ripple')!).opacity).toBe('0')

      control.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))

      await expect.poll(() => inks(control).length).toBe(0)
    })
  })

  describe('interaction', () => {
    it('should select on a click on the control and on the label text', async () => {
      const { controls, model } = group()
      await settle()

      await userEvent.click(controls[1]!)
      await settle()

      expect(model.value).toBe('m')

      await userEvent.click(controls[2]!.parentElement!.querySelector('.md1-radio__label')!)
      await settle()

      expect(model.value).toBe('l')
      expect(controls[1]!.dataset.state).toBe('unchecked')
      expect(controls[2]!.dataset.state).toBe('checked')
    })

    it('should rove focus: one tab stop, arrows move and select, wrapping', async () => {
      const { controls, model } = group({}, SIZES, 'm')
      await settle()

      expect(controls.map(control => control.getAttribute('tabindex'))).toEqual(['-1', '0', '-1'])

      controls[1]!.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(model.value).toBe('l')

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('s')
      expect(document.activeElement).toBe(controls[0])

      await userEvent.keyboard('{ArrowUp}')
      await settle()

      expect(model.value).toBe('l')
    })

    it('should move focus without selecting under activation="manual", and select on Space', async () => {
      const { controls, model } = group({ activation: 'manual' }, SIZES, 's')
      await settle()

      controls[0]!.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(document.activeElement).toBe(controls[1])
      expect(model.value).toBe('s')

      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe('m')
    })

    it('should select the first enabled radio under mandatory="force"', async () => {
      const { model } = group({ mandatory: 'force' }, [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ])
      await settle()

      expect(model.value).toBe('b')
    })
  })

  describe('theme', () => {
    it('should take its ink from the adapter sheet in the dark theme', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1Radio.Group, { ariaLabel: 'Dark', modelValue: 'b' }, () => [
          h(Md1Radio, { label: 'A', value: 'a' }),
          h(Md1Radio, { label: 'B', value: 'b' }),
          h(Md1Radio, { label: 'C', value: 'c', disabled: true }),
        ]),
      ]))
      await settle()

      const [off, on, disabled] = host.querySelectorAll<HTMLElement>('.md1-radio__ring')

      expect(getComputedStyle(off!).borderTopColor).toBe('rgba(255, 255, 255, 0.7)')
      await expect.poll(() => getComputedStyle(on!).borderTopColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(disabled!).borderTopColor).toBe('rgba(255, 255, 255, 0.3)')
    })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1Checkbox } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1CheckboxProps } from './Md1Checkbox.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

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

/** A checkbox bound to a v-model ref; returns the label root, the control and the model. */
function checkbox (props: Md1CheckboxProps & Record<string, unknown> = {}, initial = false, setup?: (app: App) => void) {
  const model = shallowRef(initial)
  const host = mount(() => h(Md1Checkbox, {
    'label': 'Send updates',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: boolean | undefined) => {
      model.value = !!value
    },
  }), setup)
  const root = host.querySelector<HTMLLabelElement>('.md1-checkbox')!
  const control = host.querySelector<HTMLButtonElement>('.md1-checkbox__control')!
  return { host, root, control, model }
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

function rules (): CSSStyleRule[] {
  return [...document.styleSheets]
    .flatMap(sheet => [...sheet.cssRules])
    .flatMap(rule => rule instanceof CSSMediaRule ? [...rule.cssRules] : [rule])
    .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
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

describe('quCheckbox', () => {
  describe('anatomy', () => {
    it('should render a label around a role=checkbox button with the ripple first, the box and the label text', async () => {
      const { root, control } = checkbox()
      await settle()

      expect(root.tagName).toBe('LABEL')
      expect(control.tagName).toBe('BUTTON')
      expect(control.type).toBe('button')
      expect(control.getAttribute('role')).toBe('checkbox')
      expect(control.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(Object.hasOwn(control.querySelector<HTMLElement>('.md1-ripple')!.dataset, 'unbounded')).toBe(true)
      expect(control.querySelector('.md1-checkbox__box')).not.toBeNull()
      expect(root.querySelector('.md1-checkbox__label')!.textContent).toBe('Send updates')
    })

    it('should name the control through aria-labelledby pointing at the visible label', async () => {
      const { root, control } = checkbox()
      await settle()

      const label = root.querySelector('.md1-checkbox__label')!

      expect(label.id).not.toBe('')
      expect(control.getAttribute('aria-labelledby')).toBe(label.id)
      expect(control.hasAttribute('aria-label')).toBe(false)
    })

    it('should render slot content as the label', async () => {
      const host = mount(() => h(Md1Checkbox, {}, () => 'Rich label'))
      await settle()

      const control = host.querySelector('.md1-checkbox__control')!
      const label = host.querySelector('.md1-checkbox__label')!

      expect(label.textContent).toBe('Rich label')
      expect(control.getAttribute('aria-labelledby')).toBe(label.id)
    })

    it('should take ariaLabel when there is no visible label', async () => {
      const { root, control } = checkbox({ label: undefined, ariaLabel: 'Select row' })
      await settle()

      expect(root.querySelector('.md1-checkbox__label')).toBeNull()
      expect(control.getAttribute('aria-label')).toBe('Select row')
      expect(control.hasAttribute('aria-labelledby')).toBe(false)
    })

    it('should forward a consumer aria-labelledby to the control when there is no visible label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { control } = checkbox({ 'label': undefined, 'aria-labelledby': 'row-name' })
      await settle()

      expect(control.getAttribute('aria-labelledby')).toBe('row-name')
      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn in dev when the checkbox has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      checkbox({ label: undefined })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1Checkbox'))
    })

    it('should render the v0 hidden input when name is set, checked with the model', async () => {
      const { host, control } = checkbox({ name: 'updates', value: 'yes' })
      await settle()

      const input = host.querySelector<HTMLInputElement>('input[name="updates"]')!

      expect(input.type).toBe('checkbox')
      expect(input.checked).toBe(false)

      await userEvent.click(control)
      await settle()

      expect(input.checked).toBe(true)
      expect(input.value).toBe('yes')
    })

    it('should measure an 18 dp box with a 2 dp border and 2 dp corners in a 24 dp control, 8 dp from the label', async () => {
      const { root, control } = checkbox()
      await settle()

      const box = control.querySelector<HTMLElement>('.md1-checkbox__box')!
      const label = root.querySelector<HTMLElement>('.md1-checkbox__label')!
      const rect = box.getBoundingClientRect()
      const computed = getComputedStyle(box)

      expect(rect.width).toBe(18)
      expect(rect.height).toBe(18)
      expect(computed.borderTopWidth).toBe('2px')
      expect(computed.borderTopLeftRadius).toBe('2px')
      expect(control.getBoundingClientRect().width).toBe(24)
      expect(control.getBoundingClientRect().height).toBe(24)
      expect(label.getBoundingClientRect().left - control.getBoundingClientRect().right).toBe(8)
      expect(root.getBoundingClientRect().height).toBe(48)
    })

    it('should set the label in Body 1 with the primary ink', async () => {
      const { root } = checkbox()
      await settle()

      const computed = getComputedStyle(root.querySelector('.md1-checkbox__label')!)

      expect(computed.fontFamily).toContain('Roboto')
      // Desktop Chromium is a fine pointer: Body 1 drops to 13 sp there once the theme is loaded; the fallback is 14.
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should answer to a 48 dp touch target around the 24 dp control', async () => {
      const { control } = checkbox({ label: undefined, ariaLabel: 'Pick' })
      await settle()

      const rect = control.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      expect(document.elementFromPoint(x, rect.top - 10)).toBe(control)
      expect(document.elementFromPoint(rect.left - 10, y)).toBe(control)
      expect(document.elementFromPoint(x, rect.top - 14)).not.toBe(control)
    })
  })

  describe('states', () => {
    it('should draw the off box as an outline in 54% black and hide the check', async () => {
      const { control } = checkbox()
      await settle()

      const box = control.querySelector<HTMLElement>('.md1-checkbox__box')!
      const check = control.querySelector<HTMLElement>('.md1-checkbox__check')!

      expect(control.dataset.state).toBe('unchecked')
      expect(control.getAttribute('aria-checked')).toBe('false')
      expect(getComputedStyle(box).borderTopColor).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(box).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(check).visibility).toBe('hidden')
    })

    it('should fill the on box with the accent and draw the white check through Md1Icon', async () => {
      const { control } = checkbox({}, true)
      await settle()

      const box = control.querySelector<HTMLElement>('.md1-checkbox__box')!
      const check = control.querySelector<HTMLElement>('.md1-checkbox__check')!
      const svg = check.querySelector('svg')!

      expect(control.dataset.state).toBe('checked')
      expect(control.getAttribute('aria-checked')).toBe('true')
      await expect.poll(() => getComputedStyle(box).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(box).borderTopColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(check).visibility).toBe('visible')
      expect(getComputedStyle(check).color).toBe('rgb(255, 255, 255)')
      expect(svg.classList.contains('md1-icon')).toBe(true)
      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.check)
      expect(getComputedStyle(svg).width).toBe('18px')
    })

    it('should draw the indeterminate extension as a filled box with the dash and aria-checked=mixed', async () => {
      const { control } = checkbox({ indeterminate: true })
      await settle()

      const svg = control.querySelector('.md1-checkbox__check svg')!

      expect(control.dataset.state).toBe('indeterminate')
      expect(control.getAttribute('aria-checked')).toBe('mixed')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.remove)
      await expect.poll(() => getComputedStyle(control.querySelector('.md1-checkbox__box')!).backgroundColor).toBe('rgb(255, 64, 129)')
    })

    it('should follow indeterminate when it changes after mount', async () => {
      const mixed = shallowRef(true)
      const host = mount(() => h(Md1Checkbox, { label: 'All', indeterminate: mixed.value }))
      await settle()

      const control = host.querySelector<HTMLElement>('.md1-checkbox__control')!
      function paths () {
        return [...control.querySelectorAll('.md1-checkbox__check path')].map(p => p.getAttribute('d'))
      }

      expect(control.dataset.state).toBe('indeterminate')
      expect(paths()).toEqual(md1Icons.remove)

      mixed.value = false
      await settle()

      expect(control.dataset.state).toBe('unchecked')
      expect(control.getAttribute('aria-checked')).toBe('false')
      expect(getComputedStyle(control.querySelector('.md1-checkbox__check')!).visibility).toBe('hidden')
    })

    it('should draw the grey focus halo on a focused disabled checkbox, which stays in the tab order', async () => {
      const { control } = checkbox({ disabled: true }, true)
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(control)
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0.06)')
    })

    it('should be inert when disabled: aria-disabled, data-disabled, 26% ink, no toggle, no ink, disabled label text', async () => {
      const { root, control, model } = checkbox({ disabled: true })
      await settle()

      expect(control.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(control.dataset, 'disabled')).toBe(true)
      expect(control.hasAttribute('tabindex')).toBe(false)
      expect(getComputedStyle(control.querySelector('.md1-checkbox__box')!).borderTopColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(root.querySelector('.md1-checkbox__label')!).color).toBe('rgba(0, 0, 0, 0.38)')

      control.click()
      root.querySelector<HTMLElement>('.md1-checkbox__label')!.click()
      down(control)
      await settle()

      expect(model.value).toBe(false)
      expect(control.dataset.state).toBe('unchecked')
      expect(inks(control).length).toBe(0)
    })

    it('should cut the disabled check out of the 26% box in the surface colour', async () => {
      const { control } = checkbox({ disabled: true }, true)
      await settle()

      expect(getComputedStyle(control.querySelector('.md1-checkbox__box')!).backgroundColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(control.querySelector('.md1-checkbox__check')!).color).toBe('rgb(255, 255, 255)')
    })

    it('should draw the 48 dp focus halo for keyboard focus only: 6% black off, 10% accent on', async () => {
      const { control } = checkbox()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(control)

      const halo = getComputedStyle(control, '::before')

      expect(halo.width).toBe('48px')
      expect(halo.height).toBe('48px')
      expect(halo.borderRadius).toBe('50%')
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      await userEvent.keyboard(' ')
      await settle()

      expect(control.dataset.state).toBe('checked')
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor)
        .toBe(serialize('color-mix(in srgb, #FF4081 10%, transparent)'))

      await userEvent.click(document.body)
      await userEvent.click(control)

      expect(control.matches(':focus-visible')).toBe(false)
      await expect.poll(() => getComputedStyle(control, '::before').backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should draw the press reaction as an unbounded 48 dp ink, hidden under a fine pointer', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const { control } = checkbox({}, false, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(control)
      await settle()

      const list = inks(control)

      expect(list.length).toBe(1)
      expect(list[0]!.style.width).toBe('48px')
      // Centred on the 24 dp control whatever the press point.
      expect(list[0]!.style.left).toBe('-12px')
      expect(getComputedStyle(list[0]!).backgroundColor).toBe('rgba(0, 0, 0, 0.06)')
      expect(getComputedStyle(control.querySelector('.md1-ripple')!).opacity).toBe('0')

      control.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))

      await expect.poll(() => inks(control).length).toBe(0)
    })

    it('should hide the ripple layer only inside the fine-pointer rule', () => {
      checkbox()

      const hidden = rules().filter(rule => rule.selectorText === '.md1-checkbox__control > .md1-ripple' && rule.style.opacity === '0')

      expect(hidden.length).toBe(1)
      expect(hidden[0]!.parentRule).toBeInstanceOf(CSSMediaRule)
      expect((hidden[0]!.parentRule as CSSMediaRule).conditionText).toBe('(pointer: fine)')
    })
  })

  describe('interaction', () => {
    it('should toggle the model on a click on the control and on the label text', async () => {
      const { root, control, model } = checkbox()
      await settle()

      await userEvent.click(control)
      await settle()

      expect(model.value).toBe(true)
      expect(control.dataset.state).toBe('checked')

      await userEvent.click(root.querySelector('.md1-checkbox__label')!)
      await settle()

      expect(model.value).toBe(false)
      expect(control.dataset.state).toBe('unchecked')
    })

    it('should toggle once on Space, and on Enter through the native button', async () => {
      const { control, model } = checkbox()
      await settle()

      control.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe(true)

      await userEvent.keyboard('{Enter}')
      await settle()

      // v0 binds click on a native button, and a native button clicks on Enter.
      expect(model.value).toBe(false)
    })

    it('should mirror the gap under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(Md1Checkbox, { label: 'Updates' })]))
      await settle()

      const control = host.querySelector('.md1-checkbox__control')!
      const label = host.querySelector('.md1-checkbox__label')!

      expect(control.getBoundingClientRect().left - label.getBoundingClientRect().right).toBe(8)
    })
  })

  describe('theme', () => {
    it('should take its ink from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark', 'style': 'background: #303030' }, [
        h(Md1Checkbox, { label: 'Off' }),
        h(Md1Checkbox, { label: 'On', modelValue: true }),
        h(Md1Checkbox, { label: 'Disabled', disabled: true }),
      ]))
      await settle()

      const [off, on, disabled] = host.querySelectorAll<HTMLElement>('.md1-checkbox__box')

      expect(getComputedStyle(off!).borderTopColor).toBe('rgba(255, 255, 255, 0.7)')
      await expect.poll(() => getComputedStyle(on!).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(disabled!).borderTopColor).toBe('rgba(255, 255, 255, 0.3)')
      expect(getComputedStyle(host.querySelector('.md1-checkbox__label')!).color).toBe('rgb(255, 255, 255)')
    })
  })
})

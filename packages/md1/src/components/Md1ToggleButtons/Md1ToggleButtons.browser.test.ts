import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1ToggleButtons, Md1ToggleButtonsItem } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1ToggleButtonsProps } from './Md1ToggleButtons.vue'
import type { Md1ToggleButtonsItemProps } from './Md1ToggleButtonsItem.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

type ItemSpec = Partial<Md1ToggleButtonsItemProps> & Record<string, unknown> & { label?: string }

/** Vuetify 1.5's pixel recipe for the 2 dp level, the strip's height while an item is selected. */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

/** The browser's own serialization of a value, so assertions never guess at shadow formatting. */
function serialize (property: 'boxShadow', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // The tester document has no body margin; the hit-area tests probe above the items, which must stay inside the viewport.
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

function item ({ label, ...props }: ItemSpec): VNode {
  return h(Md1ToggleButtons.Item, props, label ? () => label : undefined)
}

/** Day, Week, Month: the page's exclusive example shape, three text options. */
const PERIODS: ItemSpec[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

/** A group bound to a ref the way `v-model` binds it; the ref follows every emit. */
function group (props: Partial<Md1ToggleButtonsProps> & Record<string, unknown> = {}, items: ItemSpec[] = PERIODS, initial?: unknown, setup?: (app: App) => void) {
  const model = shallowRef<unknown>(initial)
  const host = mount(() => h(Md1ToggleButtons, {
    'modelValue': model.value,
    'onUpdate:modelValue': (value: unknown) => {
      model.value = value
    },
    ...props,
  }, () => items.map(spec => item(spec))), setup)
  const root = host.querySelector<HTMLElement>('.md1-toggle-buttons')!
  const buttons = [...host.querySelectorAll('button')]
  return { host, root, buttons, model }
}

function pressed (buttons: HTMLButtonElement[]): string[] {
  return buttons.map(button => button.getAttribute('aria-pressed')!)
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** A synthetic pointerdown at (x, y) inside the element: enough for the ripple, never for `:active`. */
function down (el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + x,
    clientY: rect.top + y,
    pointerType: 'mouse',
  }))
}

function up (el: HTMLElement) {
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  // The reduced-motion adapter writes the body attribute on install and never clears it.
  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quToggleButtons', () => {
  describe('anatomy', () => {
    it('should render a labelled group of native toggle buttons, each with the ripple first and the label in a span', async () => {
      const { root, buttons } = group({ label: 'Period' })
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('role')).toBe('group')
      expect(root.getAttribute('aria-label')).toBe('Period')
      expect(root.getAttribute('aria-orientation')).toBe('horizontal')
      expect(root.dataset.orientation).toBe('horizontal')
      expect(Object.hasOwn(root.dataset, 'multiple')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(false)
      expect(buttons.length).toBe(3)

      for (const [index, button] of buttons.entries()) {
        expect(button.type).toBe('button')
        expect(button.classList.contains('md1-toggle-buttons__item')).toBe(true)
        expect(button.getAttribute('aria-pressed')).toBe('false')
        expect(button.dataset.state).toBe('off')
        expect(button.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
        expect(button.firstElementChild!.getAttribute('aria-hidden')).toBe('true')
        expect(button.querySelector('.md1-toggle-buttons__label')!.textContent!.trim()).toBe(PERIODS[index]!.label)
        expect(button.querySelector('svg')).toBeNull()
      }
    })

    it('should expose data-multiple and the group-level aria relationships', async () => {
      const host = mount(() => h('div', [
        h('p', { id: 'styles-title' }, 'Text style'),
        h('p', { id: 'styles-help' }, 'Pick any number'),
        h(Md1ToggleButtons, { 'multiple': true, 'aria-labelledby': 'styles-title', 'aria-describedby': 'styles-help' }, () => PERIODS.map(spec => item(spec))),
      ]))
      await settle()

      const root = host.querySelector<HTMLElement>('.md1-toggle-buttons')!

      expect(root.dataset.multiple).toBe('true')
      expect(root.getAttribute('aria-labelledby')).toBe('styles-title')
      expect(root.getAttribute('aria-describedby')).toBe('styles-help')
      expect(root.hasAttribute('aria-label')).toBe(false)
    })

    it('should measure 36 dp flat items in Vuetify 1.5\'s 2 px surface strip, with transparent seams', async () => {
      const { root, buttons } = group()
      await settle()

      const container = getComputedStyle(root)

      // _button-toggle.styl:6-7, 19-23: a surface strip, no outline, flat until an item is selected.
      expect(container.display).toBe('inline-flex')
      expect(container.borderRadius).toBe('2px')
      expect(container.borderTopWidth).toBe('0px')
      expect(container.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(container.boxShadow).toBe('none')

      const [first, second, third] = buttons.map(button => getComputedStyle(button))

      for (const computed of [first!, second!, third!]) {
        expect(computed.paddingLeft).toBe('8px')
        expect(computed.paddingRight).toBe('8px')
        expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
        expect(computed.boxShadow).toBe('none')
      }

      expect(buttons[0]!.getBoundingClientRect().height).toBe(36)
      expect(buttons[0]!.getBoundingClientRect().width).toBeGreaterThanOrEqual(48)
      // A transparent 1 px seam on the end side of every item but the last (_button-toggle.styl:34-35).
      expect(first!.borderRightWidth).toBe('1px')
      expect(first!.borderRightColor).toBe('rgba(0, 0, 0, 0)')
      expect(second!.borderRightWidth).toBe('1px')
      expect(third!.borderRightWidth).toBe('0px')
      expect(first!.borderLeftWidth).toBe('0px')
      // The end items carry the strip's corners; the middle one is square.
      expect(first!.borderTopLeftRadius).toBe('2px')
      expect(first!.borderTopRightRadius).toBe('0px')
      expect(second!.borderTopLeftRadius).toBe('0px')
      expect(third!.borderTopRightRadius).toBe('2px')
      expect(third!.borderBottomRightRadius).toBe('2px')
    })

    it('should set the labels in the Button type style: 14 px Medium, capitals, one line', async () => {
      const { buttons } = group()
      await settle()

      const computed = getComputedStyle(buttons[0]!)

      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.textTransform).toBe('uppercase')
      expect(computed.letterSpacing).toBe('0.14px')
      expect(computed.whiteSpace).toBe('nowrap')
    })

    it('should answer to the 48 dp touch target without growing the items or the container', async () => {
      const { root, buttons } = group()
      await settle()

      const rect = buttons[1]!.getBoundingClientRect()
      const x = rect.left + rect.width / 2

      expect(root.getBoundingClientRect().height).toBe(36)
      expect(rect.height).toBe(36)
      expect(document.elementFromPoint(x, rect.top - 4)).toBe(buttons[1])
      expect(document.elementFromPoint(x, rect.bottom + 4)).toBe(buttons[1])
      expect(document.elementFromPoint(x, rect.top - 8)).not.toBe(buttons[1])
    })

    it('should mirror the seams to the end side under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(Md1ToggleButtons, {}, () => PERIODS.map(spec => item(spec)))]))
      await settle()

      const [first, second] = [...host.querySelectorAll('button')].map(button => getComputedStyle(button))

      expect(second!.borderLeftWidth).toBe('1px')
      expect(second!.borderRightWidth).toBe('0px')
      expect(first!.borderTopRightRadius).toBe('2px')
      expect(first!.borderTopLeftRadius).toBe('0px')
    })
  })

  describe('exclusive selection', () => {
    it('should select one item at a time and release it on a second press when not mandatory', async () => {
      const { buttons, model } = group()
      await settle()

      await userEvent.click(buttons[0]!)

      expect(model.value).toBe('day')
      expect(pressed(buttons)).toEqual(['true', 'false', 'false'])
      expect(buttons[0]!.dataset.state).toBe('on')

      await userEvent.click(buttons[2]!)

      expect(model.value).toBe('month')
      expect(pressed(buttons)).toEqual(['false', 'false', 'true'])

      await userEvent.click(buttons[2]!)

      expect(model.value).toBeUndefined()
      expect(pressed(buttons)).toEqual(['false', 'false', 'false'])
    })

    it('should keep the last item selected when mandatory', async () => {
      const { buttons, model } = group({ mandatory: true })
      await settle()

      await userEvent.click(buttons[1]!)

      expect(model.value).toBe('week')

      await userEvent.click(buttons[1]!)

      expect(model.value).toBe('week')
      expect(pressed(buttons)).toEqual(['false', 'true', 'false'])

      await userEvent.click(buttons[0]!)

      expect(model.value).toBe('day')
      expect(pressed(buttons)).toEqual(['true', 'false', 'false'])
    })

    it('should select the first enabled item on mount under mandatory="force"', async () => {
      const { buttons, model } = group({ mandatory: 'force' })
      await settle()

      expect(model.value).toBe('day')
      expect(pressed(buttons)).toEqual(['true', 'false', 'false'])
    })

    it('should start from the model and follow a model written from outside', async () => {
      const { buttons, model } = group({}, PERIODS, 'week')
      await settle()

      expect(pressed(buttons)).toEqual(['false', 'true', 'false'])

      model.value = 'month'
      await settle()

      expect(pressed(buttons)).toEqual(['false', 'false', 'true'])
    })
  })

  describe('multiple selection', () => {
    it('should select several items and emit an array', async () => {
      const { buttons, model } = group({ multiple: true })
      await settle()

      await userEvent.click(buttons[0]!)
      await userEvent.click(buttons[2]!)

      expect(model.value).toEqual(['day', 'month'])
      expect(pressed(buttons)).toEqual(['true', 'false', 'true'])

      await userEvent.click(buttons[0]!)

      expect(model.value).toEqual(['month'])
      expect(pressed(buttons)).toEqual(['false', 'false', 'true'])
    })

    it('should start from an array model', async () => {
      const { buttons } = group({ multiple: true }, PERIODS, ['day', 'week'])
      await settle()

      expect(pressed(buttons)).toEqual(['true', 'true', 'false'])
    })

    it('should keep the last selected item when mandatory', async () => {
      const { buttons, model } = group({ multiple: true, mandatory: true }, PERIODS, ['day'])
      await settle()

      await userEvent.click(buttons[0]!)

      expect(model.value).toEqual(['day'])
      expect(pressed(buttons)).toEqual(['true', 'false', 'false'])
    })
  })

  describe('states', () => {
    it('should fade unselected items to 40% and lay the 12% overlay on the selected one, seamed after it, in a raised strip', async () => {
      const { root, buttons } = group({}, PERIODS, 'week')
      await settle()

      const [off, on] = buttons.map(button => getComputedStyle(button))

      // Vuetify 1.5's v-btn-toggle (_button-toggle.styl:9-15, 31-41, 53-54).
      expect(off!.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(off!.opacity).toBe('0.4')
      expect(getComputedStyle(buttons[0]!, '::before').opacity).toBe('0')
      expect(on!.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(on!.opacity).toBe('1')
      expect(getComputedStyle(buttons[1]!, '::before').opacity).toBe('0.12')
      expect(on!.borderRightColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(off!.borderRightColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(root).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
    })

    it('should draw the 12% focus overlay for keyboard focus only, over the selected fill as well', async () => {
      const { buttons } = group({}, PERIODS, 'day')
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(buttons[0])
      expect(buttons[0]!.matches(':focus-visible')).toBe(true)
      await expect.poll(() => getComputedStyle(buttons[0]!, '::before').opacity).toBe('0.12')
      expect(getComputedStyle(buttons[1]!, '::before').opacity).toBe('0')

      // Chrome keeps :focus-visible on an element that is clicked while it already has focus, so blur it first.
      await userEvent.click(document.body)
      await userEvent.click(buttons[1]!)

      expect(document.activeElement).toBe(buttons[1])
      expect(buttons[1]!.matches(':focus-visible')).toBe(false)

      // The click selected it, and the pointer rests on it: move off and deselect to see focus alone.
      await userEvent.unhover(buttons[1]!)
      await userEvent.click(buttons[1]!)
      await userEvent.unhover(buttons[1]!)

      expect(buttons[1]!.getAttribute('aria-pressed')).toBe('false')
      await expect.poll(() => getComputedStyle(buttons[1]!, '::before').opacity).toBe('0')
    })

    it('should draw the pressed overlay as ink inside the pressed item only, and release it on pointerup', async () => {
      const { buttons } = group({}, PERIODS, undefined, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(buttons[1]!, 10, 10)
      await settle()

      expect(inks(buttons[1]!).length).toBe(1)
      expect(inks(buttons[0]!).length).toBe(0)
      expect(inks(buttons[2]!).length).toBe(0)
      expect(getComputedStyle(inks(buttons[1]!)[0]!).backgroundColor).toBe('rgba(153, 153, 153, 0.4)')
      // Bounded: the ink clips to the item, not the group.
      expect(Object.hasOwn((buttons[1]!.querySelector<HTMLElement>('.md1-ripple')!).dataset, 'unbounded')).toBe(false)
      expect(getComputedStyle(buttons[1]!.querySelector('.md1-ripple')!).overflow).toBe('hidden')

      up(buttons[1]!)

      await expect.poll(() => inks(buttons[1]!).length).toBe(0)
    })

    it('should disable the whole group: every item native-disabled, hooked, inert and dimmed', async () => {
      const { root, buttons, model } = group({ disabled: true })
      await settle()

      expect(root.dataset.disabled).toBe('true')
      expect(root.getAttribute('aria-disabled')).toBe('true')

      for (const button of buttons) {
        expect(button.disabled).toBe(true)
        expect(Object.hasOwn(button.dataset, 'disabled')).toBe(true)
        expect(button.getAttribute('tabindex')).toBe('-1')
        expect(button.hasAttribute('aria-disabled')).toBe(false)
        expect(getComputedStyle(button).color).toBe('rgba(0, 0, 0, 0.26)')
        expect(getComputedStyle(button).pointerEvents).toBe('none')
      }

      buttons[0]!.click()
      down(buttons[0]!, 10, 10)
      await settle()

      expect(model.value).toBeUndefined()
      expect(pressed(buttons)).toEqual(['false', 'false', 'false'])
      expect(inks(buttons[0]!).length).toBe(0)
    })

    it('should disable one item and leave its siblings selectable', async () => {
      const { root, buttons, model } = group({}, [PERIODS[0]!, { ...PERIODS[1]!, disabled: true }, PERIODS[2]!])
      await settle()

      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(false)
      expect(buttons[1]!.disabled).toBe(true)
      expect(buttons[0]!.disabled).toBe(false)

      buttons[1]!.click()
      await settle()

      expect(model.value).toBeUndefined()

      await userEvent.click(buttons[2]!)

      expect(model.value).toBe('month')
    })

    it('should keep a selected item\'s overlay when the group is then disabled, in the disabled ink', async () => {
      // v0's selection refuses to select into a disabled group, so the model is applied before the group disables.
      const disabled = shallowRef(false)
      const host = mount(() => h(Md1ToggleButtons, { disabled: disabled.value, modelValue: 'day' }, () => PERIODS.map(spec => item(spec))))
      await settle()

      disabled.value = true
      await settle()

      const buttons = [...host.querySelectorAll('button')]
      const computed = getComputedStyle(buttons[0]!)

      expect(buttons[0]!.disabled).toBe(true)

      expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true')
      expect(getComputedStyle(buttons[0]!, '::before').opacity).toBe('0.12')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.26)')
    })
  })

  describe('icons', () => {
    it('should draw the glyph through Md1Icon ahead of the label with Vuetify 1.5\'s 10 px gap', async () => {
      const { buttons } = group({}, [
        { value: 'grid', icon: 'apps', label: 'Grid' },
        { value: 'list', icon: 'reorder', label: 'List' },
        { value: 'map', icon: 'place', label: 'Map' },
      ])
      await settle()

      const button = buttons[0]!
      const svg = button.querySelector('svg')!
      const label = button.querySelector<HTMLElement>('.md1-toggle-buttons__label')!

      expect(svg.classList.contains('md1-icon')).toBe(true)
      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.apps)
      expect(svg.nextElementSibling).toBe(label)
      expect(getComputedStyle(label).marginLeft).toBe('10px')
      expect(Object.hasOwn(button.dataset, 'solo')).toBe(false)
    })

    it('should become a 48 dp square icon-only item named by ariaLabel', async () => {
      const { buttons } = group({}, [
        { value: 'grid', icon: 'apps', ariaLabel: 'Grid' },
        { value: 'list', icon: 'reorder', ariaLabel: 'List' },
        { value: 'map', icon: 'place', ariaLabel: 'Map' },
      ])
      await settle()

      const button = buttons[1]!
      const rect = button.getBoundingClientRect()

      expect(Object.hasOwn(button.dataset, 'solo')).toBe(true)
      expect(button.getAttribute('aria-label')).toBe('List')
      expect(button.querySelector('.md1-toggle-buttons__label')).toBeNull()
      // Border-box: the 1 dp divider sits inside the 48 dp square, so every icon-only item is the same width.
      expect(rect.width).toBe(48)
      expect(rect.height).toBe(36)
      expect(getComputedStyle(button).paddingLeft).toBe('0px')
      expect(buttons[0]!.getBoundingClientRect().width).toBe(48)
    })

    it('should warn in dev when an icon-only item has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      group({}, [
        { value: 'grid', icon: 'apps' },
        { value: 'list', icon: 'reorder', ariaLabel: 'List' },
        { value: 'map', icon: 'place', ariaLabel: 'Map' },
      ])
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
    })
  })

  describe('keyboard', () => {
    it('should give every item its own tab stop and toggle the focused one on Space and Enter', async () => {
      const { buttons, model } = group()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(buttons[0])

      await userEvent.tab()

      expect(document.activeElement).toBe(buttons[1])

      await userEvent.keyboard(' ')

      expect(model.value).toBe('week')

      await userEvent.keyboard('{Enter}')

      expect(model.value).toBeUndefined()
    })

    it('should skip a disabled item in the tab order', async () => {
      const { buttons } = group({}, [PERIODS[0]!, { ...PERIODS[1]!, disabled: true }, PERIODS[2]!])
      await settle()

      await userEvent.tab()
      await userEvent.tab()

      expect(document.activeElement).toBe(buttons[2])
    })
  })

  describe('composition', () => {
    it('should warn in dev when the group renders fewer than three items, and not at three', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      group({}, PERIODS.slice(0, 2))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('three'))

      group()
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('should warn in dev when an item renders outside the group, and still render it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1ToggleButtonsItem, { value: 'lone' }, () => 'Alone'))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1ToggleButtonsItem'))
      expect(host.querySelector('button')!.getAttribute('aria-pressed')).toBe('false')
    })

    it('should stop counting an item once it unmounts', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const third = shallowRef(true)
      mount(() => h(Md1ToggleButtons, {}, () => [
        item(PERIODS[0]!),
        item(PERIODS[1]!),
        third.value ? item(PERIODS[2]!) : null,
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)

      third.value = false
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('should resolve a custom namespace end to end', async () => {
      const { buttons, model } = group({ namespace: 'md1:test' }, PERIODS.map(spec => ({ ...spec, groupNamespace: 'md1:test' })))
      await settle()

      await userEvent.click(buttons[2]!)

      expect(model.value).toBe('month')
      expect(pressed(buttons)).toEqual(['false', 'false', 'true'])
    })

    it('should expose the flat item export as the attached part', () => {
      expect(Md1ToggleButtons.Item).toBe(Md1ToggleButtonsItem)
    })
  })

  describe('theme', () => {
    it('should take its strip, seam and ink from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1ToggleButtons, { modelValue: 'day' }, () => PERIODS.map(spec => item(spec)))]),
        h('div', { 'data-theme': 'md1-dark' }, [h(Md1ToggleButtons, { modelValue: 'day' }, () => PERIODS.map(spec => item(spec)))]),
      ]))
      await settle()

      const [light, dark] = [...host.querySelectorAll<HTMLElement>('.md1-toggle-buttons')]
      const [lightOn, lightOff] = [...light!.querySelectorAll('button')]
      const [darkOn, darkOff] = [...dark!.querySelectorAll('button')]

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(light!).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(lightOn!).borderRightColor).toBe('rgba(0, 0, 0, 0.26)')
      expect(getComputedStyle(lightOff!).color).toBe('rgba(0, 0, 0, 0.87)')
      // The dark theme flips the strip to the dark surface and the seam and ink to white tiers.
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(darkOn!).borderRightColor).toBe('rgba(255, 255, 255, 0.3)')
      expect(getComputedStyle(darkOn!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(darkOff!).color).toBe('rgb(255, 255, 255)')
    })
  })
})

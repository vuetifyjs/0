import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

// Components
import { QuTextField } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuTextFieldProps, QuTextFieldSlotProps } from './QuTextField.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Icons
import { quantumIcons } from '../../icons'

const ELEVATION_1 = '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'

const ACCENT = 'rgb(255, 64, 129)'
const ERROR = 'rgb(255, 23, 68)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  host.style.width = '320px'
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

interface Field {
  root: HTMLElement
  field: HTMLElement
  input: HTMLInputElement
  label: HTMLLabelElement | null
  line: HTMLElement
  model: { value: string }
}

/** A v-model bound field; `children` fills the default slot. */
function field (props: QuTextFieldProps & Record<string, unknown> = {}, initial = '', children?: (slot: QuTextFieldSlotProps) => VNode[], setup?: (app: App) => void): Field {
  const model = shallowRef(initial)
  const host = mount(() => h(QuTextField, {
    'label': 'Name',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: string) => {
      model.value = value
    },
  }, children ? { default: children } : undefined), setup)

  const root = host.querySelector<HTMLElement>('.quantum-text-field')!

  return {
    root,
    field: root.querySelector<HTMLElement>('.quantum-text-field__field')!,
    input: root.querySelector<HTMLInputElement>('.quantum-text-field__input')!,
    label: root.querySelector<HTMLLabelElement>('.quantum-text-field__label'),
    line: root.querySelector<HTMLElement>('.quantum-text-field__line')!,
    model,
  }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at formatting. */
function serialize (value: string, property: 'color' | 'boxShadow' = 'color'): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

/**
 * The line's colour derives from the hover overlay at runtime, so it computes
 * as `color(srgb ...)` and carries the 8-bit rounding of its source: compare
 * it as channels within half a percent.
 */
function ink (value: string): number[] {
  const numbers = [...value.matchAll(/[\d.]+/g)].map(match => Number(match[0]))

  if (value.startsWith('color(')) {
    const [r = 0, g = 0, b = 0, a = 1] = numbers
    return [r * 255, g * 255, b * 255, a]
  }

  const [r = 0, g = 0, b = 0, a = 1] = numbers
  return [r, g, b, a]
}

function near (actual: string, expected: [number, number, number, number]) {
  const [r, g, b, a] = ink(actual)

  expect(r).toBeCloseTo(expected[0], 0)
  expect(g).toBeCloseTo(expected[1], 0)
  expect(b).toBeCloseTo(expected[2], 0)
  expect(Math.abs(a! - expected[3])).toBeLessThan(0.015)
}

function height (el: Element): number {
  return el.getBoundingClientRect().height
}

/** A rule as authored, read from the stylesheet: for values outside the test browser's media (handset, coarse pointer). */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])

  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quTextField', () => {
  describe('anatomy', () => {
    it('should render the field, the visible label tied to the input, the line and the details row', async () => {
      const { root, field: box, input, label, line } = field()
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(root.dataset.state).toBe('pristine')
      expect(box.parentElement!.classList.contains('quantum-text-field__body')).toBe(true)
      expect(input.tagName).toBe('INPUT')
      expect(input.type).toBe('text')
      expect(label!.htmlFor).toBe(input.id)
      expect(input.labels![0]).toBe(label)
      // The visible label names the input; Input.Root never gets a duplicate aria-label.
      expect(input.hasAttribute('aria-label')).toBe(false)
      expect(line.getAttribute('aria-hidden')).toBe('true')
      expect(root.querySelector('.quantum-text-field__details')).not.toBeNull()
      expect(root.querySelector('.quantum-ripple')).toBeNull()
    })

    it('should lay out the 72 dp tile: 16 dp above the label, the 48 dp field with the line at its foot, 8 dp under it', async () => {
      const { root, field: box, input } = field()
      await settle()

      expect(height(root)).toBe(72)
      expect(getComputedStyle(root).paddingTop).toBe('16px')
      expect(height(box)).toBe(48)
      expect(getComputedStyle(box).paddingTop).toBe('20px')
      expect(getComputedStyle(box).paddingBottom).toBe('8px')
      expect(getComputedStyle(input).fontSize).toBe('16px')
      expect(getComputedStyle(input).fontWeight).toBe('400')
    })

    it('should rest the label at input size and float it to 12 sp in the accent at 87% on focus', async () => {
      const { root, input, label } = field()
      await settle()

      expect(getComputedStyle(label!).fontSize).toBe('16px')
      expect(getComputedStyle(label!).color).toBe('rgba(0, 0, 0, 0.54)')

      await userEvent.click(input)
      await settle()

      expect(root.dataset.focused).toBe('true')
      await expect.poll(() => getComputedStyle(label!).fontSize).toBe('12px')
      // The light state table: the floating label is the active colour at 87%.
      await expect.poll(() => ink(getComputedStyle(label!).color)[3]).toBeCloseTo(0.87, 2)
      near(getComputedStyle(label!).color, [255, 64, 129, 0.87])
      await expect.poll(() => label!.getBoundingClientRect().top).toBe(root.getBoundingClientRect().top + 16)
      expect(getComputedStyle(input).caretColor).toBe(ACCENT)
    })

    it('should keep the label floated at the secondary ink once filled and blurred', async () => {
      const { root, input, label } = field({}, 'Ada')
      await settle()

      expect(root.dataset.dirty).toBe('true')
      expect(input.value).toBe('Ada')
      await expect.poll(() => getComputedStyle(label!).fontSize).toBe('12px')
      expect(getComputedStyle(label!).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should reveal the placeholder only once the label floats', async () => {
      const { input } = field({ placeholder: 'Ada Lovelace' })
      await settle()

      expect(input.hasAttribute('placeholder')).toBe(false)

      await userEvent.click(input)
      await settle()

      expect(input.placeholder).toBe('Ada Lovelace')
      expect(getComputedStyle(input, '::placeholder').color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should forward non-class attributes to the input and dress the root with class and style', async () => {
      const { root, input } = field({ class: 'custom', style: 'margin: 4px', autocomplete: 'email', inputmode: 'email' })
      await settle()

      expect(root.classList.contains('custom')).toBe(true)
      expect(root.style.margin).toBe('4px')
      expect(input.getAttribute('autocomplete')).toBe('email')
      expect(input.getAttribute('inputmode')).toBe('email')
      expect(root.hasAttribute('autocomplete')).toBe(false)
    })

    it('should warn in dev when a field has no label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      field({ label: undefined })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuTextField] every text field needs a label'))
    })
  })

  describe('line', () => {
    it('should draw the idle line 1 dp at 42% black and thicken it to 2 dp at 87% on hover', async () => {
      const { field: box, line } = field()
      await settle()

      expect(height(line)).toBe(1)
      near(getComputedStyle(line).backgroundColor, [0, 0, 0, 0.42])

      await userEvent.hover(box)

      await expect.poll(() => getComputedStyle(line).height).toBe('2px')
      await expect.poll(() => getComputedStyle(line).backgroundColor).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should wash the 2 dp accent line in from the press point on focus', async () => {
      const { field: box, input, line } = field()
      await settle()

      expect(getComputedStyle(line, '::after').transform).toBe('matrix(0, 0, 0, 1, 0, 0)')

      const rect = box.getBoundingClientRect()
      box.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: rect.left + 40, clientY: rect.top + 30 }))
      input.focus()
      await settle()

      expect(line.style.transformOrigin).toBe('40px 50%')
      expect(getComputedStyle(line, '::after').height).toBe('2px')
      expect(getComputedStyle(line, '::after').backgroundColor).toBe(ACCENT)
      await expect.poll(() => getComputedStyle(line, '::after').transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
    })

    it('should put the caret in the input when the field padding is pressed', async () => {
      const { field: box, input } = field()
      await settle()

      box.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(document.activeElement).toBe(input)
    })
  })

  describe('validation', () => {
    it('should validate on blur, show the error in place of the helper and turn the line and label red', async () => {
      const { root, input, label, line } = field({
        helper: 'As on your card',
        rules: [(value: unknown) => String(value).length > 2 || 'Use three characters or more'],
      })
      await settle()

      const helper = root.querySelector('.quantum-text-field__helper')!

      expect(helper.textContent!.trim()).toBe('As on your card')
      expect(input.getAttribute('aria-describedby')).toBe(helper.id)

      await userEvent.type(input, 'Al')
      await settle()

      // Not yet: errors show when focus leaves.
      expect(root.dataset.state).toBe('pristine')

      input.blur()
      await settle()

      const error = root.querySelector<HTMLElement>('.quantum-text-field__error')!

      await expect.poll(() => root.dataset.state).toBe('invalid')
      expect(root.querySelector('.quantum-text-field__helper')).toBeNull()
      expect(error.textContent!.trim()).toBe('Use three characters or more')
      expect(error.getAttribute('aria-live')).toBe('polite')
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.getAttribute('aria-errormessage')).toBe(error.id)
      // Error text is Red A400 at 87% on the light theme; the label and line are at 100%.
      near(getComputedStyle(error).color, [255, 23, 68, 0.87])
      expect(getComputedStyle(error).fontSize).toBe('12px')
      await expect.poll(() => getComputedStyle(label!).color).toBe(ERROR)
      await expect.poll(() => getComputedStyle(line).backgroundColor).toBe(ERROR)
      expect(getComputedStyle(line).height).toBe('2px')

      await userEvent.type(input, 'an')
      input.blur()
      await settle()

      await expect.poll(() => root.dataset.state).toBe('valid')
      expect(root.querySelector('.quantum-text-field__helper')).not.toBeNull()
    })

    it('should validate on every keystroke under validateOn="input"', async () => {
      const { root, input } = field({
        validateOn: 'input',
        rules: [(value: unknown) => /^\d*$/.test(String(value)) || 'Digits only'],
      })
      await settle()

      await userEvent.type(input, 'a')

      await expect.poll(() => root.dataset.state).toBe('invalid')
      expect(document.activeElement).toBe(input)
    })

    it('should mark required fields with an asterisk, aria-required and a presence rule', async () => {
      const { root, input, label } = field({ required: true })
      await settle()

      const mark = label!.querySelector('.quantum-text-field__required')!

      expect(mark.textContent).toBe(' *')
      expect(mark.getAttribute('aria-hidden')).toBe('true')
      expect(input.getAttribute('aria-required')).toBe('true')

      input.focus()
      input.blur()
      await settle()

      await expect.poll(() => root.querySelector('.quantum-text-field__error')!.textContent!.trim()).toBe('Required')
    })

    it('should append "(optional)" to the label of an optional field', async () => {
      const { label } = field({ optional: true })
      await settle()

      expect(label!.textContent!.replaceAll(/\s+/g, ' ').trim()).toBe('Name (optional)')
    })

    it('should force the error state with error and show errorMessages', async () => {
      const { root } = field({ error: true, errorMessages: 'Taken' })
      await settle()

      expect(root.dataset.state).toBe('invalid')
      expect(root.querySelector('.quantum-text-field__error')!.textContent!.trim()).toBe('Taken')
    })
  })

  describe('counter', () => {
    it('should count characters as "used / limit" and turn the field red over the limit', async () => {
      const { root, input } = field({ counter: 5 }, 'abc')
      await settle()

      const counter = root.querySelector<HTMLElement>('.quantum-text-field__counter')!

      expect(root.dataset.counter).toBe('characters')
      expect(counter.textContent!.trim()).toBe('3 / 5')
      expect(getComputedStyle(counter).fontSize).toBe('12px')
      expect(root.dataset.state).toBe('pristine')

      await userEvent.type(input, 'def')
      await settle()

      expect(counter.textContent!.trim()).toBe('6 / 5')
      expect(root.dataset.state).toBe('invalid')
      expect(Object.hasOwn(counter.dataset, 'over')).toBe(true)
      expect(getComputedStyle(counter).color).toBe(ERROR)
      // The limit is a state, not a message: no error text replaces the helper.
      expect(root.querySelector('.quantum-text-field__error')!.textContent!.trim()).toBe('')
    })

    it('should count whitespace-separated words under a word limit', async () => {
      const { root } = field({ counter: { words: 3 } }, ' one  two three four ')
      await settle()

      expect(root.dataset.counter).toBe('words')
      expect(root.querySelector('.quantum-text-field__counter')!.textContent!.trim()).toBe('4 / 3')
      expect(root.dataset.state).toBe('invalid')
    })
  })

  describe('formatting', () => {
    it('should show the prefix and suffix only when the field is focused or filled', async () => {
      const { root, input } = field({ prefix: '$', suffix: 'USD' })
      await settle()

      const prefix = root.querySelector('.quantum-text-field__prefix')!
      const suffix = root.querySelector('.quantum-text-field__suffix')!

      expect(getComputedStyle(prefix).visibility).toBe('hidden')
      expect(getComputedStyle(suffix).visibility).toBe('hidden')

      await userEvent.click(input)
      await settle()

      expect(getComputedStyle(prefix).visibility).toBe('visible')
      expect(prefix.textContent).toBe('$')
      expect(suffix.textContent).toBe('USD')
      // The prefix sits before the input and the suffix after it.
      expect(prefix.getBoundingClientRect().right).toBeLessThanOrEqual(input.getBoundingClientRect().left)
      expect(suffix.getBoundingClientRect().left).toBeGreaterThanOrEqual(input.getBoundingClientRect().right)
    })

    it('should insert the separators of a mask and keep the model unformatted', async () => {
      const { root, input, model } = field({ mask: '(###) ###-####' })
      await settle()

      expect(root.dataset.mask).toBe('true')

      await userEvent.click(input)
      await userEvent.keyboard('555')

      // The group filled: the separators follow and the caret jumps past them.
      expect(input.value).toBe('(555) ')
      expect(input.selectionStart).toBe(6)

      await userEvent.keyboard('1234567')

      expect(input.value).toBe('(555) 123-4567')
      expect(model.value).toBe('5551234567')

      // Characters past the last slot are dropped.
      await userEvent.keyboard('8')

      expect(input.value).toBe('(555) 123-4567')

      await userEvent.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}')

      expect(input.value).toBe('(555) 12')
      expect(model.value).toBe('55512')
    })

    it('should format a model set from outside and validate the unformatted value', async () => {
      const { root, input, model } = field({
        mask: '#### #### #### ####',
        rules: [(value: unknown) => String(value).length === 16 || 'Sixteen digits'],
      }, '4111111111111111')
      await settle()

      expect(input.value).toBe('4111 1111 1111 1111')

      input.focus()
      input.blur()
      await settle()

      await expect.poll(() => root.dataset.state).toBe('valid')

      model.value = '42'
      await settle()

      expect(input.value).toBe('42')
    })
  })

  describe('buttons', () => {
    it('should enable the clear button only with text, clear on press, emit clear and keep focus', async () => {
      const onClear = vi.fn()
      const { root, input, model } = field({ clearable: true, onClear })
      await settle()

      const clear = root.querySelector<HTMLButtonElement>('.quantum-text-field__clear')!

      expect(clear.disabled).toBe(true)
      expect(clear.getAttribute('aria-label')).toBe('Clear')
      expect(clear.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect([...clear.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(quantumIcons.close)

      await userEvent.type(input, 'Ada')
      await settle()

      expect(clear.disabled).toBe(false)

      await userEvent.click(clear)
      await settle()

      expect(model.value).toBe('')
      expect(input.value).toBe('')
      expect(onClear).toHaveBeenCalledTimes(1)
      expect(document.activeElement).toBe(input)
    })

    it('should disguise a password and toggle it with the visibility button', async () => {
      const { root, input } = field({ type: 'password' }, 'secret')
      await settle()

      const toggle = root.querySelector<HTMLButtonElement>('.quantum-text-field__visibility')!

      expect(input.type).toBe('password')
      expect(toggle.getAttribute('aria-label')).toBe('Show password')
      expect(getComputedStyle(toggle).color).toBe('rgba(0, 0, 0, 0.38)')

      await userEvent.click(toggle)
      await settle()

      expect(input.type).toBe('text')
      expect(toggle.getAttribute('aria-label')).toBe('Hide password')
      expect(toggle.dataset.active).toBe('true')
      expect(getComputedStyle(toggle).color).toBe('rgba(0, 0, 0, 0.54)')
      expect([...toggle.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(quantumIcons['visibility-off'])
    })

    it('should keep the voice button enabled and emit voice', async () => {
      const onVoice = vi.fn()
      const { root } = field({ voice: true, onVoice })
      await settle()

      const mic = root.querySelector<HTMLButtonElement>('.quantum-text-field__voice')!

      expect(mic.disabled).toBe(false)
      expect(mic.getAttribute('aria-label')).toBe('Voice input')

      await userEvent.click(mic)

      expect(onVoice).toHaveBeenCalledTimes(1)
    })

    it('should give each trailing glyph a 24 dp box and a 48 dp target, 8 dp from its neighbour', async () => {
      const { root } = field({ clearable: true, voice: true }, 'x')
      await settle()

      const clear = root.querySelector<HTMLElement>('.quantum-text-field__clear')!
      const mic = root.querySelector<HTMLElement>('.quantum-text-field__voice')!

      expect(clear.getBoundingClientRect().width).toBe(24)
      expect(clear.getBoundingClientRect().height).toBe(24)
      expect(getComputedStyle(clear, '::after').width).toBe('48px')
      expect(mic.getBoundingClientRect().left - clear.getBoundingClientRect().right).toBe(8)
    })

    it('should seat each trailing glyph 8 dp above the foot of the line', async () => {
      const { root, field: box } = field({ clearable: true, voice: true, type: 'password' }, 'x')
      await settle()

      const bottom = box.getBoundingClientRect().bottom

      for (const name of ['clear', 'visibility', 'voice']) {
        const el = root.querySelector(`.quantum-text-field__${name}`)!

        expect(bottom - el.getBoundingClientRect().bottom).toBe(8)
      }
    })

    it('should reach an enabled clear button with Tab from the input and clear with Enter', async () => {
      const { root, input, model } = field({ clearable: true }, 'Ada')
      await settle()

      const clear = root.querySelector<HTMLButtonElement>('.quantum-text-field__clear')!

      input.focus()
      await userEvent.tab()

      expect(document.activeElement).toBe(clear)

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(model.value).toBe('')
      expect(document.activeElement).toBe(input)
    })

    it('should draw the icon signifier 16 dp before the field', async () => {
      const { root, field: box } = field({ icon: 'person' })
      await settle()

      const svg = root.querySelector<SVGElement>('.quantum-text-field__icon')!

      expect(svg.parentElement).toBe(root)
      expect([...svg.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(quantumIcons.person)
      expect(svg.getBoundingClientRect().width).toBe(24)
      expect(box.getBoundingClientRect().left - svg.getBoundingClientRect().right).toBe(16)
      expect(getComputedStyle(svg).color).toBe('rgba(0, 0, 0, 0.54)')
    })
  })

  describe('variants', () => {
    it('should fill the box 56 dp tall with 4 dp corners, the 6% tint, 16 dp sides and a ripple', async () => {
      const { root, field: box, label } = field({ box: true })
      await settle()

      const computed = getComputedStyle(box)

      expect(root.dataset.box).toBe('true')
      expect(height(box)).toBe(56)
      expect(computed.borderRadius).toBe('4px')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0.06)')
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.overflow).toBe('hidden')
      expect(box.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      // The resting label sits centred in the fill.
      expect(label!.getBoundingClientRect().top - box.getBoundingClientRect().top).toBe(18)
    })

    it('should condense the dense field to 13 sp with halved spacings, and the dense box to 44 dp', async () => {
      const { root, field: box, input } = field({ dense: true })
      await settle()

      expect(root.dataset.dense).toBe('true')
      expect(getComputedStyle(input).fontSize).toBe('13px')
      expect(getComputedStyle(root).paddingTop).toBe('8px')
      expect(getComputedStyle(root.querySelector('.quantum-text-field__details')!).paddingTop).toBe('4px')
      expect(height(box)).toBe(44)

      const dense = field({ dense: true, box: true })
      await settle()

      expect(height(dense.field)).toBe(44)
    })

    it('should span 56 dp at full width (48 dp dense) with the label as a hint and the divider as its line', async () => {
      const { root, field: box, input, label, line } = field({ fullWidth: true })
      await settle()

      expect(root.dataset.fullWidth).toBe('true')
      expect(height(box)).toBe(56)
      // Stacked full-width fields meet at their dividers: no empty details row beneath.
      expect(height(root)).toBe(56)
      expect(getComputedStyle(line).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')

      await userEvent.click(input)
      await settle()

      expect(getComputedStyle(label!).visibility).toBe('hidden')

      const dense = field({ fullWidth: true, dense: true })
      await settle()

      expect(height(dense.field)).toBe(48)
    })

    it('should raise the solo field to 2 dp with no line and no visible label, rising to 3 dp when scrolled, each 2 dp lower under a fine pointer', async () => {
      const { root, field: box, input, label, line } = field({ solo: true, placeholder: 'Search', icon: 'search' })
      await settle()

      expect(root.dataset.solo).toBe('true')
      expect(height(box)).toBe(48)
      expect(getComputedStyle(box).borderRadius).toBe('2px')
      // The test browser is a fine pointer: the desktop rule drops the 2 dp rest to 0 dp. The handset value is read as authored.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)
      expect(getComputedStyle(box).boxShadow).toBe('none')
      expect(rule('.quantum-text-field[data-solo] .quantum-text-field__field')!.style.boxShadow).toContain('--quantum-elevation-2')
      expect(getComputedStyle(line).display).toBe('none')
      expect(label!.getBoundingClientRect().width).toBe(1)
      expect(input.labels![0]).toBe(label)
      expect(input.placeholder).toBe('Search')
      // The icon sits inside the sheet.
      expect(root.querySelector('.quantum-text-field__icon')!.parentElement).toBe(box)

      // With no line to clear, a trailing glyph centres in the sheet.
      const search = field({ solo: true, clearable: true }, 'x')
      await settle()

      const clear = search.root.querySelector('.quantum-text-field__clear')!.getBoundingClientRect()
      const sheet = search.field.getBoundingClientRect()

      expect(clear.top - sheet.top).toBe(sheet.bottom - clear.bottom)

      const scrolled = field({ solo: true, scrolled: true })
      await settle()

      expect(scrolled.root.dataset.scrolled).toBe('true')
      await expect.poll(() => getComputedStyle(scrolled.field).boxShadow).toBe(serialize(ELEVATION_1, 'boxShadow'))
      expect(rule('.quantum-text-field[data-solo][data-scrolled] .quantum-text-field__field')!.style.boxShadow).toContain('--quantum-elevation-3')
    })

    it('should hide a heading label visually, keep the name and show the placeholder at rest', async () => {
      const { root, input, label } = field({ heading: true, placeholder: 'Type a message' })
      await settle()

      expect(root.dataset.heading).toBe('true')
      expect(label!.getBoundingClientRect().width).toBe(1)
      expect(input.labels![0]).toBe(label)
      expect(input.placeholder).toBe('Type a message')
    })

    it('should grow a multi-line field downward as lines are added', async () => {
      const { root, input } = field({ multiline: true })
      await settle()

      expect(root.dataset.multiline).toBe('true')
      expect(input.tagName).toBe('TEXTAREA')

      const before = height(input)

      expect(before).toBe(20)

      await userEvent.click(input)
      await userEvent.keyboard('one{Shift>}{Enter}{/Shift}two{Shift>}{Enter}{/Shift}three')
      await settle()

      expect(height(input)).toBe(60)
    })

    it('should give the text area a fixed height with a 1 dp border in the line colour', async () => {
      const { root, input, label } = field({ textarea: true })
      await settle()

      const computed = getComputedStyle(input)

      expect(root.dataset.textarea).toBe('true')
      expect(input.tagName).toBe('TEXTAREA')
      expect(height(input)).toBe(118)
      expect(computed.borderTopWidth).toBe('1px')
      near(computed.borderTopColor, [0, 0, 0, 0.42])
      expect(computed.overflowY).toBe('auto')
      // The label stays floated above the border.
      expect(getComputedStyle(label!).fontSize).toBe('12px')
    })
  })

  describe('dropdown', () => {
    function options (): VNode[] {
      return [
        h(QuTextField.Item, { value: 'small' }, () => 'Small'),
        h(QuTextField.Item, { value: 'medium' }, () => 'Medium'),
        h(QuTextField.Item, { value: 'large', disabled: true }, () => 'Large'),
      ]
    }

    it('should render a readonly combobox with the arrow and a listbox of the Item children', async () => {
      const { root, input, label } = field({ dropdown: true, label: 'Size' }, '', options)
      await settle()

      const list = root.querySelector<HTMLElement>('.quantum-text-field__list')!
      const items = [...list.querySelectorAll<HTMLElement>('.quantum-text-field__item')]

      expect(root.dataset.dropdown).toBe('true')
      expect(input.getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('aria-labelledby')).toBe(label!.id)
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(input.tabIndex).toBe(0)
      expect(input.querySelector('.quantum-text-field__dropdown path')!.getAttribute('d')).toBe(quantumIcons['arrow-drop-down'][0])

      // The 24 x 24 dp arrow container sits 8 dp above the foot of the line.
      const arrow = input.querySelector('.quantum-text-field__dropdown')!

      expect(arrow.getBoundingClientRect().height).toBe(24)
      expect(root.querySelector('.quantum-text-field__field')!.getBoundingClientRect().bottom - arrow.getBoundingClientRect().bottom).toBe(8)
      expect(list.getAttribute('role')).toBe('listbox')
      expect(list.hasAttribute('popover')).toBe(true)
      expect(items.map(item => item.getAttribute('role'))).toEqual(['option', 'option', 'option'])
      expect(items[0]!.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(items[2]!.getAttribute('aria-disabled')).toBe('true')
    })

    it('should open on press, write the chosen value and show its text', async () => {
      const { root, input, model } = field({ dropdown: true }, '', options)
      await settle()

      await userEvent.click(input)
      await settle()

      const list = root.querySelector<HTMLElement>('.quantum-text-field__list')!

      expect(root.dataset.open).toBe('true')
      expect(list.matches(':popover-open')).toBe(true)
      expect(getComputedStyle(list).boxShadow).not.toBe('none')

      const item = list.querySelectorAll<HTMLElement>('.quantum-text-field__item')[1]!

      expect(height(item)).toBe(48)

      await userEvent.click(item)
      await settle()

      expect(model.value).toBe('medium')
      expect(root.dataset.open).toBeUndefined()
      expect(root.dataset.dirty).toBe('true')
      expect(input.querySelector('.quantum-text-field__value')!.textContent!.trim()).toBe('Medium')
    })

    it('should open with ArrowDown and choose with Enter, skipping nothing it should not', async () => {
      const { root, input, model } = field({ dropdown: true }, 'small', options)
      await settle()

      input.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(root.dataset.open).toBe('true')

      await userEvent.keyboard('{ArrowDown}{Enter}')
      await settle()

      expect(model.value).toBe('medium')
      expect(document.activeElement).toBe(input)
    })

    it('should ignore presses while disabled', async () => {
      const { root, input } = field({ dropdown: true, disabled: true }, '', options)
      await settle()

      expect(input.tabIndex).toBe(-1)

      input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(root.dataset.open).toBeUndefined()
    })

    it('should warn in dev and render nothing for an Item outside a dropdown field', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuTextField.Item, { value: 'x' }))
      await settle()

      expect(host.querySelector('.quantum-text-field__item')).toBeNull()
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuTextFieldItem'))
    })
  })

  describe('picker', () => {
    it('should turn the signifier into a button that opens a confirmation dialog and write the value on OK', async () => {
      const { root, model } = field({ picker: 'date', label: 'Date' }, '', ({ commit }) => [
        h('button', { class: 'pick', type: 'button', onClick: () => commit('2026-10-22') }, 'Pick'),
      ], app => {
        app.use(createStackPlugin())
      })
      await settle()

      const button = root.querySelector<HTMLButtonElement>('.quantum-text-field__picker')!

      expect(root.dataset.picker).toBe('date')
      expect(button.getAttribute('aria-label')).toBe('Choose date')
      expect([...button.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(quantumIcons.event)

      await userEvent.click(button)
      await settle()

      const dialog = root.querySelector<HTMLDialogElement>('dialog')!

      await expect.poll(() => dialog.open).toBe(true)

      const confirm = dialog.querySelector<HTMLButtonElement>('.quantum-dialog__confirm')!

      expect(confirm.disabled).toBe(true)

      await userEvent.click(dialog.querySelector('.pick')!)
      await settle()

      expect(confirm.disabled).toBe(false)

      await userEvent.click(confirm)
      await settle()

      expect(model.value).toBe('2026-10-22')
      await expect.poll(() => dialog.open).toBe(false)
    })

    it('should draw the clock glyph for a time picker', async () => {
      const { root } = field({ picker: 'time', label: 'Time' }, '', () => [], app => {
        app.use(createStackPlugin())
      })
      await settle()

      const button = root.querySelector<HTMLButtonElement>('.quantum-text-field__picker')!

      expect(button.getAttribute('aria-label')).toBe('Choose time')
      expect([...button.querySelectorAll('path')].map(path => path.getAttribute('d'))).toEqual(quantumIcons.schedule)
    })
  })

  describe('disabled', () => {
    it('should disable the input and the buttons, dot the line and drop the ink to 38%', async () => {
      const { root, field: box, input, label, line } = field({ disabled: true, clearable: true, voice: true, box: true }, 'Ada')
      await settle()

      expect(root.dataset.disabled).toBe('true')
      expect(input.disabled).toBe(true)
      expect(root.querySelector<HTMLButtonElement>('.quantum-text-field__clear')!.disabled).toBe(true)
      expect(root.querySelector<HTMLButtonElement>('.quantum-text-field__voice')!.disabled).toBe(true)
      expect(getComputedStyle(line).borderTopStyle).toBe('dotted')
      expect(getComputedStyle(line).borderTopWidth).toBe('1px')
      expect(getComputedStyle(label!).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(input).color).toBe('rgba(0, 0, 0, 0.38)')

      // No press ink on a disabled box.
      const rect = box.getBoundingClientRect()
      box.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: rect.left + 10, clientY: rect.top + 10 }))
      await settle()

      expect(box.querySelectorAll('.quantum-ripple__ink')).toHaveLength(0)

      await userEvent.tab()

      expect(document.activeElement).not.toBe(input)
    })
  })

  describe('readonly', () => {
    it('should show the value without allowing edits and keep the clear button inert', async () => {
      const { root, input, model } = field({ readonly: true, clearable: true }, 'Ada')
      await settle()

      expect(root.dataset.readonly).toBe('true')
      expect(input.readOnly).toBe(true)
      expect(root.querySelector<HTMLButtonElement>('.quantum-text-field__clear')!.disabled).toBe(true)

      await userEvent.type(input, 'x')
      await settle()

      expect(model.value).toBe('Ada')
    })
  })

  describe('theme', () => {
    it('should take its line, label and ink from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuTextField, { label: 'Light' })]),
        h('div', { 'data-theme': 'quantum-dark' }, [
          h(QuTextField, { label: 'Dark', box: true }),
          h(QuTextField, { label: 'Invalid', error: true, errorMessages: 'Taken' }),
        ]),
      ]))
      await settle()

      const [light, dark, invalid] = host.querySelectorAll<HTMLElement>('.quantum-text-field')

      // The dark state table: error text at 100% Red A400 (87% on the light theme).
      near(getComputedStyle(invalid!.querySelector('.quantum-text-field__error')!).color, [255, 23, 68, 1])

      near(getComputedStyle(light!.querySelector('.quantum-text-field__line')!).backgroundColor, [0, 0, 0, 0.42])
      near(getComputedStyle(dark!.querySelector('.quantum-text-field__line')!).backgroundColor, [255, 255, 255, 0.7])
      expect(getComputedStyle(dark!.querySelector('.quantum-text-field__label')!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(dark!.querySelector('.quantum-text-field__input')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.quantum-text-field__field')!).backgroundColor).toBe('rgba(255, 255, 255, 0.1)')
    })
  })
})

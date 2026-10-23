import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { QuAutocomplete } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuAutocompleteProps } from './QuAutocomplete.vue'
import type { VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry']

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  host.style.width = '320px'
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

interface Field {
  host: HTMLElement
  root: HTMLElement
  chrome: HTMLElement
  field: HTMLElement
  input: HTMLInputElement
  list: HTMLElement
  items: () => HTMLElement[]
  model: { value: unknown }
}

interface Options {
  props?: QuAutocompleteProps & Record<string, unknown>
  initial?: unknown
  items?: (() => VNode[])
}

function autocomplete (options: Options = {}): Field {
  const { props = {}, initial, items } = options
  const model = shallowRef<unknown>(initial)
  const host = mount(() => h(QuAutocomplete, {
    'label': 'Fruit',
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (value: unknown) => {
      model.value = value
    },
  }, {
    default: items ?? (() => FRUITS.map(fruit => h(QuAutocomplete.Item, { key: fruit, value: fruit }))),
  }))

  const root = host.querySelector<HTMLElement>('.quantum-autocomplete')!

  return {
    host,
    root,
    chrome: root.querySelector<HTMLElement>('.quantum-text-field')!,
    field: root.querySelector<HTMLElement>('.quantum-text-field__field')!,
    input: root.querySelector<HTMLInputElement>('input[role="combobox"]')!,
    list: root.querySelector<HTMLElement>('.quantum-autocomplete__list')!,
    items: () => [...root.querySelectorAll<HTMLElement>('.quantum-autocomplete__item')],
    model,
  }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

function shown (el: HTMLElement): boolean {
  return getComputedStyle(el).display !== 'none'
}

function visible (items: HTMLElement[]): string[] {
  return items.filter(shown).map(item => item.textContent!.trim())
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

describe('quAutocomplete', () => {
  describe('anatomy', () => {
    it('should render the text field chrome around a combobox input and a manual-popover listbox of options', async () => {
      const { root, chrome, input, list, items } = autocomplete()
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(chrome.parentElement).toBe(root)
      expect(input.tagName).toBe('INPUT')
      expect(input.getAttribute('aria-autocomplete')).toBe('list')
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(input.getAttribute('aria-controls')).toBe(list.id)
      expect(input.labels![0]!.textContent!.trim()).toBe('Fruit')
      expect(list.getAttribute('role')).toBe('listbox')
      expect(list.getAttribute('popover')).toBe('manual')
      expect(items()).toHaveLength(5)
      expect(items().every(item => item.getAttribute('role') === 'option')).toBe(true)
      // No ripple on the field itself outside the box variant; one on every row.
      expect(root.querySelector('.quantum-text-field__field > .quantum-ripple')).toBeNull()
      expect(items()[0]!.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(root.dataset.open).toBeUndefined()
      expect(root.dataset.inline).toBeUndefined()
    })

    it('should forward non-class attributes to the input and dress the root with class and style', async () => {
      const { root, input } = autocomplete({ props: { 'class': 'custom', 'data-test': 'x', 'inputmode': 'search' } })
      await settle()

      expect(root.classList.contains('custom')).toBe(true)
      expect(input.dataset.test).toBe('x')
      expect(input.getAttribute('inputmode')).toBe('search')
    })

    it('should warn in dev when the field has no label', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      autocomplete({ props: { label: undefined } })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuAutocomplete] every text field needs a label'))
    })

    it('should warn in dev and render nothing for an Item or Empty outside QuAutocomplete', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h(QuAutocomplete.Item, { value: 'Orphan' }),
        h(QuAutocomplete.Empty),
      ]))
      await settle()

      expect(host.querySelector('.quantum-autocomplete__item')).toBeNull()
      expect(host.querySelector('.quantum-autocomplete__empty')).toBeNull()
      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuAutocompleteItem] rendered outside <QuAutocomplete>'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuAutocompleteEmpty] rendered outside <QuAutocomplete>'))
    })

    it('should not warn when the parts sit inside the field', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      autocomplete({
        items: () => [h(QuAutocomplete.Item, { value: 'Apple' }), h(QuAutocomplete.Empty)],
      })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('suggestions', () => {
    it('should open under the field on focus and refresh the suggestions with each keystroke', async () => {
      const { root, chrome, field, input, list, items } = autocomplete()
      await settle()

      await userEvent.click(input)
      await settle()

      expect(root.dataset.open).toBe('true')
      expect(chrome.dataset.focused).toBe('true')
      expect(input.getAttribute('aria-expanded')).toBe('true')
      expect(list.matches(':popover-open')).toBe(true)
      expect(visible(items())).toEqual(FRUITS)

      await userEvent.keyboard('ap')
      await settle()

      expect(visible(items())).toEqual(['Apple', 'Apricot'])

      await userEvent.keyboard('r')
      await settle()

      expect(visible(items())).toEqual(['Apricot'])

      // The sheet hangs under the field, at least as wide as it.
      const sheet = list.getBoundingClientRect()
      const box = field.getBoundingClientRect()
      expect(Math.round(sheet.top)).toBeGreaterThanOrEqual(Math.round(box.bottom))
      expect(sheet.width).toBeGreaterThanOrEqual(box.width - 0.5)
    })

    it('should move the highlight with the arrow keys and choose with Enter', async () => {
      const { root, input, items, model } = autocomplete()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('b')
      await settle()

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      const banana = items()[2]!
      expect(Object.hasOwn(banana.dataset, 'highlighted')).toBe(true)
      expect(input.getAttribute('aria-activedescendant')).toBe(banana.id)

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      const blueberry = items()[3]!
      expect(Object.hasOwn(blueberry.dataset, 'highlighted')).toBe(true)
      expect(Object.hasOwn(banana.dataset, 'highlighted')).toBe(false)

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(model.value).toBe('Blueberry')
      expect(input.value).toBe('Blueberry')
      expect(root.dataset.open).toBeUndefined()
      expect(input.getAttribute('aria-expanded')).toBe('false')
    })

    it('should choose a suggestion on press, keep focus in the input and mark it selected', async () => {
      const { root, chrome, input, items, model } = autocomplete()
      await settle()

      await userEvent.click(input)
      await settle()
      await userEvent.click(items()[4]!)
      await settle()

      expect(model.value).toBe('Cherry')
      expect(input.value).toBe('Cherry')
      expect(document.activeElement).toBe(input)
      expect(chrome.dataset.dirty).toBe('true')

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(root.dataset.open).toBe('true')
      expect(items()[4]!.dataset.selected).toBe('true')
      expect(items()[4]!.getAttribute('aria-selected')).toBe('true')
    })

    it('should close with Escape and keep the value', async () => {
      const { root, input, model } = autocomplete({ initial: 'Apple' })
      await settle()

      await userEvent.click(input)
      await settle()
      expect(root.dataset.open).toBe('true')

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(root.dataset.open).toBeUndefined()
      expect(model.value).toBe('Apple')
      expect(input.value).toBe('Apple')
    })

    it('should reopen as soon as the user types again after closing', async () => {
      const { root, input, items } = autocomplete()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('{Escape}')
      await settle()
      expect(root.dataset.open).toBeUndefined()

      await userEvent.keyboard('ch')
      await settle()

      expect(root.dataset.open).toBe('true')
      expect(visible(items())).toEqual(['Cherry'])
    })

    it('should show the Empty row when nothing matches, with the default copy', async () => {
      const { root, input, items } = autocomplete({
        items: () => [
          ...FRUITS.map(fruit => h(QuAutocomplete.Item, { key: fruit, value: fruit })),
          h(QuAutocomplete.Empty),
        ],
      })
      await settle()

      expect(root.querySelector('.quantum-autocomplete__empty')).toBeNull()

      await userEvent.click(input)
      await userEvent.keyboard('kiwi')
      await settle()

      expect(visible(items())).toEqual([])
      const empty = root.querySelector<HTMLElement>('.quantum-autocomplete__empty')!
      expect(empty.textContent!.trim()).toBe('No results')
      expect(getComputedStyle(empty).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should hide the sheet while nothing matches and there is no Empty row', async () => {
      const { root, input, list, items } = autocomplete()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('kiwi')
      await settle()

      expect(visible(items())).toEqual([])
      expect(root.dataset.open).toBe('true')
      expect(list.getBoundingClientRect().height).toBe(0)

      await userEvent.keyboard('{Backspace}{Backspace}{Backspace}{Backspace}ch')
      await settle()

      expect(visible(items())).toEqual(['Cherry'])
      expect(list.getBoundingClientRect().height).toBeGreaterThan(0)
    })

    it('should keep a disabled suggestion in the list, inert and skipped by the keyboard', async () => {
      const { input, items, model } = autocomplete({
        items: () => [
          h(QuAutocomplete.Item, { value: 'Apple', disabled: true }),
          h(QuAutocomplete.Item, { value: 'Apricot' }),
        ],
      })
      await settle()

      await userEvent.click(input)
      await settle()

      const [apple, apricot] = items()
      expect(apple!.getAttribute('aria-disabled')).toBe('true')
      expect(apple!.dataset.disabled).toBe('true')
      expect(getComputedStyle(apple!).color).toBe('rgba(0, 0, 0, 0.38)')

      await userEvent.click(apple!, { force: true })
      await settle()
      expect(model.value).toBeUndefined()

      await userEvent.keyboard('{ArrowDown}')
      await settle()
      expect(Object.hasOwn((apricot!).dataset, 'highlighted')).toBe(true)
    })

    it('should render the text displayValue gives a value, in the rows and the input', async () => {
      const people = [{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Alan Turing' }]
      const { input, items, model } = autocomplete({
        props: { displayValue: (value: unknown) => (value as { name: string }).name },
        items: () => people.map(person => h(QuAutocomplete.Item, { key: person.id, value: person })),
      })
      await settle()

      expect(items().map(item => item.textContent!.trim())).toEqual(['Ada Lovelace', 'Alan Turing'])

      await userEvent.click(input)
      await userEvent.click(items()[1]!)
      await settle()

      expect(model.value).toBe(people[1])
      expect(input.value).toBe('Alan Turing')
    })
  })

  describe('strict', () => {
    it('should commit free text when not strict', async () => {
      const { input, model } = autocomplete()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('Kiwi{Enter}')
      await settle()

      expect(model.value).toBe('Kiwi')
      expect(input.value).toBe('Kiwi')
    })

    it('should discard unmatched text when strict and accept an exact match', async () => {
      const { input, model } = autocomplete({ props: { strict: true } })
      await settle()

      expect(input.getAttribute('aria-autocomplete')).toBe('both')

      await userEvent.click(input)
      await userEvent.keyboard('Kiwi{Enter}')
      await settle()

      expect(model.value).toBeUndefined()
      expect(input.value).toBe('')

      await userEvent.keyboard('Banana{Enter}')
      await settle()

      expect(model.value).toBe('Banana')
    })
  })

  describe('multiple', () => {
    it('should render each value as a deletable contact chip in the field and keep the list open', async () => {
      const { root, input, list, items, model } = autocomplete({ props: { multiple: true }, initial: ['Apple'] })
      await settle()

      expect(root.dataset.multiple).toBe('true')
      expect(list.getAttribute('aria-multiselectable')).toBe('true')

      let chips = root.querySelectorAll<HTMLElement>('.quantum-autocomplete__chip')
      expect(chips).toHaveLength(1)
      expect(chips[0]!.classList.contains('quantum-chip')).toBe(true)
      expect(chips[0]!.dataset.contact).toBe('true')
      expect(chips[0]!.textContent!.trim()).toBe('Apple')
      // The in-field contact chip: 32 dp, the name at 14 sp.
      expect(chips[0]!.getBoundingClientRect().height).toBe(32)
      expect(getComputedStyle(chips[0]!).fontSize).toBe('14px')

      await userEvent.click(input)
      await settle()
      await userEvent.click(items()[2]!)
      await settle()

      expect(model.value).toEqual(['Apple', 'Banana'])
      expect(root.dataset.open).toBe('true')
      expect(input.value).toBe('')

      chips = root.querySelectorAll<HTMLElement>('.quantum-autocomplete__chip')
      expect([...chips].map(chip => chip.textContent!.trim())).toEqual(['Apple', 'Banana'])
    })

    it('should delete a chip from its glyph and return focus to the input', async () => {
      const { root, input, model } = autocomplete({ props: { multiple: true }, initial: ['Apple', 'Cherry'] })
      await settle()

      await userEvent.click(root.querySelector<HTMLElement>('.quantum-autocomplete__chip .quantum-chip__delete')!)
      await settle()

      expect(model.value).toEqual(['Cherry'])
      await expect.poll(() => document.activeElement).toBe(input)
    })

    it('should move to the last chip with Backspace in an empty input and delete it with a second Backspace', async () => {
      const { root, input, model } = autocomplete({ props: { multiple: true }, initial: ['Apple', 'Cherry'] })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('{Backspace}')
      await settle()

      const chips = root.querySelectorAll<HTMLElement>('.quantum-autocomplete__chip')
      expect(document.activeElement).toBe(chips[1])
      // Focused in its field the contact chip grows to 40 dp.
      await expect.poll(() => chips[1]!.getBoundingClientRect().height).toBe(40)

      await userEvent.keyboard('{Backspace}')
      await settle()

      expect(model.value).toEqual(['Apple'])
      await expect.poll(() => document.activeElement).toBe(input)
    })

    it('should add unmatched text as a chip of its own unless strict', async () => {
      const { root, input, model } = autocomplete({ props: { multiple: true }, initial: ['Apple'] })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('Kiwi{Enter}')
      await settle()

      expect(model.value).toEqual(['Apple', 'Kiwi'])
      expect([...root.querySelectorAll('.quantum-autocomplete__chip')].map(chip => chip.textContent!.trim())).toEqual(['Apple', 'Kiwi'])
      expect(input.value).toBe('')
    })

    it('should leave typed text alone on Backspace', async () => {
      const { input, model } = autocomplete({ props: { multiple: true }, initial: ['Apple'] })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('ch{Backspace}')
      await settle()

      expect(input.value).toBe('c')
      expect(model.value).toEqual(['Apple'])
      expect(document.activeElement).toBe(input)
    })
  })

  describe('inline', () => {
    it('should complete the typed text to the right of the cursor at the placeholder colour', async () => {
      const { root, input, list } = autocomplete({ props: { inline: true } })
      await settle()

      expect(root.dataset.inline).toBe('true')
      expect(input.getAttribute('aria-autocomplete')).toBe('inline')

      await userEvent.click(input)
      await userEvent.keyboard('apr')
      await settle()

      const suggestion = root.querySelector<HTMLElement>('.quantum-autocomplete__suggestion')!
      expect(suggestion.getAttribute('aria-hidden')).toBe('true')
      expect(suggestion.textContent).toBe('apricot')
      expect(suggestion.querySelector('.quantum-autocomplete__typed')!.textContent).toBe('apr')
      expect(getComputedStyle(suggestion).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(suggestion).fontSize).toBe(getComputedStyle(input).fontSize)
      // No menu: the suggestion is in the field.
      expect(shown(list)).toBe(false)
      expect(root.dataset.open).toBeUndefined()
      expect(input.getAttribute('aria-expanded')).toBe('false')
    })

    it('should accept the suggestion with Enter', async () => {
      const { root, input, model } = autocomplete({ props: { inline: true } })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('ban{Enter}')
      await settle()

      expect(model.value).toBe('Banana')
      expect(input.value).toBe('Banana')
      expect(root.querySelector('.quantum-autocomplete__suggestion')).toBeNull()
    })

    it('should scroll the suggestion with the input once the typed text overflows it', async () => {
      const long = 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch'
      const { host, root, input } = autocomplete({
        props: { inline: true },
        items: () => [h(QuAutocomplete.Item, { value: long })],
      })
      host.style.width = '160px'
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard(long.slice(0, 30))
      await settle()

      const suggestion = root.querySelector<HTMLElement>('.quantum-autocomplete__suggestion')!
      expect(input.scrollLeft).toBeGreaterThan(0)
      await expect.poll(() => suggestion.style.textIndent).toBe(`${-input.scrollLeft}px`)
    })

    it('should show nothing when no suggestion starts with the typed text', async () => {
      const { root, input } = autocomplete({ props: { inline: true } })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('nan')
      await settle()

      expect(root.querySelector('.quantum-autocomplete__suggestion')).toBeNull()
    })
  })

  describe('text field props', () => {
    it('should float the label on focus and draw the accent line, as QuTextField does', async () => {
      const { chrome, input } = autocomplete()
      await settle()

      const label = chrome.querySelector<HTMLElement>('.quantum-text-field__label')!
      expect(getComputedStyle(label).fontSize).toBe('16px')
      expect(getComputedStyle(input).fontSize).toBe('16px')
      expect(getComputedStyle(input).caretColor).toBe('rgb(255, 64, 129)')

      await userEvent.click(input)
      await settle()

      await expect.poll(() => getComputedStyle(label).fontSize).toBe('12px')
    })

    it('should show the helper, replace it with an error and turn the line red', async () => {
      const { chrome, input } = autocomplete({ props: { helper: 'Pick one', error: true, errorMessages: 'Not in season' } })
      await settle()

      expect(chrome.dataset.state).toBe('invalid')
      expect(chrome.querySelector('.quantum-text-field__helper')).toBeNull()
      const message = chrome.querySelector<HTMLElement>('.quantum-text-field__error')!
      expect(message.textContent!.trim()).toBe('Not in season')
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.getAttribute('aria-errormessage')).toBe(message.id)
      expect(getComputedStyle(chrome.querySelector('.quantum-text-field__line')!).backgroundColor).toBe('rgb(255, 23, 68)')
    })

    it('should describe the input with the helper', async () => {
      const { chrome, input } = autocomplete({ props: { helper: 'Pick one' } })
      await settle()

      const helper = chrome.querySelector<HTMLElement>('.quantum-text-field__helper')!
      expect(helper.textContent!.trim()).toBe('Pick one')
      expect(input.getAttribute('aria-describedby')).toBe(helper.id)
    })

    it('should mark a required field and draw the icon signifier', async () => {
      const { chrome, input } = autocomplete({ props: { required: true, icon: 'search' } })
      await settle()

      expect(input.getAttribute('aria-required')).toBe('true')
      expect(chrome.querySelector('.quantum-text-field__required')!.getAttribute('aria-hidden')).toBe('true')
      expect(chrome.querySelector('.quantum-text-field__icon')).not.toBeNull()
    })

    it('should enable the clear button only with a value and clear on press', async () => {
      const { root, input, model } = autocomplete({ props: { clearable: true }, initial: 'Apple' })
      await settle()

      const clear = root.querySelector<HTMLButtonElement>('.quantum-text-field__clear')!
      expect(clear.getAttribute('aria-label')).toBeDefined()
      expect(clear.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(clear.disabled).toBe(false)

      await userEvent.click(clear)
      await settle()

      expect(model.value).toBeUndefined()
      expect(input.value).toBe('')
      expect(clear.disabled).toBe(true)
      expect(document.activeElement).toBe(input)
    })

    it('should fill the box variant and host a ripple on the field', async () => {
      const { chrome, field } = autocomplete({ props: { box: true } })
      await settle()

      expect(chrome.dataset.box).toBe('true')
      expect(field.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(field.getBoundingClientRect().height).toBe(56)
      expect(getComputedStyle(field).borderTopLeftRadius).toBe('4px')
    })

    it('should raise the solo field to 2 dp with no visible label, 0 dp under a fine pointer', async () => {
      const { chrome, field } = autocomplete({ props: { solo: true, placeholder: 'Search' } })
      await settle()

      expect(chrome.dataset.solo).toBe('true')
      // The test browser is a fine pointer: the desktop rule drops the 2 dp rest to 0 dp. The handset value is read as authored.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)
      expect(getComputedStyle(field).boxShadow).toBe('none')
      expect(rule('.quantum-text-field[data-solo] .quantum-text-field__field')!.style.boxShadow).toContain('--quantum-elevation-2')
      expect(field.getBoundingClientRect().height).toBe(48)
    })
  })

  describe('list', () => {
    it('should draw the 8 dp sheet with 8 dp above and below 48 dp Subheading rows', async () => {
      const { input, list, items } = autocomplete()
      await settle()

      await userEvent.click(input)
      await settle()

      const sheet = getComputedStyle(list)
      expect(sheet.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(sheet.borderTopLeftRadius).toBe('2px')
      expect(sheet.paddingTop).toBe('8px')
      expect(sheet.paddingBottom).toBe('8px')
      // Desktop (the runner's fine pointer) rests 2 dp lower: 6 dp.
      expect(sheet.boxShadow).toBe('rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px')

      const row = items()[0]!
      expect(row.getBoundingClientRect().height).toBe(48)
      expect(getComputedStyle(row).fontSize).toBe('16px')
      expect(getComputedStyle(row).paddingLeft).toBe('16px')
    })

    it('should take the 6% overlay on the highlighted row and 12% on the selected one', async () => {
      const { input, items } = autocomplete({ initial: 'Apple' })
      await settle()

      await userEvent.click(input)
      await settle()
      await userEvent.keyboard('{ArrowDown}')
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      const highlighted = items().find(item => Object.hasOwn(item.dataset, 'highlighted'))!
      expect(highlighted.textContent!.trim()).toBe('Apricot')
      await expect.poll(() => getComputedStyle(highlighted).backgroundColor).toBe('rgba(0, 0, 0, 0.06)')
      await expect.poll(() => getComputedStyle(items()[0]!).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
    })

    it('should move every row to the 72 dp keyline when a row has an icon', async () => {
      const { input, items } = autocomplete({
        items: () => [
          h(QuAutocomplete.Item, { value: 'Home', icon: 'home' }),
          h(QuAutocomplete.Item, { value: 'Work' }),
        ],
      })
      await settle()

      await userEvent.click(input)
      await settle()

      const [home, work] = items()
      expect(home!.dataset.icon).toBe('true')
      expect(getComputedStyle(home!).paddingLeft).toBe('72px')
      expect(getComputedStyle(work!).paddingLeft).toBe('72px')
      const glyph = home!.querySelector<HTMLElement>('.quantum-autocomplete__icon')!
      expect(glyph.getBoundingClientRect().left - home!.getBoundingClientRect().left).toBe(16)
    })

    it('should condense the dense field rows to 40 dp at 14 sp', async () => {
      const { input, items } = autocomplete({ props: { dense: true } })
      await settle()

      await userEvent.click(input)
      await settle()

      expect(items()[0]!.getBoundingClientRect().height).toBe(40)
      expect(getComputedStyle(items()[0]!).fontSize).toBe('14px')
    })
  })

  describe('form', () => {
    it('should submit each value through a hidden input when name is set', async () => {
      const { host } = autocomplete({ props: { name: 'fruits', multiple: true }, initial: ['Apple', 'Cherry'] })
      await settle()

      const hidden = [...host.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="fruits"]')]
      expect(hidden.map(input => input.value)).toEqual(['Apple', 'Cherry'])
    })
  })

  describe('disabled', () => {
    it('should disable the input, ignore presses and keep chips inert', async () => {
      const { root, chrome, input, model } = autocomplete({ props: { disabled: true, multiple: true }, initial: ['Apple'] })
      await settle()

      expect(input.disabled).toBe(true)
      expect(chrome.dataset.disabled).toBe('true')
      expect(root.dataset.disabled).toBe('true')

      await userEvent.click(root.querySelector<HTMLElement>('.quantum-text-field__field')!, { force: true })
      await settle()

      expect(root.dataset.open).toBeUndefined()
      const chip = root.querySelector<HTMLButtonElement>('.quantum-autocomplete__chip')!
      expect(chip.disabled).toBe(true)
      expect(model.value).toEqual(['Apple'])
    })
  })

  describe('theme', () => {
    it('should paint the sheet and rows from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [
          h(QuAutocomplete, { label: 'Light' }, { default: () => [h(QuAutocomplete.Item, { value: 'One' })] }),
        ]),
        h('div', { 'data-theme': 'quantum-dark' }, [
          h(QuAutocomplete, { label: 'Dark' }, { default: () => [h(QuAutocomplete.Item, { value: 'Two' })] }),
        ]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.quantum-autocomplete__list')

      expect(getComputedStyle(light!).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(dark!.querySelector('.quantum-autocomplete__item')!).color).toBe('rgb(255, 255, 255)')
    })

    it('should draw the in-line suggestion at the dark theme placeholder ink, 50% white', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuAutocomplete, { label: 'City', inline: true }, {
          default: () => ['Lisbon', 'London'].map(city => h(QuAutocomplete.Item, { key: city, value: city })),
        }),
      ]))
      await settle()

      await userEvent.click(host.querySelector<HTMLInputElement>('input[role="combobox"]')!)
      await userEvent.keyboard('lis')
      await settle()

      const suggestion = host.querySelector<HTMLElement>('.quantum-autocomplete__suggestion')!
      expect(suggestion.textContent).toBe('lisbon')
      expect(getComputedStyle(suggestion).color).toBe('rgba(255, 255, 255, 0.5)')
    })
  })
})

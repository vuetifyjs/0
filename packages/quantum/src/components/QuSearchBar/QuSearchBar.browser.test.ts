import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createLocalePlugin } from '@vuetify/v0'

// Components
import { QuSearchBar } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Icons
import { quantumIcons } from '../../icons'

/** Vuetify 1.5's pixel recipe for the 2 dp level: the search bar's handset rest, and the open sheet on any pointer. */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
/** Vuetify 1.5's pixel recipe for the 1 dp level: the search bar scrolled on desktop (3 dp less the elevation page's 2 dp desktop drop). */
const ELEVATION_1 = '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.cssText = 'width: 480px; padding: 24px;'
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

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at colour or shadow formatting. */
function serialize (property: 'backgroundColor' | 'boxShadow' | 'color', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

/** A rule as authored, read from the stylesheet: for values outside the test browser's media (handset, coarse pointer). */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])

  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

function paths (el: Element): (string | null)[] {
  return [...el.querySelectorAll('path')].map(p => p.getAttribute('d'))
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

interface Options {
  props?: Record<string, unknown>
  history?: string[]
  completions?: string[]
  empty?: boolean
  disabled?: string[]
  setup?: (app: App) => void
}

function bar (options: Options = {}) {
  const { props = {}, history = [], completions = [], empty = false, disabled = [], setup } = options
  const query = shallowRef('')
  const onSubmit = vi.fn()
  const onClear = vi.fn()
  const onVoice = vi.fn()

  const host = mount(() => h(QuSearchBar, {
    'modelValue': query.value,
    'onUpdate:modelValue': (value: string) => {
      query.value = value
    },
    onSubmit,
    onClear,
    onVoice,
    ...props,
  }, () => [
    ...history.map(value => h(QuSearchBar.Item, { key: `h:${value}`, value, history: true, disabled: disabled.includes(value) })),
    ...completions.map(value => h(QuSearchBar.Item, { key: `c:${value}`, value, disabled: disabled.includes(value) })),
    empty ? h(QuSearchBar.Empty) : null,
  ]), setup)

  const root = host.querySelector<HTMLFormElement>('.quantum-search-bar')!
  const field = root.querySelector<HTMLElement>('.quantum-search-bar__field')!
  const input = root.querySelector<HTMLInputElement>('.quantum-search-bar__input')!
  const list = root.querySelector<HTMLElement>('.quantum-search-bar__list')!

  function nav () {
    return root.querySelector<HTMLButtonElement>('.quantum-search-bar__nav')!
  }

  function rows () {
    return [...list.querySelectorAll<HTMLElement>('[role="option"]')].filter(row => row.style.display !== 'none')
  }

  return { host, root, field, input, list, nav, rows, query, onSubmit, onClear, onVoice }
}

describe('quSearchBar', () => {
  describe('anatomy', () => {
    it('should render a role="search" form around the field sheet, the nav glyph, the combobox and the list', async () => {
      const { root, field, input, list, nav } = bar()
      await settle()

      expect(root.tagName).toBe('FORM')
      expect(root.getAttribute('role')).toBe('search')
      expect(root.getAttribute('aria-label')).toBe('Search')
      expect(field.parentElement).toBe(root)
      expect(nav().tagName).toBe('BUTTON')
      expect(nav().firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(nav().getAttribute('aria-label')).toBe('Search')
      expect(paths(nav())).toEqual(quantumIcons.search)
      expect(input.tagName).toBe('INPUT')
      expect(input.getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('aria-label')).toBe('Search')
      expect(input.getAttribute('aria-controls')).toBe(list.id)
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(input.placeholder).toBe('Search')
      expect(list.getAttribute('role')).toBe('listbox')
      expect(root.querySelector('.quantum-search-bar__clear')).toBeNull()
      expect(root.querySelector('.quantum-search-bar__voice')).toBeNull()

      for (const key of ['button', 'disabled', 'focused', 'open', 'scrolled']) {
        expect(Object.hasOwn(root.dataset, key)).toBe(false)
      }
    })

    it('should name the field and the landmark from placeholder', async () => {
      const { root, input } = bar({ props: { placeholder: 'Search mail' } })
      await settle()

      expect(root.getAttribute('aria-label')).toBe('Search mail')
      expect(input.getAttribute('aria-label')).toBe('Search mail')
      expect(input.placeholder).toBe('Search mail')
    })

    it('should take its default copy from the Quantum locale keys', async () => {
      const { root, input, nav } = bar({
        props: { voice: true, modelValue: 'x' },
        setup: app => app.use(createLocalePlugin({
          default: 'en',
          messages: { en: { Quantum: { search: 'Suchen', back: 'Zurück', clear: 'Löschen', voice: 'Sprachsuche' } } },
        })),
      })
      await settle()

      expect(input.placeholder).toBe('Suchen')
      expect(nav().getAttribute('aria-label')).toBe('Suchen')
      expect(root.querySelector('.quantum-search-bar__clear')!.getAttribute('aria-label')).toBe('Löschen')
      expect(root.querySelector('.quantum-search-bar__voice')!.getAttribute('aria-label')).toBe('Sprachsuche')
      expect(root.querySelector('.quantum-search-bar__button')!.textContent!.trim()).toBe('Suchen')
    })

    it('should draw the 48 dp inset sheet: surface fill, 2 dp corners, 2 dp elevation, 0 dp on desktop', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const { field } = bar()
      await settle()

      const computed = getComputedStyle(field)

      expect(field.getBoundingClientRect().height).toBe(48)
      expect(computed.borderRadius).toBe('2px')
      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      // The test browser is a fine pointer: the desktop rule drops the 2 dp rest to 0 dp. The handset value is read as authored.
      expect(computed.boxShadow).toBe('none')
      expect(rule('.quantum-search-bar__field')!.style.boxShadow).toContain('--quantum-elevation-2')
    })

    it('should put the glyph on the 16 dp keyline and the query on the 72 dp keyline in Subheading 16 sp', async () => {
      const { field, input, nav } = bar()
      await settle()

      const left = field.getBoundingClientRect().left
      const glyph = nav().querySelector('svg')!.getBoundingClientRect()
      const computed = getComputedStyle(input)

      expect(glyph.left - left).toBe(16)
      expect(glyph.width).toBe(24)
      expect(input.getBoundingClientRect().left - left).toBe(72)
      expect(computed.fontSize).toBe('16px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(nav()).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should keep the trailing glyph on the 16 dp keyline from the end', async () => {
      const { field, root } = bar({ props: { voice: true } })
      await settle()

      const mic = root.querySelector('.quantum-search-bar__voice svg')!.getBoundingClientRect()

      expect(field.getBoundingClientRect().right - mic.right).toBe(16)
    })
  })

  describe('variants', () => {
    it('should rise to 3 dp, 1 dp on desktop, and set data-scrolled when scrolled', async () => {
      const { root, field } = bar({ props: { scrolled: true } })
      await settle()

      expect(root.dataset.scrolled).toBe('true')
      expect(getComputedStyle(field).boxShadow).toBe(serialize('boxShadow', ELEVATION_1))
      expect(rule('.quantum-search-bar[data-scrolled] .quantum-search-bar__field')!.style.boxShadow).toContain('--quantum-elevation-3')
    })

    it('should show the raised Search button to the right of the field under a fine pointer, and set data-button when asked', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const { root, field, onSubmit } = bar({ props: { button: true } })
      await settle()

      const button = root.querySelector<HTMLButtonElement>('.quantum-search-bar__button')!

      expect(root.dataset.button).toBe('true')
      expect(button.dataset.variant).toBe('raised')
      expect(button.textContent!.trim()).toBe('Search')
      // A flex item: inline-flex blockifies to flex.
      expect(getComputedStyle(button).display).toBe('flex')
      expect(button.getBoundingClientRect().left).toBeGreaterThanOrEqual(field.getBoundingClientRect().right + 16)

      await userEvent.click(button)

      // Nothing typed: nothing to submit.
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should hide the Search button outside the fine-pointer rule unless button is set', async () => {
      bar()
      await settle()

      // A coarse pointer cannot be emulated and restored inside one page; the handset rule is read as authored.
      expect(rule('.quantum-search-bar__button')!.style.display).toBe('none')
      expect(rule('.quantum-search-bar[data-button] .quantum-search-bar__button')!.style.display).toBe('inline-flex')
    })

    it('should render the microphone when voice is set and emit voice without moving focus', async () => {
      const { root, input, onVoice } = bar({ props: { voice: true } })
      await settle()

      input.focus()
      await settle()

      const mic = root.querySelector<HTMLButtonElement>('.quantum-search-bar__voice')!

      expect(mic.getAttribute('aria-label')).toBe('Voice search')
      expect(paths(mic)).toEqual(quantumIcons.mic)
      expect(mic.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)

      await userEvent.click(mic)

      expect(onVoice).toHaveBeenCalledTimes(1)
      expect(document.activeElement).toBe(input)
    })
  })

  describe('focus', () => {
    it('should turn the search glyph into the up arrow and set data-focused while the field has focus', async () => {
      const { root, input, nav } = bar()
      await settle()

      await userEvent.click(input)
      await settle()

      expect(root.dataset.focused).toBe('true')
      expect(nav().getAttribute('aria-label')).toBe('Back')
      expect(paths(nav())).toEqual(quantumIcons['arrow-back'])
    })

    it('should keep the search glyph when Tab lands on it at rest, and lead into the field on Enter', async () => {
      const { root, input, nav } = bar()
      await settle()

      const before = document.createElement('button')
      root.parentElement!.prepend(before)
      before.focus()

      await userEvent.keyboard('{Tab}')
      await settle()

      expect(document.activeElement).toBe(nav())
      expect(Object.hasOwn(root.dataset, 'focused')).toBe(false)
      expect(nav().getAttribute('aria-label')).toBe('Search')
      expect(paths(nav())).toEqual(quantumIcons.search)

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(document.activeElement).toBe(input)
      expect(root.dataset.focused).toBe('true')
    })

    it('should stay focused while Tab moves from the field to its actions, closing the suggestions as v0 does', async () => {
      const { root, input, list } = bar({ props: { voice: true }, history: ['beach'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      await userEvent.keyboard('{Tab}')
      await settle()

      expect(document.activeElement).toBe(root.querySelector('.quantum-search-bar__voice'))
      expect(root.dataset.focused).toBe('true')
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(paths(root.querySelector('.quantum-search-bar__nav')!)).toEqual(quantumIcons['arrow-back'])
    })

    it('should lead into the field from the search glyph at rest', async () => {
      const { input, nav } = bar()
      await settle()

      await userEvent.click(nav())
      await settle()

      expect(document.activeElement).toBe(input)
    })

    it('should release focus and dismiss the suggestions on the up arrow', async () => {
      const { root, input, nav, list } = bar({ history: ['beach'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      expect(root.dataset.open).toBe('true')

      await userEvent.click(nav())
      await settle()

      expect(document.activeElement).not.toBe(input)
      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(Object.hasOwn(root.dataset, 'focused')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'open')).toBe(false)
      expect(paths(nav())).toEqual(quantumIcons.search)
    })

    it('should release from the up arrow reached by keyboard', async () => {
      const { root, input, nav } = bar()
      await settle()

      input.focus()
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
      await settle()

      expect(document.activeElement).toBe(nav())
      expect(root.dataset.focused).toBe('true')

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(root.contains(document.activeElement)).toBe(false)
      expect(Object.hasOwn(root.dataset, 'focused')).toBe(false)
    })
  })

  describe('suggestions', () => {
    it('should offer recent queries on focus, as 48 dp rows with the history glyph and the text on the 72 dp keyline', async () => {
      const { root, field, input, list, rows } = bar({ history: ['beach', 'birthday'], completions: ['bears'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)

      expect(rows().map(row => row.textContent)).toEqual(['beach', 'birthday'])

      const row = rows()[0]!
      const text = row.querySelector('.quantum-search-bar__text')!

      expect(row.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(row.dataset.history).toBe('true')
      expect(paths(row)).toEqual(quantumIcons.history)
      expect(row.getBoundingClientRect().height).toBe(48)
      expect(text.getBoundingClientRect().left - row.getBoundingClientRect().left).toBe(72)
      expect(list.getBoundingClientRect().width).toBe(field.getBoundingClientRect().width)
      expect(Math.round(list.getBoundingClientRect().top)).toBe(Math.round(field.getBoundingClientRect().bottom))
      expect(getComputedStyle(field).borderBottomLeftRadius).toBe('0px')
      expect(root.dataset.open).toBe('true')
      // Open is not at rest: the desktop drop lifts off and the sheet overlaps the page at 2 dp.
      await expect.poll(() => getComputedStyle(field).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      expect(getComputedStyle(list).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
    })

    it('should shift to completions with the search glyph as the user types, filtered by the query', async () => {
      const { input, list, rows } = bar({ history: ['beach', 'cats'], completions: ['bears', 'bees'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      await userEvent.keyboard('bea')
      await settle()

      expect(rows().map(row => row.textContent)).toEqual(['beach', 'bears'])
      expect(paths(rows()[1]!)).toEqual(quantumIcons.search)
      expect(Object.hasOwn(rows()[1]!.dataset, 'history')).toBe(false)
    })

    it('should not open an empty sheet when nothing is on offer', async () => {
      const { root, input, list } = bar()
      await settle()

      await userEvent.click(input)
      await settle()

      expect(list.dataset.empty).toBe('true')
      expect(getComputedStyle(list).display).toBe('none')
      expect(Object.hasOwn(root.dataset, 'open')).toBe(false)
    })

    it('should show the Empty row for a typed query nothing matches, and not before', async () => {
      const { root, input, list } = bar({ completions: ['bears'], empty: true })
      await settle()

      await userEvent.click(input)
      await settle()

      expect(list.querySelector('.quantum-search-bar__empty')).toBeNull()
      expect(getComputedStyle(list).display).toBe('none')

      await userEvent.keyboard('zzz')
      await settle()

      const empty = list.querySelector<HTMLElement>('.quantum-search-bar__empty')!

      expect(empty.textContent).toBe('No results')
      expect(empty.getBoundingClientRect().height).toBe(48)
      expect(getComputedStyle(empty).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(list).display).not.toBe('none')
      expect(root.dataset.open).toBe('true')
    })

    it('should submit a chosen suggestion and keep it in the field, unfocused', async () => {
      const { input, list, rows, query, onSubmit } = bar({ history: ['beach'], completions: ['bears'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      await userEvent.click(rows()[0]!)
      await settle()

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('beach')
      expect(query.value).toBe('beach')
      expect(input.value).toBe('beach')
      expect(document.activeElement).not.toBe(input)
    })

    it('should move the highlight with the arrow keys and submit the highlighted row on Enter', async () => {
      const { input, list, rows, onSubmit } = bar({ history: ['beach', 'birthday'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      const first = rows()[0]!

      expect(Object.hasOwn(first.dataset, 'highlighted')).toBe(true)
      expect(input.getAttribute('aria-activedescendant')).toBe(first.id)
      expect(getComputedStyle(first).backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      await userEvent.keyboard('{ArrowDown}{Enter}')
      await settle()

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('birthday')
    })

    it('should close the suggestions on Escape and keep the focus', async () => {
      const { input, list } = bar({ history: ['beach'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(input)
    })

    it('should keep a disabled suggestion inert: disabled ink, no selection, no submit', async () => {
      const { input, list, rows, onSubmit } = bar({ history: ['beach'], disabled: ['beach'] })
      await settle()

      await userEvent.click(input)
      await expect.poll(() => list.matches(':popover-open')).toBe(true)

      const row = rows()[0]!

      expect(row.getAttribute('aria-disabled')).toBe('true')
      expect(getComputedStyle(row).color).toBe('rgba(0, 0, 0, 0.38)')

      // Playwright refuses to click an aria-disabled element; a dispatched click is what a stray tap delivers.
      row.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(onSubmit).not.toHaveBeenCalled()
      expect(input.value).toBe('')
    })
  })

  describe('query', () => {
    it('should keep the query in the model and submit it on Enter, releasing the field', async () => {
      const { root, input, query, onSubmit } = bar()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('photos')

      expect(query.value).toBe('photos')

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('photos')
      expect(input.value).toBe('photos')
      expect(document.activeElement).not.toBe(input)
      expect(Object.hasOwn(root.dataset, 'focused')).toBe(false)
    })

    it('should not submit a blank query', async () => {
      const { input, onSubmit } = bar()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('   {Enter}')
      await settle()

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should show a query written to the model', async () => {
      const { input, query } = bar()
      await settle()

      query.value = 'maps'
      await settle()

      expect(input.value).toBe('maps')
    })

    it('should submit the typed query from the Search button', async () => {
      const { root, input, onSubmit } = bar({ props: { button: true } })
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('trains')
      await userEvent.click(root.querySelector<HTMLElement>('.quantum-search-bar__button')!)
      await settle()

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('trains')
    })

    it('should clear the query with the X and keep focus in the field', async () => {
      const { root, input, query, onClear } = bar()
      await settle()

      await userEvent.click(input)
      await userEvent.keyboard('cats')
      await settle()

      const clear = root.querySelector<HTMLButtonElement>('.quantum-search-bar__clear')!

      expect(clear.getAttribute('aria-label')).toBe('Clear')
      expect(paths(clear)).toEqual(quantumIcons.close)

      await userEvent.click(clear)
      await settle()

      expect(onClear).toHaveBeenCalledTimes(1)
      expect(query.value).toBe('')
      expect(input.value).toBe('')
      expect(document.activeElement).toBe(input)
      expect(root.querySelector('.quantum-search-bar__clear')).toBeNull()
    })
  })

  describe('disabled', () => {
    it('should disable the field and every action and open nothing', async () => {
      const { root, input, list, nav, onSubmit } = bar({ props: { disabled: true, voice: true, button: true }, history: ['beach'] })
      await settle()

      expect(root.dataset.disabled).toBe('true')
      expect(input.disabled).toBe(true)
      expect(nav().disabled).toBe(true)
      expect(root.querySelector<HTMLButtonElement>('.quantum-search-bar__voice')!.disabled).toBe(true)
      expect(root.querySelector<HTMLButtonElement>('.quantum-search-bar__button')!.disabled).toBe(true)
      expect(getComputedStyle(nav()).color).toBe('rgba(0, 0, 0, 0.38)')

      nav().click()
      input.focus()
      await settle()

      expect(document.activeElement).not.toBe(input)
      expect(list.matches(':popover-open')).toBe(false)
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('parts', () => {
    it('should warn once per orphaned part and render nothing', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h(QuSearchBar.Item, { value: 'beach', history: true }),
        h(QuSearchBar.Empty),
      ]))
      await settle()

      expect(host.querySelector('[role="option"]')).toBeNull()
      expect(host.textContent).toBe('')
      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuSearchBarItem'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuSearchBarEmpty'))
    })

    it('should not warn for parts inside the bar', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      bar({ history: ['beach'], empty: true })
      await settle()

      expect(warn).not.toHaveBeenCalled()
    })

    it('should take the icon prop over the default glyph and the slot over the value', async () => {
      const host = mount(() => h(QuSearchBar, null, () => [
        h(QuSearchBar.Item, { value: 'home', history: true, icon: 'mic' }, () => 'Home, spoken'),
      ]))
      await settle()

      await userEvent.click(host.querySelector('input')!)
      await settle()

      const row = host.querySelector<HTMLElement>('[role="option"]')!

      expect(paths(row)).toEqual(quantumIcons.mic)
      expect(row.textContent).toBe('Home, spoken')
    })

    it('should keep two nested bars apart through namespace', async () => {
      const host = mount(() => h('div', [
        h(QuSearchBar, { namespace: 'quantum:test:a' }, () => [h(QuSearchBar.Item, { value: 'alpha', history: true })]),
        h(QuSearchBar, { namespace: 'quantum:test:b' }, () => [h(QuSearchBar.Item, { value: 'beta', history: true })]),
      ]))
      await settle()

      const [a, b] = host.querySelectorAll('.quantum-search-bar__list')

      expect(a!.querySelectorAll('[role="option"]')).toHaveLength(0)

      await userEvent.click(host.querySelectorAll('input')[1]!)
      await settle()

      expect([...b!.querySelectorAll('[role="option"]')].map(row => row.textContent)).toEqual(['beta'])
    })
  })

  describe('theme', () => {
    it('should take its sheet, ink and list from the adapter in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuSearchBar)]),
        h('div', { 'data-theme': 'quantum-dark' }, [
          h(QuSearchBar, null, () => [h(QuSearchBar.Item, { value: 'beach', history: true })]),
        ]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.quantum-search-bar')

      expect(getComputedStyle(light!.querySelector('.quantum-search-bar__field')!).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.quantum-search-bar__field')!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(dark!.querySelector('.quantum-search-bar__input')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.quantum-search-bar__nav')!).color).toBe('rgb(255, 255, 255)')

      await userEvent.click(dark!.querySelector('input')!)
      await settle()

      const list = dark!.querySelector<HTMLElement>('.quantum-search-bar__list')!

      expect(getComputedStyle(list).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(list).borderTopColor).toBe(serialize('color', 'rgba(255, 255, 255, 0.12)'))
    })
  })
})

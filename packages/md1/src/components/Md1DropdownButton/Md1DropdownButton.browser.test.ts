import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { Md1DropdownButton, Md1DropdownButtonItem } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1DropdownButtonItemProps } from './Md1DropdownButtonItem.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

const ELEVATION_8 = '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'
const ELEVATION_6 = '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '200px 24px 24px'
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

const STATES: [string, string][] = [
  ['normal', 'Normal text'],
  ['title', 'Title'],
  ['heading', 'Heading'],
  ['caption', 'Caption'],
]

interface Harness {
  host: HTMLElement
  root: HTMLElement
  model: { value: unknown }
  selects: unknown[]
  trigger: () => HTMLButtonElement
  content: () => HTMLElement
  items: () => HTMLElement[]
}

function dropdown (
  props: Record<string, unknown> = {},
  initial?: unknown,
  states: (Md1DropdownButtonItemProps & { text: string })[] = STATES.map(([value, text]) => ({ value, text })),
): Harness {
  const model = shallowRef<unknown>(initial)
  const selects: unknown[] = []
  const host = mount(() => h(Md1DropdownButton, {
    'modelValue': model.value,
    'onUpdate:modelValue': (value: unknown) => {
      model.value = value
    },
    'onSelect': (value: unknown) => selects.push(value),
    ...props,
  }, () => states.map(({ text, ...item }) => h(Md1DropdownButtonItem, item, () => text))))

  const root = host.querySelector<HTMLElement>('.md1-dropdown-button')!

  return {
    host,
    root,
    model,
    selects,
    trigger: () => root.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!,
    content: () => root.querySelector<HTMLElement>('[role="menu"]')!,
    items: () => [...root.querySelectorAll<HTMLElement>('[role="menuitemradio"]')],
  }
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at colour or shadow formatting. */
function serialize (property: 'backgroundColor' | 'boxShadow', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

function open (el: HTMLElement) {
  return el.matches(':popover-open')
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  vi.restoreAllMocks()
})

describe('quDropdownButton', () => {
  describe('anatomy', () => {
    it('should render a menu button showing the selected state and a trailing arrow glyph', async () => {
      const { root, trigger, content } = dropdown({}, 'title')
      await settle()

      const el = trigger()

      expect(root.tagName).toBe('DIV')
      expect(el.tagName).toBe('BUTTON')
      expect(el.type).toBe('button')
      expect(el.classList.contains('md1-dropdown-button__state')).toBe(true)
      expect(el.getAttribute('aria-expanded')).toBe('false')
      expect(el.getAttribute('aria-controls')).toBe(content().id)
      expect(el.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(el.querySelector('.md1-dropdown-button__label')!.textContent).toBe('Title')

      const cue = el.querySelector('.md1-dropdown-button__cue')!

      expect([...cue.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['arrow-drop-down'])
      expect(cue.getAttribute('aria-hidden')).toBe('true')
      expect(Object.hasOwn(root.dataset, 'segmented')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'open')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'solo')).toBe(false)
    })

    it('should render the menu as a closed popover labelled by the button, with a radio item per state', async () => {
      const { trigger, content, items } = dropdown({}, 'normal')
      await settle()

      const menu = content()

      expect(menu.hasAttribute('popover')).toBe(true)
      expect(menu.classList.contains('md1-dropdown-button__menu')).toBe(true)
      expect(menu.getAttribute('aria-labelledby')).toBe(trigger().id)
      expect(open(menu)).toBe(false)
      expect(menu.querySelector('[role="group"]')!.classList.contains('md1-dropdown-button__list')).toBe(true)
      expect(items().map(item => item.textContent)).toEqual(STATES.map(([, text]) => text))
      expect(items().map(item => item.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false', 'false'])
      expect(items().map(item => item.dataset.state)).toEqual(['checked', 'unchecked', 'unchecked', 'unchecked'])
      expect(items()[0]!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
    })

    it('should draw the check of the current state in the leading slot only', async () => {
      const { items } = dropdown({}, 'heading')
      await settle()

      const leads = items().map(item => item.querySelector('.md1-dropdown-button__lead'))

      expect(leads.map(lead => lead !== null)).toEqual([false, false, true, false])
      expect([...leads[2]!.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.check)
    })

    it('should fall back to label while nothing is selected', async () => {
      const { trigger } = dropdown({ label: 'Style' })
      await settle()

      expect(trigger().querySelector('.md1-dropdown-button__label')!.textContent).toBe('Style')
    })

    it('should prefer an item label prop over its slot text on the button', async () => {
      const { trigger } = dropdown({}, 'a', [{ value: 'a', label: 'Roboto', text: 'Roboto (default)' }, { value: 'b', text: 'Noto' }])
      await settle()

      expect(trigger().querySelector('.md1-dropdown-button__label')!.textContent).toBe('Roboto')
    })
  })

  describe('metrics', () => {
    it('should measure as a flat button: 36 dp tall, 88 dp wide at least, 16 dp start padding, 2 dp corners, accent ink in the Button style', async () => {
      const { trigger } = dropdown({ label: 'A' })
      await settle()

      const el = trigger()
      const computed = getComputedStyle(el)

      expect(el.getBoundingClientRect().height).toBe(36)
      expect(el.getBoundingClientRect().width).toBeGreaterThanOrEqual(88)
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.borderTopLeftRadius).toBe('2px')
      expect(computed.color).toBe('rgb(255, 64, 129)')
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.textTransform).toBe('uppercase')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(computed.boxShadow).toBe('none')
    })

    it('should answer to the 48 dp touch target without growing the box', async () => {
      const { trigger } = dropdown({ label: 'A' })
      await settle()

      const after = getComputedStyle(trigger(), '::after')

      expect(after.top).toBe('-6px')
      expect(after.bottom).toBe('-6px')
    })

    it('should condense to the dense button under dense: 32 dp and 13 sp', async () => {
      const { root, trigger } = dropdown({ dense: true }, 'normal')
      await settle()

      expect(root.dataset.dense).toBe('true')
      expect(trigger().getBoundingClientRect().height).toBe(32)
      expect(getComputedStyle(trigger()).fontSize).toBe('13px')
      expect(trigger().querySelector('.md1-icon')!.getBoundingClientRect().width).toBe(20)
    })

    it('should pad the desktop dropdown 16 dp above and below, 24 dp before the state and 16 dp after the arrow', async () => {
      const { root, trigger } = dropdown({ desktop: true }, 'normal')
      await settle()

      const computed = getComputedStyle(trigger())

      expect(root.dataset.desktop).toBe('true')
      expect(computed.paddingTop).toBe('16px')
      expect(computed.paddingBottom).toBe('16px')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('16px')
      expect(trigger().getBoundingClientRect().height).toBe(56)
    })
  })

  describe('menu', () => {
    it('should open on a click: the 8 dp surface sheet with 48 dp rows of 16 sp text at the 72 dp keyline', async () => {
      const { root, trigger, content, items } = dropdown({}, 'title')
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)
      expect(root.dataset.open).toBe('true')
      expect(trigger().getAttribute('aria-expanded')).toBe('true')

      const sheet = getComputedStyle(menu)

      expect(sheet.boxShadow).toBe(serialize('boxShadow', ELEVATION_8))
      expect(sheet.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(sheet.borderTopLeftRadius).toBe('2px')
      expect(sheet.minWidth).not.toBe('auto')
      expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(112)
      expect(getComputedStyle(menu.querySelector('.md1-dropdown-button__list')!).paddingTop).toBe('8px')

      const row = items()[0]!
      const computed = getComputedStyle(row)

      expect(row.getBoundingClientRect().height).toBe(48)
      expect(computed.fontSize).toBe('16px')
      expect(computed.paddingLeft).toBe('72px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(items()[1]!).backgroundColor).toBe(serialize('backgroundColor', 'rgba(0, 0, 0, 0.12)'))
    })

    it('should cover the button and put the selected item over it', async () => {
      const { root, trigger, content, items } = dropdown({}, 'heading')
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)

      const button = root.getBoundingClientRect()
      const item = items()[2]!

      await expect.poll(() => {
        const rect = item.getBoundingClientRect()
        return Math.round(rect.top + rect.height / 2)
      }).toBe(Math.round(button.top + button.height / 2))

      expect(Math.round(menu.getBoundingClientRect().left)).toBe(Math.round(button.left))
      expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(button.width)
    })

    // Menus page, "Vertical realignment": near a screen edge the whole sheet moves so every item stays visible.
    it('should shift the sheet up from the bottom edge, keeping the screen margin, when the first state is selected', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      teardowns.push(() => delete document.body.dataset.reducedMotion)
      const { root, trigger, content } = dropdown({ style: 'position: fixed; left: 120px; bottom: 8px' }, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(Math.round(menu.getBoundingClientRect().bottom)).toBe(document.documentElement.clientHeight - 16)
      expect(Math.round(menu.getBoundingClientRect().left)).toBe(Math.round(root.getBoundingClientRect().left))
    })

    it('should size the sheet in whole 56 dp units and leave the screen margins and one row free below it', async () => {
      const { trigger, content } = dropdown({}, 'title')
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)
      await expect.poll(() => Math.round(menu.getBoundingClientRect().width) % 56).toBe(0)
      expect(getComputedStyle(menu).maxHeight).toBe(`${window.innerHeight - 2 * 16 - 48}px`)
    })

    it('should commit a clicked state, close the menu, relabel the button and return focus', async () => {
      const { model, trigger, content, items } = dropdown({}, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      await userEvent.click(items()[3]!)
      await settle()

      expect(model.value).toBe('caption')
      await expect.poll(() => open(content())).toBe(false)
      expect(trigger().getAttribute('aria-expanded')).toBe('false')
      expect(trigger().querySelector('.md1-dropdown-button__label')!.textContent).toBe('Caption')
      expect(items()[3]!.getAttribute('aria-checked')).toBe('true')
      await expect.poll(() => document.activeElement).toBe(trigger())
    })

    it('should close when the current state is chosen again, with the model unchanged', async () => {
      const writes: unknown[] = []
      const { model, trigger, content, items } = dropdown({ 'onUpdate:modelValue': (value: unknown) => {
        writes.push(value)
      } }, 'title')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      await userEvent.click(items()[1]!)
      await settle()

      expect(writes).toEqual([])
      expect(model.value).toBe('title')
      await expect.poll(() => open(content())).toBe(false)
    })

    it('should close on an outside press without changing the state', async () => {
      const { model, trigger, content } = dropdown({}, 'title')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      await userEvent.click(document.body, { position: { x: 4, y: 4 } })
      await settle()

      await expect.poll(() => open(content())).toBe(false)
      expect(model.value).toBe('title')
    })
  })

  describe('keyboard', () => {
    it('should open on ArrowDown at the first item, move with the arrows and commit with Enter', async () => {
      const { model, trigger, content, items } = dropdown({}, 'normal')
      await settle()

      trigger().focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      await expect.poll(() => open(content())).toBe(true)
      await expect.poll(() => document.activeElement).toBe(items()[0])
      expect(items()[0]!.dataset.highlighted).toBe('true')

      await userEvent.keyboard('{ArrowDown}')
      await expect.poll(() => document.activeElement).toBe(items()[1])
      expect(items()[1]!.dataset.highlighted).toBe('true')
      await expect.poll(() => getComputedStyle(items()[1]!).backgroundColor).toBe(serialize('backgroundColor', 'rgba(0, 0, 0, 0.04)'))

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(model.value).toBe('title')
      await expect.poll(() => open(content())).toBe(false)
      await expect.poll(() => document.activeElement).toBe(trigger())
    })

    it('should commit with Space and dismiss with Escape', async () => {
      const { model, trigger, content, items } = dropdown({}, 'normal')
      await settle()

      trigger().focus()
      await userEvent.keyboard('{ArrowUp}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(items()[3])

      await userEvent.keyboard('{Escape}')
      await settle()

      await expect.poll(() => open(content())).toBe(false)
      expect(model.value).toBe('normal')
      await expect.poll(() => document.activeElement).toBe(trigger())

      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(items()[0])

      await userEvent.keyboard('{ArrowUp}')
      await expect.poll(() => document.activeElement).toBe(items()[3])

      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe('caption')
      await expect.poll(() => open(content())).toBe(false)
    })

    it('should move to the state whose text starts with a typed letter', async () => {
      const { trigger, content, items } = dropdown({}, 'normal')
      await settle()

      trigger().focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(items()[0])

      await userEvent.keyboard('c')
      await expect.poll(() => document.activeElement).toBe(items()[3])
      expect(open(content())).toBe(true)
    })

    it('should close on Tab with the state unchanged', async () => {
      const { model, trigger, content, items } = dropdown({}, 'normal')
      await settle()

      trigger().focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(items()[0])

      await userEvent.tab()
      await settle()

      await expect.poll(() => open(content())).toBe(false)
      expect(model.value).toBe('normal')
    })

    it('should open on Enter from the button', async () => {
      const { trigger, content, items } = dropdown({}, 'normal')
      await settle()

      trigger().focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      await expect.poll(() => open(content())).toBe(true)
      await expect.poll(() => document.activeElement).toBe(items()[0])
    })
  })

  describe('segmented', () => {
    it('should split into a state segment and an arrow segment named by the locale fallback', async () => {
      const { root, trigger } = dropdown({ segmented: true }, 'title')
      await settle()

      const state = root.querySelector<HTMLButtonElement>('.md1-dropdown-button__state')!
      const arrow = trigger()

      expect(root.dataset.segmented).toBe('true')
      expect(state.tagName).toBe('BUTTON')
      expect(state.hasAttribute('aria-haspopup')).toBe(false)
      expect(state.textContent).toBe('Title')
      expect(state.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(arrow.classList.contains('md1-dropdown-button__arrow')).toBe(true)
      expect(arrow.getAttribute('aria-label')).toBe('Options')
      expect(arrow.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(arrow.getBoundingClientRect().width).toBe(36)
      expect(getComputedStyle(arrow).borderLeftWidth).toBe('1px')
      expect(getComputedStyle(arrow).borderLeftColor).toBe('rgba(0, 0, 0, 0.12)')
    })

    it('should emit select with the current state from the state segment and leave the menu closed', async () => {
      const { root, selects, content } = dropdown({ segmented: true }, 'heading')
      await settle()

      await userEvent.click(root.querySelector('.md1-dropdown-button__state')!)
      await settle()

      expect(selects).toEqual(['heading'])
      expect(open(content())).toBe(false)
    })

    it('should open the options from the arrow segment and cover both segments', async () => {
      // Room before the button: the sheet rounds up to whole 56 dp units and grows toward the start edge.
      const { root, model, trigger, content, items } = dropdown({ segmented: true, style: 'margin-inline-start: 160px' }, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)

      const button = root.getBoundingClientRect()

      expect(menu.getBoundingClientRect().width).toBeGreaterThanOrEqual(Math.floor(button.width))
      expect(Math.round(menu.getBoundingClientRect().right)).toBe(Math.round(button.right))

      await userEvent.click(items()[1]!)
      await settle()

      expect(model.value).toBe('title')
      expect(root.querySelector('.md1-dropdown-button__state')!.textContent).toBe('Title')
    })

    it('should take ariaLabel for the arrow segment', async () => {
      const { trigger } = dropdown({ segmented: true, ariaLabel: 'Text colour' }, 'normal')
      await settle()

      expect(trigger().getAttribute('aria-label')).toBe('Text colour')
    })
  })

  // Buttons page: "Editable segmented dropdown button", the font size picker.
  describe('editable', () => {
    const SIZES = [8, 9, 10, 11, 12, 14, 18, 24].map(size => ({ value: size, text: String(size) }))

    function field (root: HTMLElement): HTMLInputElement {
      return root.querySelector<HTMLInputElement>('.md1-dropdown-button__field')!
    }

    it('should render a named text field showing the state and the arrow segment, at the editable overflow button metrics', async () => {
      const { root, trigger } = dropdown({ editable: true, label: 'Font size' }, 11, SIZES)
      await settle()

      const input = field(root)
      const arrow = trigger()

      expect(root.dataset.editable).toBe('true')
      expect(root.dataset.segmented).toBe('true')
      expect(input.tagName).toBe('INPUT')
      expect(input.value).toBe('11')
      expect(input.getAttribute('aria-label')).toBe('Font size')
      expect(arrow.getAttribute('aria-haspopup')).toBe('menu')
      expect(input.getBoundingClientRect().height).toBe(48)
      expect(arrow.getBoundingClientRect().width).toBe(48)
      expect(arrow.getBoundingClientRect().height).toBe(48)
      expect(getComputedStyle(input).paddingLeft).toBe('16px')
      expect(getComputedStyle(input).fontSize).toBe('16px')
      expect(getComputedStyle(input).textTransform).toBe('none')
      expect(getComputedStyle(arrow).borderInlineStartWidth).toBe('1px')
      expect(root.getBoundingClientRect().width).toBe(112)
    })

    it('should fire select with the current state when pressed, then commit a typed state with Enter', async () => {
      const { root, model, selects } = dropdown({ editable: true, label: 'Font size' }, 11, SIZES)
      await settle()

      const input = field(root)

      await userEvent.click(input)
      await settle()

      expect(selects).toEqual([11])
      expect(document.activeElement).toBe(input)
      expect(input.selectionStart).toBe(0)
      expect(input.selectionEnd).toBe(2)

      await userEvent.keyboard('13{Enter}')
      await settle()

      // Every state is a number, so the typed size commits as one.
      expect(model.value).toBe(13)
      expect(selects).toEqual([11, 13])
      expect(input.value).toBe('13')
    })

    it('should commit a typed state that names an item to that item', async () => {
      const { root, model } = dropdown({ editable: true, label: 'Style' }, 'normal')
      await settle()

      const input = field(root)

      await userEvent.click(input)
      await userEvent.keyboard('title')
      input.blur()
      await settle()

      expect(model.value).toBe('title')
      expect(input.value).toBe('Title')
    })

    it('should restore the state on Escape and keep an empty field from committing', async () => {
      const { root, model, selects } = dropdown({ editable: true, label: 'Font size' }, 11, SIZES)
      await settle()

      const input = field(root)

      await userEvent.click(input)
      await userEvent.keyboard('99{Escape}')
      await settle()

      expect(model.value).toBe(11)
      expect(input.value).toBe('11')

      await userEvent.click(input)
      await userEvent.keyboard('{Backspace}')
      input.blur()
      await settle()

      expect(model.value).toBe(11)
      expect(input.value).toBe('11')
      expect(selects).toEqual([11, 11])
    })

    it('should open the options from the arrow, with the current state over the field', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      teardowns.push(() => delete document.body.dataset.reducedMotion)
      const { root, model, trigger, content, items } = dropdown({ editable: true, label: 'Font size' }, 11, SIZES)
      await settle()

      await userEvent.click(trigger())
      await settle()

      const menu = content()

      await expect.poll(() => open(menu)).toBe(true)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const box = root.getBoundingClientRect()
      const row = items()[3]!.getBoundingClientRect()

      expect(items()[3]!.getAttribute('aria-checked')).toBe('true')
      expect(Math.round(row.top + row.height / 2)).toBe(Math.round(box.top + box.height / 2))
      expect(Math.round(menu.getBoundingClientRect().right)).toBe(Math.round(box.right))

      await userEvent.click(items()[6]!)
      await settle()

      expect(model.value).toBe(18)
      expect(field(root).value).toBe('18')
    })

    it('should lift onto the surface at 2 dp while focused', async () => {
      const { root } = dropdown({ editable: true, label: 'Font size' }, 11, SIZES)
      await settle()

      expect(getComputedStyle(root).boxShadow).toContain('inset')

      field(root).focus()
      await settle()

      await expect.poll(() => getComputedStyle(root).boxShadow).toContain('0px 2px 2px 0px')
    })

    it('should warn in dev when an editable dropdown has no label', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dropdown({ editable: true }, 11, SIZES)
      await settle()

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('editable dropdown names its text field with label'))
    })
  })

  describe('density', () => {
    it('should condense the handset menu under dense: 40 dp rows at 14 sp', async () => {
      const { trigger, content, items } = dropdown({ dense: true }, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      expect(content().dataset.dense).toBe('true')
      expect(items()[0]!.getBoundingClientRect().height).toBe(40)
      expect(getComputedStyle(items()[0]!).fontSize).toBe('14px')
    })

    it('should use the desktop menu under desktop: 32 px rows, 15 px type, 64 px text keyline, a 6 dp sheet at least 128 px wide', async () => {
      const { trigger, content, items } = dropdown({ desktop: true }, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      const row = getComputedStyle(items()[0]!)

      expect(items()[0]!.getBoundingClientRect().height).toBe(32)
      expect(row.fontSize).toBe('15px')
      expect(row.paddingLeft).toBe('64px')
      expect(row.paddingRight).toBe('24px')
      expect(getComputedStyle(content()).boxShadow).toBe(serialize('boxShadow', ELEVATION_6))
      expect(content().getBoundingClientRect().width).toBeGreaterThanOrEqual(128)
      expect(Math.round(content().getBoundingClientRect().width) % 64).toBe(0)
    })

    it('should use the dense desktop menu under both: 24 px rows, 13 px type, 4 px list padding', async () => {
      const { trigger, content, items } = dropdown({ desktop: true, dense: true }, 'normal')
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      expect(items()[0]!.getBoundingClientRect().height).toBe(24)
      expect(getComputedStyle(items()[0]!).fontSize).toBe('13px')
      expect(getComputedStyle(content().querySelector('.md1-dropdown-button__list')!).paddingTop).toBe('4px')
    })
  })

  describe('states', () => {
    it('should disable the whole button: native disabled, data-disabled, 26% ink, no menu', async () => {
      const { root, trigger, content } = dropdown({ disabled: true }, 'normal')
      await settle()

      expect(root.dataset.disabled).toBe('true')
      expect(trigger().disabled).toBe(true)
      expect(trigger().dataset.disabled).toBe('true')
      expect(getComputedStyle(root).color).toBe('rgba(0, 0, 0, 0.26)')

      trigger().dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(open(content())).toBe(false)
      expect(root.querySelectorAll('.md1-ripple__ink')).toHaveLength(0)
    })

    it('should disable both segments of a disabled segmented button', async () => {
      const { root, selects, trigger } = dropdown({ disabled: true, segmented: true }, 'normal')
      await settle()

      const state = root.querySelector<HTMLButtonElement>('.md1-dropdown-button__state')!

      expect(state.disabled).toBe(true)
      expect(trigger().disabled).toBe(true)

      state.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(selects).toEqual([])
    })

    it('should keep a disabled state in place at 38% ink, inert to a press', async () => {
      const states = STATES.map(([value, text]) => ({ value, text, disabled: value === 'title' }))
      const { model, trigger, content, items } = dropdown({}, 'normal', states)
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      const row = items()[1]!

      expect(row.getAttribute('aria-disabled')).toBe('true')
      expect(row.dataset.disabled).toBe('true')
      expect(getComputedStyle(row).color).toBe('rgba(0, 0, 0, 0.38)')

      row.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(model.value).toBe('normal')
      expect(open(content())).toBe(true)
    })

    it('should cast the bare disabled attribute a template writes to a disabled state', async () => {
      const states = [{ value: 'a', text: 'A' }, { value: 'b', text: 'B', disabled: '' as unknown as boolean }]
      const { items } = dropdown({}, 'a', states)
      await settle()

      expect(items()[1]!.getAttribute('aria-disabled')).toBe('true')
      expect(items()[1]!.dataset.disabled).toBe('true')
    })

    it('should show the keyboard focus overlay on the button: 12% of its ink', async () => {
      const { trigger } = dropdown({ label: 'A' })
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(trigger())
      await expect.poll(() => getComputedStyle(trigger()).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, rgb(255, 64, 129) 12%, transparent)'))
    })
  })

  describe('icons', () => {
    it('should draw a state glyph in its row and on the button, and move the check to the trailing edge', async () => {
      const states = [
        { value: 'grid', icon: 'apps' as const, text: 'Grid' },
        { value: 'list', icon: 'reorder' as const, text: 'List' },
      ]
      const { trigger, items } = dropdown({}, 'list', states)
      await settle()

      const glyph = trigger().querySelector('.md1-dropdown-button__glyph')!

      expect([...glyph.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.reorder)
      expect([...items()[0]!.querySelector('.md1-dropdown-button__lead')!.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.apps)
      expect(items()[0]!.querySelector('.md1-dropdown-button__trail')).toBeNull()
      expect([...items()[1]!.querySelector('.md1-dropdown-button__trail')!.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.check)
    })

    it('should become the generic dropdown, an arrow alone in a 48 dp circle, with no selection and no label', async () => {
      const { root, trigger } = dropdown({ ariaLabel: 'More' })
      await settle()

      expect(root.dataset.solo).toBe('true')
      expect(trigger().getAttribute('aria-label')).toBe('More')
      expect(trigger().getBoundingClientRect().width).toBe(48)
      expect(trigger().getBoundingClientRect().height).toBe(48)
      expect(trigger().querySelector('.md1-dropdown-button__label')).toBeNull()
    })

    it('should keep the generic menu rows at the plain 16 dp text padding: no check column', async () => {
      const { trigger, content, items } = dropdown({ ariaLabel: 'More' })
      await settle()

      await userEvent.click(trigger())
      await settle()
      await expect.poll(() => open(content())).toBe(true)

      expect(getComputedStyle(items()[0]!).paddingLeft).toBe('16px')
      expect(items()[0]!.querySelector('.md1-dropdown-button__lead')).toBeNull()
    })

    it('should warn in dev when the generic dropdown has no accessible name', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dropdown()
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1DropdownButton'))
    })
  })

  describe('compound', () => {
    it('should attach Item to the root', () => {
      expect(Md1DropdownButton.Item).toBe(Md1DropdownButtonItem)
    })

    it('should warn once and render nothing for an Item outside Md1DropdownButton', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1DropdownButtonItem, { value: 'a' }, () => 'Alone'))
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1DropdownButtonItem'))
      expect(host.querySelector('[role="menuitemradio"]')).toBeNull()
    })

    it('should not warn for nested items', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dropdown({}, 'normal')
      await settle()

      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should fall attrs through to the root element', async () => {
      const { root } = dropdown({ 'data-testid': 'font', 'class': 'extra' }, 'normal')
      await settle()

      expect(root.dataset.testid).toBe('font')
      expect(root.classList.contains('extra')).toBe(true)
      expect(root.classList.contains('md1-dropdown-button')).toBe(true)
    })
  })

  describe('theme', () => {
    it('should take the sheet and ink tokens from the adapter sheet in the dark theme', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const model = shallowRef<unknown>('normal')
      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1DropdownButton, {
          'modelValue': model.value,
          'onUpdate:modelValue': (value: unknown) => {
            model.value = value
          },
        }, () => [
          h(Md1DropdownButtonItem, { value: 'normal' }, () => 'Normal'),
          h(Md1DropdownButtonItem, { value: 'title', disabled: true }, () => 'Title'),
        ]),
      ]))
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
      const menu = host.querySelector<HTMLElement>('[role="menu"]')!

      await userEvent.click(trigger)
      await settle()
      await expect.poll(() => open(menu)).toBe(true)

      const [normal, title] = host.querySelectorAll<HTMLElement>('[role="menuitemradio"]')

      expect(getComputedStyle(menu).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(normal!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(title!).color).toBe('rgba(255, 255, 255, 0.5)')
      // The current state keeps the 12% focus shade, hovered or not: the menu opened under the pointer.
      expect(getComputedStyle(normal!).backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
    })

    it('should draw a disabled button at 30% white in the dark theme', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1DropdownButton, { modelValue: 'normal', disabled: true }, () => [
          h(Md1DropdownButtonItem, { value: 'normal' }, () => 'Normal'),
        ]),
      ]))
      await settle()

      expect(getComputedStyle(host.querySelector('.md1-dropdown-button')!).color).toBe('rgba(255, 255, 255, 0.3)')
    })
  })
})

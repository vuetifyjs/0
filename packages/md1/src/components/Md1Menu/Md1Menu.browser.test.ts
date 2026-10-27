import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, Menu } from '@vuetify/v0'

import { Md1Menu, Md1MenuCheckItem, Md1MenuContent, Md1MenuDivider, Md1MenuItem, Md1MenuSub, Md1MenuSubheader } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1MenuProps } from './Md1Menu.vue'
import type { App, ShallowRef, VNode, VNodeChild } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'
// Components
import { Md1Button } from '../Md1Button'
import { Md1List } from '../Md1List'

const ELEVATION_8 = '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'
const ELEVATION_6 = '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'
const ELEVATION_9 = '0px 5px 6px -3px rgba(0, 0, 0, 0.2), 0px 9px 12px 1px rgba(0, 0, 0, 0.14), 0px 3px 16px 2px rgba(0, 0, 0, 0.12)'
const ELEVATION_7 = '0px 4px 5px -2px rgba(0, 0, 0, 0.2), 0px 7px 10px 1px rgba(0, 0, 0, 0.14), 0px 2px 16px 1px rgba(0, 0, 0, 0.12)'

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

interface Options {
  props?: Md1MenuProps & Record<string, unknown>
  open?: ShallowRef<boolean>
  selected?: ShallowRef<unknown>
  setup?: (app: App) => void
}

/** An Md1Menu emitted by a flat Md1Button, with `items` inside its content. */
function menu (items: () => VNodeChild, options: Options = {}): HTMLElement {
  const { props = {}, open, selected, setup } = options

  return mount(() => h(Md1Menu, {
    ...props,
    ...(open && {
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }),
    ...(selected && {
      'selected': selected.value,
      'onUpdate:selected': (value: unknown) => {
        selected.value = value
      },
    }),
  }, () => [
    h(Md1Menu.Activator, null, {
      default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Options'),
    }),
    h(Md1Menu.Content, null, items),
  ]), setup)
}

function trigger (host: HTMLElement): HTMLButtonElement {
  return host.querySelector<HTMLButtonElement>('button.md1-button')!
}

function sheet (): HTMLElement {
  return document.querySelector<HTMLElement>('.md1-menu:not([data-sub])')!
}

function rows (root: ParentNode = document): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.md1-menu__item')]
}

function row (text: string): HTMLElement {
  return rows().find(el => el.querySelector('.md1-menu__label')?.textContent === text)!
}

async function settle () {
  await nextTick()
  await nextTick()
}

/** Opens through the trigger the way a pointer does, then waits for the sheet. */
async function show (host: HTMLElement) {
  await userEvent.click(trigger(host))
  await settle()
  await expect.poll(() => sheet()?.matches(':popover-open')).toBe(true)
}

function simple () {
  return [
    h(Md1MenuItem, null, () => 'Refresh'),
    h(Md1MenuItem, null, () => 'Settings'),
    h(Md1MenuItem, null, () => 'Help'),
  ]
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quMenu', () => {
  describe('anatomy', () => {
    it('should attach every part to the root and keep the flat names', () => {
      expect(Md1Menu.Content).toBe(Md1MenuContent)
      expect(Md1Menu.Item).toBe(Md1MenuItem)
      expect(Md1Menu.CheckItem).toBe(Md1MenuCheckItem)
      expect(Md1Menu.Divider).toBe(Md1MenuDivider)
      expect(Md1Menu.Subheader).toBe(Md1MenuSubheader)
      expect(Md1Menu.Sub).toBe(Md1MenuSub)
      expect(Md1Menu.Activator).toBeDefined()
    })

    it('should render the consumer trigger as the menu button and a closed popover menu', async () => {
      const host = menu(simple)
      await settle()

      const button = trigger(host)
      const el = sheet()

      expect(button.getAttribute('aria-haspopup')).toBe('menu')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-controls')).toBe(el.id)
      expect(button.type).toBe('button')
      expect(el.tagName).toBe('DIV')
      expect(el.getAttribute('role')).toBe('menu')
      expect(el.getAttribute('popover')).toBe('')
      expect(el.getAttribute('aria-labelledby')).toBe(button.id)
      expect(el.matches(':popover-open')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'dense')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'desktop')).toBe(false)
      // The items are lazy: nothing renders before the first open.
      expect(rows().length).toBe(0)
    })

    it('should open from a press of the trigger, write v-model and expose data-open', async () => {
      const open = shallowRef(false)
      const host = menu(simple, { open })
      await settle()

      await show(host)

      const el = sheet()

      expect(open.value).toBe(true)
      expect(trigger(host).getAttribute('aria-expanded')).toBe('true')
      expect(el.dataset.open).toBe('true')
      expect(el.firstElementChild!.classList.contains('md1-menu__list')).toBe(true)

      const [item] = rows()

      expect(item.getAttribute('role')).toBe('menuitem')
      expect(item.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(item.querySelector('.md1-menu__label')!.textContent).toBe('Refresh')
    })

    it('should open and close from v-model', async () => {
      const open = shallowRef(false)
      menu(simple, { open })
      await settle()

      open.value = true
      await settle()

      await expect.poll(() => sheet().matches(':popover-open')).toBe(true)

      open.value = false
      await settle()

      await expect.poll(() => sheet().matches(':popover-open')).toBe(false)
    })

    it('should open below the trigger, aligned to its start edge', async () => {
      const host = menu(simple)
      await settle()

      await show(host)

      const anchor = trigger(host).getBoundingClientRect()
      const rect = sheet().getBoundingClientRect()

      expect(Math.round(rect.top)).toBe(Math.round(anchor.bottom))
      expect(Math.round(rect.left)).toBe(Math.round(anchor.left))
    })

    // A handset menu under a centred control near the bottom edge is wider than the room on either side of
    // the control, so every start- or end-aligned area overflowed and the browser kept the base position:
    // the sheet hung past the bottom of the screen instead of rising above the control.
    it('should rise above a centred trigger near the bottom edge when the sheet is wider than either side', async () => {
      const width = Math.round(window.innerWidth * 0.7)
      const host = menu(() => [
        h(Md1MenuItem, null, () => h('span', { style: `display: inline-block; width: ${width}px` })),
        h(Md1MenuItem, null, () => 'Settings'),
      ], { props: { desktop: true } })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '50%', bottom: '8px', translate: '-50% 0' })
      await settle()

      await show(host)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const anchor = trigger(host).getBoundingClientRect()
      const rect = sheet().getBoundingClientRect()

      expect(rect.bottom).toBeLessThanOrEqual(anchor.top + 1)
      expect(rect.top).toBeGreaterThanOrEqual(0)
      // ...and keeps the screen margin (16 dp, 24 dp from 600 px) instead of stopping flush against the edge.
      expect(rect.left).toBeGreaterThanOrEqual(16)
      expect(rect.right).toBeLessThanOrEqual(document.documentElement.clientWidth - 16)
    })

    it('should keep the screen margin when a start-aligned sheet would reach the trailing edge', async () => {
      const host = menu(simple)
      Object.assign(host.style, { position: 'fixed', padding: '0', right: '24px', top: '8px' })
      await settle()

      await show(host)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(sheet().getBoundingClientRect().right).toBeLessThanOrEqual(document.documentElement.clientWidth - 16)
    })
  })

  describe('metrics', () => {
    it('should paint the 8 dp surface sheet with 2 dp corners and 8 dp list padding', async () => {
      const host = menu(simple)
      await settle()

      await show(host)

      const el = sheet()
      const computed = getComputedStyle(el)
      const list = getComputedStyle(el.firstElementChild!)

      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.borderRadius).toBe('2px')
      expect(computed.boxShadow).toBe(serialize('boxShadow', ELEVATION_8))
      expect(computed.overflowY).toBe('auto')
      expect(list.paddingTop).toBe('8px')
      expect(list.paddingBottom).toBe('8px')
    })

    it('should set handset rows at 48 dp with 16 dp text padding and 16 sp type at 87% ink', async () => {
      const host = menu(simple)
      await settle()

      await show(host)

      const item = row('Settings')
      const computed = getComputedStyle(item)

      expect(item.getBoundingClientRect().height).toBe(48)
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.paddingRight).toBe('16px')
      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('16px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(computed.whiteSpace).toBe('nowrap')
    })

    it('should snap the width up to the 56 dp unit, from 2x to 5x', async () => {
      const host = menu(() => [
        h(Md1MenuItem, null, () => 'A'),
        h(Md1MenuItem, null, () => 'Medium length entry'),
      ])
      await settle()

      await show(host)

      await expect.poll(() => sheet().getBoundingClientRect().width % 56).toBe(0)

      const width = sheet().getBoundingClientRect().width

      expect(width).toBeGreaterThanOrEqual(112)
      expect(width).toBeLessThanOrEqual(280)
      // The snapped width is the next unit up from the content, never a full unit more.
      expect(width - row('Medium length entry').scrollWidth).toBeLessThan(56)
    })

    it('should hold a short menu at the 112 dp minimum and cap a long one at 280 dp', async () => {
      const short = menu(() => [h(Md1MenuItem, null, () => 'A'), h(Md1MenuItem, null, () => 'B')])
      await settle()

      await show(short)

      await expect.poll(() => sheet().getBoundingClientRect().width).toBe(112)

      await userEvent.keyboard('{Escape}')
      teardowns.pop()!()

      const long = menu(() => [h(Md1MenuItem, null, () => 'An item whose text runs far past five width units')])
      await settle()

      await show(long)

      await expect.poll(() => sheet().getBoundingClientRect().width).toBe(280)
    })

    it('should draw a leading glyph at 16 dp and move every row to the 72 dp keyline', async () => {
      const host = menu(() => [
        h(Md1MenuItem, { icon: 'refresh' }, () => 'Refresh'),
        h(Md1MenuItem, null, () => 'Plain'),
      ])
      await settle()

      await show(host)

      const item = row('Refresh')
      const icon = item.querySelector<HTMLElement>('.md1-menu__icon')!
      const svg = icon.querySelector('svg')!

      expect(item.dataset.icon).toBe('true')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.refresh)
      expect(svg.dataset.size).toBe('m')
      expect(icon.getBoundingClientRect().left - item.getBoundingClientRect().left).toBe(16)
      expect(getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(item).paddingLeft).toBe('72px')
      expect(getComputedStyle(row('Plain')).paddingLeft).toBe('72px')
    })

    it('should set inline information at the trailing edge in the secondary ink as a key shortcut', async () => {
      const host = menu(() => [h(Md1MenuItem, { info: 'Ctrl+C' }, () => 'Copy')])
      await settle()

      await show(host)

      const item = row('Copy')
      const info = item.querySelector<HTMLElement>('.md1-menu__info')!

      expect(info.textContent).toBe('Ctrl+C')
      expect(info.getAttribute('aria-hidden')).toBe('true')
      expect(item.getAttribute('aria-keyshortcuts')).toBe('Ctrl+C')
      expect(getComputedStyle(info).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(Math.round(item.getBoundingClientRect().right - info.getBoundingClientRect().right)).toBe(16)
    })

    it('should condense handset rows to 40 dp and 14 sp under dense', async () => {
      const host = menu(simple, { props: { dense: true } })
      await settle()

      await show(host)

      const computed = getComputedStyle(row('Help'))

      expect(sheet().dataset.dense).toBe('true')
      expect(row('Help').getBoundingClientRect().height).toBe(40)
      expect(computed.fontSize).toBe('14px')
      expect(computed.paddingLeft).toBe('16px')
    })

    it('should take the desktop metrics: 32 px rows, 24 px padding, 15 px type, the 64 px unit and 6 dp', async () => {
      const host = menu(simple, { props: { desktop: true } })
      await settle()

      await show(host)

      const el = sheet()
      const computed = getComputedStyle(row('Help'))

      expect(el.dataset.desktop).toBe('true')
      expect(row('Help').getBoundingClientRect().height).toBe(32)
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.fontSize).toBe('15px')
      expect(getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_6))
      expect(getComputedStyle(el.firstElementChild!).paddingTop).toBe('8px')
      await expect.poll(() => el.getBoundingClientRect().width % 64).toBe(0)
      expect(el.getBoundingClientRect().width).toBeGreaterThanOrEqual(128)
    })

    it('should take the dense desktop metrics: 24 px rows, 4 px list padding and 13 px type', async () => {
      const host = menu(simple, { props: { desktop: true, dense: true } })
      await settle()

      await show(host)

      const el = sheet()

      expect(row('Help').getBoundingClientRect().height).toBe(24)
      expect(getComputedStyle(row('Help')).fontSize).toBe('13px')
      expect(getComputedStyle(el.firstElementChild!).paddingTop).toBe('4px')
      expect(getComputedStyle(el.firstElementChild!).paddingBottom).toBe('4px')
    })

    it('should move the desktop glyph to 24 px at 20 dp and the text to the 64 px keyline', async () => {
      const host = menu(() => [h(Md1MenuItem, { icon: 'settings' }, () => 'Settings')], { props: { desktop: true } })
      await settle()

      await show(host)

      const item = row('Settings')
      const icon = item.querySelector<HTMLElement>('.md1-menu__icon')!

      expect(icon.querySelector('svg')!.dataset.size).toBe('s')
      expect(icon.getBoundingClientRect().left - item.getBoundingClientRect().left).toBe(24)
      expect(getComputedStyle(item).paddingLeft).toBe('64px')
    })

    it('should draw the divider as a full-width 1 dp rule at 12% with 8 dp above and below', async () => {
      const host = menu(() => [
        h(Md1MenuItem, null, () => 'Undo'),
        h(Md1MenuDivider),
        h(Md1MenuItem, null, () => 'Cut'),
      ])
      await settle()

      await show(host)

      const divider = document.querySelector<HTMLElement>('.md1-menu__divider')!
      const computed = getComputedStyle(divider)

      expect(divider.tagName).toBe('HR')
      expect(divider.getAttribute('role')).toBe('separator')
      expect(computed.borderTopWidth).toBe('1px')
      expect(computed.borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.marginTop).toBe('8px')
      expect(computed.marginBottom).toBe('8px')
      expect(divider.getBoundingClientRect().width).toBe(sheet().getBoundingClientRect().width)
    })

    it('should draw the subheader as a 48 dp Body 2 tile at the secondary ink, presentational inside the menu', async () => {
      const host = menu(() => [
        h(Md1MenuSubheader, null, () => 'Recent'),
        h(Md1MenuItem, null, () => 'Report.pdf'),
      ], { props: { desktop: true } })
      await settle()

      await show(host)

      const subheader = document.querySelector<HTMLElement>('.md1-menu__subheader')!
      const computed = getComputedStyle(subheader)

      expect(subheader.classList.contains('md1-subheader')).toBe(true)
      expect(subheader.getAttribute('role')).toBe('none')
      expect(subheader.hasAttribute('aria-level')).toBe(false)
      expect(Object.hasOwn(subheader.dataset, 'sticky')).toBe(false)
      expect(subheader.getBoundingClientRect().height).toBe(48)
      expect(computed.fontWeight).toBe('500')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(computed.paddingLeft).toBe('24px')
    })

    it('should hold the handset subheader at the 16 dp row padding when the screen margin grows to 24 dp', async () => {
      // The theme's 600 px value of the margin token, which Md1Subheader follows outside a menu.
      style(':root { --md1-keyline-margin: 24px; }')

      const host = menu(() => [
        h(Md1MenuSubheader, null, () => 'Recent'),
        h(Md1MenuItem, null, () => 'Report.pdf'),
      ])
      await settle()

      await show(host)

      const subheader = document.querySelector<HTMLElement>('.md1-menu__subheader')!

      expect(getComputedStyle(subheader).paddingLeft).toBe('16px')
      expect(getComputedStyle(row('Report.pdf')).paddingLeft).toBe('16px')
    })
  })

  describe('states', () => {
    it('should shade the hovered row 4% and follow the keyboard highlight', async () => {
      const host = menu(simple)
      await settle()

      await show(host)

      const item = row('Settings')

      await userEvent.hover(item)

      await expect.poll(() => item.dataset.highlighted).toBe('true')
      expect(getComputedStyle(item).backgroundColor).toBe('rgba(0, 0, 0, 0.04)')

      await userEvent.keyboard('{ArrowDown}')

      await expect.poll(() => row('Help').dataset.highlighted).toBe('true')
      expect(document.activeElement).toBe(row('Help'))
    })

    it('should commit an item value to v-model:selected and draw that row with the 12% shade', async () => {
      const selected = shallowRef<unknown>('b')
      const host = menu(() => [
        h(Md1MenuItem, { value: 'a' }, () => 'Alpha'),
        h(Md1MenuItem, { value: 'b' }, () => 'Beta'),
      ], { selected })
      await settle()

      await show(host)

      expect(row('Beta').dataset.selected).toBe('true')
      expect(row('Beta').getAttribute('aria-current')).toBe('true')
      expect(Object.hasOwn(row('Alpha').dataset, 'selected')).toBe(false)
      expect(getComputedStyle(row('Beta')).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')

      await userEvent.hover(row('Beta'))

      await expect.poll(() => row('Beta').dataset.highlighted).toBe('true')
      expect(getComputedStyle(row('Beta')).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')

      await userEvent.click(row('Alpha'))
      await settle()

      expect(selected.value).toBe('a')
      await expect.poll(() => sheet().matches(':popover-open')).toBe(false)
    })

    it('should keep a disabled item in place at 38% ink, inert to pointer and keyboard', async () => {
      let selects = 0
      const open = shallowRef(false)
      const host = menu(() => [
        h(Md1MenuItem, null, () => 'Undo'),
        h(Md1MenuItem, { disabled: true, icon: 'refresh', onSelect: () => selects++ }, () => 'Redo'),
        h(Md1MenuItem, null, () => 'Paste'),
      ], { open })
      await settle()

      await show(host)

      const item = row('Redo')

      expect(item.getAttribute('aria-disabled')).toBe('true')
      expect(item.dataset.disabled).toBe('true')
      expect(item.getAttribute('tabindex')).toBe('-1')
      expect(getComputedStyle(item).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(item.querySelector('.md1-menu__icon')!).color).toBe('rgba(0, 0, 0, 0.38)')

      item.click()
      await settle()

      expect(selects).toBe(0)
      expect(open.value).toBe(true)

      row('Undo').focus()
      await userEvent.keyboard('{ArrowDown}')

      expect(document.activeElement).toBe(row('Paste'))
    })

    it('should disable the trigger and every item from the root', async () => {
      const host = menu(simple, { props: { disabled: true } })
      await settle()

      const button = trigger(host)

      expect(button.disabled).toBe(true)

      button.click()
      await settle()

      expect(sheet().matches(':popover-open')).toBe(false)
    })

    it('should disable only the trigger from the activator', async () => {
      const host = mount(() => h(Md1Menu, null, () => [
        h(Md1Menu.Activator, { disabled: true }, {
          default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Options'),
        }),
        h(Md1Menu.Content, null, simple),
      ]))
      await settle()

      expect(trigger(host).disabled).toBe(true)
      expect(trigger(host).dataset.disabled).toBe('true')
    })
  })

  describe('keyboard', () => {
    it('should open on ArrowDown at the first item and on ArrowUp at the last', async () => {
      const host = menu(simple)
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(row('Refresh'))

      await userEvent.keyboard('{Escape}')
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{ArrowUp}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(row('Help'))
    })

    it('should open on Enter at the first item, wrap with the arrows and jump by typeahead', async () => {
      const host = menu(simple)
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(row('Refresh'))

      await userEvent.keyboard('{ArrowUp}')

      expect(document.activeElement).toBe(row('Help'))

      await userEvent.keyboard('s')

      expect(document.activeElement).toBe(row('Settings'))
    })

    it('should close on Escape and return focus to the trigger', async () => {
      const open = shallowRef(false)
      const host = menu(simple, { open })
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(row('Refresh'))

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      await expect.poll(() => document.activeElement).toBe(trigger(host))
    })

    it('should choose the highlighted item on Enter and on Space: select, click, commit, close, focus back', async () => {
      for (const key of ['{Enter}', ' ']) {
        let selects = 0
        let clicks = 0
        const selected = shallowRef<unknown>()
        const host = menu(() => [
          h(Md1MenuItem, { value: 'one' }, () => 'One'),
          h(Md1MenuItem, { value: 'two', onSelect: () => selects++, onClick: () => clicks++ }, () => 'Two'),
        ], { selected })
        await settle()

        trigger(host).focus()
        await userEvent.keyboard('{ArrowDown}')
        await settle()
        await expect.poll(() => document.activeElement).toBe(row('One'))

        await userEvent.keyboard('{ArrowDown}')
        await userEvent.keyboard(key)
        await settle()

        expect(selects).toBe(1)
        expect(clicks).toBe(1)
        expect(selected.value).toBe('two')
        await expect.poll(() => sheet().matches(':popover-open')).toBe(false)
        await expect.poll(() => document.activeElement).toBe(trigger(host))

        teardowns.pop()!()
      }
    })

    it('should close on Tab without pulling focus back', async () => {
      const open = shallowRef(false)
      const host = menu(simple, { open })
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await expect.poll(() => document.activeElement).toBe(row('Refresh'))

      await userEvent.keyboard('{Tab}')
      await settle()

      expect(open.value).toBe(false)
    })
  })

  describe('pointer', () => {
    it('should fire select once and close when an item is pressed', async () => {
      let selects = 0
      const open = shallowRef(false)
      const host = menu(() => [
        h(Md1MenuItem, { onSelect: () => selects++ }, () => 'Refresh'),
      ], { open })
      await settle()

      await show(host)

      await userEvent.click(row('Refresh'))
      await settle()

      expect(selects).toBe(1)
      expect(open.value).toBe(false)
    })

    it('should close on a press outside the sheet', async () => {
      const open = shallowRef(false)
      const host = menu(simple, { open })
      const outside = document.createElement('button')
      outside.textContent = 'Outside'
      outside.style.cssText = 'position: fixed; right: 0; bottom: 0'
      document.body.append(outside)
      teardowns.push(() => outside.remove())
      await settle()

      await show(host)

      await userEvent.click(outside)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should close when the trigger is pressed again', async () => {
      const open = shallowRef(false)
      const host = menu(simple, { open })
      await settle()

      await show(host)

      await userEvent.click(trigger(host))
      await settle()

      expect(open.value).toBe(false)
    })
  })

  describe('check items', () => {
    it('should toggle the check glyph, aria-checked and data-state while the menu stays open', async () => {
      const wrap = shallowRef(false)
      const open = shallowRef(false)
      const host = menu(() => [
        h(Md1MenuCheckItem, {
          'checked': wrap.value,
          'onUpdate:checked': (value: unknown) => {
            wrap.value = Boolean(value)
          },
        }, () => 'Wrap text'),
        h(Md1MenuItem, null, () => 'Plain'),
      ], { open })
      await settle()

      await show(host)

      const item = row('Wrap text')

      expect(item.getAttribute('role')).toBe('menuitemcheckbox')
      expect(item.getAttribute('aria-checked')).toBe('false')
      expect(item.dataset.state).toBe('unchecked')
      expect(item.dataset.check).toBe('true')
      expect(item.querySelector('.md1-menu__icon')).toBeNull()
      // The check column reserves the keyline for every row, checked or not.
      expect(getComputedStyle(row('Plain')).paddingLeft).toBe('72px')

      await userEvent.click(item)
      await settle()

      expect(wrap.value).toBe(true)
      expect(open.value).toBe(true)
      expect(item.getAttribute('aria-checked')).toBe('true')
      expect(item.dataset.state).toBe('checked')
      expect([...item.querySelectorAll('.md1-menu__icon path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.check)

      item.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(wrap.value).toBe(false)
      expect(open.value).toBe(true)
    })

    it('should keep a disabled check item unchecked under a press', async () => {
      const wrap = shallowRef(false)
      const host = menu(() => [
        h(Md1MenuCheckItem, {
          'disabled': true,
          'checked': wrap.value,
          'onUpdate:checked': (value: unknown) => {
            wrap.value = Boolean(value)
          },
        }, () => 'Wrap text'),
      ])
      await settle()

      await show(host)

      row('Wrap text').click()
      await settle()

      expect(wrap.value).toBe(false)
      expect(row('Wrap text').getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('cascading', () => {
    function cascade (desktop = true) {
      return menu(() => [
        h(Md1MenuItem, null, () => 'New'),
        h(Md1MenuSub, { label: 'Share', icon: 'share' }, () => [
          h(Md1MenuItem, null, () => 'Email'),
          h(Md1MenuItem, null, () => 'Link'),
        ]),
      ], { props: { desktop } })
    }

    function nested (): HTMLElement {
      return document.querySelector<HTMLElement>('.md1-menu[data-sub]')!
    }

    it('should render the parent row with the trailing triangle and the sub menu wiring', async () => {
      const host = cascade()
      await settle()

      await show(host)

      const parent = row('Share')
      const cue = parent.querySelector('.md1-menu__cue')!

      expect(parent.getAttribute('role')).toBe('menuitem')
      expect(parent.getAttribute('aria-haspopup')).toBe('menu')
      expect(parent.getAttribute('aria-expanded')).toBe('false')
      expect(parent.getAttribute('aria-controls')).toBe(nested().id)
      expect(parent.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect([...cue.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['arrow-right'])
      // The triangle ends 32 px from the desktop edge (cascading redline text).
      expect(Math.round(parent.getBoundingClientRect().right - cue.getBoundingClientRect().right)).toBe(32)
      expect(nested().getAttribute('aria-labelledby')).toBe(parent.id)
    })

    it('should open on ArrowRight at its first item, at the parent trailing edge, and close on ArrowLeft', async () => {
      const host = cascade()
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()
      await userEvent.keyboard('{ArrowDown}')

      expect(document.activeElement).toBe(row('Share'))

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      await expect.poll(() => nested().matches(':popover-open')).toBe(true)
      await expect.poll(() => document.activeElement).toBe(row('Email'))

      const parent = row('Share').getBoundingClientRect()
      const rect = nested().getBoundingClientRect()

      expect(row('Share').dataset.open).toBe('true')
      expect(getComputedStyle(row('Share')).backgroundColor).toBe('rgba(0, 0, 0, 0.04)')
      expect(Math.round(rect.left)).toBe(Math.round(sheet().getBoundingClientRect().right))
      expect(Math.round(rect.top)).toBe(Math.round(parent.top))

      await userEvent.keyboard('{ArrowLeft}')
      await settle()

      await expect.poll(() => nested().matches(':popover-open')).toBe(false)
      expect(document.activeElement).toBe(row('Share'))
      expect(sheet().matches(':popover-open')).toBe(true)
    })

    it('should open on pointer rest and stand at 7 dp with 16 px list padding on desktop', async () => {
      const host = cascade()
      await settle()

      await show(host)

      await userEvent.hover(row('Share'))

      await expect.poll(() => nested().matches(':popover-open')).toBe(true)

      const el = nested()

      expect(el.dataset.desktop).toBe('true')
      expect(getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_7))
      expect(getComputedStyle(el.firstElementChild!).paddingTop).toBe('16px')
      expect(getComputedStyle(row('Email')).height).toBe('32px')
    })

    it('should stand the handset sub menu at 9 dp', async () => {
      const host = cascade(false)
      await settle()

      await show(host)

      await userEvent.click(row('Share'))
      await settle()

      await expect.poll(() => nested().matches(':popover-open')).toBe(true)
      expect(getComputedStyle(nested()).boxShadow).toBe(serialize('boxShadow', ELEVATION_9))
    })

    it('should close every layer when a sub menu item is chosen', async () => {
      let selects = 0
      const open = shallowRef(false)
      const host = menu(() => [
        h(Md1MenuSub, { label: 'Share' }, () => [
          h(Md1MenuItem, { onSelect: () => selects++ }, () => 'Email'),
        ]),
      ], { open })
      await settle()

      await show(host)

      await userEvent.click(row('Share'))
      await settle()
      await expect.poll(() => nested().matches(':popover-open')).toBe(true)

      await userEvent.click(row('Email'))
      await settle()

      expect(selects).toBe(1)
      expect(open.value).toBe(false)
    })

    it('should keep a disabled parent row closed', async () => {
      const host = menu(() => [
        h(Md1MenuSub, { label: 'Share', disabled: true }, () => [h(Md1MenuItem, null, () => 'Email')]),
      ])
      await settle()

      await show(host)

      row('Share').click()
      await settle()

      expect(row('Share').getAttribute('aria-disabled')).toBe('true')
      expect(nested().matches(':popover-open')).toBe(false)
    })
  })

  describe('motion', () => {
    it('should grow the sheet over the entering duration and stagger the rows 20 ms apart', async () => {
      const host = menu(simple, {
        setup: app => {
          app.use(createReducedMotionPlugin({ mode: 'never' }))
        },
      })
      await settle()

      await show(host)

      const [first, second, third] = rows()

      expect(getComputedStyle(sheet()).transitionDuration.split(', ')[0]).toBe('0.225s')
      expect(getComputedStyle(first!).animationName).toBe('md1-menu-item-in')
      expect(getComputedStyle(first!).animationDuration).toBe('0.225s')
      expect(getComputedStyle(first!).animationDelay).toBe('0s')
      expect(getComputedStyle(second!).animationDelay).toBe('0.02s')
      expect(getComputedStyle(third!).animationDelay).toBe('0.04s')
    })

    it('should drop the choreography under reduced motion', async () => {
      const host = menu(simple, {
        setup: app => {
          app.use(createReducedMotionPlugin({ mode: 'always' }))
        },
      })
      await settle()

      await show(host)

      expect(getComputedStyle(rows()[0]!).animationName).toBe('none')
    })
  })

  describe('theme', () => {
    it('should take the surface and ink tokens from the adapter sheet in the dark theme', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1Menu, null, () => [
          h(Md1Menu.Activator, null, {
            default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Options'),
          }),
          h(Md1Menu.Content, null, () => [
            h(Md1MenuItem, null, () => 'On'),
            h(Md1MenuItem, { disabled: true }, () => 'Off'),
            h(Md1MenuDivider),
          ]),
        ]),
      ]))
      await settle()

      await show(host)

      expect(getComputedStyle(sheet()).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(row('On')).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(row('Off')).color).toBe('rgba(255, 255, 255, 0.5)')
      expect(getComputedStyle(document.querySelector('.md1-menu__divider')!).borderTopColor).toBe('rgba(255, 255, 255, 0.12)')
    })
  })

  // Menus page, "Location": a simple menu opens over the emitting element with the selected item on top of it.
  describe('selected item over the emitter', () => {
    function center (rect: DOMRect): number {
      return Math.round(rect.top + rect.height / 2)
    }

    function values (count: number) {
      return () => Array.from({ length: count }, (_, index) => h(Md1MenuItem, { value: index }, () => `Item ${index}`))
    }

    async function frames () {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    }

    it('should centre the selected row on the trigger and line the sheet up with its start edge', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>(2)
      const host = menu(values(4), { selected })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '120px', top: '240px' })
      await settle()

      await show(host)
      await frames()

      const anchor = trigger(host).getBoundingClientRect()
      const item = row('Item 2')

      expect(item.dataset.selected).toBe('true')
      expect(center(item.getBoundingClientRect())).toBe(center(anchor))
      expect(Math.round(sheet().getBoundingClientRect().left)).toBe(Math.round(anchor.left))
      // Never below: the sheet starts above the trigger and covers it.
      expect(sheet().getBoundingClientRect().top).toBeLessThan(anchor.top)
    })

    it('should follow the selection to a later row on the next open', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>(0)
      const host = menu(values(4), { selected })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '120px', top: '240px' })
      await settle()

      await show(host)
      await frames()
      await userEvent.click(row('Item 3'))
      await settle()

      expect(selected.value).toBe(3)

      await show(host)
      await frames()

      expect(center(row('Item 3').getBoundingClientRect())).toBe(center(trigger(host).getBoundingClientRect()))
    })

    it('should shift the whole sheet down from the top edge and keep the screen margin', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>(3)
      const host = menu(values(4), { selected })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '120px', top: '8px' })
      await settle()

      await show(host)
      await frames()

      const rect = sheet().getBoundingClientRect()

      expect(Math.round(rect.top)).toBe(16)
      // Every row stays visible; the selected one is still on screen.
      expect(row('Item 0').getBoundingClientRect().top).toBeGreaterThanOrEqual(rect.top)
    })

    it('should shift the whole sheet up from the bottom edge and keep the screen margin', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>(0)
      const host = menu(values(4), { selected })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '120px', bottom: '8px' })
      await settle()

      await show(host)
      await frames()

      const rect = sheet().getBoundingClientRect()

      expect(Math.round(rect.bottom)).toBe(document.documentElement.clientHeight - 16)
    })

    it('should scroll a long sheet so the selected row sits over the trigger', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>(30)
      const host = menu(values(40), { selected })
      Object.assign(host.style, { position: 'fixed', padding: '0', left: '120px', top: '50%' })
      await settle()

      await show(host)
      await frames()

      const el = sheet()
      const rect = el.getBoundingClientRect()
      const item = row('Item 30').getBoundingClientRect()

      expect(el.scrollHeight).toBeGreaterThan(el.clientHeight)
      expect(el.scrollTop).toBeGreaterThan(0)
      expect(item.top).toBeGreaterThanOrEqual(rect.top)
      expect(item.bottom).toBeLessThanOrEqual(rect.bottom)
      expect(Math.abs(center(item) - center(trigger(host).getBoundingClientRect()))).toBeLessThanOrEqual(1)
      expect(rect.top).toBeGreaterThanOrEqual(16)
      expect(rect.bottom).toBeLessThanOrEqual(document.documentElement.clientHeight - 16)
    })

    it('should open below the trigger when no row is selected', async () => {
      const selected = shallowRef<unknown>('none')
      const host = menu(values(4), { selected })
      await settle()

      await show(host)
      await frames()

      expect(Math.round(sheet().getBoundingClientRect().top)).toBe(Math.round(trigger(host).getBoundingClientRect().bottom))
    })

    it('should keep a cascading sub menu beside its row when it holds the selected value', async () => {
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>('b')
      const host = menu(() => [
        h(Md1MenuItem, null, () => 'Refresh'),
        h(Md1MenuSub, { label: 'Size' }, () => [
          h(Md1MenuItem, { value: 'a' }, () => 'Small'),
          h(Md1MenuItem, { value: 'b' }, () => 'Large'),
        ]),
      ], { selected, props: { desktop: true } })
      await settle()

      await show(host)
      await userEvent.hover(row('Size'))

      function sub (): HTMLElement {
        return document.querySelector<HTMLElement>('.md1-menu[data-sub]')!
      }

      await expect.poll(() => sub().matches(':popover-open')).toBe(true)
      await frames()

      const parent = row('Size').getBoundingClientRect()

      expect(Math.round(sub().getBoundingClientRect().left)).toBeGreaterThanOrEqual(Math.round(parent.right) - 1)
    })
  })

  describe('selected item over a list row', () => {
    afterEach(async () => {
      await page.viewport(1280, 800)
    })

    /** A two-line settings row that emits a simple menu, the menu riding in a row of its own. */
    function setting (selected: ShallowRef<unknown>): HTMLElement {
      return mount(() => h(Md1List, { lines: 2 }, () => [
        h(Md1Menu, {
          'selected': selected.value,
          'onUpdate:selected': (value: unknown) => {
            selected.value = value
          },
        }, () => [
          h(Md1Menu.Activator, null, {
            default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1List.Item, attrs, () => [
              h(Md1List.Content, null, () => [
                h(Md1List.Primary, null, () => 'Phone ringtone'),
                h(Md1List.Secondary, null, () => String(selected.value)),
              ]),
            ]),
          }),
          h('li', { role: 'none' }, [
            h(Md1Menu.Content, null, () => ['Ariel', 'Beebeep', 'Luna'].map(name => h(Md1MenuItem, { value: name }, () => name))),
          ]),
        ]),
      ]))
    }

    async function offset (width: number): Promise<number> {
      await page.viewport(width, 800)
      document.body.dataset.reducedMotion = 'reduce'
      const selected = shallowRef<unknown>('Beebeep')
      const host = setting(selected)
      await settle()

      await userEvent.click(host.querySelector<HTMLElement>('.md1-list__tile')!)
      await expect.poll(() => sheet()?.matches(':popover-open')).toBe(true)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const label = row('Beebeep').querySelector('.md1-menu__label')!.getBoundingClientRect()
      const text = host.querySelector('.md1-list__primary')!.getBoundingClientRect()

      return Math.round(label.left - text.left)
    }

    it('should line the selected label up with the row text on the 16 dp handset keyline', async () => {
      expect(await offset(412)).toBe(0)
    })

    it('should line the selected label up with the row text on the 24 dp keyline from 600 px', async () => {
      expect(await offset(768)).toBe(0)
    })
  })

  describe('orphans', () => {
    it('should warn once in dev for a divider outside Md1Menu', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1MenuDivider))

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1MenuDivider'))
    })

    it('should warn once in dev for a subheader outside Md1Menu', () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1MenuSubheader, null, () => 'Recent'))

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1MenuSubheader'))
    })

    it('should warn for an item inside a bare v0 menu and still render it', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Menu.Root, { modelValue: 'layer', value: 'layer' }, () => [
        h(Menu.Content, { eager: true }, () => [h(Md1MenuItem, null, () => 'Stray')]),
      ]))
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1MenuItem'))
      expect(row('Stray').getAttribute('role')).toBe('menuitem')
    })

    it('should stay silent when every part sits inside Md1Menu', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = menu(() => [
        h(Md1MenuSubheader, null, () => 'Group'),
        h(Md1MenuItem, null, () => 'One'),
        h(Md1MenuDivider),
        h(Md1MenuCheckItem, null, () => 'Two'),
        h(Md1MenuSub, { label: 'More' }, () => [h(Md1MenuItem, null, () => 'Three')]),
      ])
      await settle()

      await show(host)

      expect(spy).toHaveBeenCalledTimes(0)
    })
  })
})

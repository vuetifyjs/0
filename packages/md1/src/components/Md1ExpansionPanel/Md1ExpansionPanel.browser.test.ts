import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { ExpansionPanel } from '@vuetify/v0'

// Components
import { Md1ExpansionPanel, Md1ExpansionPanelActions, Md1ExpansionPanelContent, Md1ExpansionPanelHeader, Md1ExpansionPanelItem } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1ExpansionPanelHeaderProps } from './Md1ExpansionPanelHeader.vue'
import type { App, Component, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

/** Vuetify 1.5's pixel recipe for the 8 dp level: the expanded panel (lead decision 4). */
const ELEVATION_3 = '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)'
const ELEVATION_1 = '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'

interface Panel extends Partial<Md1ExpansionPanelHeaderProps> {
  value: string
  disabled?: boolean
  body?: string
  actions?: boolean
}

const PANELS: Panel[] = [
  { value: 'trip', label: 'Trip name', summary: 'Caribbean cruise' },
  { value: 'location', label: 'Location', summary: 'Barbados' },
  { value: 'meals', label: 'Meal preferences', secondary: 'Optional' },
]

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  host.style.width = '640px'
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

function item (panel: Panel, namespace?: string): VNode {
  const { value, disabled, body = 'Body', actions, ...header } = panel

  return h(Md1ExpansionPanel.Item, { value, disabled, namespace }, () => [
    h(Md1ExpansionPanel.Header, { label: 'Label', ...header, namespace }),
    h(Md1ExpansionPanel.Content, { namespace }, () => [
      body,
      actions
        ? h(Md1ExpansionPanel.Actions, () => [h('button', { class: 'cancel' }, 'Cancel'), h('button', { class: 'save' }, 'Save')])
        : null,
    ]),
  ])
}

function panels (props: Record<string, unknown> = {}, list: Panel[] = PANELS, setup?: (app: App) => void): HTMLElement {
  const host = mount(() => h(Md1ExpansionPanel, props, () => list.map(panel => item(panel))), setup)
  return host.querySelector<HTMLElement>('.md1-expansion-panel')!
}

function items (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.md1-expansion-panel__item')]
}

function headers (root: ParentNode): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('button.md1-expansion-panel__header')]
}

function contents (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.md1-expansion-panel__content')]
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The adapter's foundations and both theme blocks, as `dist/theme.css` ships them. */
function theme () {
  style(new Md1StyleSheetAdapter().generate({
    'md1-light': md1Colors,
    'md1-dark': md1DarkColors,
  }))
}

/** The browser's own serialization of a value, so assertions never guess at colour, shadow or transform formatting. */
function serialize (property: 'backgroundColor' | 'boxShadow' | 'transform', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

/** The stylesheet rule whose selector is exactly `selector` outside every @media block. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

function down (el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + 10,
    clientY: rect.top + 10,
    pointerType: 'mouse',
  }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
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

describe('quExpansionPanel', () => {
  describe('anatomy', () => {
    it('should attach every part to the root and keep the flat names', () => {
      expect(Md1ExpansionPanel.Item).toBe(Md1ExpansionPanelItem)
      expect(Md1ExpansionPanel.Header).toBe(Md1ExpansionPanelHeader)
      expect(Md1ExpansionPanel.Content).toBe(Md1ExpansionPanelContent)
      expect(Md1ExpansionPanel.Actions).toBe(Md1ExpansionPanelActions)
    })

    it('should render div > div.item > [h3 > button.header, div.content[role=region]]', async () => {
      const root = panels()
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(items(root).length).toBe(3)

      const [first] = items(root)
      const heading = first.firstElementChild as HTMLElement
      const button = heading.firstElementChild as HTMLButtonElement
      const region = first.lastElementChild as HTMLElement

      expect(first.parentElement).toBe(root)
      expect(heading.tagName).toBe('H3')
      expect(heading.classList.contains('md1-expansion-panel__heading')).toBe(true)
      expect(button.tagName).toBe('BUTTON')
      expect(button.type).toBe('button')
      expect(button.classList.contains('md1-expansion-panel__header')).toBe(true)
      expect(region.classList.contains('md1-expansion-panel__content')).toBe(true)
      expect(region.getAttribute('role')).toBe('region')
    })

    it('should host the ripple as the first child of the header and position the header for it', async () => {
      const root = panels()
      await settle()

      const button = headers(root)[0]
      const ripple = button.firstElementChild!

      expect(ripple.classList.contains('md1-ripple')).toBe(true)
      expect(ripple.getAttribute('aria-hidden')).toBe('true')
      expect(getComputedStyle(button).position).toBe('relative')
    })

    it('should wire the header and the region to each other', async () => {
      const root = panels()
      await settle()

      const [button] = headers(root)
      const [region] = contents(root)

      expect(button.id).not.toBe('')
      expect(region.id).not.toBe('')
      expect(button.getAttribute('aria-controls')).toBe(region.id)
      expect(region.getAttribute('aria-labelledby')).toBe(button.id)
      expect(button.getAttribute('aria-expanded')).toBe('false')
    })

    it('should render the label, the secondary line and the summary column in that order', async () => {
      const root = panels({}, [{ value: 'a', label: 'Start date', secondary: 'Required', summary: 'Feb 29, 2016' }])
      await settle()

      const [button] = headers(root)

      expect(button.querySelector('.md1-expansion-panel__label')!.textContent).toBe('Start date')
      expect(button.querySelector('.md1-expansion-panel__secondary')!.textContent).toBe('Required')
      expect(button.querySelector('.md1-expansion-panel__summary')!.textContent).toBe('Feb 29, 2016')
    })

    it('should leave out the secondary line and the summary column when neither is given', async () => {
      const root = panels({}, [{ value: 'a', label: 'Trip name' }])
      await settle()

      const [button] = headers(root)

      expect(button.querySelector('.md1-expansion-panel__secondary')).toBeNull()
      expect(button.querySelector('.md1-expansion-panel__summary')).toBeNull()
    })

    it('should let the default slot replace the summary string', async () => {
      const host = mount(() => h(Md1ExpansionPanel, () => [
        h(Md1ExpansionPanel.Item, { value: 'a' }, () => [
          h(Md1ExpansionPanel.Header, { label: 'Dates', summary: 'ignored' }, () => [h('span', { class: 'start' }, 'Feb 29'), h('span', { class: 'end' }, 'Not set')]),
          h(Md1ExpansionPanel.Content, () => 'Body'),
        ]),
      ]))
      await settle()

      const summary = host.querySelector('.md1-expansion-panel__summary')!

      expect(summary.querySelector('.start')!.textContent).toBe('Feb 29')
      expect(summary.querySelector('.end')!.textContent).toBe('Not set')
      expect(summary.textContent).not.toContain('ignored')
    })

    it('should draw the expand-more glyph through Md1Icon inside an aria-hidden cue', async () => {
      const root = panels()
      await settle()

      const cue = headers(root)[0].querySelector<HTMLElement>('.md1-expansion-panel__cue')!
      const svg = cue.querySelector('svg')!

      expect(cue.getAttribute('aria-hidden')).toBe('true')
      expect(svg.classList.contains('md1-icon')).toBe(true)
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['expand-more'])
      expect(cue.getBoundingClientRect().width).toBe(24)
      expect(cue.getBoundingClientRect().height).toBe(24)
    })
  })

  describe('metrics', () => {
    it('should measure the collapsed row at 48 dp with 24 dp side padding', async () => {
      theme()
      const root = panels()
      await settle()

      const [button] = headers(root)
      const computed = getComputedStyle(button)

      expect(button.getBoundingClientRect().height).toBe(48)
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('24px')
    })

    it('should grow the expanded header to 64 dp', async () => {
      theme()
      const root = panels({ modelValue: 'trip' })
      await settle()

      const [open, closed] = headers(root)

      expect(open.getBoundingClientRect().height).toBe(64)
      expect(closed.getBoundingClientRect().height).toBe(48)
    })

    it('should centre the label and the expand icon on one line in the 64 dp expanded header', async () => {
      theme()
      const root = panels({ modelValue: 'trip' })
      await settle()

      const [button] = headers(root)
      const label = button.querySelector('.md1-expansion-panel__label')!.getBoundingClientRect()
      const cue = button.querySelector('.md1-expansion-panel__cue')!.getBoundingClientRect()
      const rect = button.getBoundingClientRect()

      expect(label.top + label.height / 2).toBe(rect.top + rect.height / 2)
      expect(cue.top + cue.height / 2).toBe(rect.top + rect.height / 2)
    })

    it('should grow a row with a secondary line to the 64 dp two-line row', async () => {
      theme()
      const root = panels({}, [{ value: 'meals', label: 'Meal preferences', secondary: 'Optional' }])
      await settle()

      expect(headers(root)[0].getBoundingClientRect().height).toBe(64)
    })

    it('should set the label in Subheading, 15 sp Regular at 87% under a fine pointer', async () => {
      theme()
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const root = panels()
      await settle()

      const label = getComputedStyle(root.querySelector('.md1-expansion-panel__label')!)

      expect(label.fontFamily).toContain('Roboto')
      expect(label.fontSize).toBe('15px')
      expect(label.fontWeight).toBe('400')
      expect(label.color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should keep the 16 sp handset label of the 2016 revision as the stylesheet fallback', async () => {
      panels()
      await settle()

      const sheet = rule('.md1-expansion-panel__label')

      expect(sheet).toBeDefined()
      expect(sheet!.style.fontSize).toBe('var(--md1-type-subheading-size, 16px)')
    })

    it('should set the secondary line in Caption, 12 sp at 54%, and the summary in secondary ink', async () => {
      theme()
      const root = panels({}, [{ value: 'a', label: 'Start date', secondary: 'Optional', summary: 'Feb 29, 2016' }])
      await settle()

      const secondary = getComputedStyle(root.querySelector('.md1-expansion-panel__secondary')!)
      const summary = getComputedStyle(root.querySelector('.md1-expansion-panel__summary')!)

      expect(secondary.fontSize).toBe('12px')
      expect(secondary.fontWeight).toBe('400')
      expect(secondary.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(summary.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(summary.fontSize).toBe('15px')
    })

    it('should put 16 dp between the label, value and icon columns and the icon 24 dp from the edge', async () => {
      theme()
      const root = panels({}, [{ value: 'a', label: 'Trip name', summary: 'Caribbean cruise' }])
      await settle()

      const [button] = headers(root)
      const text = button.querySelector('.md1-expansion-panel__text')!.getBoundingClientRect()
      const summary = button.querySelector('.md1-expansion-panel__summary')!.getBoundingClientRect()
      const cue = button.querySelector('.md1-expansion-panel__cue')!.getBoundingClientRect()
      const rect = button.getBoundingClientRect()

      expect(summary.left - text.right).toBe(16)
      expect(cue.left - summary.right).toBe(16)
      expect(rect.right - cue.right).toBe(24)
    })

    it('should pad the body 24 dp at the sides and 16 dp below', async () => {
      const root = panels({ modelValue: 'trip' })
      await settle()

      const body = getComputedStyle(root.querySelector('.md1-expansion-panel__body')!)

      expect(body.paddingLeft).toBe('24px')
      expect(body.paddingRight).toBe('24px')
      expect(body.paddingBottom).toBe('16px')
      expect(body.paddingTop).toBe('0px')
    })
  })

  describe('surface', () => {
    it('should paint each panel on the white card surface with 1 dp 12% dividers between them', async () => {
      const root = panels()
      await settle()

      const [first, second, third] = items(root)

      expect(getComputedStyle(first).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(first).borderTopWidth).toBe('0px')
      expect(getComputedStyle(second).borderTopWidth).toBe('1px')
      expect(getComputedStyle(second).borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(getComputedStyle(third).borderTopWidth).toBe('1px')
    })

    it('should round the card corners at the ends of the stack only', async () => {
      const root = panels()
      await settle()

      const [first, second, third] = items(root)

      expect(getComputedStyle(first).borderTopLeftRadius).toBe('2px')
      expect(getComputedStyle(first).borderBottomLeftRadius).toBe('0px')
      expect(getComputedStyle(second).borderTopLeftRadius).toBe('0px')
      expect(getComputedStyle(second).borderBottomLeftRadius).toBe('0px')
      expect(getComputedStyle(third).borderBottomRightRadius).toBe('2px')
    })

    it('should rest the stack seamed at 0 dp under a fine pointer', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const root = panels()
      await settle()

      for (const el of items(root)) {
        expect(getComputedStyle(el).boxShadow).toBe('none')
      }
    })

    it('should rest the stack at Vuetify 1.5\'s 1 dp outside the fine-pointer rule', async () => {
      panels()
      await settle()

      const sheet = rule('.md1-expansion-panel__item')

      expect(sheet).toBeDefined()
      expect(sheet!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-1, ${ELEVATION_1})`)
    })

    it('should clip the upward shadow only where a sheet continues the one above it', async () => {
      const root = panels({ modelValue: 'trip' })
      await settle()

      const [first, second, third] = items(root)

      expect(getComputedStyle(first).clipPath).toBe('none')
      // The sheet after the expanded panel starts a card of its own, so its top edge casts again.
      expect(getComputedStyle(second).clipPath).toBe('none')
      expect(getComputedStyle(third).clipPath).toBe('inset(0px -24px -24px)')
    })

    it('should detach the expanded panel 16 dp from its neighbours and lift it to 3 dp', async () => {
      const root = panels({ modelValue: 'location' })
      await settle()

      const [first, second, third] = items(root)
      const a = first.getBoundingClientRect()
      const b = second.getBoundingClientRect()
      const c = third.getBoundingClientRect()

      expect(b.top - a.bottom).toBe(16)
      expect(c.top - b.bottom).toBe(16)
      expect(getComputedStyle(second).boxShadow).toBe(serialize('boxShadow', ELEVATION_3))
      // The dividers either side go transparent but keep their 1 px, so the toggle never shifts layout.
      expect(getComputedStyle(second).borderTopWidth).toBe('1px')
      expect(getComputedStyle(second).borderTopColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(third).borderTopWidth).toBe('1px')
      expect(getComputedStyle(third).borderTopColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(second).borderTopLeftRadius).toBe('2px')
      expect(getComputedStyle(second).borderBottomLeftRadius).toBe('2px')
      // The neighbours close their own sheets with the card corners.
      expect(getComputedStyle(first).borderBottomLeftRadius).toBe('2px')
      expect(getComputedStyle(third).borderTopLeftRadius).toBe('2px')
    })

    it('should keep every divider width when a panel expands and collapses, so the toggle snaps no layout', async () => {
      const root = panels()
      await settle()

      const widths = () => items(root).map(el => getComputedStyle(el).borderTopWidth)
      const rest = widths()

      await userEvent.click(headers(root)[1])
      await settle()

      expect(widths()).toEqual(rest)

      await userEvent.click(headers(root)[1])
      await settle()

      expect(widths()).toEqual(rest)
    })

    it('should keep an expanded panel at the ends of the stack in place', async () => {
      const root = panels({ modelValue: 'trip' })
      await settle()

      const [first, second] = items(root)

      expect(getComputedStyle(first).marginTop).toBe('0px')
      expect(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom).toBe(16)
    })

    it('should collapse the gap between two adjacent expanded panels to one 16 dp', async () => {
      const root = panels({ multiple: true, modelValue: ['trip', 'location'] })
      await settle()

      const [first, second] = items(root)

      expect(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom).toBe(16)
    })
  })

  describe('states', () => {
    it('should expose data-selected on the item and data-state on the header and the cue', async () => {
      const root = panels()
      await settle()

      const [first] = items(root)
      const [button] = headers(root)
      const cue = button.querySelector<HTMLElement>('.md1-expansion-panel__cue')!

      expect(Object.hasOwn(first.dataset, 'selected')).toBe(false)
      expect(button.dataset.state).toBe('closed')
      expect(cue.dataset.state).toBe('closed')

      await userEvent.click(button)
      await settle()

      expect(first.dataset.selected).toBe('true')
      expect(button.dataset.state).toBe('open')
      expect(cue.dataset.state).toBe('open')
      expect(button.getAttribute('aria-expanded')).toBe('true')
    })

    it('should show the region only while expanded', async () => {
      const root = panels()
      await settle()

      const [region] = contents(root)

      expect(region.hidden).toBe(true)
      expect(getComputedStyle(region).display).toBe('none')

      await userEvent.click(headers(root)[0])
      await settle()

      expect(region.hidden).toBe(false)
      expect(getComputedStyle(region).display).toBe('grid')
      expect(region.textContent).toContain('Body')
    })

    it('should close the region track to 0 px, with no padding floor that snaps away when the display switch lands', async () => {
      const root = panels({ modelValue: 'trip' }, [{ value: 'trip', label: 'Trip name', actions: true }])
      await settle()

      const [region] = contents(root)

      // Pin the frame the close transition ends on: the track at 0fr, still displayed.
      region.style.transition = 'none'
      region.style.gridTemplateRows = '0fr'

      expect(getComputedStyle(region).display).toBe('grid')
      expect(region.getBoundingClientRect().height).toBe(0)
    })

    it('should point the expand icon down at rest and up when expanded', async () => {
      const root = panels({ modelValue: 'trip' })
      await settle()

      const [open, closed] = headers(root).map(el => el.querySelector<HTMLElement>('.md1-expansion-panel__cue')!)

      expect(getComputedStyle(closed).transform).toBe('none')
      expect(getComputedStyle(open).transform).toBe(serialize('transform', 'rotate(180deg)'))
    })

    it('should ink the expand icon at 38% at rest and 54% on hover', async () => {
      const root = panels()
      await settle()

      const [button] = headers(root)
      const cue = button.querySelector<HTMLElement>('.md1-expansion-panel__cue')!

      expect(getComputedStyle(cue).color).toBe('rgba(0, 0, 0, 0.38)')

      await userEvent.hover(button)

      await expect.poll(() => getComputedStyle(cue).color).toBe('rgba(0, 0, 0, 0.54)')

      await userEvent.unhover(button)

      await expect.poll(() => getComputedStyle(cue).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should fill the keyboard-focused header with Grey 200 and not a clicked one', async () => {
      const root = panels()
      await settle()

      const [button] = headers(root)

      await userEvent.tab()

      expect(document.activeElement).toBe(button)
      expect(button.matches(':focus-visible')).toBe(true)
      // Grey 200 (#EEEEEE), the expansion-panels page's focus fill.
      await expect.poll(() => getComputedStyle(button).backgroundColor).toBe('rgb(238, 238, 238)')

      await userEvent.click(document.body)
      await userEvent.click(button)

      expect(button.matches(':focus-visible')).toBe(false)
      await expect.poll(() => getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should draw the pressed ink on the header', async () => {
      const root = panels()
      await settle()

      const [button] = headers(root)

      down(button)
      await settle()

      expect(inks(button).length).toBe(1)
    })

    it('should disable one item: native disabled, data-disabled on the item and the header, no toggle, no ink', async () => {
      const root = panels({}, [
        { value: 'a', label: 'Open' },
        { value: 'b', label: 'Locked', disabled: true },
      ])
      await settle()

      const [, locked] = items(root)
      const [, button] = headers(root)

      expect(locked.dataset.disabled).toBe('true')
      expect(button.dataset.disabled).toBe('true')
      expect(button.disabled).toBe(true)
      expect(Object.hasOwn(items(root)[0].dataset, 'disabled')).toBe(false)

      button.click()
      down(button)
      await settle()

      expect(Object.hasOwn(locked.dataset, 'selected')).toBe(false)
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(inks(button).length).toBe(0)

      const label = getComputedStyle(button.querySelector('.md1-expansion-panel__label')!)
      const cue = getComputedStyle(button.querySelector('.md1-expansion-panel__cue')!)

      expect(label.color).toBe('rgba(0, 0, 0, 0.38)')
      expect(cue.color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(button).pointerEvents).toBe('none')
    })

    it('should skip a disabled header in the tab order', async () => {
      const root = panels({}, [
        { value: 'a', label: 'One' },
        { value: 'b', label: 'Two', disabled: true },
        { value: 'c', label: 'Three' },
      ])
      await settle()

      const [one, , three] = headers(root)

      await userEvent.tab()

      expect(document.activeElement).toBe(one)

      await userEvent.tab()

      expect(document.activeElement).toBe(three)
    })

    it('should disable every item from the root', async () => {
      const root = panels({ disabled: true })
      await settle()

      for (const el of items(root)) {
        expect(el.dataset.disabled).toBe('true')
      }

      for (const button of headers(root)) {
        expect(button.disabled).toBe(true)
        button.click()
      }

      await settle()

      expect(items(root).some(el => Object.hasOwn(el.dataset, 'selected'))).toBe(false)
    })
  })

  describe('interaction', () => {
    it('should open one panel at a time by default', async () => {
      const root = panels()
      await settle()

      const [a, b] = headers(root)
      const [first, second] = items(root)

      await userEvent.click(a)
      await settle()

      expect(first.dataset.selected).toBe('true')

      await userEvent.click(b)
      await settle()

      expect(Object.hasOwn(first.dataset, 'selected')).toBe(false)
      expect(second.dataset.selected).toBe('true')

      await userEvent.click(b)
      await settle()

      expect(Object.hasOwn(second.dataset, 'selected')).toBe(false)
    })

    it('should keep several panels open under multiple', async () => {
      const root = panels({ multiple: true })
      await settle()

      const [a, b] = headers(root)

      await userEvent.click(a)
      await userEvent.click(b)
      await settle()

      expect(items(root).filter(el => el.dataset.selected === 'true').length).toBe(2)
    })

    it('should round-trip v-model in single mode', async () => {
      const model = shallowRef<unknown>('location')
      const host = mount(() => h(Md1ExpansionPanel, {
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value
        },
      }, () => PANELS.map(panel => item(panel))))
      await settle()

      expect(items(host)[1].dataset.selected).toBe('true')

      await userEvent.click(headers(host)[0])
      await settle()

      expect(model.value).toBe('trip')

      model.value = 'meals'
      await settle()

      expect(items(host)[2].dataset.selected).toBe('true')
      expect(Object.hasOwn(items(host)[0].dataset, 'selected')).toBe(false)
    })

    it('should round-trip v-model as an array under multiple', async () => {
      const model = shallowRef<unknown>([])
      const host = mount(() => h(Md1ExpansionPanel, {
        'multiple': true,
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value
        },
      }, () => PANELS.map(panel => item(panel))))
      await settle()

      await userEvent.click(headers(host)[0])
      await userEvent.click(headers(host)[2])
      await settle()

      expect(model.value).toEqual(['trip', 'meals'])
    })

    it('should toggle on Enter and on Space, the Accordion keys', async () => {
      const root = panels()
      await settle()

      const [button] = headers(root)

      button.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(button.getAttribute('aria-expanded')).toBe('true')

      await userEvent.keyboard(' ')
      await settle()

      expect(button.getAttribute('aria-expanded')).toBe('false')
    })

    it('should traverse the headers with Tab, the guidelines keyboard path', async () => {
      const root = panels()
      await settle()

      const list = headers(root)

      for (const button of list) {
        await userEvent.tab()

        expect(document.activeElement).toBe(button)
      }
    })

    it('should chain a consumer click listener after the toggle', async () => {
      let clicks = 0
      const host = mount(() => h(Md1ExpansionPanel, () => [
        h(Md1ExpansionPanel.Item, { value: 'a' }, () => [
          h(Md1ExpansionPanel.Header, { label: 'One', onClick: () => clicks++ }),
          h(Md1ExpansionPanel.Content, () => 'Body'),
        ]),
      ]))
      await settle()

      await userEvent.click(headers(host)[0])
      await settle()

      expect(clicks).toBe(1)
      expect(items(host)[0].dataset.selected).toBe('true')
    })

    it('should keep a nested panel under its own namespace apart from the outer one', async () => {
      const host = mount(() => h(Md1ExpansionPanel, () => [
        h(Md1ExpansionPanel.Item, { value: 'outer' }, () => [
          h(Md1ExpansionPanel.Header, { label: 'Outer' }),
          h(Md1ExpansionPanel.Content, () => [
            h(Md1ExpansionPanel, { namespace: 'md1:inner' }, () => [item({ value: 'inner', label: 'Inner' }, 'md1:inner')]),
          ]),
        ]),
      ]))
      await settle()

      const [outer, inner] = headers(host)

      await userEvent.click(outer)
      await settle()
      await userEvent.click(inner)
      await settle()

      const [outerItem, innerItem] = items(host)

      expect(outerItem.dataset.selected).toBe('true')
      expect(innerItem.dataset.selected).toBe('true')
      expect(inner.getAttribute('aria-controls')).not.toBe(outer.getAttribute('aria-controls'))
    })
  })

  describe('actions', () => {
    it('should lay the CANCEL and SAVE row at the end below a full-width divider', async () => {
      const root = panels({ modelValue: 'trip' }, [{ value: 'trip', label: 'Trip name', actions: true }])
      await settle()

      const [panel] = items(root)
      const row = root.querySelector<HTMLElement>('.md1-expansion-panel__actions')!
      const computed = getComputedStyle(row)
      const rect = row.getBoundingClientRect()
      const sheet = panel.getBoundingClientRect()

      expect(computed.display).toBe('flex')
      expect(computed.justifyContent).toBe('flex-end')
      expect(computed.columnGap).toBe('8px')
      expect(computed.borderTopWidth).toBe('1px')
      expect(computed.borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.paddingTop).toBe('16px')
      expect(computed.paddingBottom).toBe('16px')
      expect(computed.paddingRight).toBe('8px')
      // The divider spans the sheet and the row sits on its bottom edge.
      expect(rect.left).toBe(sheet.left)
      expect(rect.right).toBe(sheet.right)
      expect(rect.bottom).toBe(sheet.bottom)
      expect(row.querySelector('.cancel')!.nextElementSibling!.classList.contains('save')).toBe(true)
    })

    it('should emit nothing and leave the buttons to the consumer', async () => {
      let saves = 0
      const host = mount(() => h(Md1ExpansionPanel, { modelValue: 'a' }, () => [
        h(Md1ExpansionPanel.Item, { value: 'a' }, () => [
          h(Md1ExpansionPanel.Header, { label: 'One' }),
          h(Md1ExpansionPanel.Content, () => [
            h(Md1ExpansionPanel.Actions, () => [h('button', { onClick: () => saves++ }, 'Save')]),
          ]),
        ]),
      ]))
      await settle()

      await userEvent.click(host.querySelector('.md1-expansion-panel__actions button')!)
      await settle()

      expect(saves).toBe(1)
      // Pressing an action does not collapse the panel: that is the consumer's call.
      expect(items(host)[0].dataset.selected).toBe('true')
    })
  })

  describe('context', () => {
    it('should not warn when every part is nested', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      panels({ modelValue: 'trip' }, [{ value: 'trip', label: 'Trip', actions: true }])
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn once for an item inside a bare v0 group and still work', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // A generic SFC; the cast reaches h()'s component overload.
      const host = mount(() => h(ExpansionPanel.Group as Component, () => [item({ value: 'a', label: 'One' })]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1ExpansionPanelItem] rendered outside <Md1ExpansionPanel>'))

      await userEvent.click(headers(host)[0])
      await settle()

      expect(items(host)[0].dataset.selected).toBe('true')
    })

    it('should warn once for actions outside the compound and still render them', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1ExpansionPanelActions, () => h('button', 'Save')))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1ExpansionPanelActions] rendered outside <Md1ExpansionPanel>'))
      expect(host.querySelector('.md1-expansion-panel__actions button')).not.toBeNull()
    })

    it('should throw for a header outside an item, as the v0 part it composes does', async () => {
      const errors: unknown[] = []

      mount(() => h(Md1ExpansionPanelHeader, { label: 'Orphan' }), app => {
        app.config.errorHandler = error => {
          errors.push(error)
        }
      })
      await settle()

      expect(errors.length).toBeGreaterThan(0)
      expect(String(errors[0])).toContain('v0:expansion-panel')
    })
  })

  describe('theme', () => {
    it('should take its ink and surface from the adapter sheet in both themes', async () => {
      theme()

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1ExpansionPanel, () => PANELS.slice(0, 2).map(panel => item(panel)))]),
        h('div', { 'data-theme': 'md1-dark' }, [h(Md1ExpansionPanel, () => PANELS.slice(0, 2).map(panel => item(panel)))]),
      ]))
      await settle()

      const [, , dark, darker] = items(host)
      const button = headers(host)[2]

      expect(getComputedStyle(items(host)[0]).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(darker).borderTopColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(button.querySelector('.md1-expansion-panel__label')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(button.querySelector('.md1-expansion-panel__summary')!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(button.querySelector('.md1-expansion-panel__cue')!).color).toBe('rgba(255, 255, 255, 0.5)')
    })

    it('should fill the dark focused header with Vuetify 1.5\'s #494949', async () => {
      theme()

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [h(Md1ExpansionPanel, () => [item(PANELS[0])])]))
      await settle()

      const [button] = headers(host)

      await userEvent.tab()

      expect(document.activeElement).toBe(button)
      await expect.poll(() => getComputedStyle(button).backgroundColor).toBe('rgb(73, 73, 73)')
    })
  })
})

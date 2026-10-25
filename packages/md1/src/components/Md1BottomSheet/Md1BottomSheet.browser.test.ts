import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, createStackPlugin } from '@vuetify/v0'

import { Md1BottomSheet, Md1BottomSheetActivator, Md1BottomSheetItem, Md1BottomSheetTitle } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1BottomSheetSlotProps } from './Md1BottomSheet.vue'
import type { Md1BottomSheetActivatorSlotProps } from './Md1BottomSheetActivator.vue'
import type { ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
import { Md1Button } from '../Md1Button'
import { Md1Divider } from '../Md1Divider'

/** Vuetify 1.5's pixel recipes for the 16 dp and 14 dp levels (spec/elevation.md). */
const ELEVATION_16 = '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)'
const ELEVATION_14 = '0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

interface Options {
  open?: ShallowRef<boolean>
  expanded?: ShallowRef<boolean>
  props?: Record<string, unknown>
  /** Keep the motion: off by default so geometry reads the landed state. */
  motion?: boolean
}

function mount (node: () => VNode | VNode[], motion = false): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
  app.use(createReducedMotionPlugin({ mode: motion ? 'never' : 'always' }))
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

function activator (label = 'Share') {
  return h(Md1BottomSheet.Activator, null, {
    default: ({ attrs }: Md1BottomSheetActivatorSlotProps) => h(Md1Button, { ...attrs, id: 'trigger' }, () => label),
  })
}

function sheet (children: (props: Md1BottomSheetSlotProps) => (VNode | string)[], options: Options = {}): HTMLElement {
  const open = options.open ?? shallowRef(false)
  const expanded = options.expanded ?? shallowRef(false)

  return mount(() => h(Md1BottomSheet, {
    ...options.props,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
    'expanded': expanded.value,
    // vue-tsc types the named model's listener argument as unknown; Md1Menu's `checked` test does the same.
    'onUpdate:expanded': (value: unknown) => {
      expanded.value = Boolean(value)
    },
  }, { default: children }), options.motion)
}

/** The share sheet the page draws: a header and three actions. */
function share (options: Options = {}, onEmail?: () => void): HTMLElement {
  return sheet(() => [
    activator(),
    h(Md1BottomSheet.Title, null, () => 'Share with'),
    h(Md1BottomSheet.Item, { icon: 'email', onClick: onEmail }, () => 'Email'),
    h(Md1BottomSheet.Item, { icon: 'link' }, () => 'Copy link'),
    h(Md1BottomSheet.Item, { icon: 'phone', disabled: true }, () => 'Message'),
  ], options)
}

function dialog (host: HTMLElement): HTMLDialogElement {
  return host.querySelector('dialog')!
}

function items (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.md1-bottom-sheet__item')]
}

function aside (): HTMLElement | null {
  return document.querySelector('aside.md1-bottom-sheet')
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

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** A press outside the sheet: pointerdown and pointerup on the backdrop, the `<dialog>` itself. */
function backdrop (el: HTMLElement) {
  for (const type of ['pointerdown', 'pointerup']) {
    el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, clientX: 4, clientY: 4 }))
  }
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
  await page.viewport(414, 896)
})

describe('quBottomSheet', () => {
  describe('modal', () => {
    it('should render the activator outside a closed native dialog holding the content', async () => {
      const host = share()
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('#trigger')!
      const el = dialog(host)

      expect(el.contains(trigger)).toBe(false)
      expect(el.open).toBe(false)
      expect(el.classList.contains('md1-bottom-sheet')).toBe(true)
      expect(el.dataset.layout).toBe('list')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'persistent')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(false)
      expect(el.firstElementChild!.classList.contains('md1-bottom-sheet__content')).toBe(true)
      expect(items(el).length).toBe(3)
      expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('should open from the activator as a labelled modal dialog and move focus inside', async () => {
      const open = shallowRef(false)
      const host = share({ open })
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('#trigger')!

      await userEvent.click(trigger)
      await settle()

      const el = dialog(host)
      const title = el.querySelector<HTMLElement>('.md1-bottom-sheet__title')!

      expect(open.value).toBe(true)
      expect(el.open).toBe(true)
      expect(el.matches(':modal')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)
      expect(el.getAttribute('role')).toBe('dialog')
      expect(el.getAttribute('aria-modal')).toBe('true')
      expect(title.tagName).toBe('H2')
      expect(el.getAttribute('aria-labelledby')).toBe(title.id)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(el.contains(document.activeElement)).toBe(true)
    })

    it('should land consumer attributes on the dialog element', async () => {
      const host = sheet(() => [h(Md1BottomSheet.Item, null, () => 'One')], { props: { 'aria-label': 'Actions', 'class': 'mine' } })
      await settle()

      const el = dialog(host)

      expect(el.getAttribute('aria-label')).toBe('Actions')
      expect(el.classList.contains('mine')).toBe(true)
      expect(el.classList.contains('md1-bottom-sheet')).toBe(true)
    })

    it('should sit square against the bottom edge, full width, on the surface at 16 sp primary ink', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      const el = dialog(host)
      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(rect.left).toBe(0)
      expect(rect.width).toBe(window.innerWidth)
      expect(rect.bottom).toBe(window.innerHeight)
      expect(computed.borderRadius).toBe('0px')
      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(computed.fontFamily).toContain('Roboto')
    })

    it('should paint the 20% black scrim through ::backdrop', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      expect(getComputedStyle(dialog(host), '::backdrop').backgroundColor).toBe('rgba(0, 0, 0, 0.2)')
    })

    it('should rest at 14 dp under a fine pointer, the desktop drop from 16 dp', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = share({ open: shallowRef(true) })
      await settle()

      expect(getComputedStyle(dialog(host)).boxShadow).toBe(serialize('boxShadow', ELEVATION_14))
    })

    it('should rest at 16 dp outside the fine-pointer rule, the handset value', async () => {
      share()
      await settle()

      // Headless Chromium cannot switch to a coarse pointer inside one page; read the rule outside every @media block.
      const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
      const rule = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.md1-bottom-sheet:not([data-persistent])')

      expect(rule).toBeDefined()
      expect(rule!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-16, ${ELEVATION_16})`)
    })

    it('should cap the initial height at the 16:9 keyline and scroll the content inside', async () => {
      const host = sheet(() => Array.from({ length: 12 }, (_, index) => h(Md1BottomSheet.Item, null, () => `Action ${index + 1}`)), { open: shallowRef(true) })
      await settle()

      const el = dialog(host)
      const content = el.querySelector<HTMLElement>('.md1-bottom-sheet__content')!

      expect(el.getBoundingClientRect().height).toBeCloseTo(window.innerWidth * 9 / 16, 0)
      expect(getComputedStyle(content).overflowY).toBe('auto')
      expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
    })

    it('should never reach the app bar: an increment and 8 dp stay above a wide, short sheet', async () => {
      await page.viewport(800, 400)

      const host = sheet(() => Array.from({ length: 12 }, (_, index) => h(Md1BottomSheet.Item, null, () => `Action ${index + 1}`)), { open: shallowRef(true) })
      await settle()

      // 800 x 9 / 16 = 450 exceeds the screen; an app bar increment plus 8 dp is kept clear instead. With no
      // theme sheet the increment is its handset fallback, 56 dp; the theme raises it to 64 dp from 600 px.
      expect(dialog(host).getBoundingClientRect().top).toBe(56 + 8)
    })

    it('should size its 8 dp top and bottom margins around 48 dp rows', async () => {
      const host = sheet(() => [h(Md1BottomSheet.Item, null, () => 'One'), h(Md1BottomSheet.Item, null, () => 'Two')], { open: shallowRef(true) })
      await settle()

      const content = dialog(host).querySelector<HTMLElement>('.md1-bottom-sheet__content')!

      expect(getComputedStyle(content).paddingTop).toBe('8px')
      expect(getComputedStyle(content).paddingBottom).toBe('8px')
      expect(content.getBoundingClientRect().height).toBe(8 + 48 + 48 + 8)
    })

    it('should close on Escape and hand focus back to the trigger', async () => {
      const open = shallowRef(false)
      const host = share({ open })
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('#trigger')!

      trigger.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(dialog(host).open).toBe(true)

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      expect(dialog(host).open).toBe(false)
      expect(document.activeElement).toBe(trigger)
    })

    it('should close on a press on the scrim above the sheet', async () => {
      const open = shallowRef(true)
      const host = share({ open })
      await settle()

      backdrop(dialog(host))
      await settle()

      expect(open.value).toBe(false)
      expect(dialog(host).open).toBe(false)
    })

    it('should run the chosen action once and dismiss the sheet', async () => {
      const open = shallowRef(true)
      const onEmail = vi.fn()
      const host = share({ open }, onEmail)
      await settle()

      await userEvent.click(items(dialog(host))[0]!)
      await settle()

      expect(onEmail).toHaveBeenCalledTimes(1)
      expect(open.value).toBe(false)
    })

    it('should activate the focused item with Enter and move between items with Tab', async () => {
      const open = shallowRef(true)
      const onEmail = vi.fn()
      const host = share({ open }, onEmail)
      await settle()

      const [email, link] = items(dialog(host))

      // showModal focuses the first focusable descendant.
      expect(document.activeElement).toBe(email)

      await userEvent.tab()

      expect(document.activeElement).toBe(link)

      await userEvent.tab({ shift: true })
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(onEmail).toHaveBeenCalledTimes(1)
      expect(open.value).toBe(false)
    })
  })

  describe('items', () => {
    it('should lay out a 48 dp row: 16 dp keyline, 24 dp icon, 32 dp to the text, 16 sp at 87%', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      const item = items(dialog(host))[0]!
      const icon = item.querySelector<HTMLElement>('.md1-bottom-sheet__icon')!
      const label = item.querySelector<HTMLElement>('.md1-bottom-sheet__label')!
      const glyph = icon.querySelector('svg')!
      const rect = item.getBoundingClientRect()
      const computed = getComputedStyle(item)

      expect(item.tagName).toBe('BUTTON')
      expect(item.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(rect.height).toBe(48)
      expect(rect.width).toBe(window.innerWidth)
      expect(glyph.getBoundingClientRect().left - rect.left).toBe(16)
      expect(glyph.getBoundingClientRect().width).toBe(24)
      expect(label.getBoundingClientRect().left - glyph.getBoundingClientRect().right).toBe(32)
      expect(computed.fontSize).toBe('16px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(glyph.getAttribute('aria-hidden')).toBe('true')
    })

    it('should take its accessible name from the label', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      await expect.element(page.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
      expect(items(dialog(host))[1]!.textContent).toBe('Copy link')
    })

    it('should show the 4% list hover and no fill for keyboard focus', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      const [email, link] = items(dialog(host))

      await userEvent.hover(link!)

      await expect.poll(() => getComputedStyle(link!).backgroundColor).toBe('rgba(0, 0, 0, 0.04)')

      await userEvent.unhover(link!)

      expect(email!.matches(':focus')).toBe(true)

      await userEvent.tab()
      await userEvent.tab({ shift: true })

      expect(email!.matches(':focus-visible')).toBe(true)
      // Vuetify 1.5's list tile draws no focus fill: the user agent's focus ring marks it.
      await expect.poll(() => getComputedStyle(email!).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(email!).outlineStyle).not.toBe('none')
    })

    it('should draw the pressed ink from the press point', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      const item = items(dialog(host))[1]!
      const rect = item.getBoundingClientRect()

      item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: rect.left + 20, clientY: rect.top + 20 }))
      await settle()

      expect(item.querySelectorAll('.md1-ripple__ink').length).toBe(1)

      item.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))
    })

    it('should make a disabled item inert: no focus, no click, no dismissal, the disabled ink', async () => {
      const open = shallowRef(true)
      const onClick = vi.fn()
      const host = sheet(() => [h(Md1BottomSheet.Item, { icon: 'phone', disabled: true, onClick }, () => 'Message')], { open })
      await settle()

      const item = items(dialog(host))[0]! as HTMLButtonElement

      expect(item.disabled).toBe(true)
      expect(item.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(item.dataset, 'disabled')).toBe(true)

      item.focus()

      expect(document.activeElement).not.toBe(item)

      item.click()
      item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
      await settle()

      expect(onClick).toHaveBeenCalledTimes(0)
      expect(open.value).toBe(true)
      expect(item.querySelectorAll('.md1-ripple__ink').length).toBe(0)
      expect(getComputedStyle(item).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(item.querySelector('.md1-bottom-sheet__icon')!).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(item).pointerEvents).toBe('none')
    })

    it('should render a link item as an anchor, and a disabled link without its href', async () => {
      const host = sheet(() => [
        h(Md1BottomSheet.Item, { icon: 'open-in-new', href: '#docs' }, () => 'Open in app'),
        h(Md1BottomSheet.Item, { href: '#off', disabled: true }, () => 'Unavailable'),
      ], { open: shallowRef(true) })
      await settle()

      const [link, off] = items(dialog(host))

      expect(link!.tagName).toBe('A')
      expect(link!.getAttribute('href')).toBe('#docs')
      expect(link!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(off!.tagName).toBe('A')
      expect(link!.hasAttribute('role')).toBe(false)
      expect(off!.hasAttribute('href')).toBe(false)
      // An href-less anchor is generic, where aria-disabled means nothing; the role keeps it a disabled link.
      expect(off!.getAttribute('role')).toBe('link')
      expect(off!.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(off!.dataset, 'disabled')).toBe(true)
    })

    it('should close the sheet when a link item is chosen', async () => {
      const open = shallowRef(true)
      const host = sheet(() => [h(Md1BottomSheet.Item, { href: '#chosen' }, () => 'Open in app')], { open })
      await settle()

      await userEvent.click(items(dialog(host))[0]!)
      await settle()

      expect(open.value).toBe(false)
      expect(location.hash).toBe('#chosen')
      history.replaceState(null, '', location.pathname + location.search)
    })
  })

  describe('title and sections', () => {
    it('should draw the 56 dp header: Regular 16 sp at 54% over a 1 dp divider, 8 dp above the first row', async () => {
      const host = share({ open: shallowRef(true) })
      await settle()

      const el = dialog(host)
      const title = el.querySelector<HTMLElement>('.md1-bottom-sheet__title')!
      const computed = getComputedStyle(title)
      const first = items(el)[0]!

      expect(title.getBoundingClientRect().height).toBe(56)
      expect(title.getBoundingClientRect().top).toBe(el.getBoundingClientRect().top)
      expect(computed.fontSize).toBe('16px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.borderBottomWidth).toBe('1px')
      expect(computed.borderBottomColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(first.getBoundingClientRect().top - title.getBoundingClientRect().bottom).toBe(8)
    })

    it('should give an Md1Divider between sections 8 dp on each side', async () => {
      const host = sheet(() => [
        h(Md1BottomSheet.Item, null, () => 'One'),
        h(Md1Divider),
        h(Md1BottomSheet.Item, null, () => 'Two'),
      ], { open: shallowRef(true) })
      await settle()

      const el = dialog(host)
      const divider = el.querySelector<HTMLElement>('.md1-divider')!
      const [one, two] = items(el)

      expect(divider.getBoundingClientRect().top - one!.getBoundingClientRect().bottom).toBe(8)
      expect(two!.getBoundingClientRect().top - divider.getBoundingClientRect().bottom).toBe(8)
    })
  })

  describe('grid', () => {
    it('should expose data-layout and tile 48 dp icons with 16 dp labels 8 dp below, 24 dp margins and row gap', async () => {
      const host = sheet(() => ['email', 'link', 'phone', 'share', 'bookmark', 'cloud-upload'].map(icon => h(Md1BottomSheet.Item, { icon: icon as 'email' }, () => icon)), { open: shallowRef(true), props: { grid: true } })
      await settle()

      const el = dialog(host)
      const content = el.querySelector<HTMLElement>('.md1-bottom-sheet__content')!
      const tiles = items(el)
      const first = tiles[0]!
      const glyph = first.querySelector('svg')!
      const label = first.querySelector<HTMLElement>('.md1-bottom-sheet__label')!
      const computed = getComputedStyle(content)

      expect(el.dataset.layout).toBe('grid')
      expect(computed.display).toBe('grid')
      expect(computed.paddingTop).toBe('24px')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.rowGap).toBe('24px')
      expect(glyph.getBoundingClientRect().width).toBe(48)
      expect(glyph.getBoundingClientRect().height).toBe(48)
      expect(label.getBoundingClientRect().height).toBe(16)
      expect(label.getBoundingClientRect().top - glyph.getBoundingClientRect().bottom).toBe(8)
      expect(getComputedStyle(label).textAlign).toBe('center')
      expect(first.getBoundingClientRect().top - el.getBoundingClientRect().top).toBe(24)

      // Equal columns: the first row's tiles are evenly spaced and the second row starts 24 dp below.
      const tops = tiles.map(tile => tile.getBoundingClientRect().top)
      const columns = tops.filter(top => top === tops[0]).length
      const widths = new Set(tiles.slice(0, columns).map(tile => Math.round(tile.getBoundingClientRect().width)))

      expect(columns).toBeGreaterThan(1)
      expect(widths.size).toBe(1)
      expect(tiles[columns]!.getBoundingClientRect().top - first.getBoundingClientRect().bottom).toBe(24)
    })

    it('should run the header across the grid, flush with the edges, 8 dp above the first row', async () => {
      const host = sheet(() => [
        h(Md1BottomSheet.Title, null, () => 'Open with'),
        h(Md1BottomSheet.Item, { icon: 'email' }, () => 'Mail'),
        h(Md1BottomSheet.Item, { icon: 'phone' }, () => 'Phone'),
      ], { open: shallowRef(true), props: { grid: true } })
      await settle()

      const el = dialog(host)
      const title = el.querySelector<HTMLElement>('.md1-bottom-sheet__title')!
      const rect = title.getBoundingClientRect()

      expect(rect.top).toBe(el.getBoundingClientRect().top)
      expect(rect.width).toBe(el.getBoundingClientRect().width)
      expect(rect.height).toBe(56)
      expect(getComputedStyle(title).paddingLeft).toBe('24px')
      expect(items(el)[0]!.getBoundingClientRect().top - rect.bottom).toBe(8)
    })
  })

  describe('expanded', () => {
    it('should fill the screen with the X bar and scroll the content when v-model:expanded is set', async () => {
      const host = sheet(() => Array.from({ length: 20 }, (_, index) => h(Md1BottomSheet.Item, null, () => `Action ${index + 1}`)), {
        open: shallowRef(true),
        expanded: shallowRef(true),
      })
      await settle()

      const el = dialog(host)
      const bar = el.querySelector<HTMLElement>('.md1-bottom-sheet__bar')!
      const close = bar.querySelector<HTMLButtonElement>('button')!
      const content = el.querySelector<HTMLElement>('.md1-bottom-sheet__content')!

      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(true)
      expect(el.getBoundingClientRect().top).toBe(0)
      expect(el.getBoundingClientRect().height).toBe(window.innerHeight)
      expect(bar.getBoundingClientRect().height).toBe(56)
      expect(close.getAttribute('aria-label')).toBe('Close')
      expect(close.querySelector('svg')!.getBoundingClientRect().left).toBe(16)
      expect(getComputedStyle(close).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
    })

    it('should keep the X at 24 dp in an expanded grid sheet while the tiles draw 48 dp', async () => {
      const host = sheet(() => [h(Md1BottomSheet.Item, { icon: 'email' }, () => 'Email')], {
        open: shallowRef(true),
        expanded: shallowRef(true),
        props: { grid: true },
      })
      await settle()

      const el = dialog(host)

      expect(el.querySelector('.md1-bottom-sheet__bar svg')!.getBoundingClientRect().width).toBe(24)
      expect(items(el)[0]!.querySelector('svg')!.getBoundingClientRect().width).toBe(48)
    })

    it('should close from the X and start the next opening collapsed', async () => {
      const open = shallowRef(true)
      const expanded = shallowRef(true)
      const host = share({ open, expanded })
      await settle()

      await userEvent.click(dialog(host).querySelector('.md1-bottom-sheet__bar button')!)
      await settle()

      expect(open.value).toBe(false)
      expect(expanded.value).toBe(false)
      expect(dialog(host).open).toBe(false)

      open.value = true
      await settle()

      expect(Object.hasOwn(dialog(host).dataset, 'expanded')).toBe(false)
      expect(dialog(host).querySelector('.md1-bottom-sheet__bar')).toBeNull()
    })

    it('should expand from the slot prop, the non-gesture path to full height', async () => {
      const expanded = shallowRef(false)
      const host = sheet(({ expand, isExpanded }) => [
        h(Md1Button, { id: 'more', onClick: expand }, () => isExpanded ? 'Expanded' : 'More'),
      ], { open: shallowRef(true), expanded })
      await settle()

      await userEvent.click(host.querySelector('#more')!)
      await settle()

      expect(expanded.value).toBe(true)
      expect(host.querySelector('#more')!.textContent).toBe('Expanded')
      expect(Object.hasOwn(dialog(host).dataset, 'expanded')).toBe(true)
    })
  })

  describe('tablet and desktop', () => {
    it('should inset the modal sheet by layout increments: 1 and 6 at 960, 2 and 8 at 1280, 3 and 9 at 1440', async () => {
      const host = share({ open: shallowRef(true) })

      for (const [width, edge, min] of [[960, 64, 384], [1280, 128, 512], [1440, 192, 576]] as const) {
        await page.viewport(width, 800)
        await settle()

        const rect = dialog(host).getBoundingClientRect()

        // A short list is narrower than the room, so the sheet rests at the minimum width, centred.
        expect(rect.width).toBe(min)
        expect(rect.left).toBe((width - min) / 2)
        expect(rect.left).toBeGreaterThanOrEqual(edge)
        expect(rect.bottom).toBe(800)
      }
    })

    it('should never come closer to the edges than the increment table allows', async () => {
      await page.viewport(960, 800)

      const host = sheet(() => [h(Md1BottomSheet.Item, null, () => 'x'.repeat(400))], { open: shallowRef(true) })
      await settle()

      const rect = dialog(host).getBoundingClientRect()

      expect(rect.left).toBe(64)
      expect(rect.right).toBe(960 - 64)
    })

    it('should keep a persistent sheet full width unless it is inset', async () => {
      await page.viewport(1280, 800)

      mount(() => h(Md1BottomSheet, { persistent: true, modelValue: true }, () => [h(Md1BottomSheet.Item, { icon: 'play-arrow' }, () => 'Play')]))
      await settle()

      const el = aside()!
      const rect = el.getBoundingClientRect()

      expect(Object.hasOwn(el.dataset, 'inset')).toBe(false)
      expect(rect.left).toBe(0)
      expect(rect.width).toBe(1280)
    })

    it('should inset a persistent sheet with inset by the same increments, seamed on three sides', async () => {
      mount(() => h(Md1BottomSheet, { persistent: true, inset: true, modelValue: true }, () => [h(Md1BottomSheet.Item, { icon: 'play-arrow' }, () => 'Play')]))

      for (const [width, edge, min] of [[960, 64, 384], [1280, 128, 512], [1440, 192, 576]] as const) {
        await page.viewport(width, 800)
        await settle()

        const el = aside()!
        const rect = el.getBoundingClientRect()
        const computed = getComputedStyle(el)

        expect(Object.hasOwn(el.dataset, 'inset')).toBe(true)
        expect(rect.width).toBe(min)
        expect(rect.left).toBe((width - min) / 2)
        expect(rect.left).toBeGreaterThanOrEqual(edge)
        expect(rect.bottom).toBe(800)
        expect(computed.borderInlineStartWidth).toBe('1px')
        expect(computed.borderInlineEndWidth).toBe('1px')
        expect(computed.boxShadow).toBe('none')
      }
    })

    it('should keep an inset persistent sheet full width on handsets', async () => {
      await page.viewport(414, 800)

      mount(() => h(Md1BottomSheet, { persistent: true, inset: true, modelValue: true }, () => [h(Md1BottomSheet.Item, { icon: 'play-arrow' }, () => 'Play')]))
      await settle()

      const rect = aside()!.getBoundingClientRect()

      expect(rect.left).toBe(0)
      expect(rect.width).toBe(414)
    })
  })

  describe('persistent', () => {
    it('should render a non-modal aside with no dialog and no scrim, leaving the page interactive', async () => {
      const open = shallowRef(true)
      const outside = vi.fn()
      const host = mount(() => [
        h('button', { id: 'outside', onClick: outside }, 'Page action'),
        h(Md1BottomSheet, { 'persistent': true, 'modelValue': open.value, 'onUpdate:modelValue': (value: boolean) => {
          open.value = value
        } }, () => [h(Md1BottomSheet.Item, { icon: 'play-arrow' }, () => 'Play')]),
      ])
      await settle()

      const el = aside()!

      expect(host.querySelector('dialog')).toBeNull()
      expect(el.tagName).toBe('ASIDE')
      expect(Object.hasOwn(el.dataset, 'persistent')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)
      expect(el.dataset.layout).toBe('list')
      expect(el.hasAttribute('aria-modal')).toBe(false)
      expect(el.getBoundingClientRect().bottom).toBe(window.innerHeight)

      await userEvent.click(host.querySelector('#outside')!)

      expect(outside).toHaveBeenCalledTimes(1)
      expect(open.value).toBe(true)
    })

    it('should rest at the app elevation with a 1 dp seam, and stack through its Portal z-index', async () => {
      sheet(() => [h(Md1BottomSheet.Item, null, () => 'Play')], { open: shallowRef(true), props: { persistent: true } })
      await settle()

      const el = aside()!
      const computed = getComputedStyle(el)

      expect(computed.boxShadow).toBe(serialize('boxShadow', 'var(--md1-elevation-0, none)'))
      expect(computed.borderTopWidth).toBe('1px')
      expect(computed.borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.position).toBe('fixed')
      expect(Number(el.style.zIndex)).toBeGreaterThan(0)
    })

    it('should teleport by default and stay where it is declared with teleport off', async () => {
      const host = sheet(() => [h(Md1BottomSheet.Item, null, () => 'Play')], { open: shallowRef(true), props: { persistent: true } })
      await settle()

      expect(host.contains(aside())).toBe(false)

      teardowns.pop()!()

      const inline = sheet(() => [h(Md1BottomSheet.Item, null, () => 'Play')], { open: shallowRef(true), props: { persistent: true, teleport: false } })
      await settle()

      expect(inline.contains(aside())).toBe(true)
    })

    it('should toggle from a disclosure activator that controls the aside', async () => {
      const open = shallowRef(false)
      const host = sheet(() => [activator('Queue'), h(Md1BottomSheet.Item, null, () => 'Play')], { open, props: { persistent: true } })
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('#trigger')!

      expect(aside()).toBeNull()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.hasAttribute('aria-haspopup')).toBe(false)

      await userEvent.click(trigger)
      await settle()

      expect(open.value).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(aside()!.id)
      expect(aside()!.contains(trigger)).toBe(false)

      await userEvent.click(trigger)
      await settle()

      expect(open.value).toBe(false)
      expect(aside()).toBeNull()
    })

    it('should name the aside from its title', async () => {
      sheet(() => [h(Md1BottomSheet.Title, null, () => 'Up next'), h(Md1BottomSheet.Item, null, () => 'Play')], { open: shallowRef(true), props: { persistent: true, id: 'queue' } })
      await settle()

      const el = aside()!
      const title = el.querySelector<HTMLElement>('.md1-bottom-sheet__title')!

      expect(el.id).toBe('queue')
      expect(title.tagName).toBe('H2')
      expect(el.getAttribute('aria-labelledby')).toBe(title.id)
      await expect.element(page.getByRole('complementary', { name: 'Up next' })).toBeInTheDocument()
    })

    it('should keep the sheet when an item is chosen and close it on Escape from inside', async () => {
      const open = shallowRef(true)
      const onPlay = vi.fn()
      sheet(() => [h(Md1BottomSheet.Item, { onClick: onPlay }, () => 'Play')], { open, props: { persistent: true } })
      await settle()

      const item = items(aside()!)[0]!

      await userEvent.click(item)
      await settle()

      expect(onPlay).toHaveBeenCalledTimes(1)
      expect(open.value).toBe(true)

      item.focus()
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      expect(aside()).toBeNull()
    })

    it('should hand focus back to the activator when it closes with focus inside', async () => {
      const open = shallowRef(false)
      const host = sheet(() => [activator('Queue'), h(Md1BottomSheet.Item, null, () => 'Play')], { open, props: { persistent: true } })
      await settle()

      const trigger = host.querySelector<HTMLButtonElement>('#trigger')!

      await userEvent.click(trigger)
      await settle()

      items(aside()!)[0]!.focus()
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(aside()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('should fill its container when expanded, carry the Collapsible state, and close from the X', async () => {
      const open = shallowRef(true)
      const expanded = shallowRef(true)
      const host = mount(() => h('div', { style: 'position: relative; height: 300px; contain: layout paint' }, [
        h(Md1BottomSheet, {
          'persistent': true,
          'teleport': false,
          'modelValue': open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
          'expanded': expanded.value,
          'onUpdate:expanded': (value: unknown) => {
            expanded.value = Boolean(value)
          },
        }, () => [h(Md1BottomSheet.Item, null, () => 'Play')]),
      ]))
      await settle()

      const screen = host.firstElementChild!.getBoundingClientRect()
      const el = aside()!

      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(true)
      expect(el.dataset.state).toBe('open')
      expect(el.getBoundingClientRect().top).toBe(screen.top)
      expect(el.getBoundingClientRect().height).toBe(300)

      await userEvent.click(el.querySelector('.md1-bottom-sheet__bar button')!)
      await settle()

      expect(open.value).toBe(false)
      expect(expanded.value).toBe(false)
    })
  })

  describe('motion', () => {
    it('should slide up from below on the deceleration curve and leave on the acceleration curve', async () => {
      const host = share({ open: shallowRef(false), motion: true })
      await settle()

      const el = dialog(host)
      const closed = getComputedStyle(el)

      expect(closed.transitionDuration.split(', ')[0]).toBe('0.195s')
      expect(closed.transitionTimingFunction.startsWith('cubic-bezier(0.4, 0, 1, 1)')).toBe(true)

      el.showModal()

      const opened = getComputedStyle(el)

      expect(opened.transitionDuration.split(', ')[0]).toBe('0.225s')
      expect(opened.transitionTimingFunction.startsWith('cubic-bezier(0, 0, 0.2, 1)')).toBe(true)
      el.close()
    })
  })

  describe('orphans', () => {
    it('should warn once per part rendered outside Md1BottomSheet and render inert', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => [
        h(Md1BottomSheetActivator, null, {
          default: ({ attrs }: Md1BottomSheetActivatorSlotProps) => h(Md1Button, attrs, () => 'Open'),
        }),
        h(Md1BottomSheetTitle, null, () => 'Title'),
        h(Md1BottomSheetItem, null, () => 'Item'),
      ])
      await settle()

      expect(warn).toHaveBeenCalledTimes(3)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1BottomSheetActivator'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1BottomSheetTitle'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1BottomSheetItem'))
      expect(host.querySelector('h2')!.textContent).toBe('Title')

      await userEvent.click(host.querySelector('.md1-bottom-sheet__item')!)

      expect(host.querySelector('dialog, aside')).toBeNull()
    })

    it('should not warn when the parts are nested', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      share({ open: shallowRef(true) })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('theme', () => {
    it('should take its surface and ink from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => [
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1BottomSheet, { modelValue: true, persistent: true, teleport: false }, () => [
            h(Md1BottomSheet.Title, null, () => 'Dark'),
            h(Md1BottomSheet.Item, { icon: 'email' }, () => 'Email'),
          ]),
        ]),
      ])
      await settle()

      const el = host.querySelector<HTMLElement>('aside')!

      expect(getComputedStyle(el).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(el.querySelector('.md1-bottom-sheet__title')!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(el.querySelector('.md1-bottom-sheet__item')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(el.querySelector('.md1-bottom-sheet__icon')!).color).toBe('rgb(255, 255, 255)')
    })
  })
})

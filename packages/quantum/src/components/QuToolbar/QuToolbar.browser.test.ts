import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createLocalePlugin, createReducedMotionPlugin } from '@vuetify/v0'

import { QuToolbar } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Icons
import { quantumIcons } from '../../icons'
// Components
import { QuButton } from '../QuButton'
import { QuTabs } from '../QuTabs'

/** Vuetify 1.5's pixel recipes for the 2 and 4 dp levels. */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
const ELEVATION_4 = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
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

/** A scroll container beside the bar, standing in for the app shell's content region under an app bar. */
function scroller (bar: HTMLElement): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = 'height: 300px; overflow: auto;'
  const content = document.createElement('div')
  content.style.height = '3000px'
  el.append(content)
  bar.parentElement!.append(el)
  return el
}

async function scrollTo (el: HTMLElement, top: number) {
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
  await settle()
}

/** A rule as authored, read from the stylesheet: for values outside the test browser's media (handset, coarse pointer). */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])

  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

function basic (props: Record<string, unknown> = {}, extra: () => VNode[] = () => []): HTMLElement {
  const host = mount(() => h(QuToolbar, props, () => [
    h(QuToolbar.Nav),
    h(QuToolbar.Title, () => 'Inbox'),
    h(QuToolbar.Actions, () => [
      h(QuButton, { icon: 'search', ariaLabel: 'Search' }),
      h(QuButton, { icon: 'more-vert', ariaLabel: 'More' }),
    ]),
    ...extra(),
  ]))

  return host.querySelector<HTMLElement>('.quantum-toolbar')!
}

function paths (el: Element): (string | null)[] {
  return [...el.querySelectorAll('path')].map(p => p.getAttribute('d'))
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

describe('quToolbar', () => {
  describe('anatomy', () => {
    it('should render a surface div with the row holding nav, title and actions', async () => {
      const el = basic()
      await settle()

      const row = el.firstElementChild!

      expect(el.tagName).toBe('DIV')
      expect(el.dataset.variant).toBe('surface')
      expect(el.dataset.position).toBe('top')
      expect(el.dataset.scroll).toBe('fixed')
      expect(Object.hasOwn(el.dataset, 'appBar')).toBe(false)
      expect(row.classList.contains('quantum-toolbar__row')).toBe(true)
      expect([...row.children].map(child => child.classList[0])).toEqual([
        'quantum-toolbar__nav',
        'quantum-toolbar__title',
        'quantum-toolbar__actions',
      ])
      expect(getComputedStyle(el).position).toBe('relative')
    })

    it('should become the banner header fixed to the top as an app bar, primary by default', async () => {
      const el = basic({ appBar: true })
      await settle()

      const computed = getComputedStyle(el)

      expect(el.tagName).toBe('HEADER')
      expect(Object.hasOwn(el.dataset, 'appBar')).toBe(true)
      expect(el.dataset.variant).toBe('primary')
      expect(computed.position).toBe('fixed')
      expect(computed.top).toBe('0px')
      expect(computed.backgroundColor).toBe('rgb(63, 81, 181)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
    })

    it('should measure 64 dp from 600 px with the glyphs on the 24 dp keyline and the title on the 80 dp keyline', async () => {
      expect(matchMedia('(min-width: 600px)').matches).toBe(true)

      const el = basic()
      await settle()

      const left = el.getBoundingClientRect().left
      const right = el.getBoundingClientRect().right
      const nav = el.querySelector('.quantum-toolbar__nav')!
      const glyph = nav.querySelector('.quantum-toolbar__glyph')!
      const title = el.querySelector('.quantum-toolbar__title')!
      const more = el.querySelectorAll('.quantum-toolbar__actions .quantum-button')[1]!

      expect(el.getBoundingClientRect().height).toBe(64)
      expect(nav.getBoundingClientRect().width).toBe(48)
      expect(glyph.getBoundingClientRect().left - left).toBe(24)
      expect(title.getBoundingClientRect().left - left).toBe(80)
      // The last action's glyph sits on the end keyline too.
      expect(right - more.querySelector('svg')!.getBoundingClientRect().right).toBe(24)
    })

    it('should keep the 56 dp handset row, 16 dp keyline and 72 dp title as the authored base rules', async () => {
      basic()
      await settle()

      const row = rule('.quantum-toolbar__row')!
      const title = rule('.quantum-toolbar__nav + .quantum-toolbar__title')!

      expect(row.style.height).toBe('var(--quantum-increment, 56px)')
      expect(row.style.paddingInline).toBe('calc(var(--quantum-keyline-margin, 16px) - 12px)')
      expect(title.style.marginInlineStart).toBe('calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - 36px)')
    })

    it('should set the title in the Title style: 20 sp Medium on one line with an ellipsis', async () => {
      const el = basic()
      await settle()

      const computed = getComputedStyle(el.querySelector('.quantum-toolbar__title')!)

      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('20px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.whiteSpace).toBe('nowrap')
      expect(computed.textOverflow).toBe('ellipsis')
    })

    it('should start the title on the margin keyline without a nav icon', async () => {
      const host = mount(() => h(QuToolbar, () => [h(QuToolbar.Title, () => 'Title')]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const title = el.querySelector('.quantum-toolbar__title')!

      expect(title.getBoundingClientRect().left - el.getBoundingClientRect().left).toBe(24)
    })

    it('should rest at 2 dp under a fine pointer, the 4 dp handset value less 2 dp', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const el = basic()
      await settle()

      expect(getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      expect(rule('.quantum-toolbar')!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--quantum-elevation-4, ${ELEVATION_4})`)
    })
  })

  describe('variants', () => {
    it('should paint the surface bar in the app-bar grey with 87% ink and 54% icons', async () => {
      const el = basic()
      await settle()

      const computed = getComputedStyle(el)
      const icon = el.querySelector<HTMLElement>('.quantum-toolbar__actions .quantum-button')!

      expect(computed.backgroundColor).toBe('rgb(245, 245, 245)')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      // QuButton transitions its ink, so the toolbar's colour lands after the standard duration.
      await expect.poll(() => getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(el.querySelector('.quantum-toolbar__nav')!).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should paint the primary bar with every icon in 100% white', async () => {
      const el = basic({ variant: 'primary' })
      await settle()

      const icons = [...el.querySelectorAll<HTMLElement>('.quantum-toolbar__nav, .quantum-toolbar__actions .quantum-button')]

      expect(getComputedStyle(el).backgroundColor).toBe('rgb(63, 81, 181)')
      await expect.poll(() => icons.map(icon => getComputedStyle(icon).color)).toEqual(['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)'])
    })

    it('should drop the fill and the shadow when transparent', async () => {
      const el = basic({ variant: 'transparent' })
      await settle()

      expect(getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should condense to 48 dp with 40 dp targets when dense', async () => {
      const el = basic({ dense: true })
      await settle()

      const nav = el.querySelector('.quantum-toolbar__nav')!
      const action = el.querySelector('.quantum-toolbar__actions .quantum-button')!

      expect(Object.hasOwn(el.dataset, 'dense')).toBe(true)
      expect(el.getBoundingClientRect().height).toBe(48)
      expect(nav.getBoundingClientRect().height).toBe(40)
      expect(action.getBoundingClientRect().width).toBe(40)
    })

    it('should grow to 128 dp when prominent, icons at the top and the title 20 dp above the bottom', async () => {
      const el = basic({ prominent: true })
      await settle()

      const rect = el.getBoundingClientRect()
      const nav = el.querySelector('.quantum-toolbar__nav')!.getBoundingClientRect()
      const title = el.querySelector('.quantum-toolbar__title')!

      expect(Object.hasOwn(el.dataset, 'prominent')).toBe(true)
      expect(rect.height).toBe(128)
      // One 64 dp increment holds the icons: the 48 dp target is centred in it.
      expect(nav.top - rect.top).toBe(8)
      expect(rect.bottom - title.getBoundingClientRect().bottom).toBe(0)
      expect(getComputedStyle(title).paddingBottom).toBe('20px')
      expect(getComputedStyle(title).alignSelf).toBe('flex-end')
    })

    it('should be 96 dp when dense and prominent', async () => {
      const el = basic({ dense: true, prominent: true })
      await settle()

      expect(el.getBoundingClientRect().height).toBe(96)
    })

    it('should detach as a floating 2 dp toolbar with its own width and 2 dp corners', async () => {
      const el = basic({ floating: true })
      await settle()

      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'floating')).toBe(true)
      expect(computed.borderTopLeftRadius).toBe('2px')
      expect(computed.boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      expect(el.getBoundingClientRect().width).toBeLessThan(window.innerWidth)
    })

    it('should fix the bottom toolbar to the bottom edge', async () => {
      const el = basic({ position: 'bottom' })
      await settle()

      const computed = getComputedStyle(el)

      expect(el.dataset.position).toBe('bottom')
      expect(computed.position).toBe('fixed')
      expect(Math.round(el.getBoundingClientRect().bottom)).toBe(window.innerHeight)
    })
  })

  describe('nav', () => {
    it('should render a native 48 dp button with the ripple first and the menu glyph named Menu', async () => {
      const el = basic()
      await settle()

      const nav = el.querySelector<HTMLButtonElement>('.quantum-toolbar__nav')!

      expect(nav.tagName).toBe('BUTTON')
      expect(nav.type).toBe('button')
      expect(nav.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(nav.dataset.icon).toBe('menu')
      expect(nav.getAttribute('aria-label')).toBe('Menu')
      expect(nav.getAttribute('aria-expanded')).toBe('false')
      expect(paths(nav.querySelector('[data-glyph="menu"]')!)).toEqual(quantumIcons.menu)
      expect(getComputedStyle(nav.querySelector('[data-glyph="arrow-back"]')!).opacity).toBe('0')
    })

    it('should morph menu into the back arrow while open, over the standard duration and curve', async () => {
      const open = shallowRef(false)
      const host = mount(() => h(QuToolbar, () => [h(QuToolbar.Nav, { open: open.value })]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const nav = host.querySelector<HTMLElement>('.quantum-toolbar__nav')!
      const menu = nav.querySelector<HTMLElement>('[data-glyph="menu"]')!
      const back = nav.querySelector<HTMLElement>('[data-glyph="arrow-back"]')!

      expect(getComputedStyle(menu).transitionDuration).toContain('0.3s')
      expect(getComputedStyle(menu).transitionTimingFunction).toContain('cubic-bezier(0.4, 0, 0.2, 1)')

      open.value = true
      await settle()

      expect(nav.dataset.icon).toBe('arrow-back')
      expect(nav.getAttribute('aria-label')).toBe('Back')
      expect(nav.getAttribute('aria-expanded')).toBe('true')
      await expect.poll(() => getComputedStyle(back).opacity).toBe('1')
      await expect.poll(() => getComputedStyle(menu).opacity).toBe('0')
    })

    it('should draw the up arrow and the close glyph without a morph', async () => {
      const host = mount(() => h(QuToolbar, () => [
        h(QuToolbar.Nav, { icon: 'up' }),
        h(QuToolbar.Nav, { icon: 'close' }),
      ]))
      await settle()

      const [up, close] = host.querySelectorAll<HTMLElement>('.quantum-toolbar__nav')

      expect(up!.dataset.icon).toBe('arrow-back')
      expect(up!.getAttribute('aria-label')).toBe('Back')
      expect(up!.hasAttribute('aria-expanded')).toBe(false)
      expect(paths(up!)).toEqual(quantumIcons['arrow-back'])
      expect(close!.dataset.icon).toBe('close')
      expect(close!.getAttribute('aria-label')).toBe('Close')
      expect(paths(close!)).toEqual(quantumIcons.close)
    })

    it('should emit click once per press and take a consumer aria-label', async () => {
      const onClick = vi.fn()
      const host = mount(() => h(QuToolbar, () => [h(QuToolbar.Nav, { onClick, ariaLabel: 'Open drawer' })]))
      await settle()

      const nav = host.querySelector<HTMLElement>('.quantum-toolbar__nav')!

      expect(nav.getAttribute('aria-label')).toBe('Open drawer')

      await userEvent.click(nav)
      nav.focus()
      await userEvent.keyboard('{Enter}')

      expect(onClick).toHaveBeenCalledTimes(2)
    })

    it('should be inert when disabled', async () => {
      const onClick = vi.fn()
      const host = mount(() => h(QuToolbar, () => [h(QuToolbar.Nav, { onClick, disabled: true })]))
      await settle()

      const nav = host.querySelector<HTMLButtonElement>('.quantum-toolbar__nav')!

      expect(nav.disabled).toBe(true)
      expect(Object.hasOwn(nav.dataset, 'disabled')).toBe(true)
      nav.click()
      expect(onClick).not.toHaveBeenCalled()
      // The colour page's inactive app bar icon: 38% black.
      expect(getComputedStyle(nav).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should take the inactive 50% white on a primary bar when disabled', async () => {
      const host = mount(() => h(QuToolbar, { variant: 'primary' }, () => [h(QuToolbar.Nav, { disabled: true })]))
      await settle()

      const nav = host.querySelector<HTMLElement>('.quantum-toolbar__nav')!

      expect(getComputedStyle(nav).color).toBe(serialize('color', 'color-mix(in srgb, #FFFFFF 50%, transparent)'))
    })

    it('should show the 12% focus overlay for keyboard focus', async () => {
      const el = basic()
      await settle()

      const nav = el.querySelector<HTMLElement>('.quantum-toolbar__nav')!

      await userEvent.tab()

      expect(document.activeElement).toBe(nav)
      await expect.poll(() => getComputedStyle(nav).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, rgba(0, 0, 0, 0.54) 12%, transparent)'))
    })
  })

  describe('actions', () => {
    function actions (disabled = false): HTMLElement {
      const host = mount(() => h(QuToolbar, () => [
        h(QuToolbar.Actions, () => [
          h(QuButton, { icon: 'search', ariaLabel: 'Search' }),
          h(QuButton, { icon: 'share', ariaLabel: 'Share', disabled }),
          h(QuButton, { icon: 'delete', ariaLabel: 'Delete' }),
          h(QuButton, { icon: 'more-vert', ariaLabel: 'More' }),
        ]),
      ]))

      return host.querySelector<HTMLElement>('.quantum-toolbar__actions')!
    }

    function buttons (el: HTMLElement): HTMLButtonElement[] {
      return [...el.querySelectorAll<HTMLButtonElement>('button')]
    }

    it('should be a labelled role="toolbar" with one tab stop', async () => {
      const el = actions()
      await settle()

      expect(el.getAttribute('role')).toBe('toolbar')
      expect(el.getAttribute('aria-label')).toBe('Actions')
      expect(buttons(el).map(button => button.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    })

    it('should sit the actions at a 48 dp pitch at the end of the row', async () => {
      const el = actions()
      await settle()

      const [a, b] = buttons(el)

      expect(b!.getBoundingClientRect().left - a!.getBoundingClientRect().left).toBe(48)
    })

    it('should move with the arrow keys, jump with Home and End, and remember the last action', async () => {
      const el = actions()
      await settle()

      const list = buttons(el)

      await userEvent.tab()
      expect(document.activeElement).toBe(list[0])

      await userEvent.keyboard('{ArrowRight}')
      await settle()
      expect(document.activeElement).toBe(list[1])
      expect(list[1]!.getAttribute('tabindex')).toBe('0')
      expect(list[0]!.getAttribute('tabindex')).toBe('-1')

      await userEvent.keyboard('{End}')
      await settle()
      expect(document.activeElement).toBe(list[3])

      await userEvent.keyboard('{Home}')
      await settle()
      expect(document.activeElement).toBe(list[0])

      await userEvent.keyboard('{ArrowLeft}')
      await settle()
      // Not circular: the first action stays.
      expect(document.activeElement).toBe(list[0])

      await userEvent.click(list[2]!)
      await settle()
      expect(list[2]!.getAttribute('tabindex')).toBe('0')
    })

    it('should skip a disabled action', async () => {
      const el = actions(true)
      await settle()

      const list = buttons(el)

      list[0]!.focus()
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(document.activeElement).toBe(list[2])
      expect(list[1]!.getAttribute('tabindex')).toBe('-1')
      // The colour page's inactive app bar icon; polled across QuButton's colour transition.
      await expect.poll(() => getComputedStyle(list[1]!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should reverse the arrow keys under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuToolbar, () => [
        h(QuToolbar.Actions, () => [
          h(QuButton, { icon: 'search', ariaLabel: 'Search' }),
          h(QuButton, { icon: 'share', ariaLabel: 'Share' }),
        ]),
      ])]))
      await settle()

      const list = [...host.querySelectorAll<HTMLButtonElement>('.quantum-toolbar__actions button')]

      list[0]!.focus()
      await userEvent.keyboard('{ArrowLeft}')
      await settle()

      expect(document.activeElement).toBe(list[1])
    })
  })

  describe('extension', () => {
    it('should register a tab bar and keep the bar fill under it', async () => {
      const host = mount(() => h(QuToolbar, { variant: 'primary' }, () => [
        h(QuToolbar.Title, () => 'Library'),
        h(QuToolbar.Extension, () => [
          h(QuTabs, { modelValue: 'songs' }, () => [
            h(QuTabs.List, { label: 'Library' }, () => [
              h(QuTabs.Item, { label: 'Songs', value: 'songs' }),
              h(QuTabs.Item, { label: 'Albums', value: 'albums' }),
            ]),
          ]),
        ]),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const extension = el.lastElementChild as HTMLElement

      expect(extension.classList.contains('quantum-toolbar__extension')).toBe(true)
      // The extension renders after the row whatever the slot order.
      expect(el.firstElementChild!.classList.contains('quantum-toolbar__row')).toBe(true)
      await expect.poll(() => Object.hasOwn(extension.dataset, 'tabs')).toBe(true)
      expect(getComputedStyle(extension).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should fill related content under a primary bar with the lighter primary and dark ink', async () => {
      const host = mount(() => h(QuToolbar, { variant: 'primary' }, () => [
        h(QuToolbar.Extension, () => h('p', 'Related information')),
      ]))
      await settle()

      const extension = host.querySelector<HTMLElement>('.quantum-toolbar__extension')!

      expect(Object.hasOwn(extension.dataset, 'related')).toBe(true)
      expect(getComputedStyle(extension).backgroundColor).toBe('rgb(197, 202, 233)')
      // 87% black in both themes: the 100 shade stays light on the dark theme.
      expect(getComputedStyle(extension).color).toBe(serialize('color', 'color-mix(in srgb, #000000 87%, transparent)'))
    })

    it('should set a large title one increment tall at the content keyline', async () => {
      const host = mount(() => h(QuToolbar, () => [
        h(QuToolbar.Nav),
        h(QuToolbar.Extension, () => h(QuToolbar.Title, () => 'Large title')),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const extension = el.querySelector<HTMLElement>('.quantum-toolbar__extension')!
      const title = extension.querySelector<HTMLElement>('.quantum-toolbar__title')!

      await expect.poll(() => Object.hasOwn(extension.dataset, 'title')).toBe(true)
      expect(extension.getBoundingClientRect().height).toBe(64)
      expect(el.getBoundingClientRect().height).toBe(128)
      expect(getComputedStyle(title).fontSize).toBe('34px')
      expect(title.getBoundingClientRect().left - el.getBoundingClientRect().left).toBe(80)
    })

    it('should size an image flexible space so the whole bar takes the 4:3 ratio', async () => {
      const host = mount(() => h('div', { style: 'width: 400px' }, [h(QuToolbar, () => [
        h(QuToolbar.Nav),
        h(QuToolbar.Extension, { image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }),
      ])]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!

      await expect.poll(() => el.getBoundingClientRect().height).toBe(300)
      expect(Object.hasOwn(el.dataset, 'image')).toBe(true)
      expect(el.querySelector('.quantum-toolbar__img')!.getAttribute('alt')).toBe('')
      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })
  })

  describe('scroll', () => {
    it('should hide 1:1 with the content and return on reverse scroll', async () => {
      const el = basic({ appBar: true, scroll: 'hide' })
      await settle()

      const target = scroller(el)

      await scrollTo(target, 30)
      expect(el.style.transform).toBe('translateY(-30px)')
      expect(Object.hasOwn(el.dataset, 'hidden')).toBe(false)

      await scrollTo(target, 400)
      expect(el.style.transform).toBe('translateY(-64px)')
      expect(Object.hasOwn(el.dataset, 'hidden')).toBe(true)

      await scrollTo(target, 380)
      expect(el.style.transform).toBe('translateY(-44px)')
      expect(Object.hasOwn(el.dataset, 'hidden')).toBe(false)

      await scrollTo(target, 300)
      expect(el.style.transform).toBe('')
    })

    it('should reveal a hidden bar when focus moves into it', async () => {
      const el = basic({ appBar: true, scroll: 'hide' })
      await settle()

      const target = scroller(el)

      await scrollTo(target, 400)
      expect(Object.hasOwn(el.dataset, 'hidden')).toBe(true)

      el.querySelector<HTMLElement>('.quantum-toolbar__nav')!.focus()
      await settle()

      expect(Object.hasOwn(el.dataset, 'hidden')).toBe(false)
      expect(el.style.transform).toBe('')
    })

    it('should keep an anchored tab bar and scroll only the row off', async () => {
      const host = mount(() => h(QuToolbar, { appBar: true, scroll: 'hide' }, () => [
        h(QuToolbar.Title, () => 'Library'),
        h(QuToolbar.Extension, () => [
          h(QuTabs, { modelValue: 'a' }, () => [
            h(QuTabs.List, { label: 'Library' }, () => [h(QuTabs.Item, { label: 'A', value: 'a' })]),
          ]),
        ]),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!

      await expect.poll(() => Object.hasOwn(el.querySelector<HTMLElement>('.quantum-toolbar__extension')!.dataset, 'tabs')).toBe(true)

      const target = scroller(el)

      await scrollTo(target, 500)

      expect(el.style.transform).toBe('translateY(-64px)')
    })

    it('should return a staggered tab bar first and the row only at the top', async () => {
      const host = mount(() => h(QuToolbar, { appBar: true, scroll: 'hide', tabBar: 'staggered' }, () => [
        h(QuToolbar.Title, () => 'Library'),
        h(QuToolbar.Extension, () => [
          h(QuTabs, { modelValue: 'a' }, () => [
            h(QuTabs.List, { label: 'Library' }, () => [h(QuTabs.Item, { label: 'A', value: 'a' })]),
          ]),
        ]),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const extension = el.querySelector<HTMLElement>('.quantum-toolbar__extension')!

      await expect.poll(() => Object.hasOwn(extension.dataset, 'tabs')).toBe(true)

      const span = 64 + extension.getBoundingClientRect().height

      const target = scroller(el)

      await scrollTo(target, 800)
      expect(el.style.transform).toBe(`translateY(-${span}px)`)

      // Reverse scroll returns the tab bar, never the row.
      await scrollTo(target, 500)
      expect(el.style.transform).toBe('translateY(-64px)')

      await scrollTo(target, 20)
      expect(el.style.transform).toBe('translateY(-20px)')
    })

    it('should start a waterfall seamed and lift it once content scrolls under', async () => {
      const el = basic({ appBar: true, scroll: 'waterfall' })
      await settle()

      expect(getComputedStyle(el).boxShadow).toBe('none')
      expect(Object.hasOwn(el.dataset, 'scrolled')).toBe(false)

      const target = scroller(el)

      await scrollTo(target, 1)

      expect(Object.hasOwn(el.dataset, 'scrolled')).toBe(true)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
    })

    it('should collapse the flexible space 1:1 and shrink the title to 20 sp', async () => {
      const host = mount(() => h(QuToolbar, { appBar: true, scroll: 'collapse' }, () => [
        h(QuToolbar.Nav),
        h(QuToolbar.Extension, () => h(QuToolbar.Title, () => 'Large title')),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const extension = el.querySelector<HTMLElement>('.quantum-toolbar__extension')!
      const title = extension.querySelector<HTMLElement>('.quantum-toolbar__title')!

      await expect.poll(() => extension.getBoundingClientRect().height).toBe(64)
      expect(getComputedStyle(title).fontSize).toBe('34px')

      const target = scroller(el)

      await scrollTo(target, 32)

      expect(extension.getBoundingClientRect().height).toBe(32)
      expect(getComputedStyle(title).fontSize).toBe('27px')
      expect(Object.hasOwn(el.dataset, 'collapsed')).toBe(false)

      await scrollTo(target, 200)

      expect(extension.getBoundingClientRect().height).toBe(0)
      expect(el.getBoundingClientRect().height).toBe(64)
      expect(getComputedStyle(title).fontSize).toBe('20px')
      expect(Object.hasOwn(el.dataset, 'collapsed')).toBe(true)
      // The title lands in the row, centred on the 80 dp keyline.
      const rect = title.getBoundingClientRect()
      expect(rect.left - el.getBoundingClientRect().left).toBe(80)
      expect(rect.top - el.getBoundingClientRect().top).toBe(22)

      await scrollTo(target, 0)

      expect(extension.getBoundingClientRect().height).toBe(64)
    })

    it('should ignore scrolling when the toolbar is not an app bar', async () => {
      const el = basic({ scroll: 'hide' })
      await settle()

      const target = scroller(el)

      await scrollTo(target, 400)

      expect(el.style.transform).toBe('')
      expect(Object.hasOwn(el.dataset, 'scrolled')).toBe(false)
    })

    it('should follow only a scroller beside the bar, not one elsewhere on the page or inside the bar', async () => {
      const el = basic({ appBar: true, scroll: 'hide' })
      await settle()

      const elsewhere = document.createElement('div')
      elsewhere.style.cssText = 'height: 100px; overflow: auto;'
      elsewhere.innerHTML = '<div style="height: 1000px"></div>'
      document.body.append(elsewhere)
      teardowns.push(() => elsewhere.remove())

      await scrollTo(elsewhere, 200)
      expect(el.style.transform).toBe('')

      const inner = document.createElement('div')
      inner.style.cssText = 'height: 10px; overflow: auto;'
      inner.innerHTML = '<div style="height: 1000px"></div>'
      el.querySelector('.quantum-toolbar__row')!.append(inner)

      await scrollTo(inner, 200)
      expect(el.style.transform).toBe('')

      const target = scroller(el)

      await scrollTo(target, 40)
      expect(el.style.transform).toBe('translateY(-40px)')
    })

    it('should warn in dev when an overlapping image space carries tabs', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(QuToolbar, { appBar: true, scroll: 'waterfall' }, () => [
        h(QuToolbar.Extension, { image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }, () => [
          h(QuTabs, { modelValue: 'a' }, () => [
            h(QuTabs.List, { label: 'Library' }, () => [h(QuTabs.Item, { label: 'A', value: 'a' })]),
          ]),
        ]),
      ]))
      await settle()

      await expect.poll(() => warn.mock.calls.length).toBe(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('cannot include tabs'))
    })
  })

  describe('search', () => {
    function searching (props: Record<string, unknown> = {}) {
      const open = shallowRef(false)
      const query = shallowRef('')
      const onSubmit = vi.fn()
      const onClear = vi.fn()
      const onVoice = vi.fn()

      const host = mount(() => h(QuToolbar, { variant: 'primary' }, () => [
        h(QuToolbar.Nav),
        h(QuToolbar.Title, () => 'Inbox'),
        h(QuToolbar.Actions, () => [
          h(QuButton, { icon: 'search', ariaLabel: 'Search', class: 'opener', onClick: () => {
            open.value = true
          } }),
        ]),
        h(QuToolbar.Search, {
          'open': open.value,
          'onUpdate:open': (value: boolean) => {
            open.value = value
          },
          'modelValue': query.value,
          'onUpdate:modelValue': (value: string) => {
            query.value = value
          },
          onSubmit,
          onClear,
          onVoice,
          ...props,
        }),
      ]))

      return { host, open, query, onSubmit, onClear, onVoice }
    }

    it('should replace the row with a role="search" form and focus the field', async () => {
      const { host, open } = searching()
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!

      expect(el.querySelector('form')).toBeNull()

      await userEvent.click(host.querySelector('.opener')!)
      await settle()

      const form = el.querySelector<HTMLFormElement>('.quantum-toolbar__search')!
      const input = form.querySelector<HTMLInputElement>('input')!

      expect(open.value).toBe(true)
      expect(Object.hasOwn(el.dataset, 'search')).toBe(true)
      expect(form.getAttribute('role')).toBe('search')
      expect(form.getAttribute('aria-label')).toBe('Search')
      expect(input.getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('aria-label')).toBe('Search')
      expect(input.placeholder).toBe('Search')
      await expect.poll(() => document.activeElement).toBe(input)
      expect(getComputedStyle(el.querySelector('.quantum-toolbar__title')!).display).toBe('none')
      expect(getComputedStyle(el.querySelector('.quantum-toolbar__nav')!).display).toBe('none')
      expect(getComputedStyle(input).fontSize).toBe('16px')
      expect(getComputedStyle(input).color).toBe('rgb(255, 255, 255)')
    })

    it('should keep the query in the model and submit it on Enter', async () => {
      const { host, open, query, onSubmit } = searching()
      open.value = true
      await settle()

      const input = host.querySelector<HTMLInputElement>('.quantum-toolbar__input')!

      await expect.poll(() => document.activeElement).toBe(input)
      await userEvent.keyboard('photos')

      expect(query.value).toBe('photos')

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith('photos')
      // Results show with the field visible but not focused.
      expect(input.value).toBe('photos')
      expect(document.activeElement).not.toBe(input)
      expect(query.value).toBe('photos')
    })

    it('should clear the query with the X and keep focus in the field', async () => {
      const { host, open, query, onClear } = searching()
      open.value = true
      await settle()

      const input = host.querySelector<HTMLInputElement>('.quantum-toolbar__input')!

      await expect.poll(() => document.activeElement).toBe(input)
      expect(host.querySelector('.quantum-toolbar__clear')).toBeNull()

      await userEvent.keyboard('cats')
      await settle()

      const clear = host.querySelector<HTMLElement>('.quantum-toolbar__clear')!

      expect(clear.getAttribute('aria-label')).toBe('Clear')

      await userEvent.click(clear)
      await settle()

      expect(onClear).toHaveBeenCalledTimes(1)
      expect(query.value).toBe('')
      expect(input.value).toBe('')
      expect(document.activeElement).toBe(input)
    })

    it('should close on the up arrow and return focus to the search action', async () => {
      const { host, open } = searching()
      await settle()

      const opener = host.querySelector<HTMLElement>('.opener')!

      await userEvent.click(opener)
      await settle()

      const back = host.querySelector<HTMLElement>('.quantum-toolbar__back')!

      expect(back.getAttribute('aria-label')).toBe('Back')
      expect(paths(back)).toEqual(quantumIcons['arrow-back'])

      await userEvent.click(back)
      await settle()

      expect(open.value).toBe(false)
      expect(host.querySelector('form')).toBeNull()
      expect(Object.hasOwn(host.querySelector<HTMLElement>('.quantum-toolbar')!.dataset, 'search')).toBe(false)
      await expect.poll(() => document.activeElement).toBe(opener)
    })

    it('should close the suggestions on Escape and the search on a second Escape', async () => {
      const { host, open } = searching({ history: ['beach', 'birthday'] })
      open.value = true
      await settle()

      const input = host.querySelector<HTMLInputElement>('.quantum-toolbar__input')!

      await expect.poll(() => input.getAttribute('aria-expanded')).toBe('true')

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(input.getAttribute('aria-expanded')).toBe('false')
      expect(open.value).toBe(true)

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
    })

    it('should offer history before typing and completions while typing, and submit a chosen one', async () => {
      const { host, open, query, onSubmit } = searching({ history: ['beach'], suggestions: ['bears', 'bees'] })
      open.value = true
      await settle()

      const list = host.querySelector<HTMLElement>('.quantum-toolbar__suggestions')!

      await expect.poll(() => list.matches(':popover-open')).toBe(true)

      function rows () {
        return [...list.querySelectorAll<HTMLElement>('[role="option"]')].filter(row => row.style.display !== 'none')
      }

      expect(rows().map(row => row.textContent)).toEqual(['beach'])
      expect(paths(rows()[0]!)).toEqual(quantumIcons.history)
      expect(rows()[0]!.getBoundingClientRect().height).toBe(48)

      await userEvent.keyboard('bea')
      await settle()

      expect(rows().map(row => row.textContent)).toEqual(['beach', 'bears'])
      expect(paths(rows()[1]!)).toEqual(quantumIcons.search)

      await userEvent.click(rows()[1]!)
      await settle()

      expect(onSubmit).toHaveBeenCalledWith('bears')
      expect(query.value).toBe('bears')
    })

    it('should emit voice from the microphone action when voice is set', async () => {
      const { host, open, onVoice } = searching({ voice: true })
      open.value = true
      await settle()

      const mic = host.querySelector<HTMLElement>('.quantum-toolbar__voice')!

      expect(mic.getAttribute('aria-label')).toBe('Voice search')

      await userEvent.click(mic)

      expect(onVoice).toHaveBeenCalledTimes(1)
    })
  })

  describe('contextual', () => {
    function selecting (contextual: boolean) {
      const onClear = vi.fn()
      const host = mount(() => h(QuToolbar, { contextual }, () => [
        h(QuToolbar.Nav),
        h(QuToolbar.Title, () => 'Photos'),
        h(QuToolbar.Contextual, { count: 3, onClear }, () => [
          h(QuToolbar.Actions, () => [h(QuButton, { icon: 'delete', ariaLabel: 'Delete', class: 'delete' })]),
        ]),
      ]))

      return { host, onClear }
    }

    it('should render nothing outside selection mode', async () => {
      const { host } = selecting(false)
      await settle()

      expect(host.querySelector('.quantum-toolbar__contextual')).toBeNull()
    })

    it('should swap the row for close, "N selected" and the actions', async () => {
      const { host } = selecting(true)
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const bar = el.querySelector<HTMLElement>('.quantum-toolbar__contextual')!
      const count = bar.querySelector<HTMLElement>('.quantum-toolbar__count')!

      expect(Object.hasOwn(el.dataset, 'contextual')).toBe(true)
      expect(count.textContent).toBe('3 selected')
      expect(getComputedStyle(count).fontSize).toBe('20px')
      expect(count.getBoundingClientRect().left - el.getBoundingClientRect().left).toBe(80)
      expect(bar.querySelector('.quantum-toolbar__close')!.getAttribute('aria-label')).toBe('Close')
      expect(getComputedStyle(el.querySelector('.quantum-toolbar__title')!).display).toBe('none')
      expect(getComputedStyle(el.querySelector('.quantum-toolbar__nav')!).display).toBe('none')
    })

    it('should keep the count on the 80 dp keyline in a dense bar', async () => {
      const host = mount(() => h(QuToolbar, { contextual: true, dense: true }, () => [
        h(QuToolbar.Contextual, { count: 2 }),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-toolbar')!
      const count = el.querySelector<HTMLElement>('.quantum-toolbar__count')!

      expect(el.querySelector('.quantum-toolbar__close')!.getBoundingClientRect().width).toBe(40)
      expect(count.getBoundingClientRect().left - el.getBoundingClientRect().left).toBe(80)
    })

    it('should read the count copy from its own locale key, not the bare Selected label', async () => {
      const plugin = createLocalePlugin({
        default: 'en',
        messages: { en: { Quantum: { selected: 'Selected', selectedCount: '{0} chosen' } } },
      })
      const host = mount(() => h(QuToolbar, { contextual: true }, () => [
        h(QuToolbar.Contextual, { count: 4 }),
      ]), app => app.use(plugin))
      await settle()

      expect(host.querySelector('.quantum-toolbar__count')!.textContent).toBe('4 chosen')
    })

    it('should emit clear from the close action and from Escape', async () => {
      const { host, onClear } = selecting(true)
      await settle()

      await userEvent.click(host.querySelector('.quantum-toolbar__close')!)

      expect(onClear).toHaveBeenCalledTimes(1)

      host.querySelector<HTMLElement>('.delete')!.focus()
      await userEvent.keyboard('{Escape}')

      expect(onClear).toHaveBeenCalledTimes(2)
    })
  })

  describe('orphans', () => {
    it('should warn once per part rendered outside QuToolbar and still render it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h(QuToolbar.Nav),
        h(QuToolbar.Title, () => 'Title'),
        h(QuToolbar.Actions),
        h(QuToolbar.Contextual),
        h(QuToolbar.Extension),
        h(QuToolbar.Search),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(6)

      for (const part of ['Nav', 'Title', 'Actions', 'Contextual', 'Extension', 'Search']) {
        expect(warn).toHaveBeenCalledWith(expect.stringContaining(`[QuToolbar${part}] rendered outside <QuToolbar>`))
      }

      expect(host.querySelector('.quantum-toolbar__nav')).not.toBeNull()
      expect(host.querySelector('.quantum-toolbar__contextual')).not.toBeNull()
    })

    it('should not warn for parts inside the toolbar', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      basic({}, () => [h(QuToolbar.Contextual), h(QuToolbar.Extension), h(QuToolbar.Search)])
      await settle()

      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe('theme', () => {
    it('should take its surfaces and ink from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuToolbar, () => [h(QuToolbar.Title, () => 'Light')])]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuToolbar, () => [
          h(QuToolbar.Nav),
          h(QuToolbar.Title, () => 'Dark'),
        ])]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuToolbar, { variant: 'primary' }, () => [h(QuToolbar.Title, () => 'Primary')])]),
      ]))
      await settle()

      const [light, dark, primary] = host.querySelectorAll<HTMLElement>('.quantum-toolbar')

      expect(getComputedStyle(light!).backgroundColor).toBe('rgb(245, 245, 245)')
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgb(33, 33, 33)')
      expect(getComputedStyle(dark!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.quantum-toolbar__nav')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(primary!).backgroundColor).toBe('rgb(63, 81, 181)')
    })
  })
})

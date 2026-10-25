import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1BottomNavigation, Md1BottomNavigationAction } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1BottomNavigationActionProps } from './Md1BottomNavigationAction.vue'
import type { App, Ref, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'

/** Vuetify 1.5's pixel recipes for the bar's handset (8 dp) and desktop (6 dp) levels. */
const ELEVATION_8 = '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'
const ELEVATION_6 = '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'

const DESTINATIONS: Md1BottomNavigationActionProps[] = [
  { icon: 'history', label: 'Recents', value: 'recents' },
  { icon: 'favorite', label: 'Favorites', value: 'favorites' },
  { icon: 'place', label: 'Nearby', value: 'nearby' },
  { icon: 'person', label: 'Profile', value: 'profile' },
  { icon: 'settings', label: 'Settings', value: 'settings' },
  { icon: 'search', label: 'Search', value: 'search' },
]

const teardowns: (() => void)[] = []

/**
 * Mounts inside a 360 x 240 "screen": `contain: layout paint` makes it the
 * containing block of the fixed bar, the way the docs wrapper does, so the bar
 * measures against a handset width instead of the tester viewport.
 */
function mount (node: () => VNode, { width = 360, setup }: { width?: number, setup?: (app: App) => void } = {}): HTMLElement {
  const host = document.createElement('div')
  host.style.cssText = `position: relative; width: ${width}px; height: 240px; contain: layout paint;`
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

interface BarOptions {
  count?: number
  model?: Ref<unknown>
  props?: Record<string, unknown>
  actions?: Partial<Md1BottomNavigationActionProps & Record<string, unknown>>[]
  width?: number
  setup?: (app: App) => void
}

function bar ({ count = 3, model, props = {}, actions, width, setup }: BarOptions = {}) {
  const list = actions
    ? actions.map((action, index) => ({ ...DESTINATIONS[index], ...action }))
    : DESTINATIONS.slice(0, count)

  const host = mount(() => h(Md1BottomNavigation, {
    ...props,
    ...(model
      ? {
          'modelValue': model.value,
          'onUpdate:modelValue': (value: unknown) => {
            model.value = value
          },
        }
      : {}),
  }, () => list.map(action => h(Md1BottomNavigationAction, action as Md1BottomNavigationActionProps))), { width, setup })

  const nav = host.querySelector<HTMLElement>('nav')!

  return {
    host,
    nav,
    items: () => [...nav.querySelectorAll<HTMLElement>('.md1-bottom-navigation__action')],
  }
}

function label (el: HTMLElement): HTMLElement {
  return el.querySelector<HTMLElement>('.md1-bottom-navigation__label')!
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

function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  // The reduced-motion adapter writes the body attribute on install and never clears it.
  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quBottomNavigation', () => {
  describe('anatomy', () => {
    it('should render a nav of native buttons, each with the ripple first, the icon and the label', async () => {
      const { nav, items } = bar()
      await settle()

      expect(nav.tagName).toBe('NAV')
      expect(nav.classList.contains('md1-bottom-navigation')).toBe(true)
      expect(nav.dataset.variant).toBe('surface')
      expect(Object.hasOwn(nav.dataset, 'shifting')).toBe(false)
      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)

      const list = items()

      expect(list).toHaveLength(3)

      for (const [index, el] of list.entries()) {
        expect(el.tagName).toBe('BUTTON')
        expect((el as HTMLButtonElement).type).toBe('button')
        expect(el.firstElementChild!.classList.contains('md1-ripple')).toBe(true)

        const svg = el.querySelector('.md1-bottom-navigation__icon svg')!

        expect(svg.classList.contains('md1-icon')).toBe(true)
        expect(svg.getAttribute('aria-hidden')).toBe('true')
        expect(label(el).textContent).toBe(DESTINATIONS[index]!.label)
      }
    })

    it('should attach Action to the root and keep the flat name', () => {
      expect(Md1BottomNavigation.Action).toBe(Md1BottomNavigationAction)
    })

    it('should fix a 56 dp surface bar across the bottom of its screen', async () => {
      const { host, nav } = bar()
      await settle()

      const screen = host.getBoundingClientRect()
      const rect = nav.getBoundingClientRect()
      const computed = getComputedStyle(nav)

      expect(computed.position).toBe('fixed')
      expect(computed.zIndex).toBe('4')
      expect(rect.height).toBe(56)
      expect(rect.width).toBe(360)
      expect(rect.bottom).toBe(screen.bottom)
      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.fontFamily).toContain('Roboto')
    })

    it('should rest at the desktop 6 dp under a fine pointer', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const { nav } = bar()
      await settle()

      expect(getComputedStyle(nav).boxShadow).toBe(serialize('boxShadow', ELEVATION_6))
    })

    it('should rest at 8 dp outside the fine-pointer rule, the handset value', () => {
      bar()

      // Headless Chromium cannot switch to a coarse pointer inside one page; read the rule outside every @media block.
      const found = rule('.md1-bottom-navigation')

      expect(found).toBeDefined()
      expect(found!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-8, ${ELEVATION_8})`)
      expect(found!.style.paddingBottom || found!.style.getPropertyValue('padding-block-end')).toContain('safe-area-inset-bottom')
    })
  })

  describe('fixed', () => {
    it('should split three actions evenly and show every label', async () => {
      const { items } = bar()
      await settle()

      for (const el of items()) {
        const rect = el.getBoundingClientRect()

        expect(rect.width).toBe(120)
        expect(rect.height).toBe(56)
        expect(getComputedStyle(label(el)).opacity).toBe('1')
        expect(getComputedStyle(label(el)).paddingLeft).toBe('12px')
        expect(getComputedStyle(label(el)).paddingRight).toBe('12px')
      }
    })

    it('should tint the active action with the primary colour, 6 dp above the icon and a 14 sp label', async () => {
      const { items } = bar()
      await settle()

      const [active, inactive] = items()

      expect(Object.hasOwn(active!.dataset, 'selected')).toBe(true)
      expect(getComputedStyle(active!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(active!).paddingTop).toBe('6px')
      expect(getComputedStyle(label(active!)).fontSize).toBe('14px')
      expect(getComputedStyle(label(active!)).fontWeight).toBe('400')

      const icon = active!.querySelector('svg')!.getBoundingClientRect()

      expect(icon.top - active!.getBoundingClientRect().top).toBe(6)
      expect(icon.width).toBe(24)
      expect(icon.height).toBe(24)

      expect(Object.hasOwn(inactive!.dataset, 'selected')).toBe(false)
      expect(getComputedStyle(inactive!).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(inactive!).paddingTop).toBe('8px')
      expect(getComputedStyle(label(inactive!)).fontSize).toBe('12px')
    })

    it('should keep the label 10 dp above the bottom edge on one line', async () => {
      const { items } = bar()
      await settle()

      for (const el of items()) {
        expect(el.getBoundingClientRect().bottom - label(el).getBoundingClientRect().bottom).toBe(10)
        expect(getComputedStyle(label(el)).whiteSpace).toBe('nowrap')
      }
    })

    it('should hold actions between 80 and 168 dp, centring the group when the cap binds', async () => {
      const { nav, items } = bar({ width: 800 })
      await settle()

      const list = items()
      const total = list.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
      const rect = nav.getBoundingClientRect()

      for (const el of list) {
        expect(el.getBoundingClientRect().width).toBe(168)
      }

      expect(list[0]!.getBoundingClientRect().left - rect.left).toBe((800 - total) / 2)
      expect(getComputedStyle(list[0]!).minWidth).toBe('80px')
    })

    it('should drop the inactive labels and centre their icons with four or five actions', async () => {
      const { items } = bar({ count: 4 })
      await settle()

      const [active, ...rest] = items()

      expect(active!.getBoundingClientRect().width).toBe(90)
      expect(getComputedStyle(label(active!)).opacity).toBe('1')

      for (const el of rest) {
        const icon = el.querySelector('svg')!.getBoundingClientRect()
        const rect = el.getBoundingClientRect()

        expect(getComputedStyle(label(el)).opacity).toBe('0')
        expect(getComputedStyle(label(el)).position).toBe('absolute')
        expect(icon.top - rect.top).toBe(16)
        expect(rect.bottom - icon.bottom).toBe(16)
        // Hidden from sight only: the label is still the action's accessible name.
        expect(label(el).textContent).not.toBe('')
        expect(getComputedStyle(label(el)).visibility).toBe('visible')
      }
    })
  })

  describe('shifting', () => {
    it('should hold the active action at its 96 dp minimum, share the rest equally and narrow them to icons', async () => {
      const { nav, items } = bar({ count: 4, props: { shifting: true } })
      await settle()

      expect(Object.hasOwn(nav.dataset, 'shifting')).toBe(true)

      const [active, ...rest] = items()

      // Equal shares (Vuetify 1.5's flex): 90 dp each, the active one raised to its 96 dp minimum.
      expect(active!.getBoundingClientRect().width).toBe(96)
      expect(getComputedStyle(label(active!)).opacity).toBe('1')
      expect(getComputedStyle(active!).paddingTop).toBe('6px')

      for (const el of rest) {
        expect(el.getBoundingClientRect().width).toBe(88)
        expect(getComputedStyle(label(el)).opacity).toBe('0')
        expect(getComputedStyle(el).paddingTop).toBe('16px')
      }
    })

    it('should keep five shifting actions inside 96 to 168 dp active and 56 to 96 dp inactive', async () => {
      const { items } = bar({ count: 5, props: { shifting: true } })
      await settle()

      const [active, ...rest] = items()

      expect(active!.getBoundingClientRect().width).toBe(96)

      for (const el of rest) {
        const width = el.getBoundingClientRect().width

        expect(width).toBeGreaterThanOrEqual(56)
        expect(width).toBeLessThanOrEqual(96)
      }
    })

    it('should cap the shifting widths at 168 and 96 dp on a wide bar', async () => {
      const { items } = bar({ count: 4, props: { shifting: true }, width: 900 })
      await settle()

      const [active, ...rest] = items()

      expect(active!.getBoundingClientRect().width).toBe(168)

      for (const el of rest) {
        expect(el.getBoundingClientRect().width).toBe(96)
      }
    })

    it('should move the wide slot and the label with the selection', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ count: 4, model, props: { shifting: true } })
      await settle()

      await userEvent.click(items()[2]!)
      await settle()

      expect(model.value).toBe('nearby')

      const list = items()

      expect(list[2]!.getBoundingClientRect().width).toBe(96)
      expect(list[0]!.getBoundingClientRect().width).toBe(88)
      expect(getComputedStyle(label(list[2]!)).opacity).toBe('1')
      expect(getComputedStyle(label(list[0]!)).opacity).toBe('0')
    })

    // Under 320 px the minimums overflowed the bar, and the centred group
    // pushed the first action past the start edge.
    it('should share a bar narrower than the minimum widths instead of overflowing it', async () => {
      const fixed = bar({ count: 4, width: 270 })
      const shifting = bar({ count: 5, props: { shifting: true }, width: 270 })
      await settle()

      for (const { nav, items } of [fixed, shifting]) {
        const box = nav.getBoundingClientRect()
        const list = items()

        expect(list[0]!.getBoundingClientRect().left).toBeGreaterThanOrEqual(box.left)
        expect(list.at(-1)!.getBoundingClientRect().right).toBeLessThanOrEqual(box.right + 0.5)
      }

      expect(shifting.items()[0]!.getBoundingClientRect().width).toBeCloseTo(270 / 5, 1)
    })
  })

  describe('variants', () => {
    it('should fill the primary bar and force on-primary ink, the inactive at 70%', async () => {
      const { nav, items } = bar({ props: { variant: 'primary' } })
      await settle()

      const [active, inactive] = items()

      expect(nav.dataset.variant).toBe('primary')
      expect(getComputedStyle(nav).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(active!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(inactive!).color).toBe(serialize('color', 'color-mix(in srgb, #FFFFFF 70%, transparent)'))
    })

    it('should drop a disabled action on the primary bar to on-primary at 50%', async () => {
      const { items } = bar({ props: { variant: 'primary' }, actions: [{}, { disabled: true }, {}] })
      await settle()

      expect(getComputedStyle(items()[1]!).color).toBe(serialize('color', 'color-mix(in srgb, #FFFFFF 50%, transparent)'))
    })

    it('should follow a consumer primary whose palette ink is black', async () => {
      style('.md1-docs-test-amber { --md1-primary: #FFC107; --md1-on-primary: #000000; }')

      const { nav, items } = bar({ props: { variant: 'primary', class: 'md1-docs-test-amber' } })
      await settle()

      expect(getComputedStyle(nav).backgroundColor).toBe('rgb(255, 193, 7)')
      expect(getComputedStyle(items()[0]!).color).toBe('rgb(0, 0, 0)')
    })
  })

  describe('selection', () => {
    it('should select the first action when no model is bound, and mark it aria-current', async () => {
      const { items } = bar()
      await settle()

      const list = items()

      expect(list[0]!.getAttribute('aria-current')).toBe('page')
      expect(list[1]!.hasAttribute('aria-current')).toBe(false)
      expect(list.filter(el => Object.hasOwn(el.dataset, 'selected'))).toHaveLength(1)
    })

    it('should honour the initial model and round-trip clicks through v-model', async () => {
      const model = shallowRef<unknown>('favorites')
      const { items } = bar({ model })
      await settle()

      expect(items()[1]!.getAttribute('aria-current')).toBe('page')

      await userEvent.click(items()[2]!)
      await settle()

      expect(model.value).toBe('nearby')
      expect(items()[2]!.getAttribute('aria-current')).toBe('page')
      expect(items()[1]!.hasAttribute('aria-current')).toBe(false)
    })

    it('should follow the model when it changes from outside', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model })
      await settle()

      // The render function reads the ref, so the parent re-renders with the new value.
      model.value = 'nearby'
      await settle()

      expect(items()[2]!.getAttribute('aria-current')).toBe('page')
      expect(items()[0]!.hasAttribute('aria-current')).toBe(false)
    })

    it('should keep the active action active when it is tapped again', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model })
      await settle()

      await userEvent.click(items()[0]!)
      await settle()

      expect(model.value).toBe('recents')
      expect(items()[0]!.getAttribute('aria-current')).toBe('page')
    })

    it('should fall back to a generated value when an action has none', async () => {
      const model = shallowRef<unknown>()
      const { items } = bar({ model, actions: [{ value: undefined }, { value: undefined }, { value: undefined }] })
      await settle()

      await userEvent.click(items()[1]!)
      await settle()

      expect(typeof model.value).toBe('string')
      expect(items()[1]!.getAttribute('aria-current')).toBe('page')
    })

    it('should chain a consumer click after the selection', async () => {
      const seen: unknown[] = []
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model, actions: [{}, { onClick: () => seen.push(model.value) }, {}] })
      await settle()

      await userEvent.click(items()[1]!)

      expect(seen).toEqual(['favorites'])
    })
  })

  describe('keyboard', () => {
    it('should tab through every action and select with Enter and Space', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model })
      await settle()

      const list = items()

      await userEvent.tab()
      expect(document.activeElement).toBe(list[0])

      await userEvent.tab()
      expect(document.activeElement).toBe(list[1])

      await userEvent.keyboard('{Enter}')
      await settle()
      expect(model.value).toBe('favorites')

      await userEvent.tab()
      await userEvent.keyboard(' ')
      await settle()
      expect(model.value).toBe('nearby')
    })

    it('should show the 12% focus overlay for keyboard focus only', async () => {
      const { items } = bar()
      await settle()

      const el = items()[1]!

      await userEvent.tab()
      await userEvent.tab()

      expect(el.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(el).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, rgba(0, 0, 0, 0.54) 12%, transparent)'))
    })

    it('should draw the 12% hover overlay of the ink on an inactive action and none on the active one', async () => {
      const { items } = bar()
      await settle()

      const [active, el] = items()

      await userEvent.hover(el!)

      await expect.poll(() => getComputedStyle(el!).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, rgba(0, 0, 0, 0.54) 12%, transparent)'))

      await userEvent.hover(active!)

      expect(Object.hasOwn(active!.dataset, 'selected')).toBe(true)
      await expect.poll(() => getComputedStyle(active!).backgroundColor).toBe('rgba(0, 0, 0, 0)')

      await userEvent.unhover(active!)
    })
  })

  describe('disabled', () => {
    it('should take a disabled action out of the tab order and the selection', async () => {
      const model = shallowRef<unknown>('recents')
      let clicks = 0
      const { items } = bar({ model, actions: [{}, { disabled: true, onClick: () => clicks++ }, {}] })
      await settle()

      const el = items()[1]! as HTMLButtonElement

      expect(el.disabled).toBe(true)
      expect(el.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)
      expect(el.getAttribute('tabindex')).toBe('-1')
      expect(getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(el).pointerEvents).toBe('none')

      el.click()
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
      await settle()

      expect(clicks).toBe(0)
      expect(model.value).toBe('recents')
      expect(el.querySelectorAll('.md1-ripple__ink')).toHaveLength(0)

      await userEvent.tab()
      await userEvent.tab()

      expect(document.activeElement).toBe(items()[2])
    })

    it('should skip a disabled first action when it picks the default', async () => {
      const { items } = bar({ actions: [{ disabled: true }, {}, {}] })
      await settle()

      expect(items()[0]!.hasAttribute('aria-current')).toBe(false)
      expect(items()[1]!.getAttribute('aria-current')).toBe('page')
    })
  })

  describe('links', () => {
    it('should render an anchor when href is set and select it on click', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model, actions: [{ href: '#recents' }, { href: '#favorites' }, { href: '#nearby' }] })
      await settle()

      const el = items()[1]!

      expect(el.tagName).toBe('A')
      expect(el.getAttribute('href')).toBe('#favorites')
      expect(el.hasAttribute('role')).toBe(false)
      expect(el.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(getComputedStyle(el).textDecorationLine).toBe('none')

      await userEvent.click(el)
      await settle()

      expect(model.value).toBe('favorites')
      expect(el.getAttribute('aria-current')).toBe('page')

      history.replaceState(null, '', location.pathname + location.search)
    })

    it('should make a disabled link inert: no href, aria-disabled, out of the tab order', async () => {
      const model = shallowRef<unknown>('recents')
      const { items } = bar({ model, actions: [{ href: '#recents' }, { href: '#favorites', disabled: true }, { href: '#nearby' }] })
      await settle()

      const el = items()[1]!

      expect(el.hasAttribute('href')).toBe(false)
      expect(el.getAttribute('aria-disabled')).toBe('true')
      expect(el.getAttribute('tabindex')).toBe('-1')
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)

      el.click()
      await settle()

      expect(model.value).toBe('recents')
    })
  })

  describe('hide on scroll', () => {
    function scroller (host: HTMLElement): HTMLElement {
      const el = document.createElement('div')
      el.style.cssText = 'height: 240px; overflow: auto;'
      el.innerHTML = '<div style="height: 2000px"></div>'
      host.prepend(el)
      return el
    }

    it('should slide off on a downward scroll and return on an upward one', async () => {
      const { host, nav } = bar({ props: { hideOnScroll: true } })
      await settle()

      const content = scroller(host)

      content.scrollTop = 200
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(true)
      expect(getComputedStyle(nav).transform).toBe('matrix(1, 0, 0, 1, 0, 56)')
      expect(getComputedStyle(nav).boxShadow).toBe('none')

      content.scrollTop = 100
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
      expect(getComputedStyle(nav).transform).toBe('none')
    })

    it('should come back when focus moves into it while hidden', async () => {
      const { host, nav, items } = bar({ props: { hideOnScroll: true } })
      await settle()

      const content = scroller(host)

      content.scrollTop = 300
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(true)

      items()[0]!.focus()
      await settle()

      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    it('should bring a hidden bar back when hideOnScroll is switched off', async () => {
      const enabled = shallowRef(true)
      const host = mount(() => h(Md1BottomNavigation, { hideOnScroll: enabled.value }, () => DESTINATIONS.slice(0, 3).map(action => h(Md1BottomNavigationAction, action))))
      await settle()

      const nav = host.querySelector<HTMLElement>('nav')!
      const content = scroller(host)

      content.scrollTop = 300
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(true)

      enabled.value = false
      await settle()

      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)

      content.scrollTop = 600
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    it('should stay put without hideOnScroll', async () => {
      const { host, nav } = bar()
      await settle()

      const content = scroller(host)

      content.scrollTop = 300
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    it('should ignore a scroller outside the bar\'s screen', async () => {
      const { nav } = bar({ props: { hideOnScroll: true } })
      await settle()

      const outside = document.createElement('div')
      outside.style.cssText = 'height: 100px; overflow: auto;'
      outside.innerHTML = '<div style="height: 1000px"></div>'
      document.body.append(outside)
      teardowns.push(() => outside.remove())

      outside.scrollTop = 300
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    /** Makes the document scrollable for one test and scrolls it back afterwards. */
    function tall () {
      const spacer = document.createElement('div')
      spacer.style.height = '3000px'
      document.body.append(spacer)
      teardowns.push(() => {
        window.scrollTo(0, 0)
        spacer.remove()
      })
    }

    it('should follow the document scroll when the bar is pinned to the viewport', async () => {
      const host = document.createElement('div')
      document.body.append(host)
      const app = createApp({
        render: () => h(Md1BottomNavigation, { hideOnScroll: true }, () => DESTINATIONS.slice(0, 3).map(action => h(Md1BottomNavigationAction, action))),
      })
      app.mount(host)
      teardowns.push(() => {
        app.unmount()
        host.remove()
      })
      tall()
      await settle()

      const nav = host.querySelector<HTMLElement>('nav')!

      expect(nav.offsetParent).toBeNull()

      window.scrollTo(0, 400)
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(true)

      window.scrollTo(0, 200)
      await expect.poll(() => Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    it('should ignore the document scroll when a container holds the fixed bar', async () => {
      const { host, nav } = bar({ props: { hideOnScroll: true } })
      tall()
      await settle()

      // The docs screen case: `contain` makes the wrapper the bar's containing block.
      expect(nav.offsetParent).toBe(host)

      window.scrollTo(0, 400)
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      expect(window.scrollY).toBe(400)
      expect(Object.hasOwn(nav.dataset, 'hidden')).toBe(false)
    })

    it('should animate hide and reveal on the sharp curve at the standard duration', async () => {
      const { nav } = bar({
        props: { hideOnScroll: true },
        setup: app => {
          app.use(createReducedMotionPlugin({ mode: 'never' }))
        },
      })
      await settle()

      const computed = getComputedStyle(nav)

      expect(computed.transitionProperty).toContain('transform')
      expect(computed.transitionTimingFunction).toContain('cubic-bezier(0.4, 0, 0.6, 1)')
      // Desktop (fine pointer) durations: the standard step is 200 ms there, 300 ms on a handset.
      expect(['0.2s', '0.3s']).toContain(computed.transitionDuration.split(',')[0]!.trim())
    })
  })

  describe('accessibility', () => {
    it('should pass aria-label through to the navigation landmark', async () => {
      const { nav } = bar({ props: { 'aria-label': 'Main' } })
      await settle()

      expect(nav.getAttribute('aria-label')).toBe('Main')
    })

    it('should name an icon-only action through ariaLabel', async () => {
      const { items } = bar({ actions: [{ label: undefined, ariaLabel: 'Recents' }, {}, {}] })
      await settle()

      const el = items()[0]!

      expect(el.getAttribute('aria-label')).toBe('Recents')
      expect(label(el)).toBeNull()
    })

    it('should warn in dev when an action has neither label nor ariaLabel', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      bar({ actions: [{ label: undefined }, {}, {}] })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
    })

    it('should draw the ink from the press point on an enabled action', async () => {
      const { items } = bar({ setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await settle()

      const el = items()[1]!
      const rect = el.getBoundingClientRect()

      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: rect.left + 10, clientY: rect.top + 10 }))
      await settle()

      expect(el.querySelectorAll('.md1-ripple__ink')).toHaveLength(1)

      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))
    })
  })

  describe('warnings', () => {
    it('should warn once for an action rendered outside a bar, and still render it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1BottomNavigationAction, { icon: 'history', label: 'Recents' }))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1BottomNavigationAction'))

      const el = host.querySelector<HTMLElement>('.md1-bottom-navigation__action')!

      await userEvent.click(el)

      expect(el.hasAttribute('aria-current')).toBe(false)
    })

    it('should link actions to a bar under a custom namespace without an orphan warning', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const model = shallowRef<unknown>('recents')
      const namespace = 'md1:test'
      const { items } = bar({
        model,
        props: { namespace },
        actions: [{ namespace }, { namespace }, { namespace }],
      })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
      expect(items()[0]!.getAttribute('aria-current')).toBe('page')

      await userEvent.click(items()[1]!)
      await settle()

      expect(model.value).toBe('favorites')
    })

    it('should not warn for three to five actions', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      bar({ count: 3 })
      bar({ count: 5 })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn in dev below three destinations', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      bar({ count: 2 })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('three to five'))
    })

    it('should warn in dev above five destinations', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      bar({ count: 6 })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('renders 6'))
    })
  })

  describe('theme', () => {
    it('should take its surface and ink from the adapter sheet in both themes and keep the primary active ink on the dark one', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1BottomNavigation, {}, () => DESTINATIONS.slice(0, 3).map(action => h(Md1BottomNavigationAction, action))),
        h(Md1BottomNavigation, { variant: 'primary' }, () => DESTINATIONS.slice(0, 3).map(action => h(Md1BottomNavigationAction, action))),
      ]))
      await settle()

      const [nav, coloured] = host.querySelectorAll<HTMLElement>('nav')
      const [active, inactive] = nav!.querySelectorAll<HTMLElement>('.md1-bottom-navigation__action')

      expect(getComputedStyle(nav!).backgroundColor).toBe('rgb(66, 66, 66)')
      // Vuetify 1.5 keeps the hue on the dark bar, Indigo 500 at under 2:1 on Grey 800 (SPEC.md Known limitations).
      expect(getComputedStyle(active!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(inactive!).color).toBe('rgba(255, 255, 255, 0.7)')
      // The coloured bar is a primary fill: the fill and its on-primary ink stay as they are.
      expect(getComputedStyle(coloured!).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(coloured!.querySelector('.md1-bottom-navigation__action')!).color).toBe('rgb(255, 255, 255)')
    })
  })
})

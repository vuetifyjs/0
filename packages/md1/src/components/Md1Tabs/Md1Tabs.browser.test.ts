import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, Tabs } from '@vuetify/v0'

// Components
import { Md1Tabs } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1IconName } from '../../icons'
import type { App, Component, ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'

interface Tab {
  value: string
  label?: string
  icon?: Md1IconName
  disabled?: boolean
  ariaLabel?: string
}

interface Options {
  props?: Record<string, unknown>
  list?: Record<string, unknown>
  tabs?: Tab[]
  model?: ShallowRef<string | undefined>
  /** The host's width in px: the bar's view. */
  width?: number
  wrap?: (node: VNode) => VNode
  setup?: (app: App) => void
  panels?: boolean
}

const THREE: Tab[] = [
  { value: 'songs', label: 'Songs' },
  { value: 'albums', label: 'Albums' },
  { value: 'artists', label: 'Artists' },
]

const teardowns: (() => void)[] = []

function mount (node: () => VNode, width?: number, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  if (width) host.style.width = `${width}px`
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

function tabs (options: Options = {}): HTMLElement {
  const { props = {}, list = {}, tabs = THREE, model, width, wrap, setup, panels = true } = options

  function root (): VNode {
    return h(Md1Tabs, {
      ...props,
      ...(model
        ? {
            'modelValue': model.value,
            'onUpdate:modelValue': (value: unknown) => {
              model.value = value as string | undefined
            },
          }
        : {}),
    }, () => [
      h(Md1Tabs.List, list, () => tabs.map(tab => h(Md1Tabs.Item, { key: tab.value, ...tab }))),
      ...(panels ? tabs.map(tab => h(Md1Tabs.Panel, { key: tab.value, value: tab.value }, () => `${tab.value} content`)) : []),
    ])
  }

  return mount(() => wrap ? wrap(root()) : root(), width, setup)
}

function items (host: HTMLElement): HTMLButtonElement[] {
  return [...host.querySelectorAll<HTMLButtonElement>('.md1-tabs__item')]
}

function panels (host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('.md1-tabs__panel')]
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a colour, so assertions never guess at formatting. */
function color (value: string): string {
  const probe = document.createElement('div')
  probe.style.color = value
  document.body.append(probe)
  const result = getComputedStyle(probe).color
  probe.remove()
  return result
}

let resized = false

/** The handset view: the runner's frame narrows, so the 600 px media queries switch too. */
async function handset () {
  resized = true
  await page.viewport(375, 800)
}

afterEach(async () => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  if (resized) {
    resized = false
    await page.viewport(1280, 800)
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

/** Resize observers and animation frames land after the Vue ticks. */
async function frames (count = 3) {
  for (let index = 0; index < count; index++) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }
  await settle()
}

describe('quTabs', () => {
  describe('anatomy', () => {
    it('should render the bar, the tablist, the tabs, the indicator and the panels', async () => {
      const host = tabs({ list: { label: 'Library' } })
      await settle()

      const root = host.firstElementChild as HTMLElement
      const bar = root.querySelector('.md1-tabs__bar')!
      const list = bar.querySelector('.md1-tabs__list')!
      const indicator = list.querySelector('.md1-tabs__indicator')!

      expect(root.classList.contains('md1-tabs')).toBe(true)
      expect(root.dataset.fixed).toBe('true')
      expect(Object.hasOwn(root.dataset, 'scrollable')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'overflow')).toBe(false)
      expect(list.getAttribute('role')).toBe('tablist')
      expect(list.getAttribute('aria-label')).toBe('Library')
      expect(list.getAttribute('aria-orientation')).toBe('horizontal')
      expect(indicator.tagName).toBe('SPAN')
      expect(indicator.getAttribute('aria-hidden')).toBe('true')
      expect(bar.querySelectorAll('.md1-tabs__arrow')).toHaveLength(0)

      const [first] = items(host)

      expect(first!.tagName).toBe('BUTTON')
      expect(first!.type).toBe('button')
      expect(first!.getAttribute('role')).toBe('tab')
      expect(first!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(first!.querySelector('.md1-tabs__label')!.textContent).toBe('Songs')
      expect(first!.querySelector('.md1-icon')).toBeNull()
      expect(Object.hasOwn(first!.dataset, 'icon')).toBe(false)
      expect(first!.dataset.lines).toBe('1')

      for (const panel of panels(host)) {
        expect(panel.getAttribute('role')).toBe('tabpanel')
        expect(panel.parentElement).toBe(root)
      }
    })

    it('should mark the scrollable bar', async () => {
      const host = tabs({ props: { scrollable: true } })
      await settle()

      const root = host.firstElementChild as HTMLElement

      expect(root.dataset.scrollable).toBe('true')
      expect(Object.hasOwn(root.dataset, 'fixed')).toBe(false)
    })

    it('should tie each tab to its panel with aria-controls and aria-labelledby', async () => {
      const host = tabs()
      await settle()

      const [tab] = items(host)
      const [panel] = panels(host)

      expect(tab!.getAttribute('aria-controls')).toBe(panel!.id)
      expect(panel!.getAttribute('aria-labelledby')).toBe(tab!.id)
    })

    it('should draw the icon-and-text tab with the glyph above the label', async () => {
      const host = tabs({
        tabs: [
          { value: 'recents', label: 'Recents', icon: 'phone' },
          { value: 'favorites', label: 'Favorites', icon: 'favorite' },
        ],
      })
      await settle()

      const [tab] = items(host)
      const glyph = tab!.querySelector('.md1-icon')!
      const text = tab!.querySelector('.md1-tabs__label')!

      expect(tab!.dataset.icon).toBe('stacked')
      expect(glyph.getBoundingClientRect().bottom).toBeLessThanOrEqual(text.getBoundingClientRect().top)
    })

    it('should draw an icon-only tab with no label', async () => {
      const host = tabs({
        tabs: [
          { value: 'phone', icon: 'phone', ariaLabel: 'Calls' },
          { value: 'favorite', icon: 'favorite', ariaLabel: 'Favourites' },
        ],
      })
      await settle()

      const [tab] = items(host)

      expect(tab!.dataset.icon).toBe('only')
      expect(tab!.querySelector('.md1-tabs__label')).toBeNull()
      expect(Object.hasOwn(tab!.dataset, 'lines')).toBe(false)
      expect(tab!.getAttribute('aria-label')).toBe('Calls')
      expect(tab!.querySelector('.md1-icon')!.getAttribute('aria-hidden')).toBe('true')
    })

    it('should take the label from the default slot over the prop', async () => {
      const host = mount(() => h(Md1Tabs, null, () => [
        h(Md1Tabs.List, null, () => [
          h(Md1Tabs.Item, { value: 'a', label: 'Prop' }, () => 'Slot'),
        ]),
      ]))
      await settle()

      expect(items(host)[0]!.textContent).toBe('Slot')
    })

    it('should land consumer attrs on the tab and the panel elements', async () => {
      const model = shallowRef<string | undefined>('a')
      let clicks = 0
      const host = mount(() => h(Md1Tabs, {
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value as string | undefined
        },
      }, () => [
        h(Md1Tabs.List, { class: 'bar' }, () => [
          h(Md1Tabs.Item, { value: 'a', label: 'A' }),
          h(Md1Tabs.Item, { 'value': 'b', 'label': 'B', 'class': 'tab', 'data-testid': 'b', 'onClick': () => clicks++ }),
        ]),
        h(Md1Tabs.Panel, { value: 'a', class: 'pane' }, () => 'A'),
      ]))
      await settle()

      const tab = host.querySelector<HTMLButtonElement>('[data-testid="b"]')!

      expect(host.querySelector('.md1-tabs__bar')!.classList.contains('bar')).toBe(true)
      expect(tab.classList.contains('md1-tabs__item')).toBe(true)
      expect(tab.classList.contains('tab')).toBe(true)
      expect(host.querySelector('.md1-tabs__panel')!.classList.contains('pane')).toBe(true)

      await userEvent.click(tab)
      await settle()

      // Both handlers run: the consumer's, and v0's selection.
      expect(clicks).toBe(1)
      expect(model.value).toBe('b')
    })

    it('should expose the parts on the root and as flat names', async () => {
      const module = await import('./index')

      expect(Md1Tabs.List).toBe(module.Md1TabsList)
      expect(Md1Tabs.Item).toBe(module.Md1TabsItem)
      expect(Md1Tabs.Panel).toBe(module.Md1TabsPanel)
    })
  })

  describe('selection', () => {
    it('should select the first tab when the model is empty', async () => {
      const model = shallowRef<string>()
      const host = tabs({ model })
      await settle()

      const [first, second] = items(host)
      const [one, two] = panels(host)

      expect(model.value).toBe('songs')
      expect(first!.dataset.selected).toBe('true')
      expect(first!.getAttribute('aria-selected')).toBe('true')
      expect(Object.hasOwn(second!.dataset, 'selected')).toBe(false)
      expect(one!.hidden).toBe(false)
      expect(two!.hidden).toBe(true)
    })

    it('should round-trip the model through a click', async () => {
      const model = shallowRef<string | undefined>('albums')
      const host = tabs({ model })
      await settle()

      const [first, second, third] = items(host)

      expect(second!.getAttribute('aria-selected')).toBe('true')

      await userEvent.click(third!)
      await settle()

      expect(model.value).toBe('artists')
      expect(third!.getAttribute('aria-selected')).toBe('true')
      expect(panels(host)[2]!.hidden).toBe(false)
      expect(panels(host)[1]!.hidden).toBe(true)

      model.value = 'songs'
      await settle()

      expect(first!.getAttribute('aria-selected')).toBe('true')
    })

    it('should keep exactly one tab in the tab order', async () => {
      const host = tabs({ model: shallowRef('albums') })
      await settle()

      expect(items(host).map(tab => tab.getAttribute('tabindex'))).toEqual(['-1', '0', '-1'])
    })
  })

  describe('keyboard', () => {
    it('should move and select with the arrow keys, wrapping at the ends', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({ model })
      await settle()

      const [first, second, third] = items(host)

      first!.focus()
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('albums')
      expect(document.activeElement).toBe(second)

      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('songs')
      expect(document.activeElement).toBe(first)

      await userEvent.keyboard('{ArrowLeft}')
      await settle()

      expect(model.value).toBe('artists')
      expect(document.activeElement).toBe(third)
    })

    it('should jump to the first and last tab with Home and End', async () => {
      const model = shallowRef<string | undefined>('albums')
      const host = tabs({ model })
      await settle()

      const [first, second, third] = items(host)

      second!.focus()
      await userEvent.keyboard('{End}')
      await settle()

      expect(model.value).toBe('artists')
      expect(document.activeElement).toBe(third)

      await userEvent.keyboard('{Home}')
      await settle()

      expect(model.value).toBe('songs')
      expect(document.activeElement).toBe(first)
    })

    it('should skip a disabled tab', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({
        model,
        tabs: [
          { value: 'songs', label: 'Songs' },
          { value: 'albums', label: 'Albums', disabled: true },
          { value: 'artists', label: 'Artists' },
        ],
      })
      await settle()

      items(host)[0]!.focus()
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('artists')
    })
  })

  describe('disabled', () => {
    it('should make a disabled tab inert to clicks and to the ripple', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({
        model,
        tabs: [
          { value: 'songs', label: 'Songs' },
          { value: 'albums', label: 'Albums', disabled: true },
        ],
      })
      await settle()

      const tab = items(host)[1]!

      expect(tab.disabled).toBe(true)
      expect(tab.dataset.disabled).toBe('true')
      expect(tab.getAttribute('aria-disabled')).toBe('true')

      tab.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      tab.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
      await settle()

      expect(model.value).toBe('songs')
      expect(tab.querySelectorAll('.md1-ripple__ink')).toHaveLength(0)
    })

    it('should disable a tab written as the bare disabled attribute', async () => {
      // A template's `<Md1Tabs.Item disabled>` passes an empty string; it must cast to true.
      const host = mount(() => h(Md1Tabs, { modelValue: 'songs' }, () => [
        h(Md1Tabs.List, {}, () => [
          h(Md1Tabs.Item, { label: 'Songs', value: 'songs' }),
          h(Md1Tabs.Item as Component, { disabled: '', label: 'Albums', value: 'albums' }),
        ]),
      ]))
      await settle()

      const tab = items(host)[1]!

      expect(tab.disabled).toBe(true)
      expect(tab.getAttribute('aria-disabled')).toBe('true')
    })

    it('should disable every tab from the root', async () => {
      const host = tabs({ props: { disabled: true } })
      await settle()

      const root = host.firstElementChild as HTMLElement

      expect(root.dataset.disabled).toBe('true')
      expect(host.querySelector('.md1-tabs__list')!.getAttribute('aria-disabled')).toBe('true')
      expect(items(host).every(tab => tab.disabled)).toBe(true)
    })
  })

  describe('ripple', () => {
    it('should draw ink from the press point inside the tab', async () => {
      const host = tabs()
      await settle()

      const tab = items(host)[1]!
      const rect = tab.getBoundingClientRect()

      expect(getComputedStyle(tab).position).toBe('relative')

      tab.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        clientX: rect.left + 10,
        clientY: rect.top + 10,
        pointerType: 'mouse',
      }))
      await settle()

      expect(tab.querySelectorAll('.md1-ripple__ink')).toHaveLength(1)
    })
  })

  describe('metrics', () => {
    it('should be 48 dp tall with the desktop 24 dp padding and 13 sp capitals', async () => {
      const host = tabs()
      await settle()

      const tab = items(host)[0]!
      const computed = getComputedStyle(tab)

      expect(matchMedia('(pointer: fine)').matches).toBe(true)
      expect(tab.getBoundingClientRect().height).toBe(48)
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('24px')
      expect(computed.fontSize).toBe('13px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.textTransform).toBe('uppercase')
      expect(computed.textAlign).toBe('center')
    })

    it('should be 72 dp tall with icons and text, 10 dp between a 24 dp glyph and the label', async () => {
      const host = tabs({
        tabs: [
          { value: 'recents', label: 'Recents', icon: 'phone' },
          { value: 'favorites', label: 'Favorites', icon: 'favorite' },
        ],
      })
      await settle()

      const tab = items(host)[0]!
      const glyph = tab.querySelector('.md1-icon')!.getBoundingClientRect()
      const text = tab.querySelector('.md1-tabs__label')!.getBoundingClientRect()

      expect(tab.getBoundingClientRect().height).toBe(72)
      expect(glyph.width).toBe(24)
      expect(glyph.height).toBe(24)
      expect(text.top - glyph.bottom).toBe(10)
    })

    it('should keep icon-only tabs at 48 dp', async () => {
      const host = tabs({
        tabs: [
          { value: 'phone', icon: 'phone', ariaLabel: 'Calls' },
          { value: 'favorite', icon: 'favorite', ariaLabel: 'Favourites' },
        ],
      })
      await settle()

      expect(items(host)[0]!.getBoundingClientRect().height).toBe(48)
    })

    it('should centre fixed tabs at the widest tab width when the margin exceeds 16 dp', async () => {
      const host = tabs({ width: 1280 })
      await frames()

      const bar = host.querySelector<HTMLElement>('.md1-tabs__bar')!
      const list = host.querySelector<HTMLElement>('.md1-tabs__list')!
      const widths = items(host).map(tab => tab.getBoundingClientRect().width)

      expect(bar.dataset.centered).toBe('true')
      expect(new Set(widths).size).toBe(1)
      expect(widths[0]).toBe(160)

      const outer = bar.getBoundingClientRect()
      const inner = list.getBoundingClientRect()

      expect(Math.round(inner.left - outer.left)).toBe(Math.round(outer.right - inner.right))
    })

    it('should go full width once the centred margin would be 16 dp or less', async () => {
      // Three 160 dp tabs leave 15 dp a side in 510 px.
      const host = tabs({ width: 510 })
      await frames()

      const bar = host.querySelector<HTMLElement>('.md1-tabs__bar')!
      const widths = items(host).map(tab => tab.getBoundingClientRect().width)

      expect(Object.hasOwn(bar.dataset, 'centered')).toBe(false)
      expect(widths).toEqual([170, 170, 170])
    })

    it('should centre again with more than 16 dp to spare', async () => {
      const host = tabs({ width: 520 })
      await frames()

      expect(host.querySelector<HTMLElement>('.md1-tabs__bar')!.dataset.centered).toBe('true')
    })

    it('should cap a centred tab at 264 dp', async () => {
      const host = tabs({
        width: 1280,
        tabs: [
          { value: 'a', label: 'A label long enough to need more than the maximum' },
          { value: 'b', label: 'B' },
        ],
      })
      await frames()

      const widths = items(host).map(tab => tab.getBoundingClientRect().width)

      expect(widths).toEqual([264, 264])
    })

    it('should give fixed tabs at least 160 dp from 600 px', async () => {
      const host = tabs({ width: 400 })
      await frames()

      expect(items(host)[0]!.getBoundingClientRect().width).toBe(160)
    })

    it('should size scrollable tabs to their labels, at most 264 dp, from the 80 dp keyline', async () => {
      const host = tabs({
        props: { scrollable: true },
        width: 1280,
        tabs: [
          { value: 'a', label: 'A label long enough to need more than the maximum' },
          { value: 'b', label: 'Short' },
        ],
      })
      await frames()

      const list = host.querySelector<HTMLElement>('.md1-tabs__list')!
      const [long, short] = items(host)

      expect(getComputedStyle(list).paddingInlineStart).toBe('56px')
      expect(long!.getBoundingClientRect().width).toBe(264)
      expect(short!.getBoundingClientRect().width).toBe(160)
      expect(long!.getBoundingClientRect().left - list.getBoundingClientRect().left).toBe(56)
    })

    it('should wrap a long label to two 12 sp lines', async () => {
      const host = tabs({
        width: 520,
        tabs: [
          { value: 'a', label: 'Recently played albums and songs' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
        ],
      })
      await frames(5)

      const [long, short] = items(host)
      const text = long!.querySelector<HTMLElement>('.md1-tabs__label')!

      expect(long!.dataset.lines).toBe('2')
      expect(short!.dataset.lines).toBe('1')
      expect(getComputedStyle(text).fontSize).toBe('12px')
      expect(getComputedStyle(text).whiteSpace).toBe('normal')
      expect(long!.getBoundingClientRect().height).toBe(48)
    })
  })

  describe('handset', () => {
    const SIX: Tab[] = Array.from({ length: 6 }, (_, index) => ({ value: `t${index}`, label: `Tab ${index + 1}` }))

    it('should share a full-width bar equally under 600 dp, never below 72 dp', async () => {
      await handset()

      const three = tabs({ width: 375 })
      const six = tabs({ width: 375, tabs: SIX, panels: false })
      await frames()

      const bar = three.querySelector<HTMLElement>('.md1-tabs__bar')!
      const list = three.querySelector<HTMLElement>('.md1-tabs__list')!

      expect(matchMedia('(min-width: 600px)').matches).toBe(false)
      expect(items(three).map(tab => tab.getBoundingClientRect().width)).toEqual([125, 125, 125])
      expect(list.getBoundingClientRect().left).toBe(bar.getBoundingClientRect().left)
      expect(items(six).map(tab => tab.getBoundingClientRect().width)).toEqual([72, 72, 72, 72, 72, 72])
    })

    it('should start scrollable tabs on the 72 dp content keyline with a mouse', async () => {
      await handset()

      const host = tabs({ props: { scrollable: true }, width: 375, tabs: SIX, panels: false })
      await frames()

      const list = host.querySelector<HTMLElement>('.md1-tabs__list')!

      expect(getComputedStyle(list).paddingInlineStart).toBe('48px')
      expect(items(host)[0]!.getBoundingClientRect().left - list.getBoundingClientRect().left).toBe(48)
    })

    it('should re-measure across the 600 dp breakpoint without a ResizeObserver loop', async () => {
      const errors: string[] = []

      function onError (event: ErrorEvent) {
        errors.push(event.message)
      }

      window.addEventListener('error', onError)
      teardowns.push(() => window.removeEventListener('error', onError))

      await handset()

      tabs({ width: 375, panels: false })
      const fixed = tabs({ width: 375, tabs: SIX, panels: false })
      tabs({ props: { scrollable: true }, width: 375, tabs: SIX, panels: false })
      await frames()

      await page.viewport(1280, 800)
      await frames(10)

      expect(errors).toEqual([])
      expect(items(fixed)[0]!.getBoundingClientRect().width).toBe(160)
    })

    // Fixed tabs measured against the tablist, which the arrows narrow: once
    // shown, the arrows squeezed every tab to its minimum and never hid again.
    it('should drop the arrows once fixed tabs fit the bar again', async () => {
      const host = tabs({ width: 600, panels: false })
      await frames()

      expect(items(host).map(tab => tab.getBoundingClientRect().width)).toEqual([160, 160, 160])

      // Three 160 dp tabs overflow a 270 px desktop bar: the arrows show.
      host.style.width = '270px'
      await frames(10)

      expect(host.querySelectorAll('.md1-tabs__arrow')).toHaveLength(2)

      // Under 600 px the minimum drops to 72 dp, and three of them fit.
      await handset()
      await frames(10)

      expect(host.querySelectorAll('.md1-tabs__arrow')).toHaveLength(0)
      expect(items(host).map(tab => tab.getBoundingClientRect().width)).toEqual([90, 90, 90])
    })

    // A wrapped 12 sp label is narrower than its one-line form, so measuring the
    // label box kept a label wrapped after its tab had grown wide enough again.
    it('should unwrap a label once its tab is wide enough again', async () => {
      const host = tabs({ width: 600, tabs: [{ value: 'a', label: 'Favorites' }, ...THREE.slice(1)], panels: false })
      await frames()

      const [tab] = items(host)

      expect(tab!.dataset.lines).toBe('1')

      await handset()
      host.style.width = '270px'
      await frames(10)

      expect(tab!.dataset.lines).toBe('2')

      await page.viewport(1280, 800)
      host.style.width = '600px'
      await frames(10)

      expect(tab!.dataset.lines).toBe('1')
    })
  })

  describe('indicator', () => {
    it('should underline the selected tab with a 2 dp line', async () => {
      const model = shallowRef<string | undefined>('albums')
      const host = tabs({ model, width: 1280 })
      await frames()

      const indicator = host.querySelector<HTMLElement>('.md1-tabs__indicator')!
      const tab = items(host)[1]!

      await vi.waitFor(() => {
        const line = indicator.getBoundingClientRect()
        const rect = tab.getBoundingClientRect()

        expect(line.height).toBe(2)
        expect(line.width).toBe(rect.width)
        expect(line.left).toBe(rect.left)
        expect(line.bottom).toBe(rect.bottom)
      })
    })

    it('should follow the selection', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({ model, width: 1280 })
      await frames()

      await userEvent.click(items(host)[2]!)
      await frames()

      const indicator = host.querySelector<HTMLElement>('.md1-tabs__indicator')!
      const tab = items(host)[2]!

      // Reduced motion in the runner: the move lands without a transition.
      await vi.waitFor(() => {
        expect(indicator.getBoundingClientRect().left).toBe(tab.getBoundingClientRect().left)
      })
      expect(indicator.dataset.animate).toBe('true')
    })

    it('should slide on the standard curve once placed', async () => {
      const host = tabs({ width: 1280, setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await frames()

      const indicator = host.querySelector<HTMLElement>('.md1-tabs__indicator')!
      const computed = getComputedStyle(indicator)

      expect(computed.transitionProperty).toBe('transform, width')
      expect(computed.transitionTimingFunction).toContain('cubic-bezier(0.4, 0, 0.2, 1)')
    })
  })

  describe('colour', () => {
    it('should ink a surface bar in the accent and the secondary text colour', async () => {
      const host = tabs({
        model: shallowRef('songs'),
        tabs: [
          { value: 'songs', label: 'Songs' },
          { value: 'albums', label: 'Albums' },
          { value: 'artists', label: 'Artists', disabled: true },
        ],
      })
      await settle()

      const [selected, idle, disabled] = items(host)
      const indicator = host.querySelector<HTMLElement>('.md1-tabs__indicator')!

      expect(getComputedStyle(selected!).color).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(indicator).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(idle!).color).toBe(color('rgba(0, 0, 0, 0.54)'))
      expect(getComputedStyle(disabled!).color).toBe(color('rgba(0, 0, 0, 0.38)'))
    })

    it('should ink a primary bar white: 100% active, 70% inactive, 60% disabled', async () => {
      const host = tabs({
        model: shallowRef('songs'),
        tabs: [
          { value: 'songs', label: 'Songs' },
          { value: 'albums', label: 'Albums' },
          { value: 'artists', label: 'Artists', disabled: true },
        ],
        wrap: node => h('div', { 'class': 'md1-toolbar', 'data-variant': 'primary' }, [node]),
      })
      await settle()

      const [selected, idle, disabled] = items(host)
      const indicator = host.querySelector<HTMLElement>('.md1-tabs__indicator')!

      expect(getComputedStyle(selected!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(indicator).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(idle!).color).toBe(color('rgba(255, 255, 255, 0.7)'))
      expect(getComputedStyle(disabled!).color).toBe(color('rgba(255, 255, 255, 0.6)'))
    })

    it('should take its ink from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = tabs({
        model: shallowRef('songs'),
        wrap: node => h('div', { 'data-theme': 'md1-dark' }, [node]),
      })
      await settle()

      const [selected, idle] = items(host)

      expect(getComputedStyle(selected!).color).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(idle!).color).toBe(color('rgba(255, 255, 255, 0.7)'))
    })
  })

  describe('overflow', () => {
    const MANY: Tab[] = Array.from({ length: 10 }, (_, index) => ({ value: `t${index}`, label: `Tab ${index + 1}` }))

    it('should show the desktop pagination arrows when the tabs overflow the bar', async () => {
      const host = tabs({ props: { scrollable: true }, tabs: MANY, width: 600 })

      await vi.waitFor(() => {
        expect((host.firstElementChild as HTMLElement).dataset.overflow).toBe('true')
      })
      await settle()

      const arrows = [...host.querySelectorAll<HTMLButtonElement>('.md1-tabs__arrow')]
      const [previous, next] = arrows

      expect(arrows).toHaveLength(2)
      expect(host.querySelector<HTMLElement>('.md1-tabs__bar')!.dataset.overflow).toBe('true')
      expect(previous!.getAttribute('aria-label')).toBe('Previous tabs')
      expect(next!.getAttribute('aria-label')).toBe('Next tabs')
      expect(previous!.getAttribute('tabindex')).toBe('-1')
      expect(next!.getAttribute('tabindex')).toBe('-1')
      expect(previous!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(previous!.getBoundingClientRect().width).toBe(48)
      expect(previous!.disabled).toBe(true)
      expect(next!.disabled).toBe(false)
    })

    it('should page the bar with the arrows', async () => {
      const host = tabs({ props: { scrollable: true }, tabs: MANY, width: 600 })

      await vi.waitFor(() => {
        expect(host.querySelectorAll('.md1-tabs__arrow')).toHaveLength(2)
      })

      const list = host.querySelector<HTMLElement>('.md1-tabs__list')!
      const [previous, next] = host.querySelectorAll<HTMLButtonElement>('.md1-tabs__arrow')

      await userEvent.click(next!)

      await vi.waitFor(() => {
        expect(list.scrollLeft).toBe(list.clientWidth)
        expect(previous!.disabled).toBe(false)
      })

      await userEvent.click(previous!)

      await vi.waitFor(() => {
        expect(list.scrollLeft).toBe(0)
        expect(previous!.disabled).toBe(true)
      })
    })

    it('should scroll a selected tab into view', async () => {
      const model = shallowRef<string | undefined>('t0')
      const host = tabs({ props: { scrollable: true }, tabs: MANY, width: 600, model })
      await frames()

      model.value = 't9'
      await frames()

      const list = host.querySelector<HTMLElement>('.md1-tabs__list')!
      const tab = items(host)[9]!

      await vi.waitFor(() => {
        expect(tab.getBoundingClientRect().right).toBeLessThanOrEqual(list.getBoundingClientRect().right + 0.5)
      })
    })

    it('should show no arrows when every tab fits', async () => {
      const host = tabs({ width: 1280 })
      await frames()

      expect(host.querySelectorAll('.md1-tabs__arrow')).toHaveLength(0)
      expect(Object.hasOwn((host.firstElementChild as HTMLElement).dataset, 'overflow')).toBe(false)
    })
  })

  describe('panels', () => {
    it('should slide the new panel in from the end and the old one out to the start', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({ model, setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await settle()

      model.value = 'albums'
      await settle()

      const [old, current] = panels(host)

      expect(current!.dataset.motion).toBe('enter')
      expect(current!.dataset.direction).toBe('forward')
      expect(getComputedStyle(current!).animationName).toBe('md1-tabs-enter-right')
      expect(old!.dataset.motion).toBe('leave')
      expect(old!.hidden).toBe(false)
      expect(old!.inert).toBe(true)
      expect(getComputedStyle(old!).animationName).toBe('md1-tabs-leave-left')
      expect(getComputedStyle(old!).animationTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')

      await vi.waitFor(() => {
        expect(old!.hidden).toBe(true)
        expect(Object.hasOwn(current!.dataset, 'motion')).toBe(false)
      })
    })

    it('should slide the other way when moving back', async () => {
      const model = shallowRef<string | undefined>('artists')
      const host = tabs({ model, setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await settle()

      model.value = 'songs'
      await settle()

      const [current, , old] = panels(host)

      expect(current!.dataset.direction).toBe('backward')
      expect(getComputedStyle(current!).animationName).toBe('md1-tabs-enter-left')
      expect(getComputedStyle(old!).animationName).toBe('md1-tabs-leave-right')
    })

    it('should mirror the slide in right-to-left layouts', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({
        model,
        setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })),
        wrap: node => h('div', { dir: 'rtl' }, [node]),
      })
      await settle()

      model.value = 'albums'
      await settle()

      const [old, current] = panels(host)

      expect(getComputedStyle(current!).animationName).toBe('md1-tabs-enter-left')
      expect(getComputedStyle(old!).animationName).toBe('md1-tabs-leave-right')
    })

    it('should swap panels at once under reduced motion', async () => {
      const model = shallowRef<string | undefined>('songs')
      const host = tabs({ model })
      await settle()

      model.value = 'albums'
      await settle()
      await settle()

      const [old, current] = panels(host)

      expect(old!.hidden).toBe(true)
      expect(Object.hasOwn(old!.dataset, 'motion')).toBe(false)
      expect(Object.hasOwn(current!.dataset, 'motion')).toBe(false)
    })
  })

  describe('warnings', () => {
    it('should warn nothing for a complete bar', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      tabs()
      await frames()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn once when labelled and icon-only tabs share a bar', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      tabs({
        tabs: [
          { value: 'a', label: 'Songs' },
          { value: 'b', icon: 'favorite', ariaLabel: 'Favourites' },
        ],
      })
      await frames()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('mixes labelled and icon-only tabs'))
    })

    it('should warn when an icon-only tab has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      tabs({
        tabs: [
          { value: 'a', icon: 'phone' },
          { value: 'b', icon: 'favorite', ariaLabel: 'Favourites' },
        ],
      })
      await frames()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
    })

    it('should warn once for each part rendered outside Md1Tabs', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Tabs.Root as Component, null, () => [
        h(Md1Tabs.List, null, () => [
          h(Md1Tabs.Item, { value: 'a', label: 'A' }),
        ]),
        h(Md1Tabs.Panel, { value: 'a' }, () => 'A'),
      ]))
      await frames()

      expect(warn).toHaveBeenCalledTimes(3)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1TabsList] rendered outside <Md1Tabs>'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1TabsItem] rendered outside <Md1Tabs>'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1TabsPanel] rendered outside <Md1Tabs>'))
    })
  })
})

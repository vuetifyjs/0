import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { QuGridList } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { QuGridListProps } from './QuGridList.vue'
import type { QuGridListBarProps } from './QuGridListBar.vue'
import type { QuGridListTileProps } from './QuGridListTile.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Icons
import { quantumIcons } from '../../icons'

/** A 1 x 1 transparent GIF: loads at once without a network. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/** 404 px holds four 98 px columns and three 4 dp gutters exactly. */
const WIDTH = 404

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.cssText = `width: ${WIDTH}px; padding: 0`
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

type TileSpec = QuGridListTileProps & Record<string, unknown> & { bar?: QuGridListBarProps & Record<string, unknown> }

/** A grid of tiles; each tile spec may carry the props of one bar. */
function grid (props: QuGridListProps & Record<string, unknown> = {}, tiles: TileSpec[] = [{}, {}, {}, {}]): HTMLElement {
  const host = mount(() => h(QuGridList, props, () => tiles.map(({ bar, ...tile }) => h(
    QuGridList.Tile,
    tile,
    bar ? () => h(QuGridList.Bar, bar) : undefined,
  ))))
  return host.querySelector<HTMLElement>('.quantum-grid-list')!
}

function tiles (root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.quantum-grid-list__tile')]
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at colour formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.color = value
  document.body.append(probe)
  const result = getComputedStyle(probe).color
  probe.remove()
  return result
}

async function settle () {
  await nextTick()
  await nextTick()
}

beforeEach(() => {
  // The entrance lifts every tile 8 dp for 225 ms; geometry assertions read the landed layout.
  document.body.dataset.reducedMotion = 'reduce'
})

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quGridList', () => {
  describe('anatomy', () => {
    it('should render a list of list items with no markers, margin or padding', async () => {
      const root = grid()
      await settle()

      const computed = getComputedStyle(root)

      expect(root.tagName).toBe('UL')
      expect(root.classList.contains('quantum-grid-list')).toBe(true)
      expect(computed.display).toBe('grid')
      expect(computed.listStyleType).toBe('none')
      expect(computed.paddingLeft).toBe('0px')
      expect(computed.marginTop).toBe('0px')
      expect(tiles(root).length).toBe(4)

      for (const tile of tiles(root)) {
        expect(tile.tagName).toBe('LI')
        expect(tile.parentElement).toBe(root)
      }
    })

    it('should expose data-gutter, data-ratio and no data-horizontal by default', async () => {
      const root = grid()
      await settle()

      expect(root.dataset.gutter).toBe('4')
      expect(root.dataset.ratio).toBe('1:1')
      expect(Object.hasOwn(root.dataset, 'horizontal')).toBe(false)
    })

    it('should attach Tile and Bar to the root and keep the flat names', async () => {
      const module = await import('./index')

      expect(QuGridList.Tile).toBe(module.QuGridListTile)
      expect(QuGridList.Bar).toBe(module.QuGridListBar)
    })
  })

  describe('gutter', () => {
    it('should space tiles 4 dp apart by default', async () => {
      const root = grid({ columns: 4 })
      await settle()

      const [a, b] = tiles(root)

      expect(getComputedStyle(root).columnGap).toBe('4px')
      expect(getComputedStyle(root).rowGap).toBe('4px')
      expect(b!.getBoundingClientRect().left - a!.getBoundingClientRect().right).toBe(4)
    })

    it('should close to the 1 dp mosaic gutter', async () => {
      const root = grid({ columns: 4, gutter: 1 })
      await settle()

      const [a, b] = tiles(root)

      expect(root.dataset.gutter).toBe('1')
      expect(getComputedStyle(root).columnGap).toBe('1px')
      expect(b!.getBoundingClientRect().left - a!.getBoundingClientRect().right).toBe(1)
    })
  })

  describe('columns and ratio', () => {
    it('should split the width into a fixed column count', async () => {
      const root = grid({ columns: 4 }, [{}, {}, {}, {}, {}])
      await settle()

      const list = tiles(root)

      for (const tile of list) {
        expect(tile.getBoundingClientRect().width).toBe(98)
      }

      // Reading order: left to right, then top to bottom.
      expect(list[4]!.offsetTop).toBeGreaterThan(list[3]!.offsetTop)
      expect(list[4]!.offsetLeft).toBe(list[0]!.offsetLeft)
    })

    it('should auto-fill columns of at least two increments when columns is unset', async () => {
      const root = grid({}, [{}, {}, {}, {}])
      await settle()

      const list = tiles(root)
      const width = list[0]!.getBoundingClientRect().width

      // 112 dp minimum: three tracks fit 404 px, the fourth tile wraps.
      expect(width).toBeGreaterThanOrEqual(112)
      expect(list[2]!.offsetTop).toBe(list[0]!.offsetTop)
      expect(list[3]!.offsetTop).toBeGreaterThan(list[0]!.offsetTop)
    })

    it('should keep the 1:1 keyline by default', async () => {
      const root = grid({ columns: 4 })
      await settle()

      const rect = tiles(root)[0]!.getBoundingClientRect()

      expect(rect.height).toBe(rect.width)
    })

    for (const [ratio, w, h] of [['16:9', 16, 9], ['3:2', 3, 2], ['4:3', 4, 3], ['3:4', 3, 4], ['2:3', 2, 3]] as const) {
      it(`should size every tile to the ${ratio} keyline`, async () => {
        const root = grid({ columns: 4, ratio })
        await settle()

        const rect = tiles(root)[0]!.getBoundingClientRect()

        expect(root.dataset.ratio).toBe(ratio)
        expect(rect.height).toBeCloseTo(rect.width * h / w, 0)
      })
    }

    it('should let a tile span columns and rows', async () => {
      const root = grid({ columns: 4 }, [{ span: 2, rowSpan: 2 }, {}, {}, {}, {}])
      await settle()

      const [big, a, b, c] = tiles(root)
      const rect = big!.getBoundingClientRect()

      expect(getComputedStyle(big!).gridColumnStart).toBe('span 2')
      expect(getComputedStyle(big!).gridRowStart).toBe('span 2')
      expect(rect.width).toBe(98 * 2 + 4)
      expect(rect.height).toBeCloseTo(98 * 2 + 4, 0)
      // Two one-cell tiles sit beside it on the first row, one on the second.
      expect(a!.offsetTop).toBe(big!.offsetTop)
      expect(b!.offsetTop).toBe(big!.offsetTop)
      expect(c!.offsetTop).toBeGreaterThan(big!.offsetTop)
      expect(c!.offsetLeft).toBe(a!.offsetLeft)
    })

    it('should warn in dev for a column count that is not a positive integer and auto-fill instead', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const root = grid({ columns: 0 })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('columns must be a positive integer'))
      expect(root.getAttribute('style')).toBeNull()
    })
  })

  describe('horizontal', () => {
    it('should lay the single-line gallery out in one row that scrolls sideways', async () => {
      const root = grid({ horizontal: true }, [{}, {}, {}, {}, {}])
      await settle()

      const list = tiles(root)

      expect(Object.hasOwn(root.dataset, 'horizontal')).toBe(true)
      expect(getComputedStyle(root).overflowX).toBe('auto')

      for (const tile of list) {
        expect(tile.offsetTop).toBe(list[0]!.offsetTop)
      }

      expect(root.scrollWidth).toBeGreaterThan(root.clientWidth)
      // Three increments a tile: the fourth is cut off at the initial scroll position, the page's overflow cue.
      expect(list[0]!.getBoundingClientRect().width).toBe(168)
    })

    it('should fit columns tiles in the view when columns is set', async () => {
      const root = grid({ horizontal: true, columns: 2 }, [{}, {}, {}])
      await settle()

      const list = tiles(root)

      expect(list[0]!.getBoundingClientRect().width).toBe(200)
      expect(list[2]!.offsetTop).toBe(list[0]!.offsetTop)
    })
  })

  describe('tile', () => {
    it('should render no action for a tile that does nothing', async () => {
      const root = grid({}, [{ src: PIXEL, alt: 'Beach' }])
      await settle()

      const tile = tiles(root)[0]!

      expect(tile.querySelector('.quantum-grid-list__action')).toBeNull()
      expect(tile.querySelector('.quantum-ripple')).toBeNull()
      expect(tile.querySelector('img')!.alt).toBe('Beach')
    })

    it('should make the whole tile one button when it has a click listener, ripple first', async () => {
      let clicks = 0
      const root = grid({ columns: 4 }, [{ src: PIXEL, alt: 'Beach', onClick: () => clicks++ }])
      await settle()

      const tile = tiles(root)[0]!
      const action = tile.querySelector<HTMLElement>('.quantum-grid-list__action')!
      const rect = action.getBoundingClientRect()

      expect(action.tagName).toBe('BUTTON')
      expect(action.getAttribute('type')).toBe('button')
      expect(action.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(action.querySelector('img')!.alt).toBe('Beach')
      expect(rect.width).toBe(tile.getBoundingClientRect().width)
      expect(rect.height).toBe(tile.getBoundingClientRect().height)
      // The click lands on the action, not on the list item as well.
      expect(tile.getAttribute('onclick')).toBeNull()

      await userEvent.click(action)

      expect(clicks).toBe(1)
    })

    it('should paint the ripple above the image and below the bar', async () => {
      const root = grid({ columns: 2 }, [{ src: PIXEL, alt: 'Beach', onClick: () => {}, bar: { title: 'Sunrise' } }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!
      const ripple = action.querySelector<HTMLElement>('.quantum-ripple')!
      const img = action.querySelector<HTMLElement>('img')!

      // The image is positioned after the ripple, so without a raised ink it would cover every press.
      expect(getComputedStyle(img).position).toBe('absolute')
      expect(getComputedStyle(ripple).zIndex).toBe('1')
      // The action's own stacking context keeps the raised ink under the bar that follows it.
      expect(getComputedStyle(action).isolation).toBe('isolate')
    })

    it('should activate the primary action with Enter and Space', async () => {
      let clicks = 0
      const root = grid({}, [{ alt: 'Beach', src: PIXEL, onClick: () => clicks++ }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!

      await userEvent.tab()

      expect(document.activeElement).toBe(action)

      await userEvent.keyboard('{Enter}')

      expect(clicks).toBe(1)

      await userEvent.keyboard(' ')

      expect(clicks).toBe(2)
    })

    it('should make the primary action a link with href', async () => {
      const root = grid({}, [{ href: '#photo', alt: 'Beach', src: PIXEL }])
      await settle()

      const action = root.querySelector<HTMLAnchorElement>('.quantum-grid-list__action')!

      expect(action.tagName).toBe('A')
      expect(action.getAttribute('href')).toBe('#photo')
      expect(action.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
    })

    it('should fade the image in when it loads, the loading-images recipe', async () => {
      const root = grid({}, [{ src: PIXEL, alt: '' }])
      await settle()

      const img = root.querySelector<HTMLImageElement>('img')!

      await expect.poll(() => img.dataset.state).toBe('loaded')
      await expect.poll(() => getComputedStyle(img).opacity).toBe('1')
      expect(getComputedStyle(img).objectFit).toBe('cover')
    })

    it('should keep square corners and a 12% wash behind a missing image', async () => {
      const root = grid()
      await settle()

      const computed = getComputedStyle(tiles(root)[0]!)

      expect(computed.borderRadius).toBe('0px')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
    })

    it('should show the 6% hover overlay on the action', async () => {
      const root = grid({}, [{ alt: 'Beach', src: PIXEL, onClick: () => {} }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!

      await userEvent.hover(action)

      await expect.poll(() => getComputedStyle(action, '::after').backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      await userEvent.unhover(action)
    })

    it('should show the 12% focus overlay for keyboard focus', async () => {
      const root = grid({}, [{ alt: 'Beach', src: PIXEL, onClick: () => {} }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!

      await userEvent.tab()

      expect(action.matches(':focus-visible')).toBe(true)
      await expect.poll(() => getComputedStyle(action, '::after').backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
    })
  })

  describe('selected', () => {
    it('should expose data-selected and lay the selection scrim and a check mark over the tile', async () => {
      const root = grid({}, [{ selected: true, alt: 'Beach', src: PIXEL, onClick: () => {} }, {}])
      await settle()

      const [on, off] = tiles(root)
      const scrim = on!.querySelector<HTMLElement>('.quantum-grid-list__scrim')!
      const check = scrim.querySelector<SVGElement>('svg')!

      expect(Object.hasOwn(on!.dataset, 'selected')).toBe(true)
      expect(Object.hasOwn(off!.dataset, 'selected')).toBe(false)
      expect(off!.querySelector('.quantum-grid-list__scrim')).toBeNull()
      expect(getComputedStyle(scrim).backgroundColor).toBe('rgba(255, 64, 129, 0.3)')
      expect(getComputedStyle(scrim).pointerEvents).toBe('none')
      expect([...check.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(quantumIcons['check-circle'])
      expect(check.getAttribute('role')).toBe('img')
      expect(check.getAttribute('aria-label')).toBe('Selected')
      expect(getComputedStyle(check).color).toBe('rgb(255, 255, 255)')
    })

    it('should describe the primary action as selected', async () => {
      const root = grid({}, [{ selected: true, alt: 'Beach', src: PIXEL, onClick: () => {} }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!
      const check = root.querySelector('.quantum-grid-list__scrim svg')!

      expect(action.getAttribute('aria-describedby')).toBe(check.id)
      expect(check.id).not.toBe('')
    })

    it('should keep the tile clickable through the scrim', async () => {
      let clicks = 0
      const root = grid({}, [{ selected: true, alt: 'Beach', src: PIXEL, onClick: () => clicks++ }])
      await settle()

      await userEvent.click(root.querySelector<HTMLElement>('.quantum-grid-list__tile')!)

      expect(clicks).toBe(1)
    })
  })

  describe('bar', () => {
    it('should render a single-line 48 dp footer band in 60% black with white Subheading text', async () => {
      const root = grid({ columns: 2 }, [{ bar: { title: 'Sunrise' } }])
      await settle()

      const tile = tiles(root)[0]!
      const bar = tile.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const title = bar.querySelector<HTMLElement>('.quantum-grid-list__title')!
      const computed = getComputedStyle(bar)

      expect(bar.dataset.position).toBe('footer')
      expect(bar.dataset.lines).toBe('1')
      expect(Object.hasOwn(bar.dataset, 'icon')).toBe(false)
      expect(bar.getBoundingClientRect().height).toBe(48)
      expect(bar.getBoundingClientRect().bottom).toBe(tile.getBoundingClientRect().bottom)
      expect(bar.getBoundingClientRect().width).toBe(tile.getBoundingClientRect().width)
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0.6)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(title).fontSize).toBe('16px')
      expect(getComputedStyle(title).fontWeight).toBe('400')
      expect(getComputedStyle(title).fontFamily).toContain('Roboto')
      expect(title.getBoundingClientRect().left - bar.getBoundingClientRect().left).toBe(16)
      expect(title.textContent).toBe('Sunrise')
    })

    it('should grow to the 68 dp two-line bar with a 12 sp caption at 70% white', async () => {
      const root = grid({ columns: 2 }, [{ bar: { title: 'Sunrise', subtitle: 'by Ana' } }])
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const title = bar.querySelector<HTMLElement>('.quantum-grid-list__title')!
      const subtitle = bar.querySelector<HTMLElement>('.quantum-grid-list__subtitle')!

      expect(bar.dataset.lines).toBe('2')
      expect(bar.getBoundingClientRect().height).toBe(68)
      expect(title.getBoundingClientRect().top - bar.getBoundingClientRect().top).toBe(16)
      expect(getComputedStyle(subtitle).fontSize).toBe('12px')
      expect(getComputedStyle(subtitle).color).toBe(serialize('color-mix(in srgb, #FFFFFF 70%, transparent)'))
    })

    it('should treat an empty subtitle as no second line and an empty title as no name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const root = grid({ columns: 2 }, [{ src: PIXEL, onClick: () => {}, bar: { title: '', subtitle: '' } }])
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!

      expect(bar.dataset.lines).toBe('1')
      expect(bar.getBoundingClientRect().height).toBe(48)
      expect(action.hasAttribute('aria-labelledby')).toBe(false)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('no accessible name'))
    })

    it('should sit at the top of the tile as a header', async () => {
      const root = grid({ columns: 2 }, [{ bar: { title: 'Sunrise', position: 'header' } }])
      await settle()

      const tile = tiles(root)[0]!
      const bar = tile.querySelector<HTMLElement>('.quantum-grid-list__bar')!

      expect(bar.dataset.position).toBe('header')
      expect(bar.getBoundingClientRect().top).toBe(tile.getBoundingClientRect().top)
    })

    it('should truncate long text with an ellipsis on one line', async () => {
      const root = grid({ columns: 4 }, [{ bar: { title: 'A title far too long for a ninety-eight pixel tile' } }])
      await settle()

      const title = root.querySelector<HTMLElement>('.quantum-grid-list__title')!
      const computed = getComputedStyle(title)

      expect(computed.textOverflow).toBe('ellipsis')
      expect(computed.whiteSpace).toBe('nowrap')
      expect(title.scrollWidth).toBeGreaterThan(title.clientWidth)
      expect(title.getBoundingClientRect().height).toBe(24)
    })

    it('should name the primary action with the bar title', async () => {
      const root = grid({}, [{ src: PIXEL, onClick: () => {}, bar: { title: 'Sunrise' } }])
      await settle()

      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!
      const title = root.querySelector<HTMLElement>('.quantum-grid-list__title')!

      expect(action.getAttribute('aria-labelledby')).toBe(title.id)
      expect(title.id).not.toBe('')
    })

    it('should let a press on the bar text fall through to the primary action', async () => {
      let clicks = 0
      const root = grid({ columns: 2 }, [{ src: PIXEL, onClick: () => clicks++, bar: { title: 'Sunrise' } }])
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const action = root.querySelector<HTMLElement>('.quantum-grid-list__action')!
      const title = bar.querySelector<HTMLElement>('.quantum-grid-list__title')!.getBoundingClientRect()
      const rect = action.getBoundingClientRect()
      const x = title.left - rect.left + 4
      const y = title.top - rect.top + 4

      expect(getComputedStyle(bar).pointerEvents).toBe('none')
      expect(document.elementFromPoint(rect.left + x, rect.top + y)?.closest('.quantum-grid-list__action')).toBe(action)

      // Aimed at the title's pixels: the bar lets the press through to the action beneath.
      await userEvent.click(action, { position: { x, y } })

      expect(clicks).toBe(1)
    })

    it('should put the action icon in a 48 dp button flush with the end edge, 16 dp after the text', async () => {
      const root = grid({ columns: 2 }, [{ bar: { title: 'Sunrise', icon: 'info', iconLabel: 'Details' } }])
      await settle()

      const tile = tiles(root)[0]!
      const bar = tile.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const icon = bar.querySelector<HTMLElement>('.quantum-grid-list__icon')!
      const glyph = icon.querySelector<SVGElement>('svg')!
      const text = bar.querySelector<HTMLElement>('.quantum-grid-list__text')!
      const rect = icon.getBoundingClientRect()

      expect(bar.dataset.icon).toBe('end')
      expect(icon.tagName).toBe('BUTTON')
      expect(icon.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(icon.getAttribute('aria-label')).toBe('Details')
      expect(rect.width).toBe(48)
      expect(rect.height).toBe(48)
      expect(rect.right).toBe(tile.getBoundingClientRect().right)
      expect(glyph.getBoundingClientRect().width).toBe(24)
      expect([...glyph.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(quantumIcons.info)
      // 4 dp of text padding plus the 12 dp inside the container: 16 dp from the text to the glyph.
      expect(glyph.getBoundingClientRect().left - (text.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(text).paddingRight))).toBe(16)
      expect(getComputedStyle(icon).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(icon).pointerEvents).toBe('auto')
    })

    it('should put the icon flush with the start edge and start the text at its container edge', async () => {
      const root = grid({ columns: 2 }, [{ bar: { title: 'Sunrise', icon: 'star-border', iconLabel: 'Star', iconSide: 'start' } }])
      await settle()

      const tile = tiles(root)[0]!
      const bar = tile.querySelector<HTMLElement>('.quantum-grid-list__bar')!
      const icon = bar.querySelector<HTMLElement>('.quantum-grid-list__icon')!
      const title = bar.querySelector<HTMLElement>('.quantum-grid-list__title')!

      expect(bar.dataset.icon).toBe('start')
      expect(icon.getBoundingClientRect().left).toBe(tile.getBoundingClientRect().left)
      expect(title.getBoundingClientRect().left).toBe(icon.getBoundingClientRect().right)
    })

    it('should mirror the end icon to the left edge under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [
        h(QuGridList, { columns: 2 }, () => h(QuGridList.Tile, {}, () => h(QuGridList.Bar, { title: 'Sunrise', icon: 'info', iconLabel: 'Details' }))),
      ]))
      await settle()

      const tile = host.querySelector<HTMLElement>('.quantum-grid-list__tile')!
      const icon = host.querySelector<HTMLElement>('.quantum-grid-list__icon')!

      expect(icon.getBoundingClientRect().left).toBe(tile.getBoundingClientRect().left)
    })

    it('should emit action from the icon on click, Enter and Space without firing the tile', async () => {
      let tile = 0
      const actions: MouseEvent[] = []
      const root = grid({}, [{
        src: PIXEL,
        onClick: () => tile++,
        bar: { title: 'Sunrise', icon: 'info', iconLabel: 'Details', onAction: (event: MouseEvent) => actions.push(event) },
      }])
      await settle()

      const icon = root.querySelector<HTMLElement>('.quantum-grid-list__icon')!

      // Two tab stops per tile: the primary action, then the icon.
      await userEvent.tab()
      await userEvent.tab()

      expect(document.activeElement).toBe(icon)

      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')

      expect(actions.length).toBe(2)

      await userEvent.click(icon)

      expect(actions.length).toBe(3)
      expect(actions[2]).toBeInstanceOf(MouseEvent)
      expect(tile).toBe(0)
    })

    it('should warn in dev when the icon has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      grid({}, [{ bar: { title: 'Sunrise', icon: 'info' } }])
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('iconLabel'))
    })
  })

  describe('accessibility', () => {
    it('should warn in dev when an interactive tile has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      grid({}, [{ src: PIXEL, onClick: () => {} }])
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('no accessible name'))
    })

    it('should stay silent when alt text or a bar title names the tile', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      grid({}, [
        { src: PIXEL, alt: 'Beach', onClick: () => {} },
        { src: PIXEL, onClick: () => {}, bar: { title: 'Sunrise' } },
      ])
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('orphans', () => {
    it('should warn once for each part rendered outside its parent and still render it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h('ul', [h(QuGridList.Tile)]),
        h(QuGridList.Bar, { title: 'Loose' }),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuGridListTile] rendered outside <QuGridList>'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[QuGridListBar] rendered outside <QuGridListTile>'))
      expect(host.querySelector('.quantum-grid-list__tile')).not.toBeNull()
      expect(host.querySelector('.quantum-grid-list__bar')!.textContent).toBe('Loose')
    })

    it('should stay silent when the parts are nested', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      grid({}, [{ bar: { title: 'Sunrise' } }])
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('entrance', () => {
    it('should fade and lift the tiles in, each 20 ms after the previous, on the decelerate curve', async () => {
      // The runner emulates prefers-reduced-motion: reduce; the v0 override switches the entrance back on.
      document.body.dataset.reducedMotion = 'no-preference'

      const root = grid({}, [{}, {}, {}])
      await settle()

      const list = tiles(root)
      const computed = list.map(tile => getComputedStyle(tile))

      expect(computed[0]!.animationName).toBe('quantum-grid-list-enter')
      expect(computed[0]!.animationDuration).toBe('0.225s')
      expect(computed[0]!.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
      expect(computed.map(c => c.animationDelay)).toEqual(['0s', '0.02s', '0.04s'])
    })

    it('should start a tile added later at the head of its own sequence', async () => {
      // The runner emulates prefers-reduced-motion: reduce; the v0 override switches the entrance back on.
      document.body.dataset.reducedMotion = 'no-preference'

      const root = grid({}, [{}, {}])
      await settle()

      const late = document.createElement('div')
      document.body.append(late)
      const app = createApp({ render: () => h(QuGridList, {}, () => [h(QuGridList.Tile)]) })
      app.mount(late)
      teardowns.push(() => {
        app.unmount()
        late.remove()
      })
      await settle()

      expect(getComputedStyle(tiles(root)[1]!).animationDelay).toBe('0.02s')
      expect(getComputedStyle(late.querySelector('.quantum-grid-list__tile')!).animationDelay).toBe('0s')
    })

    it('should skip the entrance under reduced motion', async () => {
      const root = grid()
      await settle()

      expect(getComputedStyle(tiles(root)[0]!).animationName).toBe('none')
    })
  })

  describe('theme', () => {
    it('should keep the bar scrim and white ink in both themes and switch the tile wash', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuGridList, {}, () => h(QuGridList.Tile, {}, () => h(QuGridList.Bar, { title: 'Light' })))]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuGridList, {}, () => h(QuGridList.Tile, { selected: true }, () => h(QuGridList.Bar, { title: 'Dark' })))]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.quantum-grid-list__tile')
      const [lightBar, darkBar] = host.querySelectorAll<HTMLElement>('.quantum-grid-list__bar')

      expect(getComputedStyle(lightBar!).backgroundColor).toBe('rgba(0, 0, 0, 0.6)')
      expect(getComputedStyle(darkBar!).backgroundColor).toBe('rgba(0, 0, 0, 0.6)')
      expect(getComputedStyle(darkBar!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(light!).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(dark!.querySelector('.quantum-grid-list__scrim')!).backgroundColor).toBe('rgba(255, 64, 129, 0.3)')
    })
  })
})

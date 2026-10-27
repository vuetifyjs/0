import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { Md1Subheader } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { Md1SubheaderProps } from './Md1Subheader.vue'
import type { VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

/** A subheader inside a 320 px wide block, the width every geometry assertion below reads against. */
function subheader (props: Md1SubheaderProps & Record<string, unknown> = {}, label = 'Folders', dir?: string): HTMLElement {
  const host = mount(() => h('div', { style: 'width: 320px', dir }, [h(Md1Subheader, props, () => label)]))
  return host.querySelector<HTMLElement>('.md1-subheader')!
}

/** A section of a scrolling list: its subheader followed by `rows` 48 px tiles. */
function section (label: string, rows: number, props: Md1SubheaderProps = {}): VNode {
  return h('section', [
    h(Md1Subheader, props, () => label),
    ...Array.from({ length: rows }, (_, index) => h('div', { style: 'height: 48px' }, `Row ${index + 1}`)),
  ])
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The top-level rule for a selector: the handset value, which no media block overrides at the test viewport. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  // CSSOM serialises attribute values with double quotes whatever the source wrote.
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

describe('quSubheader', () => {
  describe('anatomy', () => {
    it('should render a div heading at level 2 with the label and the sticky hook on by default', async () => {
      const el = subheader()
      await settle()

      expect(el.tagName).toBe('DIV')
      expect(el.classList.contains('md1-subheader')).toBe(true)
      expect(el.getAttribute('role')).toBe('heading')
      expect(el.getAttribute('aria-level')).toBe('2')
      expect(el.textContent).toBe('Folders')
      expect(Object.hasOwn(el.dataset, 'sticky')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'inset')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'primary')).toBe(false)
    })

    it('should let a consumer set the heading level through the aria-level attribute', async () => {
      const el = subheader({ 'aria-level': '3' })
      await settle()

      expect(el.getAttribute('aria-level')).toBe('3')
      expect(el.getAttribute('role')).toBe('heading')
    })

    it('should drop data-sticky when sticky is false', async () => {
      const el = subheader({ sticky: false })
      await settle()

      expect(Object.hasOwn(el.dataset, 'sticky')).toBe(false)
      expect(getComputedStyle(el).position).toBe('static')
    })

    it('should warn nothing in dev: a static element has no parts to orphan', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      subheader({ inset: true, primary: true })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('tile', () => {
    it('should measure 48 dp tall with the text at the 24 dp keyline from 600 px, one line, centred', async () => {
      // The test viewport is 1280 px wide: the tablet side of the keylines page's split.
      expect(matchMedia('(min-width: 600px)').matches).toBe(true)

      const el = subheader()
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(rect.height).toBe(48)
      expect(rect.width).toBe(320)
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('24px')
      expect(computed.paddingTop).toBe('0px')
      expect(computed.lineHeight).toBe('48px')
      expect(computed.whiteSpace).toBe('nowrap')
      expect(computed.textOverflow).toBe('ellipsis')
      expect(computed.overflow).toBe('hidden')
      expect(computed.marginTop).toBe('0px')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should keep the 16 dp keyline on handsets, the rule outside every media block', async () => {
      subheader()
      await settle()

      // Headless Chromium cannot shrink the viewport under 600 px inside one page, so the
      // handset values are read from the stylesheet: the tile rule that sits outside @media.
      const tile = rule('.md1-subheader')

      expect(tile).toBeDefined()
      expect(tile!.style.paddingInline.replaceAll(/\s+/g, ' ')).toBe('var(--md1-keyline-margin, 16px)')
      expect(tile!.style.fontSize.replaceAll(/\s+/g, ' ')).toBe('var(--md1-type-body-2-size, 14px)')
    })

    it('should set the text in Body 2: Roboto Medium at the secondary ink, 13 sp under a fine pointer', async () => {
      // Playwright's desktop Chromium is the spec's mouse-and-keyboard environment.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const el = subheader()
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('13px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.letterSpacing).toBe('0.13px')
      expect(computed.textTransform).toBe('none')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should truncate a long title to one line instead of wrapping or growing', async () => {
      const el = subheader({}, 'A section title long enough to run past the edge of a narrow list and keep going')
      await settle()

      expect(el.getBoundingClientRect().height).toBe(48)
      expect(el.scrollWidth).toBeGreaterThan(el.clientWidth)
    })
  })

  describe('variants', () => {
    it('should expose data-inset and move the text to the 80 dp content keyline from 600 px', async () => {
      const el = subheader({ inset: true })
      await settle()

      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'inset')).toBe(true)
      expect(computed.paddingLeft).toBe('80px')
      expect(computed.paddingRight).toBe('24px')
    })

    it('should inset to the 72 dp keyline on handsets, the rule outside every media block', async () => {
      subheader({ inset: true })
      await settle()

      const inset = rule('.md1-subheader[data-inset]')

      expect(inset).toBeDefined()
      expect(inset!.style.paddingInlineStart.replaceAll(/\s+/g, ' ')).toBe('var(--md1-keyline-content, 72px)')
    })

    it('should mirror the inset to the end side under dir="rtl"', async () => {
      const el = subheader({ inset: true }, 'Folders', 'rtl')
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.paddingRight).toBe('80px')
      expect(computed.paddingLeft).toBe('24px')
    })

    it('should expose data-primary and colour the text with the primary colour', async () => {
      const el = subheader({ primary: true })
      await settle()

      expect(Object.hasOwn(el.dataset, 'primary')).toBe(true)
      expect(getComputedStyle(el).color).toBe('rgb(63, 81, 181)')
    })
  })

  describe('sticky', () => {
    it('should pin to the top of its scroll container above the tiles and inherit the surface it sits on', async () => {
      const host = mount(() => h('div', { style: 'height: 160px; width: 320px; overflow: auto; background: rgb(255, 255, 255)' }, [
        h('section', { style: 'background: rgb(66, 66, 66)' }, [
          h(Md1Subheader, null, () => 'A'),
          ...Array.from({ length: 6 }, () => h('div', { style: 'height: 48px; position: relative' })),
        ]),
      ]))
      await settle()

      const scroller = host.firstElementChild as HTMLElement
      const el = scroller.querySelector<HTMLElement>('.md1-subheader')!
      const computed = getComputedStyle(el)

      expect(computed.position).toBe('sticky')
      expect(computed.top).toBe('0px')
      expect(computed.zIndex).toBe('1')
      // No fill of its own: the pinned tile takes its parent's surface, whatever that is.
      expect(computed.backgroundColor).toBe('rgb(66, 66, 66)')

      scroller.scrollTop = 100
      await settle()

      const top = scroller.getBoundingClientRect().top

      expect(el.getBoundingClientRect().top).toBe(top)
      // Positioned tiles that scrolled under it paint beneath, not over it.
      expect(document.elementFromPoint(scroller.getBoundingClientRect().left + 100, top + 24)).toBe(el)
    })

    it('should be pushed off by the next subheader, which pins in its place', async () => {
      const host = mount(() => h('div', { style: 'height: 160px; width: 320px; overflow: auto' }, [
        section('A', 5),
        section('B', 5),
      ]))
      await settle()

      const scroller = host.firstElementChild as HTMLElement
      const [a, b] = scroller.querySelectorAll<HTMLElement>('.md1-subheader')
      const top = scroller.getBoundingClientRect().top

      // Section A spans 0 to 288 px; B's tile starts at 288.
      scroller.scrollTop = 200
      await settle()

      expect(a!.getBoundingClientRect().top).toBe(top)
      expect(b!.getBoundingClientRect().top).toBe(top + 88)

      // 20 px past the end of A's section: A is carried out with it while B approaches.
      scroller.scrollTop = 260
      await settle()

      expect(a!.getBoundingClientRect().top).toBe(top - 20)
      expect(b!.getBoundingClientRect().top).toBe(top + 28)

      // B's section owns the top of the viewport: B pins, A is gone.
      scroller.scrollTop = 300
      await settle()

      expect(b!.getBoundingClientRect().top).toBe(top)
      expect(a!.getBoundingClientRect().bottom).toBeLessThanOrEqual(top)
    })

    it('should scroll away with its section when sticky is false', async () => {
      const host = mount(() => h('div', { style: 'height: 160px; width: 320px; overflow: auto' }, [
        section('A', 6, { sticky: false }),
      ]))
      await settle()

      const scroller = host.firstElementChild as HTMLElement
      const el = scroller.querySelector<HTMLElement>('.md1-subheader')!
      const top = scroller.getBoundingClientRect().top

      scroller.scrollTop = 100
      await settle()

      expect(el.getBoundingClientRect().top).toBe(top - 100)
    })
  })

  describe('interaction', () => {
    it('should never take focus: Tab moves across it to the next control', async () => {
      const host = mount(() => h('div', [
        h('button', { id: 'before' }, 'Before'),
        h(Md1Subheader, null, () => 'Folders'),
        h('button', { id: 'after' }, 'After'),
      ]))
      await settle()

      const [before, after] = host.querySelectorAll('button')
      const el = host.querySelector<HTMLElement>('.md1-subheader')!

      expect(el.tabIndex).toBe(-1)

      before!.focus()
      await userEvent.tab()

      expect(document.activeElement).toBe(after)

      el.focus()

      expect(document.activeElement).not.toBe(el)
    })

    it('should pass consumer attributes and listeners through to the tile', async () => {
      let clicks = 0
      const el = subheader({ id: 'folders', onClick: () => clicks++ })
      await settle()

      expect(el.id).toBe('folders')

      await userEvent.click(el)

      expect(clicks).toBe(1)
    })
  })

  describe('theme', () => {
    it('should take its ink from the adapter sheet in both themes and ink the primary variant in a lighter primary tone on the dark one', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { style: 'width: 320px' }, [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1Subheader, null, () => 'Light')]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Subheader, null, () => 'Dark'),
          h(Md1Subheader, { primary: true }, () => 'Primary'),
          h(Md1Subheader, { inset: true }, () => 'Inset'),
        ]),
      ]))
      await settle()

      const [light, dark, primary, inset] = host.querySelectorAll<HTMLElement>('.md1-subheader')

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(light!).color).toBe('rgba(0, 0, 0, 0.54)')
      // Secondary ink is 70% white on the dark theme; the primary variant takes the colour page's
      // lighter tone of the primary there, Indigo 100 at 6.2:1 on the Grey 800 sheet.
      expect(getComputedStyle(dark!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(primary!).color).toBe('rgb(197, 202, 233)')
      // The foundations publish Body 2 at 13 sp under a fine pointer and the tablet keylines at this viewport.
      expect(getComputedStyle(dark!).fontSize).toBe('13px')
      expect(getComputedStyle(inset!).paddingLeft).toBe('80px')
    })
  })
})

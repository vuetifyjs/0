import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { Collapsible, createLocalePlugin } from '@vuetify/v0'

import { MD1_CARD_COLLAPSIBLE, Md1Card } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App, Component, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Components
import { Md1Button } from '../Md1Button'

/** Vuetify 1.5's pixel recipes for the card's two levels: 2 dp at rest, 8 dp picked up (or hovered on desktop). */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
const ELEVATION_8 = '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'

/** A 1 x 1 transparent GIF: loads at once without a network. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
/** Not an image: the browser fires `error` for it. */
const BROKEN = 'data:image/png;base64,AAAA'

/*
 * The tester viewport is 1280 px wide, past the 600 px handset / tablet split,
 * so the content keyline is the tablet value; the handset 16 dp is read from
 * the base rules instead.
 */
const KEYLINE = 24

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // A constant card width, the cards page's rule, so every metric below is a plain number.
  host.style.cssText = 'width: 320px; padding: 24px'
  document.body.append(host)
  const app = createApp({ render: node })
  setup?.(app)
  let mounted = false
  teardowns.push(() => {
    if (mounted) app.unmount()
    host.remove()
  })
  app.mount(host)
  mounted = true
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

/** The top-level stylesheet rule for a selector, outside every @media block; CSSOM serialises attribute quotes as double quotes. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

function card (host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>('.md1-card')!
}

function part (host: HTMLElement, name: string): HTMLElement {
  return host.querySelector<HTMLElement>(`.md1-card__${name}`)!
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

describe('quCard', () => {
  describe('anatomy', () => {
    it('should render an article sheet with the parts in anatomy order and no state hooks at rest', async () => {
      const host = mount(() => h(Md1Card, { expanded: false }, () => [
        h(Md1Card.Header, { avatar: PIXEL, subtitle: 'Subtitle', title: 'Title' }),
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Title, () => 'Primary title'),
        h(Md1Card.Subtitle, () => 'Subtitle'),
        h(Md1Card.Supporting, () => 'Supporting text'),
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action 1'), h(Md1Button, () => 'Action 2')]),
        h(Md1Card.Expanded, () => 'Expanded supporting text'),
      ]))
      await settle()

      const el = card(host)

      expect(el.tagName).toBe('ARTICLE')
      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'selected')).toBe(false)
      // A card is a sheet, not a control: no ripple, no role, no tab stop.
      expect(el.querySelector(':scope > .md1-ripple')).toBeNull()
      expect(el.getAttribute('role')).toBeNull()
      expect(el.getAttribute('tabindex')).toBeNull()

      const names = [...el.children].map(child => child.className)

      expect(names).toEqual([
        'md1-card__header',
        'md1-card__media',
        'md1-card__title',
        'md1-card__subtitle',
        'md1-card__supporting',
        'md1-card__actions',
        'md1-card__expanded',
      ])
      expect(part(host, 'title').tagName).toBe('H2')
      expect(el.getAttribute('aria-labelledby')).toBe(part(host, 'title').id)
      expect(part(host, 'title').id).not.toBe('')
    })

    it('should paint the surface at 2 dp corners and clip its children to them', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Supporting, () => 'Text')]))
      await settle()

      const computed = getComputedStyle(card(host))

      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.borderRadius).toBe('2px')
      expect(computed.overflow).toBe('clip')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(computed.fontFamily).toContain('Roboto')
      expect(card(host).getBoundingClientRect().width).toBe(320)
    })

    it('should rest at 0 dp under a fine pointer and lift to 8 dp on hover', async () => {
      // Playwright's desktop Chromium is the spec's mouse-and-keyboard environment.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = mount(() => h(Md1Card, () => [h(Md1Card.Supporting, () => 'Text')]))
      await settle()

      const el = card(host)

      expect(getComputedStyle(el).boxShadow).toBe('none')

      await userEvent.hover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_8))

      await userEvent.unhover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should rest at 2 dp outside the fine-pointer rule, the handset value', async () => {
      mount(() => h(Md1Card, () => [h(Md1Card.Supporting, () => 'Text')]))
      await settle()

      // Headless Chromium cannot be switched to a coarse pointer and back inside one page,
      // so the handset value is read from the rule that sits outside every @media block.
      const sheet = rule('.md1-card')

      expect(sheet).toBeDefined()
      expect(sheet!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-2, ${ELEVATION_2})`)
      expect(sheet!.style.transition).toContain('box-shadow 280ms')
    })

    it('should name the card by its title and release the name when the title leaves', async () => {
      const titled = shallowRef(true)
      const host = mount(() => h(Md1Card, () => [
        titled.value ? h(Md1Card.Title, () => 'Named') : null,
        h(Md1Card.Supporting, () => 'Text'),
      ]))
      await settle()

      const el = card(host)

      expect(el.getAttribute('aria-labelledby')).toBe(part(host, 'title').id)

      titled.value = false
      await settle()

      expect(el.getAttribute('aria-labelledby')).toBeNull()
    })
  })

  describe('header', () => {
    it('should lay out the 72 dp row: a 40 dp avatar at the keyline, the text at the content keyline', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Header, { avatar: PIXEL, subtitle: 'Yesterday', title: 'Ali Connors' }),
      ]))
      await settle()

      const el = card(host).getBoundingClientRect()
      const header = part(host, 'header')
      const avatar = header.querySelector<HTMLImageElement>('img.md1-card__avatar')!
      const text = part(host, 'header-text')
      const title = part(host, 'header-title')
      const subtitle = part(host, 'header-subtitle')

      expect(header.getBoundingClientRect().height).toBe(72)
      expect(avatar.alt).toBe('')
      expect(avatar.getBoundingClientRect().width).toBe(40)
      expect(avatar.getBoundingClientRect().height).toBe(40)
      expect(getComputedStyle(avatar).borderRadius).toBe('50%')
      expect(getComputedStyle(avatar).objectFit).toBe('cover')
      expect(avatar.getBoundingClientRect().left - el.left).toBe(KEYLINE)
      // 24 + 40 + 16: the tablet content keyline of 80 dp.
      expect(text.getBoundingClientRect().left - el.left).toBe(KEYLINE + 40 + 16)

      expect(title.textContent).toBe('Ali Connors')
      expect(getComputedStyle(title).fontSize).toBe('14px')
      expect(getComputedStyle(title).fontWeight).toBe('500')
      expect(getComputedStyle(title).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(subtitle.textContent).toBe('Yesterday')
      expect(getComputedStyle(subtitle).fontSize).toBe('14px')
      expect(getComputedStyle(subtitle).fontWeight).toBe('400')
      expect(getComputedStyle(subtitle).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should hold the 72 dp row on one line each when the text outgrows the card', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Header, {
          avatar: PIXEL,
          subtitle: 'Shared with you, your team and everyone in the organisation yesterday',
          title: 'A title much longer than the narrow card has room for',
        }),
      ]))
      await settle()

      const title = part(host, 'header-title')

      expect(part(host, 'header').getBoundingClientRect().height).toBe(72)
      expect(getComputedStyle(title).textOverflow).toBe('ellipsis')
      expect(getComputedStyle(title).whiteSpace).toBe('nowrap')
      expect(title.scrollWidth).toBeGreaterThan(title.clientWidth)
    })

    it('should start the text at the keyline when there is no avatar', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Header, { title: 'Title' })]))
      await settle()

      expect(part(host, 'header').querySelector('.md1-card__avatar')).toBeNull()
      expect(part(host, 'header').querySelector('.md1-card__header-subtitle')).toBeNull()
      expect(part(host, 'header-text').getBoundingClientRect().left - card(host).getBoundingClientRect().left).toBe(KEYLINE)
    })

    it('should pull a trailing icon button out so its glyph lands at the keyline', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Header, { title: 'Title' }, () => h(Md1Button, { ariaLabel: 'More options', icon: 'more-vert' })),
      ]))
      await settle()

      const el = card(host).getBoundingClientRect()
      const button = part(host, 'header').querySelector('button')!
      const glyph = button.querySelector('svg')!

      expect(button.getBoundingClientRect().width).toBe(48)
      // The 48 dp target overhangs the 40 dp content box rather than growing the 72 dp row.
      expect(part(host, 'header').getBoundingClientRect().height).toBe(72)
      expect(el.right - glyph.getBoundingClientRect().right).toBe(KEYLINE)
      expect(el.right - button.getBoundingClientRect().right).toBe(KEYLINE - 12)
    })
  })

  describe('media', () => {
    it('should size full-width media by ratio and expose data-ratio', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Media, { ratio: '1:1', src: PIXEL }),
      ]))
      await settle()

      const [wide, square] = host.querySelectorAll<HTMLElement>('.md1-card__media')

      expect(wide!.dataset.ratio).toBe('16:9')
      expect(Object.hasOwn(wide!.dataset, 'inset')).toBe(false)
      expect(wide!.getBoundingClientRect().width).toBe(320)
      expect(wide!.getBoundingClientRect().height).toBe(180)
      expect(square!.dataset.ratio).toBe('1:1')
      expect(square!.getBoundingClientRect().height).toBe(320)

      const image = wide!.querySelector('img')!

      expect(getComputedStyle(image).objectFit).toBe('cover')
      expect(image.getBoundingClientRect().height).toBe(180)
    })

    it('should inset the 80 dp increments at the top end corner and let the text flow beside', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Media, { ratio: '1x', src: PIXEL }),
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action')]),
      ]))
      await settle()

      const el = card(host).getBoundingClientRect()
      const media = part(host, 'media')
      const box = media.getBoundingClientRect()

      expect(Object.hasOwn(media.dataset, 'inset')).toBe(true)
      expect(media.dataset.ratio).toBe('1x')
      expect(getComputedStyle(media).cssFloat).toBe('inline-end')
      expect(box.width).toBe(80)
      expect(box.height).toBe(80)
      expect(box.top - el.top).toBe(16)
      expect(el.right - box.right).toBe(KEYLINE)

      // The title starts at the card's top edge and keyline, beside the thumbnail.
      const title = part(host, 'title').getBoundingClientRect()

      expect(title.top).toBe(el.top)
      expect(title.left).toBe(el.left)
      expect(getComputedStyle(part(host, 'title')).paddingLeft).toBe(`${KEYLINE}px`)
      expect(title.right).toBe(el.right)
      // The title's line box wraps beside the float, not under it.
      const range = document.createRange()
      range.selectNodeContents(part(host, 'title'))
      expect(range.getBoundingClientRect().right).toBeLessThanOrEqual(box.left)
      // The actions clear the float.
      expect(part(host, 'actions').getBoundingClientRect().top).toBeGreaterThanOrEqual(box.bottom + 16)
    })

    it('should scale the inset square with the increment', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Media, { ratio: '1.5x', src: PIXEL }),
        h(Md1Card.Media, { ratio: '2x', src: PIXEL }),
        h(Md1Card.Media, { ratio: '3x', src: PIXEL }),
      ]))
      await settle()

      const sizes = [...host.querySelectorAll<HTMLElement>('.md1-card__media')].map(media => media.getBoundingClientRect().width)

      expect(sizes).toEqual([120, 160, 240])
    })

    it('should run the loading recipe: hidden and desaturated while loading, plain once loaded', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Media, { src: PIXEL })]))

      const media = part(host, 'media')
      const image = media.querySelector('img')!

      // Before the load event lands.
      expect(media.dataset.state).toBe('loading')
      expect(getComputedStyle(image).opacity).toBe('0')
      expect(getComputedStyle(image).filter).toBe('saturate(0.2) brightness(1.2)')
      expect(getComputedStyle(media).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')

      await expect.poll(() => media.dataset.state).toBe('loaded')

      expect(getComputedStyle(image).opacity).toBe('1')
      expect(getComputedStyle(image).filter).toBe('none')
      // The tone is a placeholder: a loaded image with transparency shows the sheet, not a grey wash.
      expect(getComputedStyle(media).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should mark a failed image and hide the broken glyph', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Media, { src: BROKEN })]))

      const media = part(host, 'media')

      await expect.poll(() => media.dataset.state).toBe('error')

      expect(getComputedStyle(media.querySelector('img')!).visibility).toBe('hidden')
      expect(getComputedStyle(media).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
    })

    it('should carry no load state without a source', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Media, () => 'Custom media')]))
      await settle()

      const media = part(host, 'media')

      expect(Object.hasOwn(media.dataset, 'state')).toBe(false)
      expect(media.querySelector('img')).toBeNull()
      expect(getComputedStyle(media).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should overlay slot content in white ink over a protection gradient', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Media, { src: PIXEL }, () => h(Md1Card.Title, () => 'Over the image')),
        h(Md1Card.Media, { ratio: '1:1', src: PIXEL }),
      ]))
      await settle()

      const [covered, bare] = host.querySelectorAll<HTMLElement>('.md1-card__media')
      const title = covered!.querySelector<HTMLElement>('.md1-card__title')!

      expect(getComputedStyle(title).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(title).position).toBe('relative')
      expect(getComputedStyle(title).zIndex).toBe('1')
      expect(getComputedStyle(covered!, '::after').backgroundImage).toContain('linear-gradient')
      expect(getComputedStyle(bare!, '::after').content).toBe('none')
    })
  })

  describe('text blocks', () => {
    it('should set the primary title in Headline 24 sp with 24 dp above and below when it closes the card', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Title, () => 'Title')]))
      await settle()

      const title = part(host, 'title')
      const computed = getComputedStyle(title)

      expect(title.tagName).toBe('H2')
      expect(computed.fontSize).toBe('24px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.lineHeight).toBe('32px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(computed.marginTop).toBe('0px')
      expect(computed.paddingTop).toBe('24px')
      expect(computed.paddingBottom).toBe('24px')
      expect(computed.paddingLeft).toBe(`${KEYLINE}px`)
      expect(computed.paddingRight).toBe(`${KEYLINE}px`)
    })

    it('should render the heading level it is given', async () => {
      const host = mount(() => h(Md1Card, () => [h(Md1Card.Title, { level: 3 }, () => 'Title')]))
      await settle()

      expect(part(host, 'title').tagName).toBe('H3')
      expect(getComputedStyle(part(host, 'title')).fontSize).toBe('24px')
    })

    it('should close text blocks with 16 dp when more follows and 24 dp when they end the card', async () => {
      const host = mount(() => h(Md1Card, { expanded: false }, () => [
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Supporting, () => 'Text'),
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action')]),
        h(Md1Card.Expanded, () => 'More'),
      ]))
      await settle()

      expect(getComputedStyle(part(host, 'title')).paddingBottom).toBe('16px')
      expect(getComputedStyle(part(host, 'supporting')).paddingBottom).toBe('16px')

      // A collapsed expansion does not count as content below.
      const closed = mount(() => h(Md1Card, { expanded: false }, () => [
        h(Md1Card.Supporting, () => 'Text'),
        h(Md1Card.Expanded, () => 'More'),
      ]))
      await settle()

      expect(getComputedStyle(part(closed, 'supporting')).paddingBottom).toBe('24px')
    })

    it('should sit the subtitle 12 dp under the title in Body 1 at the secondary ink', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Subtitle, () => 'Subtitle'),
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action')]),
      ]))
      await settle()

      const subtitle = getComputedStyle(part(host, 'subtitle'))

      expect(getComputedStyle(part(host, 'title')).paddingBottom).toBe('0px')
      expect(subtitle.paddingTop).toBe('12px')
      expect(subtitle.paddingBottom).toBe('16px')
      expect(subtitle.fontSize).toBe('14px')
      expect(subtitle.fontWeight).toBe('400')
      expect(subtitle.lineHeight).toBe('20px')
      expect(subtitle.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(part(host, 'subtitle').getBoundingClientRect().top).toBe(part(host, 'title').getBoundingClientRect().bottom)
    })

    it('should set supporting text in Body 1 at the secondary ink with 16 dp above', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Supporting, () => 'Text'),
      ]))
      await settle()

      const computed = getComputedStyle(part(host, 'supporting'))

      expect(computed.paddingTop).toBe('16px')
      expect(computed.paddingBottom).toBe('24px')
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.lineHeight).toBe('20px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(part(host, 'supporting').getBoundingClientRect().top).toBe(part(host, 'media').getBoundingClientRect().bottom)
    })

    it('should read the 16 dp handset keyline from the base rules', async () => {
      mount(() => h(Md1Card, () => [h(Md1Card.Title, () => 'Title')]))
      await settle()

      const title = rule('.md1-card__title')
      const header = rule('.md1-card__header')

      expect(title!.style.padding.replaceAll(/\s+/g, ' ')).toBe('var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px)')
      expect(header!.style.padding.replaceAll(/\s+/g, ' ')).toBe('var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px)')
    })
  })

  describe('actions', () => {
    it('should pad the row by 8 dp with 4 dp between start-aligned actions', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action 1'), h(Md1Button, () => 'Action 2')]),
      ]))
      await settle()

      const actions = part(host, 'actions')
      const [first, second] = actions.querySelectorAll('button')

      expect(actions.dataset.align).toBe('start')
      expect(getComputedStyle(actions).padding).toBe('8px')
      expect(getComputedStyle(actions).columnGap).toBe('4px')
      expect(first!.getBoundingClientRect().left - actions.getBoundingClientRect().left).toBe(8)
      expect(second!.getBoundingClientRect().left - first!.getBoundingClientRect().right).toBe(4)
      expect(actions.getBoundingClientRect().height).toBe(52)
    })

    it('should gather the actions at the end under align="end"', async () => {
      const host = mount(() => h(Md1Card, () => [
        h(Md1Card.Actions, { align: 'end' }, () => [h(Md1Button, () => 'Cancel'), h(Md1Button, () => 'Save')]),
      ]))
      await settle()

      const actions = part(host, 'actions')
      const last = actions.querySelectorAll('button')[1]!

      expect(actions.dataset.align).toBe('end')
      expect(getComputedStyle(actions).justifyContent).toBe('flex-end')
      expect(actions.getBoundingClientRect().right - last.getBoundingClientRect().right).toBe(8)
    })
  })

  describe('expansion', () => {
    it('should keep the expanded region hidden and out of the tab order until the model opens it', async () => {
      const open = shallowRef(false)
      const host = mount(() => h(Md1Card, { 'expanded': open.value, 'onUpdate:expanded': (value?: boolean) => (open.value = value ?? false) }, () => [
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Actions, () => [h(Md1Button, { onClick: () => (open.value = !open.value) }, () => 'More')]),
        h(Md1Card.Expanded, () => [h(Md1Button, () => 'Inside')]),
      ]))
      await settle()

      const el = card(host)
      const region = part(host, 'expanded')
      const [toggle, inside] = host.querySelectorAll('button')

      expect(region.hidden).toBe(true)
      expect(region.getAttribute('role')).toBe('region')
      expect(region.getAttribute('aria-labelledby')).toBe(part(host, 'title').id)
      expect(region.dataset.state).toBe('closed')
      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(false)

      toggle!.focus()
      await userEvent.tab()

      expect(document.activeElement).not.toBe(inside)

      await userEvent.click(toggle!)
      await settle()

      expect(open.value).toBe(true)
      expect(region.hidden).toBe(false)
      expect(region.dataset.state).toBe('open')
      expect(el.dataset.expanded).toBe('true')

      const computed = getComputedStyle(region)

      expect(computed.display).toBe('block')
      expect(computed.paddingTop).toBe('16px')
      expect(computed.paddingBottom).toBe('24px')
      expect(computed.paddingLeft).toBe(`${KEYLINE}px`)
      expect(computed.borderTopWidth).toBe('1px')
      expect(computed.borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.fontSize).toBe('14px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
      // The seam runs full bleed: the region is as wide as the card.
      expect(region.getBoundingClientRect().width).toBe(320)

      toggle!.focus()
      await userEvent.tab()

      expect(document.activeElement).toBe(inside)

      await userEvent.click(toggle!)
      await settle()

      expect(region.hidden).toBe(true)
      expect(Object.hasOwn(el.dataset, 'expanded')).toBe(false)
    })

    it('should round-trip the model through a renderless Collapsible.Activator on an Md1Button', async () => {
      const updates: boolean[] = []
      const open = shallowRef(false)
      const host = mount(() => h(Md1Card, {
        'expanded': open.value,
        'onUpdate:expanded': (value?: boolean) => {
          updates.push(value ?? false)
          open.value = value ?? false
        },
      }, () => [
        h(Md1Card.Actions, () => h(Collapsible.Activator as Component, { namespace: MD1_CARD_COLLAPSIBLE, renderless: true }, {
          default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, { ...attrs, ariaLabel: 'Show more', icon: 'expand-more' }),
        })),
        h(Md1Card.Expanded, () => 'More'),
      ]))
      await settle()

      const toggle = host.querySelector('button')!
      const region = part(host, 'expanded')

      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      expect(toggle.getAttribute('aria-controls')).toBe(region.id)

      await userEvent.click(toggle)
      await settle()

      expect(updates).toEqual([true])
      expect(open.value).toBe(true)
      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(region.hidden).toBe(false)

      // The keyboard path: Enter and Space on the focused toggle, the APG disclosure keys.
      toggle.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(updates).toEqual([true, false])
      expect(region.hidden).toBe(true)

      await userEvent.keyboard(' ')
      await settle()

      expect(updates).toEqual([true, false, true])
      expect(region.hidden).toBe(false)
    })

    it('should drop the dangling region label when the card has no title', async () => {
      const host = mount(() => h(Md1Card, { expanded: true }, () => [
        h(Md1Card.Supporting, () => 'Text'),
        h(Md1Card.Expanded, () => 'More'),
      ]))
      await settle()

      const region = part(host, 'expanded')

      expect(region.hidden).toBe(false)
      expect(region.getAttribute('role')).toBe('region')
      expect(region.getAttribute('aria-labelledby')).toBeNull()
    })

    it('should warn in dev when the region has no model to reveal it, and stay hidden', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1Card, () => [h(Md1Card.Expanded, () => 'More')]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('v-model:expanded'))
      expect(part(host, 'expanded').hidden).toBe(true)
    })

    it('should throw outside an Md1Card, as the v0 part it wraps does', () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(() => mount(() => h(Md1Card.Expanded, () => 'More'))).toThrow()
      expect(String(warn.mock.calls[0]?.[0])).toContain('Unhandled error')
    })
  })

  describe('selected', () => {
    it('should mark the selected card with the scrim and a compact check mark named for assistive technology', async () => {
      const host = mount(() => h(Md1Card, { selected: true }, () => [
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Title, () => 'Title'),
      ]))
      await settle()

      const el = card(host)
      const check = part(host, 'check')
      const glyph = check.querySelector('svg')!
      const box = check.getBoundingClientRect()

      expect(el.dataset.selected).toBe('true')
      expect(getComputedStyle(el, '::after').backgroundColor).toBe('rgba(255, 64, 129, 0.3)')
      expect(getComputedStyle(el, '::after').pointerEvents).toBe('none')

      expect(el.firstElementChild).toBe(check)
      expect(box.width).toBe(24)
      expect(box.height).toBe(24)
      expect(box.top - el.getBoundingClientRect().top).toBe(8)
      expect(el.getBoundingClientRect().right - box.right).toBe(8)
      expect(getComputedStyle(check).borderRadius).toBe('50%')
      expect(getComputedStyle(check).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(check).color).toBe('rgb(255, 255, 255)')
      expect(glyph.dataset.size).toBe('s')
      expect(glyph.getAttribute('role')).toBe('img')
      // No locale plugin is installed, so the inline English fallback is deterministic.
      expect(glyph.getAttribute('aria-label')).toBe('Selected')
    })

    it('should replace the header avatar with the check mark and draw no compact mark', async () => {
      const selected = shallowRef(true)
      const host = mount(() => h(Md1Card, { selected: selected.value }, () => [
        h(Md1Card.Header, { avatar: PIXEL, title: 'Title' }),
      ]))
      await settle()

      const header = part(host, 'header')

      expect(host.querySelector('.md1-card__check')).toBeNull()
      expect(header.querySelector('img')).toBeNull()

      const avatar = header.querySelector<HTMLElement>('.md1-card__avatar')!
      const glyph = avatar.querySelector('svg')!

      expect(avatar.dataset.check).toBe('true')
      expect(avatar.getBoundingClientRect().width).toBe(40)
      expect(getComputedStyle(avatar).backgroundColor).toBe('rgb(255, 64, 129)')
      // The selection page draws the check mark over the scrim, not under it.
      expect(getComputedStyle(avatar).position).toBe('relative')
      expect(getComputedStyle(avatar).zIndex).toBe('1')
      expect(document.elementFromPoint(avatar.getBoundingClientRect().left + 20, avatar.getBoundingClientRect().top + 20)!.closest('.md1-card__avatar')).toBe(avatar)
      expect(glyph.dataset.size).toBe('m')
      expect(glyph.getAttribute('aria-label')).toBe('Selected')

      selected.value = false
      await settle()

      expect(header.querySelector('img.md1-card__avatar')).not.toBeNull()
      expect(header.querySelector('[data-check]')).toBeNull()
    })

    it('should fall back to the compact check mark once the header gives up its avatar', async () => {
      const avatar = shallowRef<string | undefined>(PIXEL)
      const host = mount(() => h(Md1Card, { selected: true }, () => [
        h(Md1Card.Header, { avatar: avatar.value, title: 'Title' }),
      ]))
      await settle()

      expect(host.querySelector('.md1-card__check')).toBeNull()

      avatar.value = undefined
      await settle()

      expect(host.querySelector('.md1-card__check')).not.toBeNull()
      expect(part(host, 'header').querySelector('.md1-card__avatar')).toBeNull()
    })

    it('should keep the compact check mark when the header avatar is an empty string', async () => {
      const host = mount(() => h(Md1Card, { selected: true }, () => [
        h(Md1Card.Header, { avatar: '', title: 'Title' }),
      ]))
      await settle()

      // An empty source draws no avatar, so it must not take the check mark from the root.
      expect(host.querySelector('.md1-card__check')).not.toBeNull()
      expect(part(host, 'header').querySelector('.md1-card__avatar')).toBeNull()
    })

    it('should take the check mark label from the locale', async () => {
      const host = mount(() => h(Md1Card, { selected: true }, () => [h(Md1Card.Title, () => 'Title')]), app => {
        app.use(createLocalePlugin({ default: 'en', messages: { en: { Md1: { selected: 'Ausgewählt' } } } }))
      })
      await settle()

      expect(part(host, 'check').querySelector('svg')!.getAttribute('aria-label')).toBe('Ausgewählt')
    })
  })

  describe('orphans', () => {
    it('should warn once for each part rendered outside an Md1Card and still render it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h(Md1Card.Header, { title: 'Title' }),
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Subtitle, () => 'Subtitle'),
        h(Md1Card.Supporting, () => 'Text'),
        h(Md1Card.Actions, () => 'Actions'),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(6)

      for (const name of ['Md1CardHeader', 'Md1CardMedia', 'Md1CardTitle', 'Md1CardSubtitle', 'Md1CardSupporting', 'Md1CardActions']) {
        expect(warn).toHaveBeenCalledWith(expect.stringContaining(`[${name}] rendered outside <Md1Card>`))
      }

      expect(host.querySelectorAll('[class^="md1-card__"]').length).toBeGreaterThanOrEqual(6)
    })

    it('should stay silent when the parts are nested in a card', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1Card, { expanded: false }, () => [
        h(Md1Card.Header, { avatar: PIXEL, title: 'Title' }),
        h(Md1Card.Media, { src: PIXEL }),
        h(Md1Card.Title, () => 'Title'),
        h(Md1Card.Subtitle, () => 'Subtitle'),
        h(Md1Card.Supporting, () => 'Text'),
        h(Md1Card.Actions, () => [h(Md1Button, () => 'Action')]),
        h(Md1Card.Expanded, () => 'More'),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('theme', () => {
    it('should take the surface, ink and seam from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [
          h(Md1Card, { expanded: true, selected: true }, () => [
            h(Md1Card.Title, () => 'Light'),
            h(Md1Card.Supporting, () => 'Text'),
            h(Md1Card.Expanded, () => 'More'),
          ]),
        ]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Card, { expanded: true, selected: true }, () => [
            h(Md1Card.Title, () => 'Dark'),
            h(Md1Card.Supporting, () => 'Text'),
            h(Md1Card.Expanded, () => 'More'),
          ]),
        ]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.md1-card')

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(light!).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(light!.querySelector('.md1-card__title')!).color).toBe('rgba(0, 0, 0, 0.87)')

      // The dark theme flips the surface and the ink; the accent stays.
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(dark!.querySelector('.md1-card__title')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.md1-card__supporting')!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(dark!.querySelector('.md1-card__expanded')!).borderTopColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(dark!.querySelector('.md1-card__check')!).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(dark!, '::after').backgroundColor).toBe('rgba(255, 64, 129, 0.3)')
    })
  })
})

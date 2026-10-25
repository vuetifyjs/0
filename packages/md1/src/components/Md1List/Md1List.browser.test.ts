import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

import { Md1List } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'
// Components
import { Md1Checkbox } from '../Md1Checkbox'
import { Md1Subheader } from '../Md1Subheader'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.width = '400px'
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

function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.backgroundImage = value
  document.body.append(probe)
  const result = getComputedStyle(probe).backgroundImage
  probe.remove()
  return result
}

function text (primary: string, secondary?: string): VNode {
  return h(Md1List.Content, () => [
    h(Md1List.Primary, () => primary),
    secondary ? h(Md1List.Secondary, () => secondary) : null,
  ])
}

function tiles (host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('.md1-list__tile')]
}

function items (host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('.md1-list__item')]
}

function height (el: Element): number {
  return el.getBoundingClientRect().height
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

describe('quList', () => {
  describe('anatomy', () => {
    it('should render ul > li > button tile with the ripple first and the parts inside the body', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { value: 'inbox' }, () => [
          h(Md1List.Icon, { name: 'inbox' }),
          text('Inbox'),
        ]),
      ]))
      await settle()

      const list = host.querySelector<HTMLElement>('ul.md1-list')!
      const item = list.firstElementChild as HTMLElement
      const tile = item.firstElementChild as HTMLElement
      const body = tile.querySelector('.md1-list__body')!

      expect(list.dataset.select).toBe('none')
      expect(Object.hasOwn(list.dataset, 'dense')).toBe(false)
      expect(list.hasAttribute('role')).toBe(false)
      expect(item.tagName).toBe('LI')
      expect(item.dataset.lines).toBe('1')
      expect(item.hasAttribute('role')).toBe(false)
      expect(tile.tagName).toBe('BUTTON')
      expect(tile.getAttribute('type')).toBe('button')
      expect(tile.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect([...body.children].map(el => el.className)).toEqual(['md1-list__icon', 'md1-list__content'])
      expect(body.querySelector('.md1-list__primary')!.textContent).toBe('Inbox')
    })

    it('should render a link tile for href and a static row with no ripple when the item has no action', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { href: '#inbox' }, () => text('Inbox')),
        h(Md1List.Item, null, () => text('Read only')),
      ]))
      await settle()

      const [link, row] = tiles(host)

      expect(link!.tagName).toBe('A')
      expect(link!.getAttribute('href')).toBe('#inbox')
      expect(link!.querySelector('.md1-ripple')).not.toBeNull()
      expect(row!.tagName).toBe('DIV')
      expect(row!.querySelector('.md1-ripple')).toBeNull()
      expect(getComputedStyle(row!).cursor).toBe('auto')
    })

    it('should make the tile a button when the consumer listens for clicks, and fire it once', async () => {
      let clicks = 0
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { onClick: () => clicks++ }, () => text('Settings')),
      ]))
      await settle()

      const [tile] = tiles(host)

      expect(tile!.tagName).toBe('BUTTON')

      await userEvent.click(tile!)

      expect(clicks).toBe(1)
    })

    it('should draw the avatar as a 40 dp circle with an empty alt', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { value: 'a' }, () => [
          h(Md1List.Avatar, { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }),
          text('Ali Connors'),
        ]),
      ]))
      await settle()

      const avatar = host.querySelector<HTMLElement>('.md1-list__avatar')!
      const face = avatar.querySelector<HTMLElement>('.md1-list__face')!
      const img = avatar.querySelector('img')!

      expect(avatar.getBoundingClientRect().width).toBe(40)
      expect(avatar.getBoundingClientRect().height).toBe(40)
      expect(getComputedStyle(face).borderRadius).toBe('50%')
      expect(img.getAttribute('alt')).toBe('')
      expect(img.classList.contains('md1-list__image')).toBe(true)
    })

    it('should fill an avatar without src with Grey 400 under white ink', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => [h(Md1List.Avatar, null, () => 'A'), text('Folder')]),
      ]))
      await settle()

      const face = host.querySelector<HTMLElement>('.md1-list__avatar .md1-list__face')!

      expect(getComputedStyle(face).backgroundColor).toBe('rgb(189, 189, 189)')
      expect(getComputedStyle(face).color).toBe('rgb(255, 255, 255)')
      expect(face.textContent).toBe('A')
    })

    it('should draw the icon through Md1Icon at 24 dp in the 54% active ink', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox')]),
      ]))
      await settle()

      const icon = host.querySelector<HTMLElement>('.md1-list__icon')!
      const svg = icon.querySelector('svg')!

      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.inbox)
      expect(svg.getBoundingClientRect().width).toBe(24)
      expect(getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
    })
  })

  describe('metrics', () => {
    it('should pad the list 8 dp top and bottom and 4 dp dense', async () => {
      const host = mount(() => h('div', [
        h(Md1List, null, () => [h(Md1List.Item, null, () => 'One')]),
        h(Md1List, { dense: true }, () => [h(Md1List.Item, null, () => 'One')]),
      ]))
      await settle()

      const [list, dense] = host.querySelectorAll<HTMLElement>('.md1-list')

      expect(getComputedStyle(list!).paddingTop).toBe('8px')
      expect(getComputedStyle(list!).paddingBottom).toBe('8px')
      expect(Object.hasOwn(dense!.dataset, 'dense')).toBe(true)
      expect(getComputedStyle(dense!).paddingTop).toBe('4px')
    })

    it('should drop the top padding when a subheader opens the list', async () => {
      const host = mount(() => h('div', [
        h(Md1Subheader, null, () => 'Today'),
        h(Md1List, null, () => [h(Md1List.Item, null, () => 'One')]),
      ]))
      await settle()

      const list = host.querySelector<HTMLElement>('.md1-list')!

      expect(getComputedStyle(list).paddingTop).toBe('0px')
      expect(getComputedStyle(list).paddingBottom).toBe('8px')
    })

    it('should size tiles 48, 56 with an avatar, 72 and 88 dp', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => text('One')),
        h(Md1List.Item, null, () => [h(Md1List.Avatar), text('Avatar')]),
        h(Md1List.Item, { lines: 2 }, () => text('Two', 'Second')),
        h(Md1List.Item, { lines: 3 }, () => text('Three', 'Second and third')),
      ]))
      await settle()

      expect(tiles(host).map(height)).toEqual([48, 56, 72, 88])
      expect(items(host).map(el => el.dataset.lines)).toEqual(['1', '1', '2', '3'])
    })

    it('should size dense tiles 40, 48, 60 and 76 dp with 13 sp text', async () => {
      const host = mount(() => h(Md1List, { dense: true }, () => [
        h(Md1List.Item, null, () => text('One')),
        h(Md1List.Item, null, () => [h(Md1List.Avatar), text('Avatar')]),
        h(Md1List.Item, { lines: 2 }, () => text('Two', 'Second')),
        h(Md1List.Item, { lines: 3 }, () => text('Three', 'Second and third')),
      ]))
      await settle()

      expect(tiles(host).map(height)).toEqual([40, 48, 60, 76])
      expect(getComputedStyle(host.querySelector('.md1-list__primary')!).fontSize).toBe('13px')
      expect(getComputedStyle(host.querySelector('.md1-list__secondary')!).fontSize).toBe('13px')
    })

    it('should keep the 24 dp icon in a dense list, as the dense redlines draw it', async () => {
      const host = mount(() => h(Md1List, { dense: true }, () => [
        h(Md1List.Item, null, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox')]),
      ]))
      await settle()

      const icon = host.querySelector<HTMLElement>('.md1-list__icon')!

      expect(icon.getBoundingClientRect().width).toBe(24)
      expect(icon.querySelector('svg')!.getBoundingClientRect().width).toBe(24)
    })

    it('should take every item from the root lines unless the item sets its own', async () => {
      const host = mount(() => h(Md1List, { lines: 2 }, () => [
        h(Md1List.Item, null, () => text('Two', 'Second')),
        h(Md1List.Item, { lines: 1 }, () => text('One')),
      ]))
      await settle()

      expect(items(host).map(el => el.dataset.lines)).toEqual(['2', '1'])
      expect(tiles(host).map(height)).toEqual([72, 48])
    })

    it('should put the avatar or icon at the margin keyline and the text on the content keyline', async () => {
      // The test frame is 1280 px wide: the 600 px tablet column, 24 dp margin and 80 dp content keylines.
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => [h(Md1List.Avatar), text('Avatar')]),
        h(Md1List.Item, null, () => [h(Md1List.Icon, { name: 'inbox' }), text('Icon')]),
        h(Md1List.Item, null, () => text('Text only')),
        h(Md1List.Item, { inset: true }, () => text('Inset')),
      ]))
      await settle()

      const left = host.querySelector('.md1-list')!.getBoundingClientRect().left
      function offset (el: Element) {
        return el.getBoundingClientRect().left - left
      }
      const [avatar, icon, plain, inset] = [...host.querySelectorAll('.md1-list__primary')]

      expect(offset(host.querySelector('.md1-list__avatar')!)).toBe(24)
      expect(offset(host.querySelector('.md1-list__icon')!)).toBe(24)
      expect(offset(avatar!)).toBe(80)
      expect(offset(icon!)).toBe(80)
      expect(offset(plain!)).toBe(24)
      expect(Object.hasOwn(items(host)[3]!.dataset, 'inset')).toBe(true)
      expect(offset(inset!)).toBe(80)
    })

    it('should mirror the keylines under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [
        h(Md1List, null, () => [h(Md1List.Item, null, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox')])]),
      ]))
      await settle()

      const right = host.querySelector('.md1-list')!.getBoundingClientRect().right

      expect(right - host.querySelector('.md1-list__icon')!.getBoundingClientRect().right).toBe(24)
      expect(right - host.querySelector('.md1-list__primary')!.getBoundingClientRect().right).toBe(80)
    })

    it('should top-align the avatar with the primary text in a three-line tile', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { lines: 3 }, () => [h(Md1List.Avatar), text('Brunch this weekend?', 'I will be in your neighbourhood doing errands this weekend. Do you want to grab brunch?')]),
      ]))
      await settle()

      const top = tiles(host)[0]!.getBoundingClientRect().top

      expect(host.querySelector('.md1-list__avatar')!.getBoundingClientRect().top - top).toBe(16)
      expect(host.querySelector('.md1-list__primary')!.getBoundingClientRect().top - top).toBe(16)
      expect(getComputedStyle(host.querySelector('.md1-list__secondary')!).webkitLineClamp).toBe('2')
    })
  })

  describe('type', () => {
    it('should set primary text in Subheading and secondary text in Body 1 at the desktop sizes', async () => {
      // Playwright's desktop Chromium is the spec's mouse-and-keyboard environment.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { lines: 2 }, () => text('Primary', 'Secondary')),
      ]))
      await settle()

      const primary = getComputedStyle(host.querySelector('.md1-list__primary')!)
      const secondary = getComputedStyle(host.querySelector('.md1-list__secondary')!)

      expect(primary.fontFamily).toContain('Roboto')
      expect(primary.fontSize).toBe('15px')
      expect(primary.fontWeight).toBe('400')
      expect(primary.lineHeight).toBe('24px')
      expect(primary.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(primary.textOverflow).toBe('ellipsis')
      expect(secondary.fontSize).toBe('13px')
      expect(secondary.lineHeight).toBe('20px')
      expect(secondary.color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should keep the handset sizes outside the fine-pointer rule: 16 and 14 sp', () => {
      mount(() => h(Md1List, null, () => [h(Md1List.Item, null, () => text('A', 'B'))]))

      // Chromium cannot be switched to a coarse pointer inside one page, so the handset rules are read from the sheet.
      const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
      const primary = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.md1-list__primary')
      const secondary = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.md1-list__secondary')

      expect(primary!.style.fontSize).toBe('var(--md1-type-subheading-size, 16px)')
      expect(secondary!.style.fontSize).toBe('var(--md1-type-body-1-size, 14px)')
    })
  })

  describe('actions', () => {
    it('should render the action beside the tile as its own target, with the text clear of its column', async () => {
      let clicks = 0
      const checked = shallowRef(false)
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { onClick: () => clicks++ }, () => [
          text('Wi-Fi'),
          h(Md1List.Action, () => h(Md1Checkbox, {
            'ariaLabel': 'Wi-Fi',
            'modelValue': checked.value,
            'onUpdate:modelValue': (value: unknown) => {
              checked.value = value as boolean
            },
          })),
        ]),
      ]))
      await settle()

      const item = items(host)[0]!
      const tile = tiles(host)[0]!
      const action = item.querySelector<HTMLElement>('.md1-list__action')!

      // A sibling of the tile, never nested inside the button.
      expect(action.parentElement).toBe(item)
      expect(tile.contains(action)).toBe(false)

      await userEvent.click(action.querySelector('[role="checkbox"]')!)

      expect(checked.value).toBe(true)
      expect(clicks).toBe(0)

      const right = item.getBoundingClientRect().right

      // 24 dp from the edge at this width, and the text column stops another 24 dp before the control.
      expect(right - action.getBoundingClientRect().right).toBe(0)
      expect(getComputedStyle(action).paddingRight).toBe('24px')
      expect(host.querySelector('.md1-list__body')!.getBoundingClientRect().right).toBe(action.getBoundingClientRect().left)
    })

    it('should set text in the action column as Caption secondary info', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => [text('Meeting'), h(Md1List.Action, () => '15 min')]),
      ]))
      await settle()

      const action = getComputedStyle(host.querySelector('.md1-list__action')!)

      expect(action.fontSize).toBe('12px')
      expect(action.color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should warn in dev when an action is placed inside a selectable list', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1List, { select: 'single' }, () => [
        h(Md1List.Item, { value: 'a' }, () => [text('A'), h(Md1List.Action, () => 'x')]),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1ListAction'))
    })
  })

  describe('navigation', () => {
    it('should mark the item whose value is the model as current, in the primary colour', async () => {
      const current = shallowRef('inbox')
      const host = mount(() => h(Md1List, {
        'modelValue': current.value,
        'onUpdate:modelValue': (value: unknown) => {
          current.value = value as string
        },
      }, () => [
        h(Md1List.Item, { value: 'inbox', href: '#inbox' }, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox')]),
        h(Md1List.Item, { value: 'sent' }, () => [h(Md1List.Icon, { name: 'send' }), text('Sent')]),
      ]))
      await settle()

      const [inbox, sent] = tiles(host)

      expect(inbox!.getAttribute('aria-current')).toBe('page')
      expect(Object.hasOwn(items(host)[0]!.dataset, 'selected')).toBe(true)
      expect(inbox!.hasAttribute('aria-selected')).toBe(false)
      expect(getComputedStyle(inbox!.querySelector('.md1-list__primary')!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(inbox!.querySelector('.md1-list__icon')!).color).toBe('rgb(63, 81, 181)')
      // No scrim outside a listbox.
      expect(getComputedStyle(inbox!).backgroundColor).toBe('rgba(0, 0, 0, 0)')

      await userEvent.click(sent!)
      await settle()

      expect(current.value).toBe('sent')
      expect(sent!.getAttribute('aria-current')).toBe('true')
      expect(inbox!.hasAttribute('aria-current')).toBe(false)
    })
  })

  describe('selection', () => {
    it('should render a single-select listbox of options and select on click', async () => {
      const value = shallowRef<string>()
      const host = mount(() => h(Md1List, {
        'select': 'single',
        'aria-label': 'Ringtone',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: unknown) => {
          value.value = next as string
        },
      }, () => [
        h(Md1List.Item, { value: 'a' }, () => text('Andromeda')),
        h(Md1List.Item, { value: 'b' }, () => text('Beacon')),
      ]))
      await settle()

      const list = host.querySelector<HTMLElement>('.md1-list')!
      const [a, b] = tiles(host)

      expect(list.getAttribute('role')).toBe('listbox')
      expect(list.getAttribute('aria-label')).toBe('Ringtone')
      expect(list.hasAttribute('aria-multiselectable')).toBe(false)
      expect(list.dataset.select).toBe('single')
      expect(items(host).every(el => el.getAttribute('role') === 'none')).toBe(true)
      expect(a!.tagName).toBe('DIV')
      expect(a!.getAttribute('role')).toBe('option')
      expect(a!.getAttribute('aria-selected')).toBe('false')
      // No check marks in a single-select list.
      expect(host.querySelector('.md1-list__mark')).toBeNull()

      await userEvent.click(a!)
      await settle()

      expect(value.value).toBe('a')
      expect(a!.getAttribute('aria-selected')).toBe('true')

      await userEvent.click(b!)
      await settle()

      expect(value.value).toBe('b')
      expect(a!.getAttribute('aria-selected')).toBe('false')
      expect(b!.getAttribute('aria-selected')).toBe('true')
      expect(Object.hasOwn(items(host)[1]!.dataset, 'selected')).toBe(true)
      expect(getComputedStyle(b!).backgroundColor).toBe('rgba(255, 64, 129, 0.3)')
    })

    it('should toggle options of a multiple-select listbox and swap the avatar for the check mark', async () => {
      const value = shallowRef<string[]>([])
      const host = mount(() => h(Md1List, {
        'select': 'multiple',
        'aria-label': 'Recipients',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: unknown) => {
          value.value = next as string[]
        },
      }, () => [
        h(Md1List.Item, { value: 'ali' }, () => [h(Md1List.Avatar), text('Ali')]),
        h(Md1List.Item, { value: 'sandra' }, () => [h(Md1List.Icon, { name: 'person' }), text('Sandra')]),
      ]))
      await settle()

      const list = host.querySelector<HTMLElement>('.md1-list')!
      const [ali, sandra] = tiles(host)
      const mark = ali!.querySelector<HTMLElement>('.md1-list__mark')!

      expect(list.getAttribute('aria-multiselectable')).toBe('true')
      expect(Object.hasOwn(list.dataset, 'selecting')).toBe(false)
      expect(mark.getAttribute('aria-hidden')).toBe('true')
      expect(getComputedStyle(mark).display).toBe('none')

      await userEvent.click(ali!)
      await userEvent.click(sandra!)
      await settle()

      expect(value.value).toEqual(['ali', 'sandra'])
      expect(Object.hasOwn(list.dataset, 'selecting')).toBe(true)
      expect(getComputedStyle(mark).display).toBe('flex')
      expect(getComputedStyle(mark).color).toBe('rgb(255, 64, 129)')
      expect([...mark.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['check-box'])
      expect(getComputedStyle(ali!.querySelector('.md1-list__face')!).visibility).toBe('hidden')

      await userEvent.click(ali!)
      await settle()

      expect(value.value).toEqual(['sandra'])
      expect(ali!.getAttribute('aria-selected')).toBe('false')
      // While the set is in selection mode every item shows its mark, the unselected ones empty.
      expect(getComputedStyle(mark).display).toBe('flex')
      expect([...mark.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['check-box-outline-blank'])
    })

    it('should reveal the empty check mark for the hovered item on desktop', async () => {
      const host = mount(() => h(Md1List, { 'select': 'multiple', 'aria-label': 'People' }, () => [
        h(Md1List.Item, { value: 'ali' }, () => [h(Md1List.Avatar), text('Ali')]),
      ]))
      await settle()

      const tile = tiles(host)[0]!
      const mark = tile.querySelector<HTMLElement>('.md1-list__mark')!

      await userEvent.hover(tile)

      expect(getComputedStyle(mark).display).toBe('flex')

      await userEvent.unhover(tile)

      expect(getComputedStyle(mark).display).toBe('none')
    })

    it('should follow the model when it is set from outside', async () => {
      const value = shallowRef('b')
      const host = mount(() => h(Md1List, { 'select': 'single', 'aria-label': 'Options', 'modelValue': value.value }, () => [
        h(Md1List.Item, { value: 'a' }, () => 'A'),
        h(Md1List.Item, { value: 'b' }, () => 'B'),
      ]))
      await settle()

      expect(tiles(host).map(el => el.getAttribute('aria-selected'))).toEqual(['false', 'true'])

      value.value = 'a'
      await settle()

      expect(tiles(host).map(el => el.getAttribute('aria-selected'))).toEqual(['true', 'false'])
    })
  })

  describe('keyboard', () => {
    function listbox (select: 'single' | 'multiple', model?: unknown) {
      const value = shallowRef<unknown>(model)
      const host = mount(() => h(Md1List, {
        select,
        'aria-label': 'Options',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: unknown) => {
          value.value = next
        },
      }, () => [
        h(Md1List.Item, { value: 'a' }, () => 'A'),
        h(Md1List.Item, { value: 'b', disabled: true }, () => 'B'),
        h(Md1List.Item, { value: 'c' }, () => 'C'),
        h(Md1List.Item, { value: 'd' }, () => 'D'),
      ]))

      return { host, value }
    }

    it('should hold one tab stop and move it with the arrows, skipping disabled options', async () => {
      const { host } = listbox('single')
      await settle()

      const [a, b, c, d] = tiles(host)

      expect(tiles(host).map(el => el.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1'])

      await userEvent.tab()

      expect(document.activeElement).toBe(a)

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(document.activeElement).toBe(c)
      expect(c!.getAttribute('tabindex')).toBe('0')
      expect(a!.getAttribute('tabindex')).toBe('-1')
      expect(b!.getAttribute('tabindex')).toBe('-1')

      await userEvent.keyboard('{End}')
      await settle()

      expect(document.activeElement).toBe(d)

      await userEvent.keyboard('{Home}')
      await settle()

      expect(document.activeElement).toBe(a)

      await userEvent.keyboard('{ArrowUp}')
      await settle()

      expect(document.activeElement).toBe(a)
    })

    it('should select with Space and Enter in a single-select list', async () => {
      const { host, value } = listbox('single')
      await settle()

      const [a, , c] = tiles(host)

      a!.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(value.value).toBe('a')

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(document.activeElement).toBe(c)

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(value.value).toBe('c')
    })

    it('should toggle with Space in a multiple-select list', async () => {
      const { host, value } = listbox('multiple', [])
      await settle()

      tiles(host)[0]!.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(value.value).toEqual(['a'])

      await userEvent.keyboard(' ')
      await settle()

      expect(value.value).toEqual([])
    })

    it('should start the tab stop on the selected option', async () => {
      const { host } = listbox('single', 'c')
      await settle()

      expect(tiles(host).map(el => el.getAttribute('tabindex'))).toEqual(['-1', '-1', '0', '-1'])

      await userEvent.tab()

      expect(document.activeElement).toBe(tiles(host)[2])
    })

    it('should leave a navigation list to the native tab order', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, { value: 'a' }, () => 'A'),
        h(Md1List.Item, { value: 'b' }, () => 'B'),
      ]))
      await settle()

      const [a, b] = tiles(host)

      expect(a!.hasAttribute('tabindex')).toBe(false)

      await userEvent.tab()

      expect(document.activeElement).toBe(a)

      await userEvent.keyboard('{ArrowDown}')

      expect(document.activeElement).toBe(a)

      await userEvent.tab()

      expect(document.activeElement).toBe(b)
    })
  })

  describe('states', () => {
    it('should lay Vuetify 1.5\'s 4% list hover over the tile', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, { value: 'a' }, () => 'A')]))
      await settle()

      const tile = tiles(host)[0]!

      await userEvent.hover(tile)

      await expect.poll(() => getComputedStyle(tile).backgroundImage)
        .toBe(serialize('linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04))'))

      await userEvent.unhover(tile)

      await expect.poll(() => getComputedStyle(tile).backgroundImage).toBe('none')
    })

    it('should show the 12% focus overlay for keyboard focus only', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, { value: 'a' }, () => 'A')]))
      await settle()

      const tile = tiles(host)[0]!

      await userEvent.tab()

      expect(tile.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(tile).backgroundImage)
        .toBe(serialize('linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12))'))
    })

    it('should draw the pressed ink from the press point', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, { value: 'a' }, () => 'A')]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const tile = tiles(host)[0]!
      const rect = tile.getBoundingClientRect()

      tile.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: rect.left + 10, clientY: rect.top + 10 }))
      await settle()

      const ink = tile.querySelector<HTMLElement>('.md1-ripple__ink')!

      expect(ink).not.toBeNull()
      expect(getComputedStyle(ink).backgroundColor).toBe('rgba(153, 153, 153, 0.4)')

      tile.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))

      await expect.poll(() => tile.querySelectorAll('.md1-ripple__ink').length).toBe(0)
    })

    it('should disable a button tile natively: no click, no ink, disabled ink', async () => {
      let clicks = 0
      const value = shallowRef<string>()
      const host = mount(() => h(Md1List, { 'modelValue': value.value, 'onUpdate:modelValue': (next: unknown) => {
        value.value = next as string
      } }, () => [
        h(Md1List.Item, { value: 'a', disabled: true, onClick: () => clicks++ }, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox', 'Nothing')]),
      ]))
      await settle()

      const item = items(host)[0]!
      const tile = tiles(host)[0]!

      expect(Object.hasOwn(item.dataset, 'disabled')).toBe(true)
      expect((tile as HTMLButtonElement).disabled).toBe(true)

      tile.click()
      tile.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
      await settle()

      expect(clicks).toBe(0)
      expect(value.value).toBeUndefined()
      expect(tile.querySelectorAll('.md1-ripple__ink').length).toBe(0)
      expect(getComputedStyle(tile).pointerEvents).toBe('none')
      expect(getComputedStyle(tile.querySelector('.md1-list__primary')!).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(tile.querySelector('.md1-list__secondary')!).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(tile.querySelector('.md1-list__icon')!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should disable an option with aria-disabled and refuse the selection', async () => {
      const value = shallowRef<string>()
      const host = mount(() => h(Md1List, { 'select': 'single', 'aria-label': 'Options', 'modelValue': value.value, 'onUpdate:modelValue': (next: unknown) => {
        value.value = next as string
      } }, () => [h(Md1List.Item, { value: 'a', disabled: true }, () => 'A')]))
      await settle()

      const tile = tiles(host)[0]!

      expect(tile.getAttribute('aria-disabled')).toBe('true')
      expect(tile.getAttribute('tabindex')).toBe('-1')

      tile.click()
      await settle()

      expect(value.value).toBeUndefined()
      expect(tile.getAttribute('aria-selected')).toBe('false')
    })

    it('should drop the href from a disabled link', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, { href: '#a', disabled: true }, () => 'A')]))
      await settle()

      const tile = tiles(host)[0]!

      expect(tile.tagName).toBe('A')
      expect(tile.hasAttribute('href')).toBe(false)
      expect(tile.getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('group', () => {
    function group (open = shallowRef(false)) {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Group, {
          'title': 'Folders',
          'icon': 'folder',
          'modelValue': open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
        }, () => [
          h(Md1List.Item, { value: 'work' }, () => text('Work')),
          h(Md1List.Item, { value: 'travel' }, () => text('Travel')),
        ]),
      ]))

      return { host, open }
    }

    it('should render an item-shaped disclosure header with the chevron and hide the children', async () => {
      const { host } = group()
      await settle()

      const root = host.querySelector<HTMLElement>('.md1-list__group')!
      const header = root.querySelector<HTMLElement>('.md1-list__header')!
      const children = root.querySelector<HTMLElement>('.md1-list__children')!

      expect(root.tagName).toBe('LI')
      expect(root.dataset.state).toBe('closed')
      expect(header.tagName).toBe('BUTTON')
      expect(header.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(header.getAttribute('aria-expanded')).toBe('false')
      expect(header.getAttribute('aria-controls')).toBe(children.id)
      expect(header.querySelector('.md1-list__primary')!.textContent).toBe('Folders')
      expect(height(header)).toBe(48)
      expect(children.hidden).toBe(true)
      expect([...header.querySelectorAll('.md1-list__cue path')].map(p => p.getAttribute('d'))).toEqual(md1Icons['expand-more'])
    })

    it('should expand on click: primary title, rotated chevron, dividers and children on the content keyline', async () => {
      const { host, open } = group()
      await settle()

      const root = host.querySelector<HTMLElement>('.md1-list__group')!
      const header = root.querySelector<HTMLElement>('.md1-list__header')!

      await userEvent.click(header)
      await settle()

      expect(open.value).toBe(true)
      expect(root.dataset.state).toBe('open')
      expect(header.getAttribute('aria-expanded')).toBe('true')
      expect(root.querySelector<HTMLElement>('.md1-list__children')!.hidden).toBe(false)
      expect(getComputedStyle(header.querySelector('.md1-list__primary')!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(header.querySelector('.md1-list__cue svg')!).transform).not.toBe('none')
      expect(getComputedStyle(root).borderTopWidth).toBe('1px')
      expect(getComputedStyle(root).borderBottomColor).toBe('rgba(0, 0, 0, 0.12)')

      const left = host.querySelector('.md1-list')!.getBoundingClientRect().left
      const child = root.querySelector('.md1-list__nested .md1-list__primary')!

      expect(child.getBoundingClientRect().left - left).toBe(80)
    })

    it('should toggle from the keyboard and follow its model', async () => {
      const open = shallowRef(true)
      const { host } = group(open)
      await settle()

      const header = host.querySelector<HTMLElement>('.md1-list__header')!

      expect(header.getAttribute('aria-expanded')).toBe('true')

      header.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(open.value).toBe(false)
      expect(header.getAttribute('aria-expanded')).toBe('false')
    })

    it('should refuse to open a disabled group', async () => {
      const open = shallowRef(false)
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Group, {
          'title': 'Folders',
          'disabled': true,
          'modelValue': open.value,
          'onUpdate:modelValue': (value: boolean) => {
            open.value = value
          },
        }, () => [h(Md1List.Item, { value: 'work' }, () => 'Work')]),
      ]))
      await settle()

      const root = host.querySelector<HTMLElement>('.md1-list__group')!
      const header = root.querySelector<HTMLButtonElement>('.md1-list__header')!

      header.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await settle()

      expect(Object.hasOwn(root.dataset, 'disabled')).toBe(true)
      expect(header.disabled).toBe(true)
      expect(open.value).toBe(false)
      expect(root.dataset.state).toBe('closed')
      expect(getComputedStyle(header.querySelector('.md1-list__primary')!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should expand vertically on the standard duration and curve when motion is allowed', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Group, { title: 'Folders', modelValue: true }, () => [h(Md1List.Item, { value: 'work' }, () => 'Work')]),
      ]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const children = getComputedStyle(host.querySelector('.md1-list__children')!)

      expect(children.display).toBe('grid')
      expect(children.transitionProperty).toContain('grid-template-rows')
      expect(children.transitionTimingFunction).toContain('cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should mark nested items current through the same root model', async () => {
      const current = shallowRef('travel')
      const host = mount(() => h(Md1List, { modelValue: current.value }, () => [
        h(Md1List.Group, { title: 'Folders', modelValue: true }, () => [
          h(Md1List.Item, { value: 'work' }, () => 'Work'),
          h(Md1List.Item, { value: 'travel' }, () => 'Travel'),
        ]),
      ]))
      await settle()

      const nested = [...host.querySelectorAll<HTMLElement>('.md1-list__nested .md1-list__tile')]

      expect(nested.map(el => el.getAttribute('aria-current'))).toEqual([null, 'true'])
    })

    it('should warn in dev when a group is placed inside a selectable list', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1List, { 'select': 'multiple', 'aria-label': 'x' }, () => [
        h(Md1List.Group, { title: 'Folders' }),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1ListGroup'))
    })
  })

  describe('context', () => {
    it('should not warn when every part is nested', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => [
          h(Md1List.Avatar),
          text('Primary', 'Secondary'),
          h(Md1List.Action, () => 'x'),
        ]),
        h(Md1List.Item, null, () => h(Md1List.Icon, { name: 'inbox' })),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn once for an item outside the list and render it inert', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('ul', [h(Md1List.Item, { value: 'a' }, () => 'A')]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1ListItem] rendered outside <Md1List>'))
      expect(host.querySelector('.md1-list__tile')!.tagName).toBe('BUTTON')
    })

    it.each([
      ['Md1ListAvatar', () => h(Md1List.Avatar)],
      ['Md1ListIcon', () => h(Md1List.Icon, { name: 'inbox' })],
      ['Md1ListContent', () => h(Md1List.Content)],
      ['Md1ListPrimary', () => h(Md1List.Primary)],
      ['Md1ListSecondary', () => h(Md1List.Secondary)],
      ['Md1ListAction', () => h(Md1List.Action)],
      ['Md1ListGroup', () => h(Md1List.Group, { title: 'x' })],
    ])('should warn once for %s outside its parent', async (name, render) => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h('div', [render()]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(`[${name}]`))
    })

    it('should attach every part to the root and keep the flat names', async () => {
      const module = await import('./index')

      expect(Md1List.Item).toBe(module.Md1ListItem)
      expect(Md1List.Avatar).toBe(module.Md1ListAvatar)
      expect(Md1List.Icon).toBe(module.Md1ListIcon)
      expect(Md1List.Content).toBe(module.Md1ListContent)
      expect(Md1List.Primary).toBe(module.Md1ListPrimary)
      expect(Md1List.Secondary).toBe(module.Md1ListSecondary)
      expect(Md1List.Action).toBe(module.Md1ListAction)
      expect(Md1List.Group).toBe(module.Md1ListGroup)
    })
  })

  describe('motion', () => {
    it('should stagger the entrance of the rows present at mount, and not of rows added later', async () => {
      const count = shallowRef(2)
      const host = mount(() => h(Md1List, null, () => Array.from({ length: count.value }, (_, index) =>
        h(Md1List.Item, { key: index }, () => `Row ${index}`),
      )))
      await settle()

      const [first, second] = items(host)

      expect(Object.hasOwn(first!.dataset, 'enter')).toBe(true)
      expect(first!.style.animationDelay).toBe('calc(0 * var(--md1-stagger, 20ms))')
      expect(second!.style.animationDelay).toBe('calc(1 * var(--md1-stagger, 20ms))')
      // The test browser runs under prefers-reduced-motion: reduce, which removes the animation.
      expect(getComputedStyle(first!).animationName).toBe('none')

      count.value = 3
      await settle()

      const third = items(host)[2]!

      expect(Object.hasOwn(third.dataset, 'enter')).toBe(false)
      expect(third.style.animationDelay).toBe('')
    })

    it('should play the entrance on the decelerate curve when motion is allowed', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, null, () => 'A')]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const computed = getComputedStyle(items(host)[0]!)

      expect(computed.animationName).toBe('md1-list-enter')
      expect(computed.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
    })

    it('should spend the entrance once it has played, so a later display change cannot replay it', async () => {
      const host = mount(() => h(Md1List, null, () => [h(Md1List.Item, null, () => 'A')]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const [item] = items(host)

      expect(Object.hasOwn(item!.dataset, 'enter')).toBe(true)

      item!.dispatchEvent(new AnimationEvent('animationend', { animationName: 'md1-list-enter' }))
      await settle()

      expect(Object.hasOwn(item!.dataset, 'enter')).toBe(false)
      expect(item!.style.animationDelay).toBe('')
    })

    it('should not give the entrance to rows inside a closed group, which are off screen at mount', async () => {
      const host = mount(() => h(Md1List, null, () => [
        h(Md1List.Item, null, () => 'Inbox'),
        h(Md1List.Group, { title: 'Folders' }, () => [h(Md1List.Item, { value: 'work' }, () => 'Work')]),
      ]))
      await settle()

      const [visible, nested] = items(host)

      expect(Object.hasOwn(visible!.dataset, 'enter')).toBe(true)
      expect(Object.hasOwn(nested!.dataset, 'enter')).toBe(false)
    })
  })

  describe('theme', () => {
    it('should take its ink from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [
          h(Md1List, null, () => [h(Md1List.Item, { lines: 2 }, () => [h(Md1List.Icon, { name: 'inbox' }), text('Light', 'Second')])]),
        ]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1List, null, () => [
            h(Md1List.Item, { lines: 2 }, () => [h(Md1List.Icon, { name: 'inbox' }), text('Dark', 'Second')]),
            h(Md1List.Item, { disabled: true }, () => text('Off')),
          ]),
        ]),
      ]))
      await settle()

      const primaries = host.querySelectorAll('.md1-list__primary')
      const secondaries = host.querySelectorAll('.md1-list__secondary')
      const icons = host.querySelectorAll('.md1-list__icon')

      expect(getComputedStyle(primaries[0]!).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(primaries[1]!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(secondaries[1]!).color).toBe('rgba(255, 255, 255, 0.7)')
      expect(getComputedStyle(icons[1]!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(primaries[2]!).color).toBe('rgba(255, 255, 255, 0.5)')
    })

    it('should keep the primary 500 on the current item and the open group title on the dark sheet', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1List, { modelValue: 'inbox' }, () => [
          h(Md1List.Item, { value: 'inbox' }, () => [h(Md1List.Icon, { name: 'inbox' }), text('Inbox')]),
          h(Md1List.Group, { title: 'Labels', modelValue: true }, () => [h(Md1List.Item, { value: 'work' }, () => text('Work'))]),
        ]),
      ]))
      await settle()

      const [current, title] = host.querySelectorAll('.md1-list__primary')

      // Vuetify 1.5 leaves the primary unchanged on dark surfaces (SPEC.md Known limitations: about 1.5:1).
      expect(getComputedStyle(current!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(host.querySelector('.md1-list__icon')!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(title!).color).toBe('rgb(63, 81, 181)')
    })

    it('should draw the dark check mark in the accent, as Md1Checkbox does', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1List, { 'select': 'multiple', 'aria-label': 'Recipients', 'modelValue': ['ali'] }, () => [
          h(Md1List.Item, { value: 'ali' }, () => [h(Md1List.Avatar), text('Ali')]),
        ]),
      ]))
      await settle()

      // Pink A200, not the accent's 200: Vuetify 1.5's selectable.js:22.
      expect(getComputedStyle(host.querySelector('.md1-list__mark')!).color).toBe('rgb(255, 64, 129)')
    })
  })
})

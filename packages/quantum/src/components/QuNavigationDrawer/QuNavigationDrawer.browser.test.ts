import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, createStackPlugin } from '@vuetify/v0'

import { QuNavigationDrawer, QuNavigationDrawerActivator, QuNavigationDrawerContent, QuNavigationDrawerHeader } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuNavigationDrawerSlotProps } from './QuNavigationDrawer.vue'
import type { QuNavigationDrawerActivatorSlotProps } from './QuNavigationDrawerActivator.vue'
import type { ShallowRef, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
import { QuButton } from '../QuButton'
import { QuDivider } from '../QuDivider'
import { QuList } from '../QuList'
import { QuSubheader } from '../QuSubheader'

/** Vuetify 1.5's pixel recipes (spec/elevation.md) for the levels the drawer rests at. */
const ELEVATION_16 = '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)'
const ELEVATION_14 = '0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12)'
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

interface Options {
  open?: ShallowRef<boolean>
  page?: ShallowRef<unknown>
  props?: Record<string, unknown>
  /** Wraps the drawer in an attribute-carrying host (`dir`, `data-theme`). */
  host?: Record<string, unknown>
  /** Leaves out the activator. */
  bare?: boolean
  /** Extra destinations, to make the sheet scroll. */
  more?: number
}

function mount (node: () => VNode | VNode[]): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
  // Geometry is read in the landed state: motion is off unless a test turns it on.
  app.use(createReducedMotionPlugin({ mode: 'always' }))
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

/** The browser's own serialization of a shadow, so assertions never guess at its formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.boxShadow = value
  document.body.append(probe)
  const result = getComputedStyle(probe).boxShadow
  probe.remove()
  return result
}

/** A stylesheet rule by its selector, for values that live outside the media blocks this browser matches. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])

  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

function destination (value: string, icon: string, label: string, extra: Record<string, unknown> = {}): VNode {
  return h(QuList.Item, { value, ...extra }, () => [
    h(QuList.Icon, { name: icon }),
    h(QuList.Content, () => h(QuList.Primary, () => label)),
  ])
}

/** The pattern page's drawer: an account header, a list of destinations, a divider and a support list. */
function drawer (options: Options = {}): HTMLElement {
  const open = options.open ?? shallowRef(false)
  const current = options.page ?? shallowRef<unknown>('inbox')

  function node () {
    return h(QuNavigationDrawer, {
      'id': 'drawer',
      ...options.props,
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      default: (props: QuNavigationDrawerSlotProps) => [
        options.bare
          ? null
          : h(QuNavigationDrawer.Activator, null, {
              default: ({ attrs }: QuNavigationDrawerActivatorSlotProps) => h(QuButton, { ...attrs, id: 'trigger' }, () => props.isOpen ? 'Close menu' : 'Menu'),
            }),
        h(QuNavigationDrawer.Header, { name: 'Ada Lovelace', email: 'ada@example.com' }),
        h(QuNavigationDrawer.Content, () => [
          h(QuList, {
            'id': 'primary',
            'modelValue': current.value,
            'onUpdate:modelValue': (value: unknown) => {
              current.value = value
            },
          }, () => [
            destination('inbox', 'inbox', 'Inbox', { id: 'inbox' }),
            destination('sent', 'send', 'Sent mail', { id: 'sent' }),
            destination('drafts', 'drafts', 'Drafts', { id: 'drafts', disabled: true }),
            h(QuList.Group, { title: 'Labels', icon: 'label' }, () => [destination('work', 'label', 'Work')]),
            ...Array.from({ length: options.more ?? 0 }, (_, index) => destination(`extra-${index}`, 'star', `Starred ${index + 1}`)),
          ]),
          h(QuDivider, { id: 'divider' }),
          h(QuSubheader, { id: 'subheader' }, () => 'Support'),
          h(QuList, { id: 'support' }, () => [destination('settings', 'settings', 'Settings'), destination('help', 'help', 'Help')]),
        ]),
      ],
    })
  }

  // Non-modal drawers sit beside the content in a flex row the height of the screen.
  return mount(() => h('div', { style: 'display: flex; height: 600px', ...options.host }, [node(), h('main', { id: 'main', style: 'flex: 1 1 auto' }, 'Content')]))
}

function sheet (host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>('.quantum-navigation-drawer')!
}

function trigger (host: HTMLElement): HTMLButtonElement {
  return host.querySelector<HTMLButtonElement>('#trigger')!
}

async function settle () {
  await nextTick()
  await nextTick()
}

beforeEach(async () => {
  await page.viewport(1280, 800)
})

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quNavigationDrawer', () => {
  describe('temporary', () => {
    it('should render the activator outside a closed native dialog holding a nav sheet', async () => {
      const host = drawer()
      await settle()

      const el = sheet(host) as HTMLDialogElement

      expect(el.tagName).toBe('DIALOG')
      expect(el.open).toBe(false)
      expect(el.contains(trigger(host))).toBe(false)
      expect(el.id).toBe('drawer')
      expect(el.dataset.type).toBe('temporary')
      expect(el.dataset.side).toBe('start')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'mini')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'clipped')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'floating')).toBe(false)
      expect(el.getAttribute('role')).toBe('dialog')
      expect(el.getAttribute('aria-modal')).toBe('true')
      expect(el.getAttribute('aria-label')).toBe('Navigation')

      const nav = el.firstElementChild!

      expect(nav.tagName).toBe('NAV')
      expect(nav.classList.contains('quantum-navigation-drawer__sheet')).toBe(true)
      expect(nav.firstElementChild!.classList.contains('quantum-navigation-drawer__header')).toBe(true)
      expect(nav.lastElementChild!.classList.contains('quantum-navigation-drawer__content')).toBe(true)

      expect(trigger(host).getAttribute('aria-haspopup')).toBe('dialog')
      expect(trigger(host).getAttribute('aria-expanded')).toBe('false')
    })

    it('should open from the activator, move focus inside and mark every hook open', async () => {
      const open = shallowRef(false)
      const host = drawer({ open })
      await settle()

      await userEvent.click(trigger(host))
      await settle()

      const el = sheet(host) as HTMLDialogElement

      expect(open.value).toBe(true)
      expect(el.open).toBe(true)
      expect(el.matches(':modal')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)
      expect(trigger(host).getAttribute('aria-expanded')).toBe('true')
      expect(el.contains(document.activeElement)).toBe(true)
    })

    it('should open from the keyboard: Enter on the focused activator', async () => {
      const open = shallowRef(false)
      const host = drawer({ open })
      await settle()

      trigger(host).focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(open.value).toBe(true)
      expect((sheet(host) as HTMLDialogElement).open).toBe(true)
    })

    it('should span the full screen height at the start edge, 320 dp wide from 600 px', async () => {
      const host = drawer({ open: shallowRef(true) })
      await settle()

      const rect = sheet(host).getBoundingClientRect()

      expect(rect.left).toBe(0)
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(320)
      expect(rect.height).toBe(800)
    })

    it('should follow the width rule: screen width minus the app bar, at most five increments', async () => {
      const host = drawer({ open: shallowRef(true) })

      // Handset: min(100vw - 56, 280); from 600 px: min(100vw - 64, 320).
      for (const [width, expected] of [[414, 280], [320, 264], [600, 320], [360, 280]] as const) {
        await page.viewport(width, 700)
        await settle()

        expect(sheet(host).getBoundingClientRect().width).toBe(expected)
      }
    })

    it('should rest at 14 dp under a fine pointer, the desktop drop from 16 dp', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = drawer({ open: shallowRef(true) })
      await settle()

      expect(getComputedStyle(sheet(host)).boxShadow).toBe(serialize(ELEVATION_14))
    })

    it('should rest at 16 dp outside the fine-pointer rule, the pattern page value', async () => {
      drawer()
      await settle()

      const found = rule('.quantum-navigation-drawer[data-type=\'temporary\']')

      expect(found).toBeDefined()
      expect(found!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--quantum-elevation-16, ${ELEVATION_16})`)
    })

    it('should darken everything behind it with the scrim through ::backdrop', async () => {
      const host = drawer({ open: shallowRef(true) })
      await settle()

      expect(getComputedStyle(sheet(host), '::backdrop').backgroundColor).toBe('rgba(33, 33, 33, 0.46)')
    })

    it('should close on Escape and hand focus back to the activator', async () => {
      const open = shallowRef(false)
      const host = drawer({ open })
      await settle()

      await userEvent.click(trigger(host))
      await settle()

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      expect((sheet(host) as HTMLDialogElement).open).toBe(false)
      expect(document.activeElement).toBe(trigger(host))
    })

    it('should close on a press on the scrim beside the sheet', async () => {
      const open = shallowRef(true)
      const host = drawer({ open })
      await settle()

      const el = sheet(host)

      for (const type of ['pointerdown', 'pointerup']) {
        el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, clientX: 1000, clientY: 400 }))
      }
      await settle()

      expect(open.value).toBe(false)
    })

    it('should stay open for a press on the sheet itself', async () => {
      const open = shallowRef(true)
      const host = drawer({ open })
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-navigation-drawer__header')!

      for (const type of ['pointerdown', 'pointerup']) {
        header.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, clientX: 100, clientY: 40 }))
      }
      await settle()

      expect(open.value).toBe(true)
    })

    it('should close when a destination is chosen, after selecting it', async () => {
      const open = shallowRef(true)
      const current = shallowRef<unknown>('inbox')
      const host = drawer({ open, page: current })
      await settle()

      await userEvent.click(host.querySelector<HTMLElement>('#sent')!)
      await settle()

      expect(current.value).toBe('sent')
      expect(open.value).toBe(false)
    })

    it('should stay open when a nested level expands in-line', async () => {
      const open = shallowRef(true)
      const host = drawer({ open })
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-list__header')!

      await userEvent.click(header)
      await settle()

      expect(header.getAttribute('aria-expanded')).toBe('true')
      expect(open.value).toBe(true)
    })

    it('should leave a disabled destination inert: no selection, no close', async () => {
      const open = shallowRef(true)
      const current = shallowRef<unknown>('inbox')
      const host = drawer({ open, page: current })
      await settle()

      const drafts = host.querySelector<HTMLButtonElement>('#drafts')!

      expect(drafts.disabled).toBe(true)

      drafts.click()
      await settle()

      expect(current.value).toBe('inbox')
      expect(open.value).toBe(true)
    })

    it('should open from the end edge with side="end"', async () => {
      const host = drawer({ open: shallowRef(true), props: { side: 'end' } })
      await settle()

      const rect = sheet(host).getBoundingClientRect()

      expect(sheet(host).dataset.side).toBe('end')
      expect(rect.right).toBe(1280)
      expect(rect.width).toBe(320)
    })

    it('should mirror to the right edge under dir="rtl"', async () => {
      const host = drawer({ open: shallowRef(true), host: { dir: 'rtl' } })
      await settle()

      expect(sheet(host).getBoundingClientRect().right).toBe(1280)
    })

    it('should wait past its own edge while closed and slide in on the deceleration curve', async () => {
      drawer()
      await settle()

      expect(rule('.quantum-navigation-drawer[data-type=\'temporary\']:not([open])')!.style.transform).toBe('translateX(-100%)')
      expect(rule('.quantum-navigation-drawer[data-type=\'temporary\'][data-side=\'end\']:not([open]), .quantum-navigation-drawer[data-type=\'temporary\']:not([open]):dir(rtl)')!.style.transform).toBe('translateX(100%)')

      const enter = rule('.quantum-navigation-drawer[data-type=\'temporary\'][open]')!

      expect(enter.style.transitionDuration).toBe('var(--quantum-duration-enter, 225ms)')
      expect(enter.style.transitionTimingFunction).toBe('var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1))')
    })

    it('should take the accessible name from ariaLabel', async () => {
      const host = drawer({ props: { ariaLabel: 'Mail folders' } })
      await settle()

      expect(sheet(host).getAttribute('aria-label')).toBe('Mail folders')
    })
  })

  describe('persistent', () => {
    it('should render a nav landmark beside the content, closed and inert by default', async () => {
      const host = drawer({ props: { type: 'persistent' } })
      await settle()

      const el = sheet(host)

      expect(host.querySelector('dialog')).toBeNull()
      expect(el.tagName).toBe('NAV')
      expect(el.id).toBe('drawer')
      expect(el.getAttribute('aria-label')).toBe('Navigation')
      expect(el.dataset.type).toBe('persistent')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(el.hasAttribute('inert')).toBe(true)
      expect(el.getBoundingClientRect().width).toBe(0)
      expect(getComputedStyle(el).visibility).toBe('hidden')
      // The activator sits before it in the row; the content starts where the empty drawer ends.
      expect(host.querySelector('#main')!.getBoundingClientRect().left).toBe(el.getBoundingClientRect().right)
    })

    it('should be a disclosure: the activator controls the nav and toggles it', async () => {
      const open = shallowRef(false)
      const host = drawer({ open, props: { type: 'persistent' } })
      await settle()

      const button = trigger(host)

      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-controls')).toBe('drawer')
      expect(button.hasAttribute('aria-haspopup')).toBe(false)

      await userEvent.click(button)
      await settle()

      expect(open.value).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('true')
      expect(Object.hasOwn(sheet(host).dataset, 'open')).toBe(true)

      await userEvent.click(button)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should open at the content elevation, squeezing the content, with a 1 dp seam', async () => {
      const host = drawer({ open: shallowRef(true), props: { type: 'persistent' } })
      await settle()

      const el = sheet(host)
      const computed = getComputedStyle(el)

      expect(el.hasAttribute('inert')).toBe(false)
      expect(el.clientWidth).toBe(320)
      expect(computed.borderRightWidth).toBe('1px')
      expect(computed.borderRightColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.boxShadow).toBe('none')
      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.position).toBe('sticky')
      expect(el.getBoundingClientRect().height).toBe(600)
      expect(el.getBoundingClientRect().width).toBe(321)
      expect(host.querySelector('#main')!.getBoundingClientRect().left).toBe(el.getBoundingClientRect().right)
    })

    it('should not close on Escape: it stays open until closed', async () => {
      const open = shallowRef(true)
      const host = drawer({ open, props: { type: 'persistent' } })
      await settle()

      host.querySelector<HTMLElement>('#inbox')!.focus()
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(true)
    })

    it('should stay open when a destination is chosen', async () => {
      const open = shallowRef(true)
      const current = shallowRef<unknown>('inbox')
      const host = drawer({ open, page: current, props: { type: 'persistent' } })
      await settle()

      await userEvent.click(host.querySelector<HTMLElement>('#sent')!)
      await settle()

      expect(current.value).toBe('sent')
      expect(open.value).toBe(true)
    })

    it('should hand focus back to where it was when closing with focus inside', async () => {
      const open = shallowRef(false)
      const host = drawer({ open, props: { type: 'persistent' } })
      await settle()

      trigger(host).focus()
      open.value = true
      await settle()

      host.querySelector<HTMLElement>('#sent')!.focus()
      open.value = false
      await settle()
      await settle()

      expect(document.activeElement).toBe(trigger(host))
    })

    it('should seam the start edge instead with side="end"', async () => {
      const host = drawer({ open: shallowRef(true), props: { type: 'persistent', side: 'end' } })
      await settle()

      const computed = getComputedStyle(sheet(host))

      expect(computed.borderLeftWidth).toBe('1px')
      expect(computed.borderRightWidth).toBe('0px')
    })
  })

  describe('mini', () => {
    it('should rest as a 64 dp icon rail from 600 px, still focusable', async () => {
      const host = drawer({ props: { type: 'persistent', mini: true } })
      await settle()

      const el = sheet(host)

      expect(Object.hasOwn(el.dataset, 'mini')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(el.hasAttribute('inert')).toBe(false)
      expect(el.clientWidth).toBe(64)

      const icon = host.querySelector<HTMLElement>('#inbox .quantum-list__icon')!

      expect(icon.getBoundingClientRect().left - el.getBoundingClientRect().left).toBe(16)
      expect(getComputedStyle(host.querySelector('#subheader')!).opacity).toBe('0')
      expect(getComputedStyle(host.querySelector('.quantum-navigation-drawer__account')!).opacity).toBe('0')

      host.querySelector<HTMLElement>('#inbox')!.focus()

      expect(document.activeElement!.id).toBe('inbox')
    })

    it('should rest at 56 dp under 600 px', async () => {
      await page.viewport(414, 700)

      const host = drawer({ props: { type: 'persistent', mini: true } })
      await settle()

      expect(sheet(host).clientWidth).toBe(56)
    })

    it('should expand to the full drawer on open', async () => {
      const open = shallowRef(false)
      const host = drawer({ open, props: { type: 'persistent', mini: true } })
      await settle()

      await userEvent.click(trigger(host))
      await settle()

      expect(sheet(host).clientWidth).toBe(320)
      expect(getComputedStyle(host.querySelector('#subheader')!).opacity).toBe('1')
    })

    it('should warn in dev on a temporary or permanent drawer', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      drawer({ props: { mini: true } })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('mini'))
    })
  })

  describe('permanent', () => {
    it('should always be open whatever the model, and ignore close', async () => {
      const open = shallowRef(false)
      let close: (() => void) | undefined
      const host = mount(() => h(QuNavigationDrawer, {
        'type': 'permanent',
        'modelValue': open.value,
        'onUpdate:modelValue': (value: boolean) => {
          open.value = value
        },
      }, {
        default: (props: QuNavigationDrawerSlotProps) => {
          close = props.close

          return [h(QuNavigationDrawer.Content, () => h(QuList, () => destination('inbox', 'inbox', 'Inbox')))]
        },
      }))
      await settle()

      const el = sheet(host)

      expect(el.dataset.type).toBe('permanent')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)
      expect(el.hasAttribute('inert')).toBe(false)
      expect(el.clientWidth).toBe(320)

      close!()
      await settle()

      expect(open.value).toBe(false)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)
    })

    it('should hand an inert activator nothing to spread and warn in dev', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = drawer({ props: { type: 'permanent' } })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('permanent'))
      expect(trigger(host).hasAttribute('aria-expanded')).toBe(false)
      expect(trigger(host).hasAttribute('aria-controls')).toBe(false)
    })

    it('should start under the app bar when clipped, one increment down', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent', clipped: true } })
      await settle()

      const el = sheet(host)
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'clipped')).toBe(true)
      expect(computed.top).toBe('64px')
      expect(computed.maxHeight).toBe(`${800 - 64}px`)
    })

    it('should detach into a card when floating: 8 dp clear, 2 dp corners, no seam', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent', floating: true } })
      await settle()

      const el = sheet(host)
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'floating')).toBe(true)
      expect(computed.marginLeft).toBe('8px')
      expect(computed.marginTop).toBe('8px')
      expect(computed.borderRadius).toBe('2px')
      expect(computed.borderRightWidth).toBe('0px')
      expect(el.getBoundingClientRect().height).toBe(600 - 16)
      // The card's desktop rest under a fine pointer; the handset 2 dp sits outside the media block.
      expect(computed.boxShadow).toBe('none')
      expect(rule('.quantum-navigation-drawer[data-floating]:not([data-type=\'temporary\'])')!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--quantum-elevation-2, ${ELEVATION_2})`)
    })

    it('should warn in dev on floating without permanent and clipped with temporary', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      drawer({ props: { type: 'persistent', floating: true } })
      drawer({ props: { clipped: true } })
      await settle()

      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('floating'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('clipped'))
    })
  })

  describe('header', () => {
    it('should draw the 16:9 account area on the primary fill with white name and email', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent' } })
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-navigation-drawer__header')!
      const rect = header.getBoundingClientRect()
      const name = host.querySelector<HTMLElement>('.quantum-navigation-drawer__name')!
      const email = host.querySelector<HTMLElement>('.quantum-navigation-drawer__email')!
      const account = host.querySelector<HTMLElement>('.quantum-navigation-drawer__account')!

      expect(rect.width).toBe(320)
      expect(rect.height).toBe(180)
      expect(getComputedStyle(header).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(Object.hasOwn(header.dataset, 'image')).toBe(false)
      expect(account.getBoundingClientRect().height).toBe(56)
      expect(account.getBoundingClientRect().bottom).toBe(rect.bottom)
      expect(name.textContent).toBe('Ada Lovelace')
      expect(getComputedStyle(name).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(name).fontWeight).toBe('500')
      expect(getComputedStyle(email).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(email).fontWeight).toBe('400')
      // Body 2 and Body 1 at the desktop 13 sp under a fine pointer; 14 sp on a handset.
      expect(getComputedStyle(name).fontSize).toBe('13px')
      expect(rule('.quantum-navigation-drawer__name, .quantum-navigation-drawer__email')!.style.fontSize).toBe('var(--quantum-type-body-2-size, 14px)')
    })

    it('should draw the avatar as a 64 dp circle on the 16 dp keyline over a background image', async () => {
      const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
      const host = mount(() => h(QuNavigationDrawer, { type: 'permanent' }, () => [
        h(QuNavigationDrawer.Header, { name: 'Ada', avatar: pixel, image: pixel }, () => h('span', { id: 'switch' }, 'v')),
      ]))
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-navigation-drawer__header')!
      const avatar = host.querySelector<HTMLImageElement>('.quantum-navigation-drawer__avatar')!
      const image = host.querySelector<HTMLImageElement>('.quantum-navigation-drawer__image')!
      const box = header.getBoundingClientRect()
      const rect = avatar.getBoundingClientRect()

      expect(Object.hasOwn(header.dataset, 'image')).toBe(true)
      expect(image.alt).toBe('')
      expect(getComputedStyle(image).objectFit).toBe('cover')
      expect(image.getBoundingClientRect().height).toBe(box.height)
      expect(avatar.alt).toBe('')
      expect(rect.width).toBe(64)
      expect(rect.height).toBe(64)
      expect(rect.left - box.left).toBe(16)
      expect(rect.top - box.top).toBe(16)
      expect(getComputedStyle(avatar).borderRadius).toBe('50%')
      expect(host.querySelector('.quantum-navigation-drawer__account #switch')).not.toBeNull()
    })
  })

  describe('content', () => {
    it('should set destinations in Medium 14 sp with icons on 16 dp and text on 72 dp, even where the theme moves the keylines', async () => {
      // The theme sheet puts the list keylines at 24 and 80 dp from 600 px; the drawer keeps its own.
      style(new QuantumStyleSheetAdapter().generate({ 'quantum-light': quantumColors, 'quantum-dark': quantumDarkColors }))

      const host = drawer({ bare: true, props: { type: 'permanent' } })
      await settle()

      const left = sheet(host).getBoundingClientRect().left
      const icon = host.querySelector<HTMLElement>('#sent .quantum-list__icon')!
      const primary = host.querySelector<HTMLElement>('#sent .quantum-list__primary')!
      const subheader = host.querySelector<HTMLElement>('#subheader')!

      expect(icon.getBoundingClientRect().left - left).toBe(16)
      expect(primary.getBoundingClientRect().left - left).toBe(72)
      expect(getComputedStyle(subheader).paddingLeft).toBe('16px')
      expect(getComputedStyle(primary).fontWeight).toBe('500')
      expect(getComputedStyle(primary).fontSize).toBe('13px')
      expect(getComputedStyle(primary).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(host.querySelector<HTMLElement>('#sent')!.getBoundingClientRect().height).toBe(48)
    })

    it('should mark the current destination in the primary colour with aria-current', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent' } })
      await settle()

      const inbox = host.querySelector<HTMLElement>('#inbox')!

      expect(inbox.getAttribute('aria-current')).toBe('true')
      expect(getComputedStyle(inbox.querySelector('.quantum-list__primary')!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(inbox.querySelector('.quantum-list__icon')!).color).toBe('rgb(63, 81, 181)')
      expect(host.querySelector('#sent')!.hasAttribute('aria-current')).toBe(false)
    })

    it('should colour a bare-text current destination in the primary colour too', async () => {
      const current = shallowRef<unknown>('inbox')
      const host = mount(() => h(QuNavigationDrawer, { type: 'permanent' }, () => [
        h(QuNavigationDrawer.Content, () => h(QuList, {
          'modelValue': current.value,
          'onUpdate:modelValue': (value: unknown) => {
            current.value = value
          },
        }, () => [
          h(QuList.Item, { value: 'inbox', id: 'inbox' }, () => [h(QuList.Icon, { name: 'inbox' }), 'Inbox']),
          h(QuList.Item, { value: 'sent', id: 'sent' }, () => [h(QuList.Icon, { name: 'send' }), 'Sent mail']),
        ])),
      ]))
      await settle()

      expect(getComputedStyle(host.querySelector('#inbox .quantum-list__body')!).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(host.querySelector('#sent .quantum-list__body')!).color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should keep 8 dp above and below a full-bleed divider between groupings', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent' } })
      await settle()

      const divider = host.querySelector<HTMLElement>('#divider')!.getBoundingClientRect()
      const last = [...host.querySelectorAll<HTMLElement>('#primary > .quantum-list__item, #primary > .quantum-list__group')].at(-1)!.getBoundingClientRect()
      const content = host.querySelector<HTMLElement>('.quantum-navigation-drawer__content')!.getBoundingClientRect()

      expect(divider.top - last.bottom).toBe(8)
      expect(divider.width).toBe(content.width)
      expect(divider.left).toBe(content.left)
    })

    it('should scroll the whole sheet as a view when the destinations overflow', async () => {
      const host = drawer({ bare: true, props: { type: 'permanent' }, more: 20 })
      await settle()

      const scroller = host.querySelector<HTMLElement>('.quantum-navigation-drawer__sheet')!

      expect(getComputedStyle(scroller).overflowY).toBe('auto')
      expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      expect(scroller.contains(host.querySelector('.quantum-navigation-drawer__header'))).toBe(true)
    })
  })

  describe('compound', () => {
    it('should attach the parts to the root and keep the flat names', () => {
      expect(QuNavigationDrawer.Activator).toBe(QuNavigationDrawerActivator)
      expect(QuNavigationDrawer.Header).toBe(QuNavigationDrawerHeader)
      expect(QuNavigationDrawer.Content).toBe(QuNavigationDrawerContent)
    })

    it('should not warn when every part renders inside the root', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      drawer()
      drawer({ props: { type: 'persistent' } })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it.each([
      ['QuNavigationDrawerActivator', () => h(QuNavigationDrawerActivator, null, { default: ({ attrs }: QuNavigationDrawerActivatorSlotProps) => h('button', attrs, 'Menu') })],
      ['QuNavigationDrawerHeader', () => h(QuNavigationDrawerHeader, { name: 'Ada' })],
      ['QuNavigationDrawerContent', () => h(QuNavigationDrawerContent, () => 'Inbox')],
    ])('should warn once in dev when %s renders outside the root', async (part, node) => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(node)
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(part))
    })
  })

  describe('theme', () => {
    it('should take its surface and ink from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({ 'quantum-light': quantumColors, 'quantum-dark': quantumDarkColors }))

      const light = drawer({ bare: true, props: { type: 'permanent' }, host: { 'data-theme': 'quantum-light' } })
      const dark = drawer({ bare: true, props: { type: 'permanent' }, host: { 'data-theme': 'quantum-dark' } })
      await settle()

      expect(getComputedStyle(sheet(light)).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(sheet(dark)).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(dark.querySelector('#sent .quantum-list__primary')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(sheet(dark)).borderRightColor).toBe('rgba(255, 255, 255, 0.12)')
    })
  })
})

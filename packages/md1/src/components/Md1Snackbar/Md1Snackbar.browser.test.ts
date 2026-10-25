import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

// Framework
import { createNotificationsPlugin, createReducedMotionPlugin, createStackPlugin, useNotifications } from '@vuetify/v0'

import { Md1Snackbar } from './index'

// Utilities
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1SnackbarQueueSlotProps } from './Md1SnackbarQueue.vue'
import type { NotificationsContext } from '@vuetify/v0'
import type { App, ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Components
import { Md1BottomNavigation } from '../Md1BottomNavigation'

/** Vuetify 1.5's pixel recipes for the 6 dp handset and the 4 dp desktop rest (elevation page, 2 dp lower under a fine pointer). */
const ELEVATION_6 = '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'
const ELEVATION_4 = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

/** The configured desktop viewport (vitest.browser.config.ts). */
const DESKTOP = { width: 1280, height: 800 }

/** The tester frame's layout viewport, the box a fixed portal measures against. */
function viewport () {
  return { width: window.innerWidth, height: window.innerHeight }
}

const teardowns: (() => void | Promise<void>)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

/** Animations on, so the entrance and exit run for real; the tester context otherwise reports reduced motion. */
function motion (app: App) {
  app.use(createReducedMotionPlugin({ mode: 'never' }))
}

/** A single snackbar driven by v-model inside an inline (non-teleported) portal. */
function standalone (
  open: ShallowRef<boolean>,
  props: Record<string, unknown> = {},
  message = 'Message archived',
  setup?: (app: App) => void,
): HTMLElement {
  return mount(() => h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar, {
    ...props,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
  }, () => message)), setup)
}

function snackbar (host: ParentNode = document): HTMLElement | null {
  return host.querySelector<HTMLElement>('.md1-snackbar')
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

/** The stylesheet rule for a selector outside every @media block, read from the CSSOM. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

/** Parks the pointer in the top corner, away from the bottom edge where an earlier test may have left it over a snackbar. */
async function away () {
  const corner = document.createElement('div')
  corner.style.cssText = 'position: fixed; top: 0; left: 0; width: 8px; height: 8px'
  document.body.append(corner)
  teardowns.push(() => corner.remove())
  await userEvent.hover(corner)
}

/** Waits out the entrance (1 ms under the tester's reduced motion) so geometry reads the resting position, not the start of the slide. */
async function rest (el: HTMLElement) {
  await Promise.all(el.getAnimations().map(animation => animation.finished))
}

async function handset () {
  await page.viewport(400, 800)
  teardowns.push(() => page.viewport(DESKTOP.width, DESKTOP.height))
}

/** Mounts a portal plus queue on the default notifications key and hands back the context to send through. */
function queued (
  render: (props: Md1SnackbarQueueSlotProps) => VNode,
  queue: Record<string, unknown> = {},
  setup?: (app: App) => void,
): { host: HTMLElement, notifications: NotificationsContext } {
  let notifications!: NotificationsContext
  const Probe = defineComponent({
    setup () {
      notifications = useNotifications()
      return () => h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar.Queue, queue, {
        default: (props: Md1SnackbarQueueSlotProps) => render(props),
      }))
    },
  })
  const host = mount(() => h(Probe), app => {
    app.use(createNotificationsPlugin())
    setup?.(app)
  })
  return { host, notifications }
}

afterEach(async () => {
  while (teardowns.length > 0) {
    await teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quSnackbar', () => {
  describe('anatomy', () => {
    it('should render a status root with the message span and a flat Md1Button action', async () => {
      const host = standalone(shallowRef(true), { action: 'Undo' })
      await settle()

      const el = snackbar(host)!
      const text = el.querySelector('.md1-snackbar__text')!
      const action = el.querySelector<HTMLButtonElement>('.md1-snackbar__action')!

      expect(el.tagName).toBe('DIV')
      expect(el.getAttribute('role')).toBe('status')
      expect(el.dataset.align).toBe('center')
      expect(Object.hasOwn(el.dataset, 'multiline')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'stacked')).toBe(false)
      expect(text.tagName).toBe('SPAN')
      expect(text.textContent).toBe('Message archived')
      expect(action.tagName).toBe('BUTTON')
      expect(action.type).toBe('button')
      expect(action.classList.contains('md1-button')).toBe(true)
      expect(action.dataset.variant).toBe('flat')
      expect(action.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(action.textContent).toBe('Undo')
    })

    it('should render no action without the prop: the spec allows none, and never an icon', async () => {
      const host = standalone(shallowRef(true))
      await settle()

      expect(snackbar(host)!.querySelector('button')).toBeNull()
      expect(snackbar(host)!.querySelector('svg')).toBeNull()
    })

    it('should paint #323232 with white Body 1 text, one line, 24 dp at the sides and 14 dp above and below', async () => {
      const host = standalone(shallowRef(true), {}, 'A rather long message that will not fit on one line of a snackbar however wide the screen gets, so it is cut')
      await settle()

      const el = snackbar(host)!
      const text = el.querySelector<HTMLElement>('.md1-snackbar__text')!
      const computed = getComputedStyle(el)
      const type = getComputedStyle(text)

      expect(computed.backgroundColor).toBe('rgb(50, 50, 50)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('24px')
      expect(computed.paddingTop).toBe('14px')
      expect(computed.paddingBottom).toBe('14px')
      expect(el.getBoundingClientRect().height).toBe(48)
      expect(type.fontFamily).toContain('Roboto')
      expect(type.fontSize).toBe('14px')
      expect(type.fontWeight).toBe('400')
      expect(type.lineHeight).toBe('20px')
      expect(type.whiteSpace).toBe('nowrap')
      expect(type.textOverflow).toBe('ellipsis')
      expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
    })

    it('should set the action label in the accent, capitals, 24 dp from the message and from the end edge on a handset', async () => {
      await handset()

      const host = standalone(shallowRef(true), { action: 'Undo' })
      await settle()

      const el = snackbar(host)!
      const text = el.querySelector<HTMLElement>('.md1-snackbar__text')!
      const action = el.querySelector<HTMLElement>('.md1-snackbar__action')!
      const box = el.getBoundingClientRect()
      const button = action.getBoundingClientRect()
      const computed = getComputedStyle(action)

      expect(computed.color).toBe('rgb(255, 64, 129)')
      expect(computed.textTransform).toBe('uppercase')
      expect(computed.paddingLeft).toBe('8px')
      expect(computed.paddingRight).toBe('8px')
      // The label is the button's content box: 8 dp inside the button on either side.
      expect(box.right - (button.right - 8)).toBe(24)
      expect(button.left + 8 - text.getBoundingClientRect().right).toBe(24)
      // The 36 dp button never grows the 48 dp bar.
      expect(box.height).toBe(48)
    })

    it('should widen the message-to-action gap to 48 dp from 600 px', async () => {
      const host = standalone(shallowRef(true), { action: 'Undo' })
      await settle()

      const el = snackbar(host)!
      const text = el.querySelector<HTMLElement>('.md1-snackbar__text')!
      const button = el.querySelector<HTMLElement>('.md1-snackbar__action')!.getBoundingClientRect()

      expect(button.left + 8 - text.getBoundingClientRect().right).toBe(48)
      expect(el.getBoundingClientRect().right - (button.right - 8)).toBe(24)
    })

    it('should mirror the action to the start side under dir="rtl"', async () => {
      await handset()

      const host = mount(() => h('div', { dir: 'rtl' }, [
        h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar, { action: 'Undo' }, () => 'Archived')),
      ]))
      await settle()

      const el = snackbar(host)!
      const button = el.querySelector<HTMLElement>('.md1-snackbar__action')!.getBoundingClientRect()

      expect(button.left + 8 - el.getBoundingClientRect().left).toBe(24)
    })
  })

  describe('forms', () => {
    it('should run full width and square, flush with the bottom edge, on a handset', async () => {
      await handset()

      const host = standalone(shallowRef(true))
      await settle()

      const el = snackbar(host)!
      await rest(el)
      const box = el.getBoundingClientRect()

      expect(box.left).toBe(0)
      expect(box.width).toBe(viewport().width)
      expect(box.bottom).toBe(viewport().height)
      expect(getComputedStyle(el).borderRadius).toBe('0px')
    })

    it('should centre a 288 to 568 dp bar with 2 dp corners from 600 px', async () => {
      const short = standalone(shallowRef(true), {}, 'Sent')
      await settle()

      const el = snackbar(short)!
      await rest(el)
      const box = el.getBoundingClientRect()

      expect(box.width).toBe(288)
      expect(box.left).toBe((viewport().width - 288) / 2)
      expect(box.bottom).toBe(viewport().height)
      expect(getComputedStyle(el).borderRadius).toBe('2px')

      const long = standalone(shallowRef(true), {}, 'A rather long message that will not fit on one line of a snackbar however wide the screen gets')
      await settle()

      expect(snackbar(long)!.getBoundingClientRect().width).toBe(568)
    })

    it('should sit 24 dp in from the start and bottom edges under align="start"', async () => {
      const host = standalone(shallowRef(true), { align: 'start' })
      await settle()

      const el = snackbar(host)!
      await rest(el)
      const box = el.getBoundingClientRect()

      expect(el.dataset.align).toBe('start')
      expect(box.left).toBe(24)
      expect(box.bottom).toBe(viewport().height - 24)
    })

    it('should grow to 80 dp for two lines under multiline, with 24 dp above and below', async () => {
      const host = standalone(shallowRef(true), { multiline: true, action: 'Undo' }, 'This item has been archived. It stays in the archive folder for thirty days before deletion.')
      await settle()

      const el = snackbar(host)!
      const text = el.querySelector<HTMLElement>('.md1-snackbar__text')!

      expect(Object.hasOwn(el.dataset, 'multiline')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'stacked')).toBe(false)
      expect(el.getBoundingClientRect().height).toBe(80)
      expect(getComputedStyle(el).paddingTop).toBe('24px')
      expect(text.getBoundingClientRect().height).toBeLessThanOrEqual(40)
    })

    it('should move a long action to its own row, the 112 dp form, from its measured width', async () => {
      const host = standalone(shallowRef(true), { multiline: true, action: 'Open the archive folder' }, 'This item has been archived.')
      await settle()

      const el = snackbar(host)!
      const action = el.querySelector<HTMLElement>('.md1-snackbar__action')!

      await expect.poll(() => Object.hasOwn(el.dataset, 'stacked')).toBe(true)
      expect(action.offsetWidth).toBeGreaterThan(128)
      expect(el.getBoundingClientRect().height).toBe(112)
      // The action sits at the end of its own row, its label 24 dp from the edge.
      expect(el.getBoundingClientRect().right - (action.getBoundingClientRect().right - 8)).toBe(24)
      expect(action.getBoundingClientRect().top).toBeGreaterThan(el.querySelector('.md1-snackbar__text')!.getBoundingClientRect().bottom)
    })

    it('should pin the stacked action to the bottom edge whether the message runs to one line or two', async () => {
      const one = standalone(shallowRef(true), { multiline: true, action: 'Open the archive folder' }, 'Archived')
      const two = standalone(shallowRef(true), { multiline: true, action: 'Open the archive folder' }, 'This item has been archived. It stays in the archive folder for thirty days before it is deleted for good.')
      await settle()

      for (const host of [one, two]) {
        const el = snackbar(host)!
        const action = el.querySelector<HTMLElement>('.md1-snackbar__action')!

        await expect.poll(() => Object.hasOwn(el.dataset, 'stacked')).toBe(true)
        await rest(el)

        // The 36 dp button box ends on the bar's bottom edge, which puts its label baseline about 14 dp up.
        expect(el.getBoundingClientRect().bottom - action.getBoundingClientRect().bottom).toBe(0)
        expect(action.getBoundingClientRect().top - el.querySelector('.md1-snackbar__text')!.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(12)
      }
    })

    it('should keep a long action inline on a single-line snackbar', async () => {
      const host = standalone(shallowRef(true), { action: 'Open the archive folder' }, 'Archived')
      await settle()

      const el = snackbar(host)!

      expect(Object.hasOwn(el.dataset, 'stacked')).toBe(false)
      expect(el.getBoundingClientRect().height).toBe(48)
    })
  })

  describe('elevation', () => {
    it('should rest at 4 dp under a fine pointer, 2 dp below the handset 6 dp', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = standalone(shallowRef(true))
      await settle()

      expect(getComputedStyle(snackbar(host)!).boxShadow).toBe(serialize('boxShadow', ELEVATION_4))
    })

    it('should rest at 6 dp outside the fine-pointer rule, the handset value', async () => {
      standalone(shallowRef(true))
      await settle()

      // Headless Chromium cannot switch to a coarse pointer, so the base rule is read from the stylesheet.
      const base = rule('.md1-snackbar')

      expect(base).toBeDefined()
      expect(base!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-6, ${ELEVATION_6})`)
    })
  })

  describe('motion', () => {
    it('should enter upward on the decelerate curve and leave downward on the accelerate curve', async () => {
      const open = shallowRef(true)
      const host = standalone(open, {}, 'Sent', motion)
      await settle()

      const el = snackbar(host)!
      const entering = getComputedStyle(el)

      expect(el.dataset.state).toBe('present')
      expect(entering.animationName).toBe('md1-snackbar-enter')
      expect(entering.animationDuration).toBe('0.225s')
      expect(entering.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')

      open.value = false
      await settle()

      const leaving = getComputedStyle(el)

      expect(el.dataset.state).toBe('leaving')
      expect(leaving.animationName).toBe('md1-snackbar-leave')
      expect(leaving.animationDuration).toBe('0.195s')
      expect(leaving.animationTimingFunction).toBe('cubic-bezier(0.4, 0, 1, 1)')

      // The exit's animationend unmounts it.
      await expect.poll(() => snackbar(host)).toBeNull()
    })

    it('should travel the extra 24 dp inset when aligned to the start', async () => {
      const host = standalone(shallowRef(true), { align: 'start' }, 'Sent', motion)
      await settle()

      expect(getComputedStyle(snackbar(host)!).animationName).toBe('md1-snackbar-enter-inset')
    })

    it('should still finish its exit when motion is reduced', async () => {
      const open = shallowRef(true)
      const host = standalone(open, {}, 'Sent', app => {
        app.use(createReducedMotionPlugin({ mode: 'always' }))
      })
      await settle()

      expect(getComputedStyle(snackbar(host)!).animationDuration).toBe('0.001s')

      open.value = false

      await expect.poll(() => snackbar(host)).toBeNull()
    })

    it('should finish its exit even when the animation never runs', async () => {
      const open = shallowRef(true)
      const host = standalone(open, {}, 'Sent', motion)
      await settle()

      style('.md1-snackbar { animation: none !important; }')
      open.value = false
      await settle()

      expect(snackbar(host)).not.toBeNull()
      await expect.poll(() => snackbar(host), { timeout: 2000 }).toBeNull()
    })
  })

  describe('timing', () => {
    it('should dismiss itself after the 6000 ms default', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })
      teardowns.push(() => {
        vi.useRealTimers()
      })

      const open = shallowRef(true)
      standalone(open)
      await settle()

      vi.advanceTimersByTime(5999)

      expect(open.value).toBe(true)

      vi.advanceTimersByTime(1)

      expect(open.value).toBe(false)
    })

    it('should honour a shorter timeout and pause it while hovered', async () => {
      const open = shallowRef(true)
      const host = standalone(open, { timeout: 150 })
      await settle()

      const el = snackbar(host)!

      await userEvent.hover(el)
      await new Promise(resolve => setTimeout(resolve, 300))

      expect(open.value).toBe(true)

      await userEvent.unhover(el)

      await expect.poll(() => open.value).toBe(false)
    })

    it('should pause while focus is inside it', async () => {
      const open = shallowRef(true)
      const host = standalone(open, { timeout: 150, action: 'Undo' })
      await settle()

      snackbar(host)!.querySelector<HTMLButtonElement>('button')!.focus()
      await new Promise(resolve => setTimeout(resolve, 300))

      expect(open.value).toBe(true)

      document.body.focus()
      ;(document.activeElement as HTMLElement | null)?.blur()

      await expect.poll(() => open.value).toBe(false)
    })

    it('should warn in dev that a snackbar is never persistent when timeout is not positive', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      standalone(shallowRef(false), { timeout: 0 })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('persistent'))
    })
  })

  describe('interaction', () => {
    it('should emit action and dismiss itself when the action is clicked', async () => {
      const open = shallowRef(true)
      let actions = 0
      const host = standalone(open, { action: 'Undo', onAction: () => actions++ })
      await settle()

      await userEvent.click(snackbar(host)!.querySelector('button')!)

      expect(actions).toBe(1)
      expect(open.value).toBe(false)
      await expect.poll(() => snackbar(host)).toBeNull()
    })

    it('should reach the action with Tab and activate it with Enter and Space', async () => {
      let actions = 0
      const host = standalone(shallowRef(true), { action: 'Undo', onAction: () => actions++, timeout: 60_000 })
      await settle()

      const button = snackbar(host)!.querySelector<HTMLButtonElement>('button')!

      await userEvent.tab()

      expect(document.activeElement).toBe(button)

      await userEvent.keyboard('{Enter}')

      expect(actions).toBe(1)

      const again = standalone(shallowRef(true), { action: 'Retry', onAction: () => actions++, timeout: 60_000 })
      await settle()

      snackbar(again)!.querySelector<HTMLButtonElement>('button')!.focus()
      await userEvent.keyboard(' ')

      expect(actions).toBe(2)
    })

    it('should not block the page: the portal lets pointer events through outside the bar', async () => {
      const host = standalone(shallowRef(true))
      await settle()

      const portal = host.querySelector<HTMLElement>('.md1-snackbar-portal')!

      expect(getComputedStyle(portal).pointerEvents).toBe('none')
      expect(getComputedStyle(snackbar(host)!).pointerEvents).toBe('auto')
    })

    it('should reopen through v-model after leaving', async () => {
      const open = shallowRef(true)
      const host = standalone(open)
      await settle()

      open.value = false
      await expect.poll(() => snackbar(host)).toBeNull()

      open.value = true
      await settle()

      expect(snackbar(host)).not.toBeNull()
    })

    it('should render nothing while v-model is false', async () => {
      const host = standalone(shallowRef(false))
      await settle()

      expect(snackbar(host)).toBeNull()
    })
  })

  describe('portal', () => {
    it('should teleport a fixed bottom container to the body at the snackbar\'s z-index and with the live regions', async () => {
      const host = mount(() => h(Md1Snackbar.Portal, null, () => h(Md1Snackbar, { timeout: 60_000 }, () => 'Saved')))
      await settle()

      const portal = document.body.querySelector<HTMLElement>(':scope > .md1-snackbar-portal')!
      const computed = getComputedStyle(portal)

      expect(host.querySelector('.md1-snackbar')).toBeNull()
      expect(portal).not.toBeNull()
      expect(computed.position).toBe('fixed')
      expect(computed.bottom).toBe('0px')
      // Not the stack's inline 2000-range value: the 6 dp snackbar sits under the 8 dp bottom navigation.
      expect(portal.style.zIndex).toBe('')
      expect(computed.zIndex).toBe('3')
      expect(portal.querySelector('.md1-snackbar')!.textContent).toBe('Saved')

      // The Portal's persistent polite region mirrors the message so a fresh node is heard.
      const polite = document.body.querySelector<HTMLElement>('[aria-live="polite"]')!

      await expect.poll(() => polite.textContent).toBe('Saved')
    })

    it('should sit behind the bottom navigation', async () => {
      mount(() => h('div', [
        h(Md1Snackbar.Portal, null, () => h(Md1Snackbar, { timeout: 60_000 }, () => 'Archived')),
        h(Md1BottomNavigation, { 'modelValue': 'music', 'aria-label': 'Library' }, () => [
          h(Md1BottomNavigation.Action, { icon: 'mic', label: 'Music', value: 'music' }),
        ]),
      ]))
      await settle()

      const snackbar = document.body.querySelector<HTMLElement>(':scope > .md1-snackbar-portal .md1-snackbar')!
      const bar = document.querySelector<HTMLElement>('.md1-bottom-navigation')!
      // Past the slide-in: the snackbar rests on the bottom edge.
      await expect.poll(() => snackbar.getBoundingClientRect().bottom).toBe(window.innerHeight)

      const box = snackbar.getBoundingClientRect()
      const point = document.elementFromPoint(box.left + box.width / 2, box.bottom - 4)

      // Both hug the bottom edge; the bar paints over the snackbar where they overlap.
      expect(bar.contains(point)).toBe(true)
      expect(Number(getComputedStyle(bar).zIndex)).toBeGreaterThan(Number(getComputedStyle(snackbar.closest('.md1-snackbar-portal')!).zIndex))
    })

    it('should announce the message and the action as separate words', async () => {
      mount(() => h(Md1Snackbar.Portal, null, () => h(Md1Snackbar, { timeout: 60_000, action: 'Undo' }, () => 'Archived')))
      await settle()

      const polite = document.body.querySelector<HTMLElement>('[aria-live="polite"]')!

      await expect.poll(() => polite.textContent?.replaceAll(/\s+/g, ' ').trim()).toBe('Archived Undo')
    })

    it('should publish its height on the portal\'s parent while shown, for the FAB to move up', async () => {
      const open = shallowRef(true)
      const host = standalone(open, { multiline: true }, 'Two lines\nof text')
      await settle()

      await expect.poll(() => host.style.getPropertyValue('--md1-snackbar-height')).toBe('80px')

      open.value = false

      await expect.poll(() => host.style.getPropertyValue('--md1-snackbar-height')).toBe('')
    })
  })

  describe('queue', () => {
    it('should show a sent notification through the slot and dismiss it from the action', async () => {
      let actions = 0
      const { host, notifications } = queued(({ item }) => h(Md1Snackbar, { action: 'Undo', onAction: () => actions++ }, () => item.subject))
      await settle()

      expect(snackbar(host)).toBeNull()

      const ticket = notifications.send({ subject: 'Conversation archived' })
      await settle()

      const el = snackbar(host)!

      expect(el.textContent).toContain('Conversation archived')

      await userEvent.click(el.querySelector('button')!)

      expect(actions).toBe(1)
      expect(notifications.has(ticket.id)).toBe(false)
      await expect.poll(() => snackbar(host)).toBeNull()
    })

    it('should re-time a notification sent without its own timeout to the 6000 ms default, and keep an explicit one', async () => {
      const { notifications } = queued(({ item }) => h(Md1Snackbar, null, () => item.subject))
      await settle()

      const first = notifications.send({ subject: 'Default' })
      await settle()

      expect(notifications.queue.get(first.id)!.timeout).toBe(6000)

      const second = notifications.send({ subject: 'Explicit', timeout: 2500 })
      await settle()

      expect(notifications.queue.get(second.id)!.timeout).toBe(2500)
    })

    it('should take the queue timeout prop as the default', async () => {
      await away()

      const { notifications } = queued(({ item }) => h(Md1Snackbar, null, () => item.subject), { timeout: 120 })
      await settle()

      const ticket = notifications.send({ subject: 'Quick' })
      await settle()

      expect(notifications.queue.get(ticket.id)!.timeout).toBe(120)
      await expect.poll(() => notifications.queue.has(ticket.id)).toBe(false)
    })

    it('should show one at a time: a newer notification sends the shown one off before it enters', async () => {
      const { host, notifications } = queued(({ item }) => h(Md1Snackbar, null, () => item.subject), {}, motion)
      await settle()

      const first = notifications.send({ subject: 'First' })
      await settle()

      expect(snackbar(host)!.textContent).toBe('First')

      notifications.send({ subject: 'Second' })
      await settle()

      // The first contracts downward; the second waits for it.
      expect(host.querySelectorAll('.md1-snackbar').length).toBe(1)
      expect(snackbar(host)!.textContent).toBe('First')
      expect(snackbar(host)!.dataset.state).toBe('leaving')
      expect(notifications.queue.has(first.id)).toBe(false)
      // Leaving the display queue keeps the inbox entry.
      expect(notifications.has(first.id)).toBe(true)

      await expect.poll(() => snackbar(host)?.textContent).toBe('Second')
      expect(host.querySelectorAll('.md1-snackbar').length).toBe(1)
      expect(snackbar(host)!.dataset.state).toBe('present')
    })

    it('should pause the queue while the snackbar is hovered', async () => {
      const { host, notifications } = queued(({ item }) => h(Md1Snackbar, null, () => item.subject))
      await settle()

      const ticket = notifications.send({ subject: 'Hover me' })
      await settle()

      await userEvent.hover(snackbar(host)!)

      await expect.poll(() => notifications.queue.get(ticket.id)?.isPaused).toBe(true)

      await userEvent.unhover(snackbar(host)!)

      await expect.poll(() => notifications.queue.get(ticket.id)?.isPaused).toBe(false)
    })

    it('should render nothing when no notifications plugin is installed', async () => {
      const host = mount(() => h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar.Queue, null, {
        default: ({ item }: Md1SnackbarQueueSlotProps) => h(Md1Snackbar, null, () => item.subject),
      })))
      await settle()

      expect(host.querySelector('.md1-snackbar-queue')).not.toBeNull()
      expect(snackbar(host)).toBeNull()
    })
  })

  describe('warnings', () => {
    it('should warn in dev when the action is "Dismiss" or "Cancel"', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      standalone(shallowRef(true), { action: 'Dismiss' })
      standalone(shallowRef(true), { action: 'cancel' })
      await settle()

      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('"Dismiss"'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('"cancel"'))
    })

    it('should warn nothing for a spec action inside a portal', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      standalone(shallowRef(true), { action: 'Undo' })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })

    it('should warn once when the snackbar renders outside the portal', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Md1Snackbar, null, () => 'Loose'))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1Snackbar]'))
      expect(snackbar(host)).not.toBeNull()
    })

    it('should warn once when the queue renders outside the portal', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1Snackbar.Queue))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Md1SnackbarQueue]'))
    })
  })

  describe('theme', () => {
    it('should keep the dark bar and white ink in both themes from the adapter sheet', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [
          h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar, { action: 'Undo' }, () => 'Light')),
        ]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Snackbar.Portal, { teleport: false }, () => h(Md1Snackbar, { action: 'Undo' }, () => 'Dark')),
        ]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.md1-snackbar')

      for (const el of [light!, dark!]) {
        expect(getComputedStyle(el).backgroundColor).toBe('rgb(50, 50, 50)')
        expect(getComputedStyle(el).color).toBe('rgb(255, 255, 255)')
        expect(getComputedStyle(el.querySelector('button')!).color).toBe('rgb(255, 64, 129)')
      }
    })
  })
})

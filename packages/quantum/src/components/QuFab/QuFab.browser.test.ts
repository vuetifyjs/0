import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { QuFab, QuFabAction } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuantumCommands } from '../../../test/commands'
import type { QuFabProps } from './QuFab.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
import { elevation } from '../../design-system'
// Icons
import { quantumIcons } from '../../icons'

declare module 'vitest/browser' {
  interface BrowserCommands extends QuantumCommands {}
}

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
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

const BASE = { icon: 'add', ariaLabel: 'Create', position: 'static' } as const

function fab (props: Partial<QuFabProps> & Record<string, unknown> = {}, setup?: (app: App) => void): HTMLButtonElement {
  const host = mount(() => h(QuFab, { ...BASE, ...props }), setup)
  return host.querySelector('button')!
}

interface DialOptions {
  props?: Partial<QuFabProps> & Record<string, unknown>
  actions?: { icon: 'email' | 'event' | 'photo' | 'share' | 'edit' | 'phone', label: string, value?: unknown, onClick?: () => void }[]
  wrap?: (node: VNode) => VNode
}

const ACTIONS: NonNullable<DialOptions['actions']> = [
  { icon: 'email', label: 'Email', value: 'email' },
  { icon: 'event', label: 'Event', value: 'event' },
  { icon: 'photo', label: 'Photo', value: 'photo' },
]

function dial ({ props = {}, actions = ACTIONS, wrap = node => node }: DialOptions = {}) {
  const open = shallowRef(false)
  const selected: unknown[] = []
  const host = mount(() => wrap(h(QuFab, {
    ...BASE,
    'modelValue': open.value,
    'onUpdate:modelValue': (value: boolean) => {
      open.value = value
    },
    'onSelect': (value: unknown) => selected.push(value),
    ...props,
  }, () => actions.map(action => h(QuFab.Action, action)))))

  return {
    host,
    open,
    selected,
    get trigger () {
      return host.querySelector<HTMLButtonElement>('.quantum-fab')!
    },
    get menu () {
      return host.querySelector<HTMLElement>('.quantum-fab__actions')!
    },
    get items () {
      return [...host.querySelectorAll<HTMLButtonElement>('.quantum-fab__action')]
    },
    get labels () {
      return [...host.querySelectorAll<HTMLElement>('.quantum-fab__label')]
    },
  }
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

/** Every style rule in the document whose selector matches, with quotes normalised. */
function rules (selector: string, media?: string): CSSStyleRule[] {
  const found: CSSStyleRule[] = []

  function walk (list: CSSRuleList, inside?: string) {
    for (const rule of list) {
      if (rule instanceof CSSMediaRule) walk(rule.cssRules, rule.conditionText)
      else if (rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector && inside === media) found.push(rule)
    }
  }

  for (const sheet of document.styleSheets) walk(sheet.cssRules)

  return found
}

function down (el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + x,
    clientY: rect.top + y,
    pointerType: 'mouse',
  }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.quantum-ripple__ink')]
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

describe('quFab', () => {
  describe('anatomy', () => {
    it('should render a native button with the ripple first and the glyph through QuIcon', async () => {
      const el = fab()
      await settle()

      expect(el.tagName).toBe('BUTTON')
      expect(el.type).toBe('button')
      expect(el.classList.contains('quantum-fab')).toBe(true)
      expect(el.getAttribute('aria-label')).toBe('Create')
      expect(el.dataset.position).toBe('static')
      expect(Object.hasOwn(el.dataset, 'mini')).toBe(false)
      expect(el.hasAttribute('aria-haspopup')).toBe(false)

      const ripple = el.firstElementChild!
      const svg = el.querySelector<SVGElement>('svg')!

      expect(ripple.classList.contains('quantum-ripple')).toBe(true)
      expect(svg.classList.contains('quantum-icon')).toBe(true)
      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(quantumIcons.add)
    })

    it('should be a 56 dp accent circle with a white 24 dp glyph', async () => {
      const el = fab()
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)
      const svg = el.querySelector('svg')!

      expect(rect.width).toBe(56)
      expect(rect.height).toBe(56)
      expect(computed.borderRadius).toBe('50%')
      expect(computed.backgroundColor).toBe('rgb(255, 64, 129)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(svg).width).toBe('24px')
      expect(getComputedStyle(svg).height).toBe('24px')
    })

    it('should shrink to the 40 dp mini circle, keep the 24 dp glyph and answer to a 48 dp target', async () => {
      const el = fab({ mini: true })
      await settle()

      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2

      expect(Object.hasOwn(el.dataset, 'mini')).toBe(true)
      expect(rect.width).toBe(40)
      expect(rect.height).toBe(40)
      expect(getComputedStyle(el.querySelector('svg')!).width).toBe('24px')
      expect(document.elementFromPoint(x, rect.top - 3)).toBe(el)
      expect(document.elementFromPoint(x, rect.bottom + 3)).toBe(el)
      expect(document.elementFromPoint(x, rect.top - 6)).not.toBe(el)
    })

    it('should force the mini size at screen widths of 460 dp or less', async () => {
      fab()
      await settle()

      // The tester viewport is 1280 px wide, so the handset rule is read from the stylesheet.
      const [rule] = rules('.quantum-fab', '(max-width: 460px)')

      expect(rule).toBeDefined()
      expect(rule!.style.width).toBe('40px')
      expect(rule!.style.height).toBe('40px')
    })

    it('should warn in dev when the FAB has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(QuFab, { icon: 'add', position: 'static' }))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('pass ariaLabel'))
    })

    it('should enter as an expanding piece of material on the deceleration curve', async () => {
      const el = fab({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.animationName).toBe('quantum-fab-in')
      expect(computed.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
      expect(computed.animationDuration).toBe('0.225s')
    })

    it('should skip the entrance under reduced motion', async () => {
      const el = fab()
      await settle()

      // The tester context reports prefers-reduced-motion: reduce.
      expect(getComputedStyle(el).animationName).toBe('none')
    })
  })

  describe('position', () => {
    it('should fix the end FAB 24 dp from the bottom and end edges on a tablet-wide screen', async () => {
      const el = fab({ position: 'end' })
      await settle()

      const rect = el.getBoundingClientRect()

      expect(el.dataset.position).toBe('end')
      expect(getComputedStyle(el).position).toBe('fixed')
      expect(window.innerWidth - rect.right).toBe(24)
      expect(window.innerHeight - rect.bottom).toBe(24)
    })

    it('should keep the 16 dp handset inset outside the 600 px rule', async () => {
      fab({ position: 'end' })
      await settle()

      const [rule] = rules('.quantum-fab[data-position=\'end\'], .quantum-fab__dial[data-position=\'end\']')

      expect(rule).toBeDefined()
      expect(rule!.style.insetInlineEnd).toBe('var(--quantum-keyline-margin, 16px)')
    })

    it('should fix the start FAB at the start edge', async () => {
      const el = fab({ position: 'start' })
      await settle()

      const rect = el.getBoundingClientRect()

      expect(rect.left).toBe(24)
      expect(window.innerHeight - rect.bottom).toBe(24)
    })

    it('should mirror the end edge under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuFab, { ...BASE, position: 'end' })]))
      await settle()

      const rect = host.querySelector('button')!.getBoundingClientRect()

      expect(rect.left).toBe(24)
    })

    it('should move up by the height a visible snackbar publishes', async () => {
      const host = mount(() => h('div', { style: '--quantum-snackbar-height: 48px' }, [h(QuFab, { ...BASE, position: 'end' })]))
      await settle()

      const rect = host.querySelector('button')!.getBoundingClientRect()

      expect(window.innerHeight - rect.bottom).toBe(72)
    })

    it('should leave the static FAB in the flow', async () => {
      const el = fab()
      await settle()

      expect(getComputedStyle(el).position).toBe('relative')
    })

    it('should straddle the bottom edge of its host by half its height at the end keyline', async () => {
      const host = mount(() => h('div', {
        'data-fab-host': '',
        'style': 'position: relative; width: 400px; height: 120px',
      }, [h(QuFab, { ...BASE, position: 'seam' })]))
      await settle()

      const box = host.querySelector<HTMLElement>('[data-fab-host]')!.getBoundingClientRect()
      const rect = host.querySelector('button')!.getBoundingClientRect()

      expect(rect.top + rect.height / 2).toBe(box.bottom)
      expect(box.right - rect.right).toBe(24)
    })
  })

  describe('elevation', () => {
    it('should rest at the desktop 4 dp, regain 6 dp on hover and lift to 12 dp on press', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const el = fab({ id: 'held' }, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      expect(getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', elevation[4]))

      await userEvent.hover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', elevation[6]))

      await commands.press('#held')

      await expect.poll(() => el.matches(':active')).toBe(true)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', elevation[12]))
      await expect.poll(() => inks(el).length).toBe(1)

      await commands.release()
      await userEvent.unhover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', elevation[4]))
    })

    it('should rest at 6 dp and press to 12 dp outside the fine-pointer rule, the handset values', async () => {
      fab()
      await settle()

      const [rest] = rules('.quantum-fab')
      const [pressed] = rules('.quantum-fab:active')

      expect(rest!.style.boxShadow).toContain('var(--quantum-elevation-6,')
      expect(pressed!.style.boxShadow).toContain('var(--quantum-elevation-12,')
    })
  })

  describe('states', () => {
    it('should change colour on keyboard focus with the 12% focus overlay', async () => {
      const el = fab()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(el).backgroundImage).toBe('linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12))')
    })

    it('should draw the ink from the press point', async () => {
      const el = fab({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(el, 10, 10)
      await settle()

      expect(inks(el).length).toBe(1)
    })

    it('should disable natively with the raised button treatment and no shadow, click or ink', async () => {
      let clicks = 0
      const el = fab({ disabled: true, onClick: () => clicks++ })
      await settle()

      expect(el.disabled).toBe(true)
      expect(el.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)
      expect(el.getAttribute('tabindex')).toBe('-1')

      el.focus()

      expect(document.activeElement).not.toBe(el)

      el.click()
      down(el, 10, 10)
      await settle()

      const computed = getComputedStyle(el)

      expect(clicks).toBe(0)
      expect(inks(el).length).toBe(0)
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.26)')
      expect(computed.boxShadow).toBe('none')
    })

    it('should fire the consumer click once per click, Enter and Space', async () => {
      let clicks = 0
      const el = fab({ onClick: () => clicks++ })
      await settle()

      await userEvent.click(el)

      expect(clicks).toBe(1)

      el.focus()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')

      expect(clicks).toBe(3)
    })
  })

  describe('speed dial', () => {
    it('should make the FAB the menu button of a role=menu holding one menuitem per action', async () => {
      const { host, trigger, menu, items, labels } = dial()
      await settle()

      const root = host.querySelector<HTMLElement>('.quantum-fab__dial')!

      expect(root.dataset.position).toBe('static')
      expect(Object.hasOwn(root.dataset, 'open')).toBe(false)
      expect(Object.hasOwn(root.dataset, 'mini')).toBe(false)
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('aria-label')).toBe('Create')
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.getAttribute('aria-controls')).toBe(menu.id)
      expect(trigger.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(menu.getAttribute('role')).toBe('menu')
      expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id)
      expect(menu.hasAttribute('popover')).toBe(true)
      expect(menu.matches(':popover-open')).toBe(false)

      expect(items.map(item => item.getAttribute('role'))).toEqual(['menuitem', 'menuitem', 'menuitem'])
      expect(items.map(item => item.getAttribute('aria-label'))).toEqual(['Email', 'Event', 'Photo'])
      expect(items.every(item => item.type === 'button')).toBe(true)
      expect(items.every(item => item.firstElementChild!.classList.contains('quantum-ripple'))).toBe(true)
      expect(labels.map(label => label.textContent)).toEqual(['Email', 'Event', 'Photo'])
      expect(labels.every(label => label.getAttribute('aria-hidden') === 'true')).toBe(true)
      // SPEC.md anatomy: each action button, then its label.
      expect(items.every((item, index) => item.nextElementSibling === labels[index])).toBe(true)
    })

    it('should fly the actions out above the FAB as 40 dp circles centred on it, labels at the start side, 16 dp apart', async () => {
      const { host, trigger, menu, items, labels, open } = dial({ props: { position: 'end' } })
      await settle()

      await userEvent.click(trigger)
      await settle()

      const root = host.querySelector<HTMLElement>('.quantum-fab__dial')!

      expect(open.value).toBe(true)
      expect(menu.matches(':popover-open')).toBe(true)
      expect(Object.hasOwn(root.dataset, 'open')).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')

      const fabRect = trigger.getBoundingClientRect()
      const centre = fabRect.left + fabRect.width / 2
      const rects = items.map(item => item.getBoundingClientRect())

      for (const [index, rect] of rects.entries()) {
        expect(rect.width).toBe(40)
        expect(rect.height).toBe(40)
        expect(rect.left + rect.width / 2).toBeCloseTo(centre, 0)
        expect(labels[index]!.getBoundingClientRect().right).toBeCloseTo(rect.left - 16, 0)
      }

      expect(rects.at(-1)!.bottom).toBeLessThanOrEqual(fabRect.top - 16)
      expect(rects[1]!.top - rects[0]!.bottom).toBeCloseTo(16, 0)
      expect(rects[2]!.top - rects[1]!.bottom).toBeCloseTo(16, 0)
    })

    it('should paint the actions as surface mini FABs and the labels in Body 1', async () => {
      const { trigger, items, labels } = dial()
      await settle()

      await userEvent.click(trigger)
      await settle()

      const action = getComputedStyle(items[0]!)
      const label = getComputedStyle(labels[0]!)

      expect(action.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(action.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(action.borderRadius).toBe('50%')
      expect(action.boxShadow).toBe(serialize('boxShadow', elevation[4]))
      expect(label.fontSize).toBe('14px')
      expect(label.color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should stagger the fly-out from the action nearest the FAB, 20 ms apart', async () => {
      const { trigger, items } = dial()
      await settle()

      await userEvent.click(trigger)
      await settle()

      const delays = items.map(item => getComputedStyle(item).transitionDelay.split(',')[0]!.trim())

      expect(delays).toEqual(['0.04s', '0.02s', '0s'])
    })

    it('should close when the FAB is pressed again, the FAB staying on screen', async () => {
      const { trigger, menu, open } = dial()
      await settle()

      await userEvent.click(trigger)
      await settle()

      expect(menu.matches(':popover-open')).toBe(true)

      await userEvent.click(trigger)
      await settle()

      expect(open.value).toBe(false)
      expect(menu.matches(':popover-open')).toBe(false)
      expect(trigger.isConnected).toBe(true)
    })

    it('should report the chosen action through select, fire its click once and close', async () => {
      let clicks = 0
      const { trigger, items, selected, open } = dial({
        actions: [
          { icon: 'email', label: 'Email', value: 'email', onClick: () => clicks++ },
          { icon: 'event', label: 'Event', value: 'event' },
        ],
      })
      await settle()

      await userEvent.click(trigger)
      await settle()
      await userEvent.click(items[0]!)
      await settle()

      expect(selected).toEqual(['email'])
      expect(clicks).toBe(1)
      expect(open.value).toBe(false)
    })

    it('should report the label when an action has no value', async () => {
      const { trigger, items, selected } = dial({
        actions: [
          { icon: 'email', label: 'Email' },
          { icon: 'event', label: 'Event' },
        ],
      })
      await settle()

      await userEvent.click(trigger)
      await settle()
      await userEvent.click(items[1]!)
      await settle()

      expect(selected).toEqual(['Event'])
    })

    it('should treat a press on the label as a press on its action', async () => {
      const { trigger, labels, selected, open } = dial()
      await settle()

      await userEvent.click(trigger)
      await settle()
      await userEvent.click(labels[2]!)
      await settle()

      expect(selected).toEqual(['photo'])
      expect(open.value).toBe(false)
    })

    it('should open from the keyboard on the first action, move with the arrows and activate with Enter', async () => {
      let clicks = 0
      const { trigger, items, selected, open } = dial({
        actions: [
          { icon: 'email', label: 'Email', value: 'email' },
          { icon: 'event', label: 'Event', value: 'event', onClick: () => clicks++ },
        ],
      })
      await settle()

      trigger.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(open.value).toBe(true)
      await expect.poll(() => document.activeElement).toBe(items[0])

      await userEvent.keyboard('{ArrowDown}')

      expect(document.activeElement).toBe(items[1])

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(selected).toEqual(['event'])
      expect(clicks).toBe(1)
      expect(open.value).toBe(false)
      await expect.poll(() => document.activeElement).toBe(trigger)
    })

    it('should activate a highlighted action with Space exactly once', async () => {
      const { trigger, items, selected, open } = dial()
      await settle()

      trigger.focus()
      await userEvent.keyboard('{ArrowUp}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(items[2])

      await userEvent.keyboard(' ')
      await settle()

      expect(selected).toEqual(['photo'])
      expect(open.value).toBe(false)
    })

    it('should close on Escape and return focus to the FAB', async () => {
      const { trigger, items, open } = dial()
      await settle()

      trigger.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(items[0])

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      await expect.poll(() => document.activeElement).toBe(trigger)
    })

    it('should close on Tab without pulling focus back to the FAB', async () => {
      const { trigger, items, open } = dial()
      await settle()

      trigger.focus()
      await userEvent.keyboard('{ArrowDown}')
      await settle()

      await expect.poll(() => document.activeElement).toBe(items[0])

      await userEvent.keyboard('{Tab}')
      await settle()

      expect(open.value).toBe(false)
      expect(document.activeElement).not.toBe(trigger)
    })

    it('should close on a press outside the dial without choosing an action', async () => {
      const { trigger, menu, selected, open } = dial()
      await settle()

      await userEvent.click(trigger)
      await settle()

      expect(menu.matches(':popover-open')).toBe(true)

      await userEvent.click(document.body, { position: { x: 4, y: 4 } })
      await settle()

      expect(open.value).toBe(false)
      expect(menu.matches(':popover-open')).toBe(false)
      expect(selected).toEqual([])
    })

    it('should mark a mini dial and centre its 40 dp actions on the 40 dp FAB', async () => {
      const { host, trigger, items } = dial({ props: { mini: true, position: 'end' } })
      await settle()

      const root = host.querySelector<HTMLElement>('.quantum-fab__dial')!

      expect(Object.hasOwn(root.dataset, 'mini')).toBe(true)
      expect(Object.hasOwn(trigger.dataset, 'mini')).toBe(true)

      await userEvent.click(trigger)
      await settle()

      const fabRect = trigger.getBoundingClientRect()

      expect(fabRect.width).toBe(40)

      for (const item of items) {
        const rect = item.getBoundingClientRect()

        expect(rect.left + rect.width / 2).toBeCloseTo(fabRect.left + fabRect.width / 2, 0)
      }
    })

    it('should open and close from v-model', async () => {
      const { menu, open } = dial()
      await settle()

      open.value = true
      await settle()

      expect(menu.matches(':popover-open')).toBe(true)

      open.value = false
      await settle()

      expect(menu.matches(':popover-open')).toBe(false)
    })

    it('should put the labels at the end side for a start-edge FAB', async () => {
      const { trigger, items, labels } = dial({ props: { position: 'start' } })
      await settle()

      await userEvent.click(trigger)
      await settle()

      const action = items[0]!.getBoundingClientRect()
      const label = labels[0]!.getBoundingClientRect()

      expect(label.left).toBeCloseTo(action.right + 16, 0)
      expect(trigger.getBoundingClientRect().left).toBe(24)
    })

    it('should keep a disabled dial shut and out of the tab order', async () => {
      const { host, trigger, menu, open } = dial({ props: { disabled: true } })
      await settle()

      expect(trigger.disabled).toBe(true)
      expect(Object.hasOwn(trigger.dataset, 'disabled')).toBe(true)
      expect(Object.hasOwn(host.querySelector<HTMLElement>('.quantum-fab__dial')!.dataset, 'disabled')).toBe(true)

      trigger.click()
      await settle()

      expect(open.value).toBe(false)
      expect(menu.matches(':popover-open')).toBe(false)
      expect(getComputedStyle(trigger).boxShadow).toBe('none')
    })

    it('should warn in dev for one action or for six, and stay quiet for two to five', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dial({ actions: ACTIONS.slice(0, 2) })
      dial({ actions: [...ACTIONS, { icon: 'share', label: 'Share' }, { icon: 'edit', label: 'Edit' }] })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)

      dial({ actions: ACTIONS.slice(0, 1) })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('two to five'))

      dial({ actions: [...ACTIONS, { icon: 'share', label: 'Share' }, { icon: 'edit', label: 'Edit' }, { icon: 'phone', label: 'Call' }] })
      await settle()

      expect(warn).toHaveBeenCalledTimes(2)
    })

    it('should warn once in dev for an orphaned action and render nothing for it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuFabAction, { icon: 'email', label: 'Email' }))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuFabAction'))
      expect(host.querySelector('.quantum-fab__action')).toBeNull()
      expect(host.querySelector('.quantum-fab__label')).toBeNull()
    })

    it('should expose the part on the root and as a flat export', () => {
      expect(QuFab.Action).toBe(QuFabAction)
    })
  })

  describe('theme', () => {
    it('should keep the accent FAB in both themes and turn the actions to the dark surface', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const { trigger, items, labels } = dial({ wrap: node => h('div', { 'data-theme': 'quantum-dark' }, [node]) })
      const light = mount(() => h('div', { 'data-theme': 'quantum-light' }, [h(QuFab, BASE)])).querySelector('button')!
      const disabled = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [h(QuFab, { ...BASE, disabled: true })])).querySelector('button')!
      await settle()

      await userEvent.click(trigger)
      await settle()

      expect(getComputedStyle(light).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(trigger).backgroundColor).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(items[0]!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(items[0]!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(labels[0]!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(disabled).backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(disabled).color).toBe('rgba(255, 255, 255, 0.3)')
    })
  })
})

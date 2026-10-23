import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, Tooltip } from '@vuetify/v0'

// Components
import { Md1Tooltip, Md1TooltipActivator, Md1TooltipContent } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1TooltipProps } from './Md1Tooltip.vue'
import type { App, ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Components
import { Md1Button } from '../Md1Button'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void, css = 'padding: 48px'): HTMLElement {
  const host = document.createElement('div')
  host.style.cssText = css
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

interface Options {
  props?: Md1TooltipProps & Record<string, unknown>
  open?: ShallowRef<boolean>
  label?: () => VNode | string
  setup?: (app: App) => void
  css?: string
}

/** An Md1Tooltip describing an icon-only Md1Button. */
function tooltip (options: Options = {}): HTMLElement {
  const { props = {}, open, label = () => 'Delete', setup, css } = options

  return mount(() => h(Md1Tooltip, {
    ...props,
    ...(open && {
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }),
  }, () => [
    h(Md1TooltipActivator, null, {
      default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, { ...attrs, ariaLabel: 'Delete', icon: 'delete' }),
    }),
    h(Md1TooltipContent, null, label),
  ]), setup, css)
}

function trigger (host: HTMLElement): HTMLButtonElement {
  return host.querySelector('button')!
}

function content (host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>('.md1-tooltip')!
}

function tile (host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>('.md1-tooltip__tile')!
}

function shown (host: HTMLElement): boolean {
  return content(host).matches(':popover-open')
}

function touch (el: HTMLElement, type: 'pointerdown' | 'pointerup' | 'pointercancel') {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType: 'touch', button: 0, isPrimary: true }))
}

async function frames () {
  await new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  vi.useRealTimers()

  // Park the real pointer where no later mount can sit under it.
  await userEvent.unhover(document.body)

  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quTooltip', () => {
  describe('anatomy', () => {
    it('should render the content as a closed native tooltip popover around the tile', async () => {
      const host = tooltip()
      await settle()

      const el = content(host)

      expect(el.tagName).toBe('DIV')
      expect(el.getAttribute('role')).toBe('tooltip')
      expect(el.getAttribute('popover')).toBe('')
      expect(el.dataset.state).toBe('closed')
      expect(Object.hasOwn(el.dataset, 'touch')).toBe(false)
      expect(shown(host)).toBe(false)
      expect(getComputedStyle(el).display).toBe('none')
      expect(tile(host).tagName).toBe('SPAN')
      expect(tile(host).textContent).toBe('Delete')
    })

    it('should describe the control: aria-describedby names the content and the anchor rides on style', async () => {
      const host = tooltip()
      await settle()

      const button = trigger(host)
      const el = content(host)

      expect(button.getAttribute('aria-describedby')).toBe(el.id)
      expect(button.getAttribute('aria-label')).toBe('Delete')
      expect(button.dataset.state).toBe('closed')
      expect(button.style.getPropertyValue('anchor-name')).toBe(`--${el.id}`)
      expect(getComputedStyle(el).getPropertyValue('position-anchor')).toBe(`--${el.id}`)
    })

    it('should leave the control enabled and keep its ripple first', async () => {
      const host = tooltip()
      await settle()

      const button = trigger(host)

      expect(button.disabled).toBe(false)
      expect(button.type).toBe('button')
      expect(button.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
    })

    it('should forward namespace from the root so every part resolves a custom key', async () => {
      const host = tooltip({ props: { namespace: 'md1:test' } })
      await settle()

      await userEvent.hover(trigger(host))

      await expect.poll(() => shown(host)).toBe(true)
      expect(trigger(host).getAttribute('aria-describedby')).toBe(content(host).id)
    })
  })

  describe('desktop', () => {
    it('should show on hover without a delay and hide when the pointer leaves', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      await userEvent.hover(trigger(host))
      await settle()

      // The 0 ms open delay: shown as soon as the pointer arrives.
      expect(open.value).toBe(true)
      expect(shown(host)).toBe(true)
      expect(content(host).dataset.state).toBe('delayed-open')
      expect(trigger(host).dataset.state).toBe('delayed-open')

      await userEvent.unhover(trigger(host))

      await expect.poll(() => open.value).toBe(false)
      await expect.poll(() => shown(host)).toBe(false)
      expect(content(host).dataset.state).toBe('closed')
    })

    it('should wait out an explicit openDelay and closeDelay', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open, props: { openDelay: 200, closeDelay: 200 } })
      await settle()

      await userEvent.hover(trigger(host))
      await settle()

      expect(open.value).toBe(false)

      await expect.poll(() => open.value, { timeout: 1000 }).toBe(true)

      await userEvent.unhover(trigger(host))
      await settle()

      expect(open.value).toBe(true)

      await expect.poll(() => open.value, { timeout: 1000 }).toBe(false)
    })

    it('should show at once on keyboard focus and hide on blur', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(trigger(host))
      await expect.poll(() => open.value).toBe(true)
      expect(content(host).dataset.state).toBe('instant-open')

      await userEvent.tab()

      await expect.poll(() => open.value).toBe(false)
    })

    it('should not show for a focus that is not focus-visible', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      // A pointer-originated focus: no :focus-visible, no tooltip.
      trigger(host).dispatchEvent(new FocusEvent('focus'))
      await settle()

      expect(open.value).toBe(false)
    })

    it('should hide on Escape', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      await userEvent.tab()
      await expect.poll(() => open.value).toBe(true)

      await userEvent.keyboard('{Escape}')

      await expect.poll(() => open.value).toBe(false)
      expect(document.activeElement).toBe(trigger(host))
    })

    it('should hide when the control is activated', async () => {
      let clicks = 0
      const open = shallowRef(false)
      const host = mount(() => h(Md1Tooltip, {
        'modelValue': open.value,
        'onUpdate:modelValue': (value: boolean) => {
          open.value = value
        },
      }, () => [
        h(Md1TooltipActivator, null, {
          default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, { ...attrs, onClick: () => clicks++ }, () => 'Save'),
        }),
        h(Md1TooltipContent, null, () => 'Save the draft'),
      ]))
      await settle()

      await userEvent.hover(trigger(host))
      await expect.poll(() => open.value).toBe(true)

      await userEvent.click(trigger(host))

      // The control's own click still fires once; the tooltip gets out of the way.
      expect(clicks).toBe(1)
      await expect.poll(() => open.value).toBe(false)
    })

    it('should follow v-model both ways', async () => {
      const open = shallowRef(true)
      const host = tooltip({ open })
      await settle()

      await expect.poll(() => shown(host)).toBe(true)

      open.value = false

      await expect.poll(() => shown(host)).toBe(false)
    })
  })

  describe('disabled', () => {
    it('should stay hidden on hover and focus, with the control still enabled', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open, props: { disabled: true } })
      await settle()

      const button = trigger(host)

      expect(button.disabled).toBe(false)
      expect(button.hasAttribute('aria-disabled')).toBe(true)
      expect(button.getAttribute('aria-disabled')).toBe('false')
      expect(Object.hasOwn(button.dataset, 'disabled')).toBe(false)
      // A disabled tooltip describes nothing.
      expect(button.hasAttribute('aria-describedby')).toBe(false)

      await userEvent.hover(button)
      await userEvent.tab()
      await settle()

      expect(open.value).toBe(false)
      expect(shown(host)).toBe(false)
    })

    it('should hide a showing tooltip when it becomes disabled', async () => {
      const open = shallowRef(true)
      const disabled = shallowRef(false)
      const host = mount(() => h(Md1Tooltip, {
        'disabled': disabled.value,
        'modelValue': open.value,
        'onUpdate:modelValue': (value: boolean) => {
          open.value = value
        },
      }, () => [
        h(Md1TooltipActivator, null, {
          default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Save'),
        }),
        h(Md1TooltipContent, null, () => 'Save the draft'),
      ]))
      await settle()

      expect(shown(host)).toBe(true)

      disabled.value = true

      await expect.poll(() => open.value).toBe(false)
      expect(shown(host)).toBe(false)
    })

    it('should ignore a press and hold while disabled', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open, props: { disabled: true } })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(600)
      await settle()

      expect(open.value).toBe(false)
    })
  })

  describe('touch', () => {
    it('should show after a 500 ms hold, keep it 1.5 s after the lift and then hide', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      const button = trigger(host)

      touch(button, 'pointerdown')
      vi.advanceTimersByTime(499)
      await settle()

      expect(open.value).toBe(false)

      vi.advanceTimersByTime(1)
      await settle()

      expect(open.value).toBe(true)
      expect(shown(host)).toBe(true)
      expect(Object.hasOwn(content(host).dataset, 'touch')).toBe(true)

      // Still held: it stays for as long as the finger does.
      vi.advanceTimersByTime(5000)
      await settle()

      expect(open.value).toBe(true)

      touch(button, 'pointerup')
      vi.advanceTimersByTime(1499)
      await settle()

      expect(open.value).toBe(true)

      vi.advanceTimersByTime(1)
      await settle()

      expect(open.value).toBe(false)
      // Kept through the exit, so the closing tile does not jump to the desktop metrics.
      expect(Object.hasOwn(content(host).dataset, 'touch')).toBe(true)
    })

    it('should survive the light dismiss the lift triggers and still hide 1.5 s later', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      const button = trigger(host)

      touch(button, 'pointerdown')
      vi.advanceTimersByTime(500)
      await settle()

      expect(shown(host)).toBe(true)

      // A trusted lift outside the popover is light-dismissed by the browser before any
      // listener runs; synthetic events skip that step, so a window capture listener stands in for it.
      function dismiss () {
        content(host).hidePopover()
      }

      window.addEventListener('pointerup', dismiss, { capture: true, once: true })
      teardowns.push(() => window.removeEventListener('pointerup', dismiss, { capture: true }))

      touch(button, 'pointerup')

      expect(shown(host)).toBe(true)

      await settle()
      vi.advanceTimersByTime(1499)
      await settle()

      expect(open.value).toBe(true)
      expect(shown(host)).toBe(true)
      expect(Object.hasOwn(content(host).dataset, 'touch')).toBe(true)

      vi.advanceTimersByTime(1)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should leave a tap to the control: no tooltip below 500 ms', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(200)
      touch(trigger(host), 'pointerup')
      vi.advanceTimersByTime(2000)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should hide at once when the user takes another action before the 1.5 s end', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      touch(trigger(host), 'pointerup')
      await settle()

      expect(open.value).toBe(true)

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
      await settle()

      expect(open.value).toBe(false)
    })

    it('should hide on a key press and on a scroll after a hold', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      touch(trigger(host), 'pointerup')
      await settle()

      expect(open.value).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
      await settle()

      expect(open.value).toBe(false)

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      await settle()

      expect(open.value).toBe(true)

      document.dispatchEvent(new Event('scroll'))
      await settle()

      expect(open.value).toBe(false)
    })

    it('should hide when the browser takes the touch for a scroll', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(200)
      touch(trigger(host), 'pointercancel')
      vi.advanceTimersByTime(600)
      await settle()

      expect(open.value).toBe(false)

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      await settle()

      expect(open.value).toBe(true)

      touch(trigger(host), 'pointercancel')
      await settle()

      expect(open.value).toBe(false)
    })

    it('should claim the long press: no context menu during the hold and no click on the lift', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const host = tooltip()
      await settle()

      const button = trigger(host)

      touch(button, 'pointerdown')

      const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
      button.dispatchEvent(menu)

      expect(menu.defaultPrevented).toBe(true)

      vi.advanceTimersByTime(500)
      touch(button, 'pointerup')

      const end = new TouchEvent('touchend', { bubbles: true, cancelable: true })
      button.dispatchEvent(end)

      expect(end.defaultPrevented).toBe(true)
    })

    it('should leave the context menu and the click alone outside a hold', async () => {
      const host = tooltip()
      await settle()

      const button = trigger(host)
      const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
      const end = new TouchEvent('touchend', { bubbles: true, cancelable: true })

      button.dispatchEvent(menu)
      button.dispatchEvent(end)

      expect(menu.defaultPrevented).toBe(false)
      expect(end.defaultPrevented).toBe(false)
    })

    it('should not start a hold for a mouse press', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      trigger(host).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }))
      vi.advanceTimersByTime(600)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should drop data-touch on the next open from hover', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const open = shallowRef(false)
      const host = tooltip({ open })
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      touch(trigger(host), 'pointerup')
      vi.advanceTimersByTime(1500)
      await settle()

      expect(open.value).toBe(false)

      vi.useRealTimers()
      await userEvent.hover(trigger(host))

      await expect.poll(() => open.value).toBe(true)
      await settle()

      expect(Object.hasOwn(content(host).dataset, 'touch')).toBe(false)
    })
  })

  describe('metrics', () => {
    it('should draw the desktop tile: 22 dp, 8 dp padding, Medium 10 sp, Grey 700 at 90%, 2 dp corners, no shadow', async () => {
      // Playwright's desktop Chromium is the spec's mouse-and-keyboard environment.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = tooltip({ open: shallowRef(true) })
      await settle()
      await frames()

      const computed = getComputedStyle(tile(host))

      expect(tile(host).getBoundingClientRect().height).toBe(22)
      expect(computed.paddingLeft).toBe('8px')
      expect(computed.paddingRight).toBe('8px')
      expect(computed.fontSize).toBe('10px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.whiteSpace).toBe('nowrap')
      expect(computed.backgroundColor).toBe('rgba(97, 97, 97, 0.9)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
      expect(computed.borderTopLeftRadius).toBe('2px')
      expect(computed.boxShadow).toBe('none')
      expect(getComputedStyle(content(host)).boxShadow).toBe('none')
      expect(getComputedStyle(content(host)).pointerEvents).toBe('none')
    })

    it('should sit centred 14 dp below the target', async () => {
      const host = tooltip({ open: shallowRef(true) })
      await settle()
      await frames()

      const target = trigger(host).getBoundingClientRect()
      const box = tile(host).getBoundingClientRect()

      expect(Math.round(box.top - target.bottom)).toBe(14)
      expect(Math.abs((box.left + box.width / 2) - (target.left + target.width / 2))).toBeLessThan(1)
    })

    it('should flip above the target, 14 dp clear, when there is no room below', async () => {
      const host = tooltip({ open: shallowRef(true), css: 'position: fixed; bottom: 0; left: 200px; padding: 4px' })
      await settle()
      await frames()

      const target = trigger(host).getBoundingClientRect()
      const box = tile(host).getBoundingClientRect()

      expect(box.bottom).toBeLessThan(target.top)
      expect(Math.round(target.top - box.bottom)).toBe(14)
    })

    it('should take the touch metrics under data-touch: 32 dp, 16 dp padding, 14 sp, 24 dp below', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] })

      const host = tooltip()
      await settle()

      touch(trigger(host), 'pointerdown')
      vi.advanceTimersByTime(500)
      await settle()
      vi.useRealTimers()
      await frames()

      const computed = getComputedStyle(tile(host))
      const target = trigger(host).getBoundingClientRect()
      const box = tile(host).getBoundingClientRect()

      expect(Object.hasOwn(content(host).dataset, 'touch')).toBe(true)
      expect(box.height).toBe(32)
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('500')
      expect(Math.round(box.top - target.bottom)).toBe(24)
    })

    it('should keep the touch metrics in the rule outside the fine-pointer block, the handset value', () => {
      tooltip()

      // Headless Chromium cannot be switched to a coarse pointer and back inside one page,
      // so the handset values are read from the base rules outside every @media block.
      const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
      const base = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.md1-tooltip__tile')

      expect(base).toBeDefined()
      expect(base!.style.height).toBe('32px')
      expect(base!.style.fontSize).toBe('14px')
      expect(base!.style.padding).toBe('0 var(--md1-spacing-2, 16px)')
    })

    it('should truncate one line at the screen margins rather than wrap', async () => {
      const host = tooltip({ open: shallowRef(true), label: () => 'A label far longer than any tooltip should carry '.repeat(10) })
      await settle()
      await frames()

      const box = tile(host).getBoundingClientRect()

      expect(box.height).toBe(22)
      expect(box.width).toBeLessThanOrEqual(window.innerWidth - 32)
      expect(getComputedStyle(tile(host)).textOverflow).toBe('ellipsis')
    })

    it('should run 150 ms in on the deceleration curve and 150 ms out on the acceleration curve', async () => {
      const open = shallowRef(false)
      const host = tooltip({ open, setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await settle()

      const el = content(host)
      const out = getComputedStyle(el)

      expect(out.transitionDuration.split(', ').slice(0, 2)).toEqual(['0.15s', '0.15s'])
      expect(out.transitionTimingFunction.startsWith('cubic-bezier(0.4, 0, 1, 1)')).toBe(true)

      open.value = true
      await settle()

      await expect.poll(() => getComputedStyle(el).transitionTimingFunction.startsWith('cubic-bezier(0, 0, 0.2, 1)')).toBe(true)
      expect(getComputedStyle(el).transitionDuration.split(', ')[0]).toBe('0.15s')
    })

    it('should drop the motion under reduced motion', async () => {
      const host = tooltip({ setup: app => app.use(createReducedMotionPlugin({ mode: 'always' })) })
      await settle()

      expect(getComputedStyle(content(host)).transitionDuration).toBe('0s')
    })
  })

  describe('theme', () => {
    it('should keep the same grey tile and white text in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [
          h(Md1Tooltip, { modelValue: true }, () => [
            h(Md1TooltipActivator, null, { default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Light') }),
            h(Md1TooltipContent, null, () => 'Light'),
          ]),
        ]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Tooltip, { modelValue: true }, () => [
            h(Md1TooltipActivator, null, { default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Dark') }),
            h(Md1TooltipContent, null, () => 'Dark'),
          ]),
        ]),
      ]))
      await settle()

      const [light, dark] = host.querySelectorAll<HTMLElement>('.md1-tooltip__tile')

      expect(getComputedStyle(light!).backgroundColor).toBe('rgba(97, 97, 97, 0.9)')
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgba(97, 97, 97, 0.9)')
      expect(getComputedStyle(light!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!).color).toBe('rgb(255, 255, 255)')
    })
  })

  describe('orphans', () => {
    it('should not warn when the parts sit inside Md1Tooltip', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      tooltip()
      await settle()

      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should warn once in dev for parts inside a bare v0 tooltip, and still render', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(Tooltip.Root, null, () => [
        h(Md1TooltipActivator, null, { default: ({ attrs }: { attrs: Record<string, unknown> }) => h(Md1Button, attrs, () => 'Save') }),
        h(Md1TooltipContent, null, () => 'Save the draft'),
      ]))
      await settle()

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1TooltipActivator'))
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Md1TooltipContent'))
      expect(trigger(host).getAttribute('aria-describedby')).toBe(content(host).id)
    })

    it('should warn in dev for rich content in the tile', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      tooltip({ label: () => h('strong', 'Delete') })
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('plain text'))
    })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1Toolbar } from '../Md1Toolbar'
import { Md1IconToggle } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1IconToggleProps } from './Md1IconToggle.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // The tester document has no body margin; the unbounded ink and the hit tests reach outside the button.
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

/** Mounts one toggle; `aria-label` is set unless a test is about its absence. */
function toggle (props: Partial<Md1IconToggleProps> & Record<string, unknown> = {}, setup?: (app: App) => void): HTMLButtonElement {
  const host = mount(() => h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star-border', ...props }), setup)
  return host.querySelector('button')!
}

/** A toggle bound to a ref the way `v-model` binds it; the ref follows every emit. */
function bound (props: Partial<Md1IconToggleProps> & Record<string, unknown> = {}) {
  const pressed = shallowRef(false)
  const host = mount(() => h(Md1IconToggle, {
    'ariaLabel': 'Star',
    'icon': 'star-border',
    'iconOn': 'star',
    'modelValue': pressed.value,
    'onUpdate:modelValue': (value: boolean | undefined) => {
      pressed.value = value ?? false
    },
    ...props,
  }))
  return { el: host.querySelector('button')!, pressed }
}

/** The computed form Chrome gives a colour expression, read back from a probe element. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.backgroundColor = value
  document.body.append(probe)
  const result = getComputedStyle(probe).backgroundColor
  probe.remove()
  return result
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** A synthetic pointerdown at (x, y) inside the element: enough for the ripple, never for `:active`. */
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

function up (el: HTMLElement) {
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
}

function paths (el: HTMLElement): (string | null)[] {
  return [...el.querySelectorAll('svg path')].map(p => p.getAttribute('d'))
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  // The reduced-motion adapter writes the body attribute on install and never clears it.
  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quIconToggle', () => {
  describe('anatomy', () => {
    it('should render a native toggle button with the ripple first and one glyph after it', async () => {
      const el = toggle()
      await settle()

      expect(el.tagName).toBe('BUTTON')
      expect(el.type).toBe('button')
      expect(el.classList.contains('md1-icon-toggle')).toBe(true)
      expect(el.hasAttribute('role')).toBe(false)
      expect(el.getAttribute('aria-pressed')).toBe('false')
      expect(el.dataset.state).toBe('off')
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(false)

      const [ripple, glyph, ...rest] = el.children

      expect(ripple!.classList.contains('md1-ripple')).toBe(true)
      expect(ripple!.getAttribute('aria-hidden')).toBe('true')
      expect(glyph!.tagName.toLowerCase()).toBe('svg')
      expect(glyph!.classList.contains('md1-icon')).toBe(true)
      expect(glyph!.getAttribute('aria-hidden')).toBe('true')
      expect(rest.length).toBe(0)
      expect(el.querySelectorAll('svg').length).toBe(1)
    })

    it('should measure the 48 dp touch target as a circle around a 24 dp glyph', async () => {
      const el = toggle()
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)
      const glyph = el.querySelector('svg')!

      expect(rect.width).toBe(48)
      expect(rect.height).toBe(48)
      expect(computed.borderRadius).toBe('50%')
      expect(computed.paddingLeft).toBe('0px')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(computed.boxShadow).toBe('none')
      expect(getComputedStyle(glyph).width).toBe('24px')
      expect(getComputedStyle(glyph).height).toBe('24px')
      expect(glyph.dataset.size).toBe('m')
      // The glyph sits centred in the target.
      const inner = glyph.getBoundingClientRect()

      expect(inner.left - rect.left).toBe(12)
      expect(inner.top - rect.top).toBe(12)
    })

    it('should draw the off glyph through Md1Icon and mark the ripple unbounded by default', async () => {
      const el = toggle()
      await settle()

      expect(paths(el)).toEqual(md1Icons['star-border'])
      const ripple = el.querySelector<HTMLElement>('.md1-ripple')!

      expect(Object.hasOwn(el.dataset, 'unbounded')).toBe(true)
      expect(ripple.dataset.unbounded).toBe('true')
      expect(getComputedStyle(ripple).overflow).toBe('visible')
    })

    it('should drop the data-unbounded hook and clip the ink when unbounded is false', async () => {
      const el = toggle({ unbounded: false })
      await settle()

      const ripple = el.querySelector<HTMLElement>('.md1-ripple')!

      expect(Object.hasOwn(el.dataset, 'unbounded')).toBe(false)
      expect(Object.hasOwn(ripple.dataset, 'unbounded')).toBe(false)
      expect(getComputedStyle(ripple).overflow).toBe('hidden')
    })

    it('should forward namespace to Toggle.Indicator so the glyph still follows the state under a custom key', async () => {
      const { el, pressed } = bound({ namespace: 'md1:test' })
      await settle()

      expect(paths(el)).toEqual(md1Icons['star-border'])

      await userEvent.click(el)

      expect(pressed.value).toBe(true)
      await expect.poll(() => paths(el)).toEqual(md1Icons.star)
    })
  })

  describe('state', () => {
    it('should start on from the model and expose aria-pressed and data-state', async () => {
      const el = toggle({ modelValue: true, iconOn: 'star' })
      await settle()

      expect(el.getAttribute('aria-pressed')).toBe('true')
      expect(el.dataset.state).toBe('on')
      expect(paths(el)).toEqual(md1Icons.star)
    })

    it('should round-trip the model on click and swap the glyph with the state', async () => {
      const { el, pressed } = bound()
      await settle()

      await userEvent.click(el)

      expect(pressed.value).toBe(true)
      expect(el.getAttribute('aria-pressed')).toBe('true')
      expect(el.dataset.state).toBe('on')
      expect(paths(el)).toEqual(md1Icons.star)

      await userEvent.click(el)

      expect(pressed.value).toBe(false)
      expect(el.getAttribute('aria-pressed')).toBe('false')
      expect(el.dataset.state).toBe('off')
      expect(paths(el)).toEqual(md1Icons['star-border'])
    })

    it('should follow a model written from outside', async () => {
      const { el, pressed } = bound()
      await settle()

      pressed.value = true
      await settle()

      expect(el.getAttribute('aria-pressed')).toBe('true')
      expect(paths(el)).toEqual(md1Icons.star)
    })

    it('should keep one glyph in both states when iconOn is omitted', async () => {
      const { el, pressed } = bound({ icon: 'bookmark', iconOn: undefined })
      await settle()

      expect(paths(el)).toEqual(md1Icons.bookmark)

      await userEvent.click(el)

      expect(pressed.value).toBe(true)
      expect(paths(el)).toEqual(md1Icons.bookmark)
    })

    it('should toggle once per click, with no double handling from the wrapper', async () => {
      let updates = 0
      const el = toggle({ 'onUpdate:modelValue': () => updates++ })
      await settle()

      await userEvent.click(el)

      expect(updates).toBe(1)
      expect(el.getAttribute('aria-pressed')).toBe('true')
    })
  })

  describe('ink', () => {
    it('should paint the inactive tier at rest and the active tier while on', async () => {
      const off = toggle()
      const on = toggle({ modelValue: true })
      await settle()

      expect(getComputedStyle(off).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(on).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should take the white ink of a primary bar among its actions, and keep the black tiers on a surface bar', async () => {
      function bar (variant: 'primary' | 'surface') {
        const host = mount(() => h(Md1Toolbar, { variant }, () => [
          h(Md1Toolbar.Title, () => 'Trail'),
          h(Md1Toolbar.Actions, () => [
            h(Md1IconToggle, { ariaLabel: 'Off', icon: 'star-border' }),
            h(Md1IconToggle, { ariaLabel: 'On', icon: 'star-border', modelValue: true }),
            h(Md1IconToggle, { ariaLabel: 'Disabled', icon: 'star-border', disabled: true }),
          ]),
        ]))
        return [...host.querySelectorAll<HTMLButtonElement>('.md1-icon-toggle')].map(el => getComputedStyle(el).color)
      }

      const primary = bar('primary')
      const surface = bar('surface')
      await settle()

      // Off at the 70% inactive white of a primary bar, on at 100%, disabled at 30%.
      expect(primary).toEqual(['rgba(255, 255, 255, 0.7)', 'rgb(255, 255, 255)', 'rgba(255, 255, 255, 0.3)'])
      expect(surface).toEqual(['rgba(0, 0, 0, 0.38)', 'rgba(0, 0, 0, 0.54)', 'rgba(0, 0, 0, 0.26)'])
    })

    it('should lift the glyph to the focused tier and draw the 12% circle in its ink for keyboard focus, not for a click', async () => {
      const el = toggle()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(true)
      await expect.poll(() => getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.87)')
      // The indicator takes the icon's own colour: 12% of the focused ink, filling the circular target.
      await expect.poll(() => getComputedStyle(el).backgroundColor)
        .toBe(serialize('color-mix(in srgb, rgba(0, 0, 0, 0.87) 12%, transparent)'))

      // Chrome keeps :focus-visible on an element that is clicked while it already has focus, so blur it first.
      await userEvent.click(document.body)

      expect(document.activeElement).not.toBe(el)

      await userEvent.click(el)

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(false)
      // The click turned the toggle on, so the resting colour is now the active tier.
      await expect.poll(() => getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.54)')
      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should draw the unbounded ink as the 48 dp circle centred on the toggle, whatever the press point', async () => {
      const el = toggle({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(el, 4, 4)
      await settle()

      const list = inks(el)

      expect(list.length).toBe(1)
      expect(list[0]!.dataset.state).toBe('in')
      expect(list[0]!.style.width).toBe('48px')
      expect(list[0]!.style.height).toBe('48px')
      expect(list[0]!.style.left).toBe('0px')
      expect(list[0]!.style.top).toBe('0px')
      expect(getComputedStyle(list[0]!).backgroundColor).toBe('rgba(153, 153, 153, 0.4)')

      up(el)

      await expect.poll(() => inks(el).length).toBe(0)
    })

    it('should grow the bounded ink from the press point to the farthest corner', async () => {
      const el = toggle({ unbounded: false }, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(el, 4, 4)
      await settle()

      const [ink] = inks(el)
      const size = 2 * Math.hypot(44, 44)

      expect(Number.parseFloat(ink!.style.width)).toBeCloseTo(size, 3)
      expect(Number.parseFloat(ink!.style.left)).toBeCloseTo(4 - size / 2, 3)
      expect(Number.parseFloat(ink!.style.top)).toBeCloseTo(4 - size / 2, 3)

      up(el)

      await expect.poll(() => inks(el).length).toBe(0)
    })

    it('should draw the centred ink for a keyboard press', async () => {
      const el = toggle({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      el.focus()
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await settle()

      const [ink] = inks(el)

      expect(ink).toBeDefined()
      expect(ink!.style.left).toBe('0px')
      expect(ink!.style.width).toBe('48px')

      el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }))

      await expect.poll(() => inks(el).length).toBe(0)
    })
  })

  describe('disabled', () => {
    it('should disable natively: disabled, data-disabled, out of the tab order, no toggle, no ink, no aria-disabled', async () => {
      const { el, pressed } = bound({ disabled: true })
      await settle()

      expect(el.disabled).toBe(true)
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)
      expect(el.getAttribute('tabindex')).toBe('-1')
      // A native button carries `disabled`; v0 omits aria-disabled on that host.
      expect(el.hasAttribute('aria-disabled')).toBe(false)

      el.focus()

      expect(document.activeElement).not.toBe(el)

      el.click()
      down(el, 24, 24)
      await settle()

      expect(pressed.value).toBe(false)
      expect(el.getAttribute('aria-pressed')).toBe('false')
      expect(inks(el).length).toBe(0)

      const computed = getComputedStyle(el)

      expect(computed.color).toBe('rgba(0, 0, 0, 0.26)')
      expect(computed.pointerEvents).toBe('none')
    })

    it('should keep the on state and glyph while disabled', async () => {
      const el = toggle({ disabled: true, modelValue: true, iconOn: 'star' })
      await settle()

      expect(el.getAttribute('aria-pressed')).toBe('true')
      expect(el.dataset.state).toBe('on')
      expect(paths(el)).toEqual(md1Icons.star)
      expect(getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.26)')
    })
  })

  describe('keyboard', () => {
    it('should toggle on Enter and on Space like any native button', async () => {
      const { el, pressed } = bound()
      await settle()

      el.focus()
      await userEvent.keyboard('{Enter}')

      expect(pressed.value).toBe(true)

      await userEvent.keyboard(' ')

      expect(pressed.value).toBe(false)
    })

    it('should be one tab stop', async () => {
      const el = toggle()
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(el)

      await userEvent.tab()

      expect(document.activeElement).not.toBe(el)
    })
  })

  describe('accessibility', () => {
    it('should take its accessible name from ariaLabel and keep it across states', async () => {
      const { el, pressed } = bound({ ariaLabel: 'Favourite' })
      await settle()

      expect(el.getAttribute('aria-label')).toBe('Favourite')

      await userEvent.click(el)

      expect(pressed.value).toBe(true)
      expect(el.getAttribute('aria-label')).toBe('Favourite')
    })

    it('should accept the kebab attribute form of the name', async () => {
      const host = mount(() => h(Md1IconToggle, { 'aria-label': 'Bookmark', 'icon': 'bookmark' }))
      await settle()

      expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('Bookmark')
    })

    it('should warn in dev when the toggle has no accessible name', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1IconToggle, { icon: 'star-border' }))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
    })

    it('should not warn when the name comes from aria-labelledby', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h('span', { id: 'star-caption' }, 'Star'),
        h(Md1IconToggle, { 'aria-labelledby': 'star-caption', 'icon': 'star-border' }),
      ]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
      expect(host.querySelector('button')!.getAttribute('aria-labelledby')).toBe('star-caption')
    })
  })

  describe('dense hosts', () => {
    it('should condense to a 40 dp target with a 20 dp glyph under a data-dense ancestor', async () => {
      const host = mount(() => h('div', { 'data-dense': true }, [h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star-border' })]))
      await settle()

      const el = host.querySelector('button')!
      const rect = el.getBoundingClientRect()
      const glyph = el.querySelector('svg')!

      expect(rect.width).toBe(40)
      expect(rect.height).toBe(40)
      expect(getComputedStyle(glyph).width).toBe('20px')
      expect(getComputedStyle(glyph).height).toBe('20px')
    })

    it('should keep the unbounded ink at 48 dp inside a 40 dp dense target', async () => {
      const host = mount(() => h('div', { 'data-dense': true }, [h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star-border' })]), app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const el = host.querySelector('button')!

      down(el, 20, 20)
      await settle()

      const [ink] = inks(el)

      expect(ink!.style.width).toBe('48px')
      expect(ink!.style.left).toBe('-4px')

      up(el)

      await expect.poll(() => inks(el).length).toBe(0)
    })
  })

  describe('theme', () => {
    it('should take its ink tiers from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [
          h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star-border' }),
          h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star', modelValue: true }),
        ]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star-border' }),
          h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star', modelValue: true }),
          h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star', disabled: true }),
        ]),
      ]))
      await settle()

      const [lightOff, lightOn, darkOff, darkOn, darkDisabled] = host.querySelectorAll('button')

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(lightOff!).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(lightOn!).color).toBe('rgba(0, 0, 0, 0.54)')
      // The dark theme flips to light icons: 50% inactive, 100% active, 30% disabled.
      expect(getComputedStyle(darkOff!).color).toBe('rgba(255, 255, 255, 0.5)')
      expect(getComputedStyle(darkOn!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(darkDisabled!).color).toBe('rgba(255, 255, 255, 0.3)')
      expect(getComputedStyle(darkOn!.firstElementChild!).color).toBe('rgba(204, 204, 204, 0.25)')
    })

    it('should show keyboard focus on an on toggle in the dark theme, where the focused and active tiers are both 100%', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1IconToggle, { ariaLabel: 'Star', icon: 'star', modelValue: true }),
      ]))
      await settle()

      const el = host.querySelector('button')!

      expect(getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')

      await userEvent.tab()

      expect(el.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(el).color).toBe('rgb(255, 255, 255)')
      await expect.poll(() => getComputedStyle(el).backgroundColor)
        .toBe(serialize('color-mix(in srgb, rgb(255, 255, 255) 12%, transparent)'))
    })
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin, isString } from '@vuetify/v0'

// Components
import { Md1Button } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { Md1Commands } from '../../../test/commands'
import type { Md1ButtonProps } from './Md1Button.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

declare module 'vitest/browser' {
  interface BrowserCommands extends Md1Commands {}
}

/** Vuetify 1.5's pixel recipe for the 2 dp level, the one the raised button rests and hovers at. */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // The tester document has no body margin; the hit-area tests probe above the button, which must stay inside the viewport.
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

function button (props: Md1ButtonProps & Record<string, unknown> = {}, label?: string, setup?: (app: App) => void): HTMLButtonElement {
  const host = mount(() => h(Md1Button, props, isString(label) ? () => label : undefined), setup)
  return host.querySelector('button')!
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

describe('quButton', () => {
  describe('anatomy', () => {
    it('should render a native flat button with the ripple first and the label in the content span', async () => {
      const el = button({}, 'Save')
      await settle()

      expect(el.tagName).toBe('BUTTON')
      expect(el.type).toBe('button')
      expect(el.classList.contains('md1-button')).toBe(true)
      expect(el.dataset.variant).toBe('flat')
      expect(Object.hasOwn(el.dataset, 'dense')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'footer')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'solo')).toBe(false)

      const ripple = el.firstElementChild!
      const content = el.querySelector('.md1-button__content')!

      expect(ripple.classList.contains('md1-ripple')).toBe(true)
      expect(ripple.getAttribute('aria-hidden')).toBe('true')
      expect(content.tagName).toBe('SPAN')
      expect(content.textContent).toBe('Save')
      expect(el.querySelector('.md1-button__icon')).toBeNull()
    })

    it('should measure 36 dp tall and 88 dp wide at least, with 16 dp side padding and 2 dp corners', async () => {
      const el = button({}, 'Ok')
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(rect.height).toBe(36)
      expect(rect.width).toBe(88)
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.paddingRight).toBe('16px')
      expect(computed.borderRadius).toBe('2px')
    })

    it('should set the label in the Button type style: 14 px Medium, capitals, one line', async () => {
      const el = button({}, 'Save changes')
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.textTransform).toBe('uppercase')
      expect(computed.letterSpacing).toBe('0.14px')
      expect(computed.whiteSpace).toBe('nowrap')
    })

    it('should answer to the 48 dp touch target without growing the box', async () => {
      const el = button({}, 'Save')
      await settle()

      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2

      expect(rect.height).toBe(36)
      expect(document.elementFromPoint(x, rect.top - 4)).toBe(el)
      expect(document.elementFromPoint(x, rect.bottom + 4)).toBe(el)
      expect(document.elementFromPoint(x, rect.top - 8)).not.toBe(el)
    })

    it('should render the v0 hidden input unchecked when name is set, so a standalone button submits nothing', async () => {
      const host = mount(() => h(Md1Button, { name: 'save' }, () => 'Save'))
      await settle()

      const input = host.querySelector<HTMLInputElement>('input[name="save"]')!

      expect(input).not.toBeNull()
      expect(input.type).toBe('checkbox')
      expect(input.hasAttribute('inert')).toBe(true)
      // Checked only when selected inside a v0 Button.Group; an unchecked checkbox is left out of form data.
      expect(input.checked).toBe(false)
    })

    it('should forward namespace to Button.Icon and Button.Content so a custom key still resolves', async () => {
      const el = button({ namespace: 'md1:test', icon: 'add' }, 'Save')
      await settle()

      expect(el.querySelector('.md1-button__icon svg')).not.toBeNull()
      expect(el.querySelector('.md1-button__content')!.textContent).toBe('Save')
      expect(Object.hasOwn(el.dataset, 'solo')).toBe(false)
    })

    it('should keep the icon-only detection under a custom namespace', async () => {
      const el = button({ namespace: 'md1:test', icon: 'add', ariaLabel: 'Add' })
      await settle()

      expect(Object.hasOwn(el.dataset, 'solo')).toBe(true)
      expect(el.getAttribute('aria-label')).toBe('Add')
    })
  })

  describe('variants', () => {
    it('should paint the flat button as accent ink on nothing, with no shadow', async () => {
      const el = button({}, 'Cancel')
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.color).toBe('rgb(255, 64, 129)')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(computed.boxShadow).toBe('none')
    })

    it('should fill the raised button with the primary colour and white ink', async () => {
      const el = button({ variant: 'raised' }, 'Save')
      await settle()

      const computed = getComputedStyle(el)

      expect(el.dataset.variant).toBe('raised')
      expect(computed.backgroundColor).toBe('rgb(63, 81, 181)')
      expect(computed.color).toBe('rgb(255, 255, 255)')
    })

    it('should rest the raised button at 0 dp under a fine pointer and lift it to 2 dp on hover', async () => {
      // Playwright's desktop Chromium is the spec's mouse-and-keyboard environment.
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const el = button({ variant: 'raised' }, 'Save')
      await settle()

      expect(getComputedStyle(el).boxShadow).toBe('none')

      await userEvent.hover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))

      await userEvent.unhover(el)

      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should draw Vuetify 1.5\'s 12% hover overlay of the ink: accent on flat, a white wash on raised', async () => {
      const host = mount(() => h('div', [
        h(Md1Button, null, () => 'Cancel'),
        h(Md1Button, { variant: 'raised' }, () => 'Save'),
      ]))
      await settle()

      const [flat, raised] = host.querySelectorAll<HTMLElement>('.md1-button')

      await userEvent.hover(flat!)

      await expect.poll(() => getComputedStyle(flat!).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, rgb(255, 64, 129) 12%, transparent)'))

      await userEvent.hover(raised!)

      await expect.poll(() => getComputedStyle(raised!).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, rgb(255, 255, 255) 12%, #3F51B5)'))

      await userEvent.unhover(raised!)

      await expect.poll(() => getComputedStyle(raised!).backgroundColor).toBe('rgb(63, 81, 181)')
    })

    it('should rest the raised button at 2 dp outside the fine-pointer rule, the handset value', async () => {
      button({ variant: 'raised' }, 'Save')
      await settle()

      // Headless Chromium cannot be switched to a coarse pointer and back inside one page
      // (CDP touch emulation restores `pointer: none`), so the handset value is read from the
      // stylesheet: the raised rule that sits outside every @media block. CSSOM serialises
      // attribute values with double quotes whatever the source wrote, so the quotes are normalised.
      const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
      const rule = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === '.md1-button[data-variant=\'raised\']')

      expect(rule).toBeDefined()
      expect(rule!.style.boxShadow.replaceAll(/\s+/g, ' ')).toBe(`var(--md1-elevation-2, ${ELEVATION_2})`)
    })
  })

  describe('forms', () => {
    it('should expose data-dense and condense to 32 dp with a 13 sp label', async () => {
      const el = button({ dense: true }, 'Save')
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'dense')).toBe(true)
      expect(rect.height).toBe(32)
      expect(computed.fontSize).toBe('13px')
      expect(computed.paddingLeft).toBe('16px')
      expect(computed.borderRadius).toBe('2px')
      // The hit area grows to keep the 48 dp target around the shorter button.
      expect(document.elementFromPoint(rect.left + rect.width / 2, rect.top - 7)).toBe(el)
    })

    it('should expose data-footer and stretch to a 48 dp full-width flat bar with square corners', async () => {
      const host = mount(() => h('div', { style: 'width: 320px' }, [h(Md1Button, { footer: true }, () => 'Got it')]))
      await settle()

      const el = host.querySelector('button')!
      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'footer')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'loading')).toBe(false)
      expect(rect.width).toBe(320)
      expect(rect.height).toBe(48)
      expect(computed.borderRadius).toBe('0px')
      expect(computed.boxShadow).toBe('none')
      expect(computed.color).toBe('rgb(255, 64, 129)')
    })

    it('should warn in dev when footer is paired with raised', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const el = button({ footer: true, variant: 'raised' }, 'Save')
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('footer'))
      // The hooks stay truthful: the warning is the correction, not a silent override.
      expect(el.dataset.variant).toBe('raised')
      expect(Object.hasOwn(el.dataset, 'footer')).toBe(true)
    })

    it('should draw the icon through Md1Icon ahead of the label', async () => {
      const el = button({ icon: 'add' }, 'Add item')
      await settle()

      const icon = el.querySelector<HTMLElement>('.md1-button__icon')!
      const svg = icon.querySelector('svg')!

      expect(icon.getAttribute('aria-hidden')).toBe('true')
      expect(icon.nextElementSibling!.classList.contains('md1-button__content')).toBe(true)
      expect(svg.classList.contains('md1-icon')).toBe(true)
      expect(svg.dataset.size).toBe('m')
      expect([...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))).toEqual(md1Icons.add)
      expect(getComputedStyle(icon).marginRight).toBe('16px')
      expect(Object.hasOwn(el.dataset, 'solo')).toBe(false)
    })

    it('should put the icon gap on the end side under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(Md1Button, { icon: 'add' }, () => 'Add')]))
      await settle()

      const icon = host.querySelector<HTMLElement>('.md1-button__icon')!

      expect(getComputedStyle(icon).marginLeft).toBe('16px')
      expect(getComputedStyle(icon).marginRight).toBe('0px')
    })

    it('should become a 48 dp circular icon-only button named by ariaLabel', async () => {
      const el = button({ icon: 'add', ariaLabel: 'Add' })
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'solo')).toBe(true)
      expect(el.getAttribute('aria-label')).toBe('Add')
      expect(el.querySelector('.md1-button__content')).toBeNull()
      expect(rect.width).toBe(48)
      expect(rect.height).toBe(48)
      expect(computed.borderRadius).toBe('50%')
      expect(computed.paddingLeft).toBe('0px')
      // Vuetify 1.5's icon button inks in the primary text colour, not the accent.
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(el.querySelector('.md1-button__icon')!).marginRight).toBe('0px')
    })

    it('should drop a dense icon-only button to a 40 dp target with a 20 dp glyph', async () => {
      const el = button({ icon: 'add', ariaLabel: 'Add', dense: true })
      await settle()

      const rect = el.getBoundingClientRect()
      const svg = el.querySelector('svg')!

      expect(rect.width).toBe(40)
      expect(rect.height).toBe(40)
      expect(svg.dataset.size).toBe('s')
      expect(getComputedStyle(svg).width).toBe('20px')
    })

    it('should warn in dev when an icon-only button has no accessible name, and still get one', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const el = button({ icon: 'add' })
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('ariaLabel'))
      // v0's locale fallback names the button; translatable copy, so no pin on the English text.
      expect(el.getAttribute('aria-label')).not.toBeNull()
    })
  })

  describe('states', () => {
    it('should show the 12% focus overlay for keyboard focus and not for a click', async () => {
      const el = button({}, 'Save')
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(true)
      await expect.poll(() => getComputedStyle(el).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, rgb(255, 64, 129) 12%, transparent)'))

      // Chrome keeps :focus-visible on an element that is clicked while it already has focus, so blur it first.
      await userEvent.click(document.body)

      expect(document.activeElement).not.toBe(el)

      await userEvent.click(el)

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(false)

      // The pointer that clicked still rests on the button; move it off so only focus is left.
      await userEvent.unhover(el)

      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should shade the focused raised button with 12% black over the colour', async () => {
      const el = button({ variant: 'raised' }, 'Save')
      await settle()

      await userEvent.tab()

      expect(el.matches(':focus-visible')).toBe(true)
      await expect.poll(() => getComputedStyle(el).backgroundColor)
        .toBe(serialize('backgroundColor', 'color-mix(in srgb, #000000 12%, #3F51B5)'))
    })

    it('should draw the pressed overlay as ink from the press point and release it on pointerup', async () => {
      const el = button({ variant: 'raised' }, 'Save', app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(el, 10, 10)
      await settle()

      const list = inks(el)

      expect(list.length).toBe(1)
      expect(list[0].dataset.state).toBe('in')
      expect(getComputedStyle(list[0]).backgroundColor).toBe('rgba(153, 153, 153, 0.4)')

      up(el)

      await expect.poll(() => inks(el).length).toBe(0)
    })

    it('should fill the held raised button with the 700 shade at the desktop 2 dp and settle on release', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const el = button({ id: 'held', variant: 'raised' }, 'Save', app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      // A real mouse press: synthetic pointer events never set :active.
      await commands.press('#held')

      await expect.poll(() => el.matches(':active')).toBe(true)
      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe('rgb(48, 63, 159)')
      expect(getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      await expect.poll(() => inks(el).length).toBe(1)

      await commands.release()
      await userEvent.unhover(el)

      expect(el.matches(':active')).toBe(false)
      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe('rgb(63, 81, 181)')
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should keep the held flat button at its hover overlay: the ink is its only pressed fill', async () => {
      const el = button({ id: 'held-flat' }, 'Cancel', app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      await commands.press('#held-flat')

      await expect.poll(() => el.matches(':active')).toBe(true)
      await expect.poll(() => inks(el).length).toBe(1)
      await expect.poll(() => getComputedStyle(el).backgroundColor).toBe(serialize('backgroundColor', 'color-mix(in srgb, rgb(255, 64, 129) 12%, transparent)'))
      expect(getComputedStyle(el).boxShadow).toBe('none')

      await commands.release()
      await userEvent.unhover(el)
    })

    it('should disable natively: disabled, aria-disabled, data-disabled, out of the tab order, no click, no ink', async () => {
      let clicks = 0
      const el = button({ disabled: true, onClick: () => clicks++ }, 'Stop')
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

      expect(clicks).toBe(0)
      expect(inks(el).length).toBe(0)

      const computed = getComputedStyle(el)

      expect(computed.color).toBe('rgba(0, 0, 0, 0.26)')
      expect(computed.pointerEvents).toBe('none')
    })

    it('should drop the disabled raised container to the 12% fill with no shadow', async () => {
      const el = button({ disabled: true, variant: 'raised' }, 'Stop')
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.26)')
      expect(computed.boxShadow).toBe('none')
    })
  })

  describe('interaction', () => {
    it('should fire the consumer click once per real click', async () => {
      let clicks = 0
      const el = button({ onClick: () => clicks++ }, 'Save')
      await settle()

      await userEvent.click(el)

      expect(clicks).toBe(1)
    })

    it('should activate on Enter and on Space like any native button', async () => {
      let clicks = 0
      const el = button({ onClick: () => clicks++ }, 'Save')
      await settle()

      el.focus()
      await userEvent.keyboard('{Enter}')

      expect(clicks).toBe(1)

      await userEvent.keyboard(' ')

      expect(clicks).toBe(2)
    })
  })

  describe('theme', () => {
    it('should take its ink and state tokens from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1Button, {}, () => 'Light')]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Button, { disabled: true }, () => 'Flat'),
          h(Md1Button, { disabled: true, variant: 'raised' }, () => 'Raised'),
          h(Md1Button, { variant: 'raised' }, () => 'On'),
        ]),
      ]))
      await settle()

      const [light, flat, raised, on] = host.querySelectorAll('button')

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(light!).color).toBe('rgb(255, 64, 129)')
      // The dark theme flips the ink and state tokens; the roles stay.
      expect(getComputedStyle(flat!).color).toBe('rgba(255, 255, 255, 0.3)')
      expect(getComputedStyle(raised!).backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(on!).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(on!.firstElementChild!).color).toBe('rgba(204, 204, 204, 0.25)')
    })
  })
})

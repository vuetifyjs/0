import { afterEach, describe, expect, it, vi } from 'vitest'

// Framework
import { createLocalePlugin, createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { QuProgressLinear } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuProgressLinearProps } from './QuProgressLinear.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // A 320 px sheet edge, so percent widths read as round pixel values.
  host.style.width = '320px'
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

function bar (props: QuProgressLinearProps & Record<string, unknown> = {}, setup?: (app: App) => void): HTMLElement {
  const host = mount(() => h(QuProgressLinear, props), setup)
  return host.querySelector<HTMLElement>('.quantum-progress-linear')!
}

function part (el: HTMLElement, name: 'track' | 'buffer' | 'fill'): HTMLElement {
  return el.querySelector<HTMLElement>(`.quantum-progress-linear__${name}`)!
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
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

describe('quProgressLinear', () => {
  describe('anatomy', () => {
    it('should render a progressbar div with the track and the fill, and no buffer by default', async () => {
      const el = bar()
      await settle()

      expect(el.tagName).toBe('DIV')
      expect(el.getAttribute('role')).toBe('progressbar')
      expect([...el.children].map(child => child.className)).toEqual([
        'quantum-progress-linear__track',
        'quantum-progress-linear__fill',
      ])
      expect(el.querySelector('.quantum-progress-linear__buffer')).toBeNull()
      // Never a form control and never a ripple host: the indicator is output only.
      expect(el.querySelector('input')).toBeNull()
      expect(el.querySelector('.quantum-ripple')).toBeNull()
    })

    it('should measure 4 dp tall and the full width of its sheet edge, with square ends', async () => {
      const el = bar({ value: 50 })
      await settle()

      const rect = el.getBoundingClientRect()

      expect(rect.height).toBe(4)
      expect(rect.width).toBe(320)
      expect(getComputedStyle(el).borderRadius).toBe('0px')
      expect(getComputedStyle(el).overflow).toBe('hidden')
      expect(part(el, 'track').getBoundingClientRect().width).toBe(320)
    })

    it('should never be focusable: a progress bar is not a control', async () => {
      const el = bar({ value: 10 })
      await settle()

      expect(el.hasAttribute('tabindex')).toBe(false)
      el.focus()
      expect(document.activeElement).not.toBe(el)
    })

    it('should pass consumer attributes to the root and keep its own class', async () => {
      const el = bar({ 'id': 'upload', 'class': 'mine', 'aria-describedby': 'hint' })
      await settle()

      expect(el.id).toBe('upload')
      expect(el.classList.contains('mine')).toBe(true)
      expect(el.classList.contains('quantum-progress-linear')).toBe(true)
      expect(el.getAttribute('aria-describedby')).toBe('hint')
    })

    it('should resolve its parts under a custom namespace', async () => {
      const el = bar({ value: 25, buffer: 50, namespace: 'quantum:test' })
      await settle()

      expect(part(el, 'fill').style.width).toBe('25%')
      expect(part(el, 'buffer').style.width).toBe('50%')
    })
  })

  describe('indeterminate', () => {
    it('should be indeterminate without a value: busy, no valuenow, named Loading', async () => {
      const el = bar()
      await settle()

      expect(el.dataset.state).toBe('indeterminate')
      expect(el.getAttribute('aria-busy')).toBe('true')
      expect(el.hasAttribute('aria-valuenow')).toBe(false)
      expect(el.hasAttribute('aria-valuetext')).toBe(false)
      expect(el.getAttribute('aria-valuemin')).toBe('0')
      expect(el.getAttribute('aria-valuemax')).toBe('100')
      expect(el.getAttribute('aria-label')).toBe('Loading')
      expect(Object.hasOwn(el.dataset, 'query')).toBe(false)
    })

    it('should sweep two primary segments along the track while the fill stays empty', async () => {
      const el = bar({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const fill = part(el, 'fill')
      const before = getComputedStyle(part(el, 'track'), '::before')
      const after = getComputedStyle(part(el, 'track'), '::after')

      expect(fill.style.width).toBe('')
      expect(fill.getBoundingClientRect().width).toBe(0)
      expect(before.animationName).toBe('quantum-progress-linear-long')
      expect(after.animationName).toBe('quantum-progress-linear-short')
      expect(before.backgroundColor).toBe('rgb(63, 81, 181)')
      // The 2 s cycle on the standard curve is a Quantum decision (the page states none).
      expect(before.animationDuration).toBe('2s')
      expect(before.animationTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
      expect(before.animationIterationCount).toBe('infinite')
    })

    it('should mirror the sweep under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuProgressLinear)]))
      await settle()

      const track = host.querySelector<HTMLElement>('.quantum-progress-linear__track')!

      expect(getComputedStyle(track, '::before').animationName).toBe('quantum-progress-linear-long-reverse')
      expect(getComputedStyle(track, '::after').animationName).toBe('quantum-progress-linear-short-reverse')
    })

    it('should slow the sweep to 4 s under reduced motion rather than freeze it', async () => {
      // The browser context runs with prefers-reduced-motion: reduce.
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true)

      const el = bar()
      await settle()

      expect(getComputedStyle(part(el, 'track'), '::before').animationDuration).toBe('4s')
      expect(getComputedStyle(part(el, 'track'), '::after').animationDuration).toBe('4s')
    })

    it('should follow the reduced-motion plugin over the OS setting', async () => {
      const el = bar({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'always' }))
      })
      await settle()

      expect(document.body.dataset.reducedMotion).toBe('reduce')
      expect(getComputedStyle(part(el, 'track'), '::before').animationDuration).toBe('4s')
    })
  })

  describe('determinate', () => {
    it('should fill the primary colour to the percent over a 30% track', async () => {
      const el = bar({ value: 40 })
      await settle()

      const fill = part(el, 'fill')

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuenow')).toBe('40')
      expect(el.getAttribute('aria-valuetext')).toBe('40%')
      expect(el.hasAttribute('aria-busy')).toBe(false)
      expect(fill.style.width).toBe('40%')
      await expect.poll(() => fill.getBoundingClientRect().width).toBe(128)
      expect(getComputedStyle(fill).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(part(el, 'track')).backgroundColor).toBe('rgba(63, 81, 181, 0.3)')
      // No sweep segments in the determinate bar.
      expect(getComputedStyle(part(el, 'track'), '::before').content).toBe('none')
    })

    it('should treat 0 as the start of a determinate bar, not as indeterminate', async () => {
      const el = bar({ value: 0 })
      await settle()

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuenow')).toBe('0')
      expect(el.getAttribute('aria-valuetext')).toBe('0%')
      expect(el.hasAttribute('aria-busy')).toBe(false)
      expect(part(el, 'fill').getBoundingClientRect().width).toBe(0)
    })

    it('should clamp the value into 0 to 100 and mark completion', async () => {
      const el = bar({ value: 140 })
      await settle()

      expect(el.getAttribute('aria-valuenow')).toBe('100')
      expect(Object.hasOwn(el.dataset, 'complete')).toBe(true)

      const low = bar({ value: -20 })
      await settle()

      expect(low.getAttribute('aria-valuenow')).toBe('0')
      expect(Object.hasOwn(low.dataset, 'complete')).toBe(false)
    })

    it('should ease each step on the standard curve over the standard duration', async () => {
      const el = bar({ value: 10 })
      await settle()

      const computed = getComputedStyle(part(el, 'fill'))

      expect(computed.transitionProperty).toBe('width')
      expect(computed.transitionDuration).toBe('0.3s')
      expect(computed.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should grow as the value grows', async () => {
      const value = shallowRef(10)
      const host = mount(() => h(QuProgressLinear, { value: value.value }))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-linear')!

      value.value = 75
      await settle()

      expect(el.getAttribute('aria-valuenow')).toBe('75')
      await expect.poll(() => part(el, 'fill').getBoundingClientRect().width).toBe(240)
    })

    it('should start from the end edge under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuProgressLinear, { value: 25 })]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-linear')!
      const rect = el.getBoundingClientRect()

      await expect.poll(() => part(el, 'fill').getBoundingClientRect().right).toBe(rect.right)
      await expect.poll(() => part(el, 'fill').getBoundingClientRect().left).toBe(rect.right - 80)
    })
  })

  describe('buffer', () => {
    it('should draw the buffered extent in the track tint ahead of the fill', async () => {
      const el = bar({ value: 40, buffer: 70 })
      await settle()

      const buffer = part(el, 'buffer')

      expect(Object.hasOwn(el.dataset, 'buffer')).toBe(true)
      expect([...el.children].map(child => child.className)).toEqual([
        'quantum-progress-linear__track',
        'quantum-progress-linear__buffer',
        'quantum-progress-linear__fill',
      ])
      expect(buffer.style.width).toBe('70%')
      await expect.poll(() => buffer.getBoundingClientRect().width).toBe(224)
      expect(getComputedStyle(buffer).backgroundColor).toBe('rgba(63, 81, 181, 0.3)')
    })

    it('should draw the unbuffered remainder as a dotted trail starting at the buffer edge', async () => {
      const el = bar({ value: 40, buffer: 70 })
      await settle()

      const buffer = part(el, 'buffer')
      const trail = getComputedStyle(buffer, '::after')

      // The solid track gives way to the trail, so the buffer is the only tint behind the fill.
      expect(getComputedStyle(part(el, 'track')).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(trail.backgroundImage).toContain('radial-gradient')
      expect(trail.backgroundImage).toContain('rgba(63, 81, 181, 0.3)')
      expect(trail.backgroundSize).toBe('8px 4px')
      await expect.poll(() => getComputedStyle(buffer, '::after').left).toBe('224px')
    })

    it('should keep a value of 0 determinate beside a buffered extent', async () => {
      const el = bar({ value: 0, buffer: 10 })
      await settle()

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuetext')).toBe('0%, 10% buffered')
      expect(part(el, 'fill').getBoundingClientRect().width).toBe(0)
      expect(part(el, 'buffer').style.width).toBe('10%')
      expect(getComputedStyle(part(el, 'track'), '::before').content).toBe('none')
    })

    it('should announce both extents', async () => {
      const el = bar({ value: 40, buffer: 70 })
      await settle()

      expect(el.getAttribute('aria-valuenow')).toBe('40')
      expect(el.getAttribute('aria-valuetext')).toBe('40%, 70% buffered')
    })

    it('should translate the buffered text through the locale', async () => {
      const el = bar({ value: 40, buffer: 70 }, app => {
        app.use(createLocalePlugin({ default: 'en', messages: { en: { Quantum: { buffered: '{value} von {buffer}' } } } }))
      })
      await settle()

      expect(el.getAttribute('aria-valuetext')).toBe('40 von 70')
    })
  })

  describe('query', () => {
    it('should reverse the sweep while pending, then switch to determinate when the value arrives', async () => {
      const value = shallowRef<number>()
      const host = mount(() => h(QuProgressLinear, { query: true, value: value.value }))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-linear')!
      const fill = part(el, 'fill')
      const track = part(el, 'track')

      expect(Object.hasOwn(el.dataset, 'query')).toBe(true)
      expect(el.dataset.state).toBe('indeterminate')
      expect(getComputedStyle(track, '::before').animationName).toBe('quantum-progress-linear-long-reverse')
      expect(getComputedStyle(track, '::after').animationName).toBe('quantum-progress-linear-short-reverse')

      value.value = 30
      await settle()

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuenow')).toBe('30')
      expect(getComputedStyle(track, '::before').content).toBe('none')
      await expect.poll(() => fill.getBoundingClientRect().width).toBe(96)
    })

    it('should grow the fill from the start edge when the value arrives, never shrink it from full width', async () => {
      const value = shallowRef<number>()
      const host = mount(() => h(QuProgressLinear, { query: true, value: value.value }))
      await settle()

      const fill = host.querySelector<HTMLElement>('.quantum-progress-linear__fill')!
      const widths: number[] = []

      // Paint the pending bar first, so the switch has a before-change style to transition from.
      await new Promise(resolve => requestAnimationFrame(resolve))
      expect(fill.getBoundingClientRect().width).toBe(0)

      value.value = 30
      await settle()

      // Sample the transition frame by frame: a determinate bar only ever grows.
      await expect.poll(() => {
        widths.push(fill.getBoundingClientRect().width)
        return widths.at(-1)
      }).toBe(96)
      expect(widths[0]).toBeLessThan(96)
      expect(widths).toEqual(widths.toSorted((a, b) => a - b))
    })

    it('should run the query sweep forward under dir="rtl", its own mirror', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(QuProgressLinear, { query: true })]))
      await settle()

      const track = host.querySelector<HTMLElement>('.quantum-progress-linear__track')!

      expect(getComputedStyle(track, '::before').animationName).toBe('quantum-progress-linear-long')
    })
  })

  describe('appearance', () => {
    it('should carry the Presence phase in data-presence and settle on present', async () => {
      const el = bar()

      // Presence mounts the bar one tick before it is present.
      expect(el.dataset.presence).toBe('mounted')
      expect(getComputedStyle(el).opacity).toBe('0')

      await settle()

      expect(el.dataset.presence).toBe('present')
      expect(getComputedStyle(el).opacity).toBe('1')
    })

    it('should grow out of its edge over 225 ms on the deceleration curve when it appears', async () => {
      const el = bar({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const computed = getComputedStyle(el)

      expect(computed.animationName).toBe('quantum-progress-linear-in')
      expect(computed.animationDuration).toBe('0.225s')
      expect(computed.animationTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
    })

    it('should appear in place under reduced motion', async () => {
      const el = bar()
      await settle()

      expect(getComputedStyle(el).animationName).toBe('none')
    })

    it('should leave the DOM with its v-if', async () => {
      const show = shallowRef(true)
      const host = mount(() => show.value ? h(QuProgressLinear) : h('span'))
      await settle()

      expect(host.querySelector('.quantum-progress-linear')).not.toBeNull()

      show.value = false
      await settle()

      expect(host.querySelector('.quantum-progress-linear')).toBeNull()
    })
  })

  describe('naming', () => {
    it('should take ariaLabel as the accessible name', async () => {
      const el = bar({ ariaLabel: 'Uploading photos' })
      await settle()

      expect(el.getAttribute('aria-label')).toBe('Uploading photos')
    })

    it('should translate the default name through the locale', async () => {
      const el = bar({}, app => {
        app.use(createLocalePlugin({ default: 'en', messages: { en: { Quantum: { loading: 'Laden' } } } }))
      })
      await settle()

      expect(el.getAttribute('aria-label')).toBe('Laden')
    })
  })

  describe('theme', () => {
    it('should take the indicator and its track tint from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuProgressLinear, { value: 50 })]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuProgressLinear, { value: 50 })]),
        h('div', { style: '--quantum-primary: #009688; --quantum-primary-channels: 0 150 136' }, [h(QuProgressLinear, { value: 50 })]),
      ]))
      await settle()

      const [light, dark, teal] = host.querySelectorAll<HTMLElement>('.quantum-progress-linear')

      expect(getComputedStyle(part(light!, 'fill')).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(part(dark!, 'fill')).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(part(dark!, 'track')).backgroundColor).toBe('rgba(63, 81, 181, 0.3)')
      // A consumer hue moves the fill and the track together.
      expect(getComputedStyle(part(teal!, 'fill')).backgroundColor).toBe('rgb(0, 150, 136)')
      expect(getComputedStyle(part(teal!, 'track')).backgroundColor).toBe('rgba(0, 150, 136, 0.3)')
    })
  })
})

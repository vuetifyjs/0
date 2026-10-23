import { afterEach, describe, expect, it, vi } from 'vitest'

// Framework
import { createLocalePlugin, createReducedMotionPlugin } from '@vuetify/v0'

import { QuProgressCircular } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuProgressCircularProps } from './QuProgressCircular.vue'
import type { App, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Components
import { QuFab } from '../QuFab'

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

function ring (props: QuProgressCircularProps & Record<string, unknown> = {}, setup?: (app: App) => void): HTMLElement {
  const host = mount(() => h(QuProgressCircular, props), setup)
  return host.querySelector<HTMLElement>('.quantum-progress-circular')!
}

function arc (el: HTMLElement): SVGCircleElement {
  return el.querySelector<SVGCircleElement>('.quantum-progress-circular__arc')!
}

function track (el: HTMLElement): SVGCircleElement | null {
  return el.querySelector<SVGCircleElement>('.quantum-progress-circular__track')
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

describe('quProgressCircular', () => {
  describe('anatomy', () => {
    it('should render a progressbar div around an aria-hidden svg with one arc', async () => {
      const el = ring()
      await settle()

      const svg = el.querySelector('svg')!

      expect(el.tagName).toBe('DIV')
      expect(el.getAttribute('role')).toBe('progressbar')
      expect(el.children).toHaveLength(1)
      expect(svg.getAttribute('aria-hidden')).toBe('true')
      expect(svg.querySelectorAll('circle')).toHaveLength(1)
      expect(arc(el)).not.toBeNull()
      // The arc is runtime geometry, not a glyph: no QuIcon inside the indicator.
      expect(el.querySelector('.quantum-icon')).toBeNull()
      expect(el.querySelector('input')).toBeNull()
      expect(el.querySelector('.quantum-ripple')).toBeNull()
    })

    it('should measure 40 dp with a 4 dp stroke whose outer edge is the diameter', async () => {
      const el = ring()
      await settle()

      const svg = el.querySelector('svg')!
      const circle = arc(el)

      expect(el.getBoundingClientRect().width).toBe(40)
      expect(el.getBoundingClientRect().height).toBe(40)
      expect(svg.getAttribute('viewBox')).toBe('0 0 40 40')
      expect(circle.getAttribute('cx')).toBe('20')
      expect(circle.getAttribute('cy')).toBe('20')
      expect(circle.getAttribute('r')).toBe('18')
      expect(circle.getAttribute('pathLength')).toBe('100')
      expect(getComputedStyle(circle).strokeWidth).toBe('4px')
      expect(getComputedStyle(circle).fill).toBe('none')
    })

    it('should resize to the size prop and keep the 4 dp stroke', async () => {
      const el = ring({ size: 24, value: 50 })
      await settle()

      expect(el.getBoundingClientRect().width).toBe(24)
      expect(arc(el).getAttribute('r')).toBe('10')
      expect(track(el)!.getAttribute('r')).toBe('10')
      expect(getComputedStyle(arc(el)).strokeWidth).toBe('4px')
    })

    it('should never be focusable: a progress indicator is not a control', async () => {
      const el = ring({ value: 10 })
      await settle()

      expect(el.hasAttribute('tabindex')).toBe(false)
      el.focus()
      expect(document.activeElement).not.toBe(el)
    })

    it('should pass consumer attributes to the root and keep its own class', async () => {
      const el = ring({ 'id': 'sync', 'class': 'mine', 'aria-describedby': 'hint' })
      await settle()

      expect(el.id).toBe('sync')
      expect(el.classList.contains('mine')).toBe(true)
      expect(el.classList.contains('quantum-progress-circular')).toBe(true)
      expect(el.getAttribute('aria-describedby')).toBe('hint')
    })

    it('should render under a custom namespace', async () => {
      const el = ring({ value: 30, namespace: 'quantum:test' })
      await settle()

      expect(el.getAttribute('aria-valuenow')).toBe('30')
      expect(arc(el).getAttribute('stroke-dasharray')).toBe('30 100')
    })
  })

  describe('indeterminate', () => {
    it('should be indeterminate without a value: busy, no valuenow, no track, named Loading', async () => {
      const el = ring()
      await settle()

      expect(el.dataset.state).toBe('indeterminate')
      expect(el.getAttribute('aria-busy')).toBe('true')
      expect(el.hasAttribute('aria-valuenow')).toBe(false)
      expect(el.hasAttribute('aria-valuetext')).toBe(false)
      expect(el.getAttribute('aria-label')).toBe('Loading')
      expect(track(el)).toBeNull()
      expect(arc(el).hasAttribute('stroke-dasharray')).toBe(false)
    })

    it('should rotate the ring while the sweep grows and shrinks, 1.4 s per cycle', async () => {
      const el = ring({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      const svg = getComputedStyle(el.querySelector('svg')!)
      const sweep = getComputedStyle(arc(el))

      expect(svg.animationName).toBe('quantum-progress-circular-rotate')
      expect(svg.animationDuration).toBe('1.4s')
      expect(svg.animationTimingFunction).toBe('linear')
      expect(svg.animationIterationCount).toBe('infinite')
      expect(sweep.animationName).toBe('quantum-progress-circular-dash')
      expect(sweep.animationDuration).toBe('1.4s')
      expect(sweep.animationTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('should slow both motions to 2.8 s under reduced motion rather than freeze them', async () => {
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true)

      const el = ring()
      await settle()

      expect(getComputedStyle(el.querySelector('svg')!).animationDuration).toBe('2.8s')
      expect(getComputedStyle(arc(el)).animationDuration).toBe('2.8s')
    })

    it('should follow the reduced-motion plugin over the OS setting', async () => {
      const el = ring({}, app => {
        app.use(createReducedMotionPlugin({ mode: 'always' }))
      })
      await settle()

      expect(document.body.dataset.reducedMotion).toBe('reduce')
      expect(getComputedStyle(arc(el)).animationDuration).toBe('2.8s')
    })
  })

  describe('determinate', () => {
    it('should draw the percent as a primary arc over a 30% track', async () => {
      const el = ring({ value: 25 })
      await settle()

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuenow')).toBe('25')
      expect(el.getAttribute('aria-valuetext')).toBe('25%')
      expect(el.hasAttribute('aria-busy')).toBe(false)
      expect(arc(el).getAttribute('stroke-dasharray')).toBe('25 100')
      expect(getComputedStyle(el).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(arc(el)).stroke).toBe('rgb(63, 81, 181)')
      expect(track(el)).not.toBeNull()
      expect(getComputedStyle(track(el)!).opacity).toBe('0.3')
      expect(getComputedStyle(arc(el)).animationName).toBe('none')
    })

    it('should start the arc at the top and grow clockwise', async () => {
      const el = ring({ value: 25 })
      await settle()

      // SVG strokes start at 3 o'clock; a quarter turn back puts the start at 12.
      expect(getComputedStyle(el.querySelector('svg')!).transform).toBe('matrix(0, -1, 1, 0, 0, 0)')
      expect(getComputedStyle(el.querySelector('svg')!).animationName).toBe('none')
    })

    it('should treat 0 as an empty determinate ring, not as indeterminate', async () => {
      const el = ring({ value: 0 })
      await settle()

      expect(el.dataset.state).toBe('determinate')
      expect(el.getAttribute('aria-valuenow')).toBe('0')
      expect(arc(el).getAttribute('stroke-dasharray')).toBe('0 100')
    })

    it('should clamp the value into 0 to 100 and mark completion', async () => {
      const el = ring({ value: 180 })
      await settle()

      expect(el.getAttribute('aria-valuenow')).toBe('100')
      expect(arc(el).getAttribute('stroke-dasharray')).toBe('100 100')
      expect(Object.hasOwn(el.dataset, 'complete')).toBe(true)
    })

    it('should ease each step on the standard curve', async () => {
      const value = shallowRef(10)
      const host = mount(() => h(QuProgressCircular, { value: value.value }))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-circular')!
      const computed = getComputedStyle(arc(el))

      expect(computed.transitionProperty).toBe('stroke-dasharray')
      expect(computed.transitionDuration).toBe('0.3s')
      expect(computed.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')

      value.value = 60
      await settle()

      expect(arc(el).getAttribute('stroke-dasharray')).toBe('60 100')
      expect(el.getAttribute('aria-valuenow')).toBe('60')
    })
  })

  describe('fab', () => {
    it('should draw a 64 dp accent ring 4 dp outside a 56 dp FAB', async () => {
      const host = mount(() => h('div', { style: 'position: relative; width: 56px; height: 56px' }, [
        h(QuFab, { ariaLabel: 'Upload', icon: 'cloud-upload', position: 'static' }),
        h(QuProgressCircular, { fab: true }),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-circular')!
      const fab = host.querySelector<HTMLElement>('.quantum-fab')!
      const outer = el.getBoundingClientRect()
      const inner = fab.getBoundingClientRect()

      expect(Object.hasOwn(el.dataset, 'fab')).toBe(true)
      expect(inner.width).toBe(56)
      expect(outer.width).toBe(64)
      expect(outer.height).toBe(64)
      expect(outer.left).toBe(inner.left - 4)
      expect(outer.top).toBe(inner.top - 4)
      expect(arc(el).getAttribute('r')).toBe('30')
      expect(getComputedStyle(el).color).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(el).position).toBe('absolute')
    })

    it('should let presses through to the FAB beneath the ring', async () => {
      let clicks = 0
      const host = mount(() => h('div', { style: 'position: relative; width: 56px; height: 56px' }, [
        h(QuFab, { ariaLabel: 'Upload', icon: 'cloud-upload', position: 'static', onClick: () => clicks++ }),
        h(QuProgressCircular, { fab: true, value: 40 }),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.quantum-progress-circular')!
      const fab = host.querySelector<HTMLElement>('.quantum-fab')!
      const rect = fab.getBoundingClientRect()

      expect(getComputedStyle(el).pointerEvents).toBe('none')
      expect(fab.contains(document.elementFromPoint(rect.left + 28, rect.top + 28))).toBe(true)

      fab.click()

      expect(clicks).toBe(1)
    })

    it('should keep an explicit size under fab, concentric with the FAB', async () => {
      const host = mount(() => h('div', { style: 'position: relative; width: 56px; height: 56px' }, [
        h(QuFab, { ariaLabel: 'Upload', icon: 'cloud-upload', position: 'static' }),
        h(QuProgressCircular, { fab: true, size: 72 }),
      ]))
      await settle()

      const svg = host.querySelector<SVGSVGElement>('.quantum-progress-circular svg')!
      const outer = svg.getBoundingClientRect()
      const inner = host.querySelector<HTMLElement>('.quantum-fab')!.getBoundingClientRect()

      expect(svg.getAttribute('width')).toBe('72')
      expect(outer.left + outer.width / 2).toBe(inner.left + inner.width / 2)
      expect(outer.top + outer.height / 2).toBe(inner.top + inner.height / 2)
    })
  })

  describe('naming', () => {
    it('should take ariaLabel as the accessible name', async () => {
      const el = ring({ ariaLabel: 'Syncing mail' })
      await settle()

      expect(el.getAttribute('aria-label')).toBe('Syncing mail')
    })

    it('should translate the default name through the locale', async () => {
      const el = ring({}, app => {
        app.use(createLocalePlugin({ default: 'en', messages: { en: { Quantum: { loading: 'Laden' } } } }))
      })
      await settle()

      expect(el.getAttribute('aria-label')).toBe('Laden')
    })
  })

  describe('theme', () => {
    it('should take the indicator colour from the adapter sheet in both themes', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuProgressCircular, { value: 50 })]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuProgressCircular, { value: 50 }), h(QuProgressCircular, { fab: true })]),
        h('div', { style: '--quantum-primary: #009688' }, [h(QuProgressCircular, { value: 50 })]),
      ]))
      await settle()

      const [light, dark, fab, teal] = host.querySelectorAll<HTMLElement>('.quantum-progress-circular')

      expect(getComputedStyle(arc(light!)).stroke).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(arc(dark!)).stroke).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(arc(fab!)).stroke).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(arc(teal!)).stroke).toBe('rgb(0, 150, 136)')
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Overflow, useOverflowRoot } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type {
  OverflowIndicatorSlotProps,
  OverflowItemSlotProps,
  OverflowRootContext,
  OverflowRootSlotProps,
} from './index'

let resizeObserverCallback: ResizeObserverCallback | null = null
let resizeObserverTarget: Element | null = null

class TestResizeObserver {
  constructor (cb: ResizeObserverCallback) {
    resizeObserverCallback = cb
  }

  observe (el: Element) {
    resizeObserverTarget = el
  }

  unobserve () {}
  disconnect () {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver)
  resizeObserverCallback = null
  resizeObserverTarget = null
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function triggerResize (width: number, height = 0): void {
  if (!resizeObserverCallback || !resizeObserverTarget) return
  const rect = {
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRectReadOnly
  resizeObserverCallback(
    [{
      contentRect: rect,
      target: resizeObserverTarget,
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    }],
    {} as ResizeObserver,
  )
}

describe('overflow', () => {
  describe('root', () => {
    it('should render as div by default', () => {
      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: { default: () => h('span', 'content') },
      })

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should support renderless mode', () => {
      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', renderless: true },
        slots: { default: () => h('section', { class: 'wrapper' }, 'content') },
      })

      expect(wrapper.find('.wrapper').exists()).toBe(true)
    })

    it('should expose slot props', () => {
      let captured: OverflowRootSlotProps | undefined

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: (props: OverflowRootSlotProps) => {
            captured = props
            return h('span')
          },
        },
      })

      expect(captured).toBeDefined()
      expect(typeof captured!.capacity).toBe('number')
      expect(typeof captured!.size).toBe('number')
      expect(typeof captured!.isOverflowing).toBe('boolean')
      expect(captured!.attrs['data-priority']).toBe('start')
    })

    it('should provide context to descendants', () => {
      let captured: OverflowRootContext | undefined

      const Probe = defineComponent({
        setup () {
          captured = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: { default: () => h(Probe) },
      })

      expect(captured).toBeDefined()
      expect(captured!.overflow).toBeDefined()
      expect(captured!.registry).toBeDefined()
      expect(typeof captured!.isVisible).toBe('function')
    })
  })

  describe('item', () => {
    it('should register one ticket per Item', async () => {
      let captured: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          captured = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => [
            h(Probe),
            h(Overflow.Item, { value: 'a', namespace: 'test:overflow' }, { default: () => h('span', 'a') }),
            h(Overflow.Item, { value: 'b', namespace: 'test:overflow' }, { default: () => h('span', 'b') }),
            h(Overflow.Item, { value: 'c', namespace: 'test:overflow' }, { default: () => h('span', 'c') }),
          ],
        },
      })

      await nextTick()
      expect(captured!.registry.size).toBe(3)
    })

    it('should unregister on unmount', async () => {
      let captured: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          captured = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const Wrapper = defineComponent({
        props: { count: { type: Number, default: 3 } },
        setup (props) {
          return () => h(Overflow.Root, { namespace: 'test:overflow' }, {
            default: () => [
              h(Probe),
              ...Array.from({ length: props.count }, (_, i) => h(
                Overflow.Item,
                { key: i, value: i, namespace: 'test:overflow' },
                { default: () => h('span') },
              )),
            ],
          })
        },
      })

      const wrapper = mount(Wrapper, { props: { count: 3 } })

      await nextTick()
      expect(captured!.registry.size).toBe(3)

      await wrapper.setProps({ count: 1 })
      await nextTick()
      expect(captured!.registry.size).toBe(1)
    })

    it('should expose slot props', () => {
      let captured: OverflowItemSlotProps | undefined

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => h(Overflow.Item, { value: 0, namespace: 'test:overflow' }, {
            default: (props: OverflowItemSlotProps) => {
              captured = props
              return h('span')
            },
          }),
        },
      })

      expect(captured).toBeDefined()
      expect(typeof captured!.isVisible).toBe('boolean')
      expect(typeof captured!.isHidden).toBe('boolean')
      expect(captured!.attrs).toBeDefined()
    })

    it('should expose isVisible on the root context', async () => {
      let captured: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          captured = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => [
            h(Probe),
            h(Overflow.Item, { value: 'a', namespace: 'test:overflow' }, { default: () => h('span', 'a') }),
          ],
        },
      })

      await nextTick()
      expect(captured!.isVisible(0)).toBe(true)
    })

    it('should always be visible when Item is disabled', () => {
      let captured: OverflowItemSlotProps | undefined

      mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => h(Overflow.Item, {
            value: 0,
            disabled: true,
            namespace: 'test:overflow',
          }, {
            default: (props: OverflowItemSlotProps) => {
              captured = props
              return h('span')
            },
          }),
        },
      })

      expect(captured!.isVisible).toBe(true)
      expect(captured!.isHidden).toBe(false)
    })

    it('should exempt disabled items from capacity math', async () => {
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', priority: 'start' },
        slots: {
          default: () => [
            h(Probe),
            h(
              Overflow.Item,
              { key: 0, value: 0, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
            h(
              Overflow.Item,
              { key: 1, value: 1, disabled: true, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
            h(
              Overflow.Item,
              { key: 2, value: 2, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (const i of [0, 2]) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(120)
        await nextTick()

        expect(rootCtx!.isVisible(0)).toBe(true)
        expect(rootCtx!.isVisible(1)).toBe(true)
        expect(rootCtx!.isVisible(2)).toBe(false)
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      wrapper.unmount()
    })
  })

  describe('indicator', () => {
    it('should not render when not overflowing', async () => {
      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => [
            h(
              Overflow.Item,
              { value: 0, namespace: 'test:overflow' },
              { default: () => h('span', 'a') },
            ),
            h(
              Overflow.Indicator,
              { namespace: 'test:overflow' },
              { default: () => h('span', { class: 'badge' }, '+more') },
            ),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()
      expect(wrapper.find('.badge').exists()).toBe(false)
      wrapper.unmount()
    })

    it('should render when overflowing and expose count + hidden', async () => {
      let captured: OverflowIndicatorSlotProps | undefined
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow' },
        slots: {
          default: () => [
            h(Probe),
            h(
              Overflow.Item,
              { value: 0, namespace: 'test:overflow' },
              { default: () => h('span', 'a') },
            ),
            h(
              Overflow.Item,
              { value: 1, namespace: 'test:overflow' },
              { default: () => h('span', 'b') },
            ),
            h(
              Overflow.Item,
              { value: 2, namespace: 'test:overflow' },
              { default: () => h('span', 'c') },
            ),
            h(
              Overflow.Indicator,
              { namespace: 'test:overflow' },
              {
                default: (props: OverflowIndicatorSlotProps) => {
                  captured = props
                  return h('span', { class: 'badge' }, `+${props.count}`)
                },
              },
            ),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      // happy-dom returns empty strings for getComputedStyle margins, which
      // would coerce to NaN inside createOverflow.measure(). Stub it so the
      // synthetic elements measure to a clean numeric width.
      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (let i = 0; i < 3; i++) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(120)
        await nextTick()
        await nextTick()
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      expect(captured).toBeDefined()
      expect(typeof captured!.count).toBe('number')
      expect(Array.isArray(captured!.hidden)).toBe(true)
      expect(captured!.attrs['aria-live']).toBe('polite')
      expect(captured!.attrs['data-overflow-indicator']).toBe('true')
      wrapper.unmount()
    })

    it('should not count disabled items as hidden', async () => {
      let captured: OverflowIndicatorSlotProps | undefined
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', priority: 'start' },
        slots: {
          default: () => [
            h(Probe),
            h(
              Overflow.Item,
              { key: 0, value: 0, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
            h(
              Overflow.Item,
              { key: 1, value: 1, disabled: true, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
            h(
              Overflow.Item,
              { key: 2, value: 2, namespace: 'test:overflow' },
              { default: () => h('span') },
            ),
            h(
              Overflow.Indicator,
              { namespace: 'test:overflow' },
              {
                default: (props: OverflowIndicatorSlotProps) => {
                  captured = props
                  return h('span', { class: 'badge' }, `+${props.count}`)
                },
              },
            ),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (const i of [0, 2]) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(120)
        await nextTick()
        await nextTick()

        expect(captured!.count).toBe(1)
        expect(captured!.hidden.length).toBe(1)
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      wrapper.unmount()
    })
  })

  describe('priority', () => {
    it('should hide trailing items when priority="start"', async () => {
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', priority: 'start' },
        slots: {
          default: () => [
            h(Probe),
            ...Array.from({ length: 3 }, (_, i) => h(
              Overflow.Item,
              { key: i, value: i, namespace: 'test:overflow' },
              { default: () => h('span') },
            )),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (let i = 0; i < 3; i++) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(120)
        await nextTick()

        expect(rootCtx!.isVisible(0)).toBe(true)
        expect(rootCtx!.isVisible(2)).toBe(false)
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      wrapper.unmount()
    })

    it('should hide leading items when priority="end"', async () => {
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', priority: 'end' },
        slots: {
          default: () => [
            h(Probe),
            ...Array.from({ length: 3 }, (_, i) => h(
              Overflow.Item,
              { key: i, value: i, namespace: 'test:overflow' },
              { default: () => h('span') },
            )),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (let i = 0; i < 3; i++) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(120)
        await nextTick()

        expect(rootCtx!.isVisible(0)).toBe(false)
        expect(rootCtx!.isVisible(2)).toBe(true)
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      wrapper.unmount()
    })
  })

  describe('disabled root', () => {
    it('should treat all items as visible when Root.disabled=true', async () => {
      let rootCtx: OverflowRootContext | undefined
      const Probe = defineComponent({
        setup () {
          rootCtx = useOverflowRoot('test:overflow')
          return () => null
        },
      })

      const wrapper = mount(Overflow.Root, {
        props: { namespace: 'test:overflow', disabled: true },
        slots: {
          default: () => [
            h(Probe),
            ...Array.from({ length: 3 }, (_, i) => h(
              Overflow.Item,
              { key: i, value: i, namespace: 'test:overflow' },
              { default: () => h('span') },
            )),
          ],
        },
        attachTo: document.body,
      })

      await nextTick()

      const realGetComputedStyle = globalThis.getComputedStyle
      const fakes: HTMLElement[] = []
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))

      try {
        for (let i = 0; i < 3; i++) {
          const el = document.createElement('div')
          Object.defineProperty(el, 'offsetWidth', { value: 100 })
          document.body.append(el)
          fakes.push(el)
          rootCtx!.overflow.measure(i, el)
        }
        triggerResize(50)
        await nextTick()

        for (let i = 0; i < 3; i++) {
          expect(rootCtx!.isVisible(i)).toBe(true)
        }
      } finally {
        vi.stubGlobal('getComputedStyle', realGetComputedStyle)
        for (const el of fakes) el.remove()
      }

      wrapper.unmount()
    })
  })
})

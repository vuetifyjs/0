import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type { OverflowItemSlotProps, OverflowRootContext, OverflowRootSlotProps } from './index'

import { Overflow, useOverflowRoot } from './index'

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

    it('should expose isVisible on registered tickets', async () => {
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
      const ticket = captured!.registry.values()[0]
      expect(ticket.isVisible.value).toBe(true)
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
  })
})

// Suppress unused warning for triggerResize until later tasks need it
void triggerResize

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Context
import { provideVirtualizerRoot } from './VirtualizerRoot.vue'

import { Virtualizer } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

// A ResizeObserver stub that synchronously reports a fixed contentRect for
// whatever element it observes — happy-dom implements the ResizeObserver
// constructor but never fires real layout-driven callbacks, so component
// tests need to trigger them manually the same way createVirtual's own
// suite does.
function stubResizeObserver (rectByTarget: (el: Element) => { width: number, height: number }) {
  const realResizeObserver = globalThis.ResizeObserver
  globalThis.ResizeObserver = vi.fn(function (this: unknown, callback: ResizeObserverCallback) {
    return {
      observe: (target: Element) => {
        const { width, height } = rectByTarget(target)
        callback([
          {
            target,
            contentRect: { width, height, top: 0, left: 0, bottom: height, right: width, x: 0, y: 0, toJSON: () => ({}) },
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          } as unknown as ResizeObserverEntry,
        ], this as ResizeObserver)
      },
      unobserve: () => {},
      disconnect: () => {},
    }
  }) as unknown as typeof ResizeObserver

  return () => {
    globalThis.ResizeObserver = realResizeObserver
  }
}

describe('virtualizer', () => {
  let restoreResizeObserver: () => void

  beforeEach(() => {
    restoreResizeObserver = stubResizeObserver(() => ({ width: 400, height: 500 }))
  })

  afterEach(() => {
    restoreResizeObserver()
  })

  it('should render leading and trailing spacer elements', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    const wrapper = mount(Virtualizer.Root, {
      props: { items, itemHeight: 40, height: 500 },
    })

    expect(wrapper.find('[data-virtualizer-spacer="start"]').exists()).toBe(true)
    expect(wrapper.find('[data-virtualizer-spacer="end"]').exists()).toBe(true)
  })

  it('should render only the visible items via the default slot', async () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i }))
    const wrapper = mount(Virtualizer.Root, {
      props: { items, itemHeight: 40, height: 500 },
      slots: {
        default: (props: { items: readonly { index: number }[] }) =>
          props.items.map(item => h(Virtualizer.Item as any, { key: item.index, index: item.index }, () => `Item ${item.index}`)),
      },
    })
    await nextTick()
    await nextTick()

    const rendered = wrapper.findAll('[data-virtualizer-index]')
    expect(rendered.length).toBeGreaterThan(0)
    expect(rendered.length).toBeLessThan(1000)
  })

  it('should pass through consumer-supplied ARIA attrs, since it imposes no role itself', async () => {
    // Item doesn't bake in role/aria-posinset/aria-setsize by default — a
    // bare div doesn't support them per the ARIA spec (axe: aria-allowed-attr).
    // The consumer picks the role that fits their content (listbox, grid,
    // etc.) and supplies the matching attrs, which pass straight through.
    const items = Array.from({ length: 50 }, (_, i) => ({ id: i }))
    const wrapper = mount(Virtualizer.Root, {
      props: { items, itemHeight: 40, height: 500 },
      slots: {
        default: (props: { items: readonly { index: number }[] }) =>
          props.items.map(item => h(Virtualizer.Item as any, {
            'key': item.index,
            'index': item.index,
            'role': 'option',
            'aria-posinset': item.index + 1,
            'aria-setsize': 50,
          }, () => `Item ${item.index}`)),
      },
    })
    await nextTick()
    await nextTick()

    const first = wrapper.find('[data-virtualizer-index="0"]')
    expect(first.attributes('role')).toBe('option')
    expect(first.attributes('aria-posinset')).toBe('1')
    expect(first.attributes('aria-setsize')).toBe('50')
  })

  it('should report a measured item height back to the root via resize', async () => {
    const restore = stubResizeObserver(() => ({ width: 400, height: 88 }))
    const resize = vi.fn()

    const wrapper = mount({
      setup () {
        provideVirtualizerRoot('v0:virtualizer:root', {
          itemsLength: { value: 10 } as any,
          resize,
        } as any)
        return () => h(Virtualizer.Item as any, { index: 3 }, () => 'content')
      },
    })
    await nextTick()

    expect(resize).toHaveBeenCalledWith(3, 88)
    wrapper.unmount()
    restore()
  })

  it('should expose scrollTo and reset via the default slot', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }))
    let captured: { scrollTo: (i: number) => void, reset: () => void } | undefined
    mount(Virtualizer.Root, {
      props: { items, itemHeight: 40, height: 500 },
      slots: {
        default: (props: any) => {
          captured = props
          return []
        },
      },
    })

    expect(typeof captured?.scrollTo).toBe('function')
    expect(typeof captured?.reset).toBe('function')
  })

  it('should react to items changing', async () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }))
    const wrapper = mount(Virtualizer.Root, {
      props: { items, itemHeight: 40, height: 500 },
    })
    await nextTick()

    await wrapper.setProps({ items: Array.from({ length: 20 }, (_, i) => ({ id: i })) })
    await nextTick()

    // No throw, spacer elements still present after the item count changes.
    expect(wrapper.find('[data-virtualizer-spacer="start"]').exists()).toBe(true)
  })
})

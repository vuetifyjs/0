import { describe, expect, it, vi } from 'vitest'

import { createVirtual } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, shallowRef } from 'vue'

// Types
import type { VirtualOptions } from './index'

const ITEM = 40
const VIEWPORT = 400

function frames (count = 4) {
  return new Promise<void>(resolve => {
    function tick (remaining: number) {
      if (remaining === 0) return resolve()
      requestAnimationFrame(() => tick(remaining - 1))
    }
    tick(count)
  })
}

function setup (options: VirtualOptions = {}) {
  const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
  const key = shallowRef(0)

  const wrapper = mount(defineComponent({
    setup () {
      const virtual = createVirtual(items, { itemHeight: ITEM, ...options })

      // Components sync element from their own template ref through a watcher,
      // which stops before unmount nulls the ref — the detached node stays assigned
      function onRef (el: unknown) {
        if (el) virtual.element.value = el as HTMLElement
      }

      return () => h('div', {
        key: key.value,
        ref: onRef,
        style: { height: `${VIEWPORT}px`, overflowY: 'auto' },
        onScroll: virtual.scroll,
      }, [
        h('div', { style: { height: `${virtual.offset.value}px` } }),
        ...virtual.items.value.map(item => h('div', {
          key: item.index,
          style: { height: `${ITEM}px` },
        }, String(item.raw))),
        h('div', { style: { height: `${virtual.size.value}px` } }),
      ])
    },
  }), { attachTo: document.body })

  return {
    wrapper,
    el: () => wrapper.element as HTMLElement,
    remount: () => key.value++,
  }
}

describe('createVirtual', () => {
  describe('reverse direction', () => {
    it('should pin to the bottom on mount', async () => {
      const { wrapper, el } = setup({ direction: 'reverse' })

      await frames()

      expect(el().scrollHeight).toBe(100 * ITEM)
      expect(el().scrollTop).toBeGreaterThan(0)
      expect(el().scrollTop).toBe(el().scrollHeight - el().clientHeight)

      wrapper.unmount()
    })

    it('should pin to the bottom again when the element is re-assigned', async () => {
      const { wrapper, el, remount } = setup({ direction: 'reverse' })

      await frames()

      const previous = el()
      remount()

      await frames()

      expect(el()).not.toBe(previous)
      expect(el().scrollTop).toBeGreaterThan(0)
      expect(el().scrollTop).toBe(el().scrollHeight - el().clientHeight)

      wrapper.unmount()
    })
  })

  describe('dispose', () => {
    it('should not fire edge callbacks for a scroll queued before unmount', async () => {
      const onStartReached = vi.fn()
      const onEndReached = vi.fn()
      const { wrapper, el } = setup({ onStartReached, onEndReached })

      await frames()

      el().scrollTop = el().scrollHeight
      wrapper.unmount()

      await frames()

      expect(onStartReached).not.toHaveBeenCalled()
      expect(onEndReached).not.toHaveBeenCalled()
    })
  })
})

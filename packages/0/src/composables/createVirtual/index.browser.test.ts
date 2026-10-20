import { describe, expect, it, vi } from 'vitest'

import { createVirtual } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, onMounted, shallowRef } from 'vue'

// Types
import type { VirtualContext, VirtualOptions } from './index'

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

function list (length: number) {
  return Array.from({ length }, (_, i) => i)
}

interface SetupOptions extends VirtualOptions {
  initial?: number[]
  hidden?: boolean
  /** Bind `virtual.element` as the template ref instead of syncing it */
  direct?: boolean
  mounted?: (virtual: VirtualContext<number>) => void
}

function setup (_options: SetupOptions = {}) {
  const { initial = list(100), hidden: _hidden = false, direct, mounted, ...options } = _options
  const items = shallowRef(initial)
  const hidden = shallowRef(_hidden)
  const key = shallowRef(0)

  const wrapper = mount(defineComponent({
    setup () {
      const virtual = createVirtual(items, { itemHeight: ITEM, ...options })

      // Components sync element from their own template ref through a watcher,
      // which stops before unmount nulls the ref — the detached node stays assigned
      function onRef (el: unknown) {
        if (el) virtual.element.value = el as HTMLElement
      }

      if (mounted) onMounted(() => mounted(virtual))

      return () => h('div', {
        key: key.value,
        ref: direct ? virtual.element : onRef,
        style: {
          height: `${VIEWPORT}px`,
          overflowY: 'auto',
          display: hidden.value ? 'none' : 'block',
        },
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
    items,
    el: () => wrapper.element as HTMLElement,
    show: () => {
      hidden.value = false
      key.value++
    },
  }
}

function max (el: HTMLElement) {
  return el.scrollHeight - el.clientHeight
}

describe('createVirtual', () => {
  describe('reverse direction', () => {
    it('should pin to the bottom on mount', async () => {
      const { wrapper, el } = setup({ direction: 'reverse' })

      await frames()

      expect(el().scrollHeight).toBe(100 * ITEM)
      expect(el().scrollTop).toBeGreaterThan(0)
      expect(el().scrollTop).toBe(max(el()))

      wrapper.unmount()
    })

    it('should pin to the bottom when the first items arrive after mount', async () => {
      const { wrapper, el, items } = setup({ direction: 'reverse', initial: [] })

      await frames()

      items.value = list(100)

      await frames()

      expect(el().scrollTop).toBeGreaterThan(0)
      expect(el().scrollTop).toBe(max(el()))

      wrapper.unmount()
    })

    it('should pin when remounted after a mount with no viewport', async () => {
      const { wrapper, el, show } = setup({ direction: 'reverse', hidden: true })

      await frames()

      show()

      await frames()

      expect(el().scrollTop).toBeGreaterThan(0)
      expect(el().scrollTop).toBe(max(el()))

      wrapper.unmount()
    })

    it('should not override a scrollTo made right after mount', async () => {
      const { wrapper, el } = setup({
        direction: 'reverse',
        height: VIEWPORT,
        direct: true,
        mounted: async virtual => {
          await nextTick()
          virtual.scrollTo(10)
        },
      })

      await frames()

      expect(el().scrollTop).toBe(10 * ITEM)

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

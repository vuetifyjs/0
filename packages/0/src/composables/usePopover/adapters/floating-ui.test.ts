import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@floating-ui/dom', () => {
  return {
    computePosition: vi.fn(async () => ({
      x: 12,
      y: 34,
      placement: 'bottom',
      strategy: 'fixed',
      middlewareData: {},
    })),
    autoUpdate: vi.fn((_anchor: Element, _content: Element, update: () => void) => {
      void update()
      return vi.fn()
    }),
    offset: vi.fn(value => ({ name: 'offset', options: value })),
    flip: vi.fn(() => ({ name: 'flip' })),
    shift: vi.fn(value => ({ name: 'shift', options: value })),
  }
})

import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { FloatingUIPopoverAdapter } from './floating-ui'
import { toPlacement } from './placement'

// Utilities
import { effectScope, nextTick, shallowRef, toRef } from 'vue'

// Types
import type { PopoverPlacement } from './adapter'
import type { Middleware } from '@floating-ui/dom'
import type { Ref } from 'vue'

interface WritableContext {
  anchorName: string
  anchorEl: Ref<Element | null | undefined>
  contentEl: Ref<HTMLElement | null | undefined>
  isOpen: Ref<boolean>
  placement: Ref<PopoverPlacement>
  positionTry: string
}

function makeContext (overrides: Partial<WritableContext> = {}): WritableContext {
  return {
    anchorName: '--test',
    anchorEl: shallowRef(),
    contentEl: shallowRef(),
    isOpen: shallowRef(false),
    placement: toRef(() => toPlacement('bottom')),
    positionTry: 'most-width bottom',
    ...overrides,
  }
}

function element (tag = 'div'): HTMLElement {
  return document.createElement(tag)
}

async function flush () {
  await Promise.resolve()
  await Promise.resolve()
  await nextTick()
}

describe('floatingUIPopoverAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('middleware', () => {
    it('should use offset(8), flip(), and shift({ padding: 8 }) by default', () => {
      const adapter = new FloatingUIPopoverAdapter()

      expect(adapter).toBeInstanceOf(FloatingUIPopoverAdapter)
      expect(offset).toHaveBeenCalledWith(8)
      expect(flip).toHaveBeenCalledTimes(1)
      expect(shift).toHaveBeenCalledWith({ padding: 8 })
    })

    it('should pass constructor middleware through to computePosition', async () => {
      const custom: Middleware[] = [{ name: 'custom', fn: () => ({}) }]
      const adapter = new FloatingUIPopoverAdapter({ middleware: custom })
      const context = makeContext()
      const anchor = element()
      const content = element()

      expect(offset).not.toHaveBeenCalled()
      expect(flip).not.toHaveBeenCalled()
      expect(shift).not.toHaveBeenCalled()

      adapter.setup(context)
      context.anchorEl.value = anchor
      context.contentEl.value = content
      context.isOpen.value = true
      await flush()

      expect(computePosition).toHaveBeenCalledWith(
        anchor,
        content,
        expect.objectContaining({ middleware: custom }),
      )
    })
  })

  describe('positionTry', () => {
    it('should ignore positionTry and emit top/left instead of CSS fallbacks', async () => {
      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext({ positionTry: 'flip-block' })
      const styles = adapter.setup(context)

      context.anchorEl.value = element()
      context.contentEl.value = element()
      context.isOpen.value = true
      await flush()

      expect(styles.value).toEqual({ position: 'fixed', top: '34px', left: '12px' })
      expect(styles.value).not.toHaveProperty('position-try-fallbacks')
    })
  })

  describe('autoUpdate', () => {
    it('should start autoUpdate when open with both elements, and stop on close', async () => {
      const stop = vi.fn()
      vi.mocked(autoUpdate).mockImplementation((_anchor, _content, update) => {
        void update()
        return stop
      })

      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext()
      adapter.setup(context)

      expect(autoUpdate).not.toHaveBeenCalled()

      context.anchorEl.value = element()
      context.contentEl.value = element()
      await flush()
      expect(autoUpdate).not.toHaveBeenCalled()

      context.isOpen.value = true
      await flush()
      expect(autoUpdate).toHaveBeenCalledTimes(1)
      expect(stop).not.toHaveBeenCalled()

      context.isOpen.value = false
      await flush()
      expect(stop).toHaveBeenCalledTimes(1)
    })

    it('should recompute when placement changes while open', async () => {
      const placementSource = shallowRef('bottom')
      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext({
        placement: toRef(() => toPlacement(placementSource.value)),
      })
      adapter.setup(context)

      context.anchorEl.value = element()
      context.contentEl.value = element()
      context.isOpen.value = true
      await flush()

      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'bottom' }),
      )

      vi.mocked(computePosition).mockClear()
      vi.mocked(autoUpdate).mockClear()

      placementSource.value = 'top'
      await flush()

      expect(autoUpdate).toHaveBeenCalledTimes(1)
      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'top' }),
      )
    })

    it('should pass side-align as a floating-ui placement when align is not center', async () => {
      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext({
        placement: toRef(() => toPlacement('bottom span-right')),
      })
      adapter.setup(context)

      context.anchorEl.value = element()
      context.contentEl.value = element()
      context.isOpen.value = true
      await flush()

      expect(computePosition).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ placement: 'bottom-end' }),
      )
    })

    it('should no-op when the anchor or content element is missing', async () => {
      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext()
      const styles = adapter.setup(context)

      context.isOpen.value = true
      context.contentEl.value = element()
      await flush()

      expect(autoUpdate).not.toHaveBeenCalled()
      expect(computePosition).not.toHaveBeenCalled()
      expect(styles.value).toEqual({ position: 'fixed', top: '0px', left: '0px' })

      context.contentEl.value = null
      context.anchorEl.value = element()
      await flush()

      expect(autoUpdate).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should stop autoUpdate when the setup scope is disposed', async () => {
      const stop = vi.fn()
      vi.mocked(autoUpdate).mockImplementation((_anchor, _content, update) => {
        void update()
        return stop
      })

      const adapter = new FloatingUIPopoverAdapter()
      const context = makeContext()
      const scope = effectScope()

      scope.run(() => {
        adapter.setup(context)
      })

      context.anchorEl.value = element()
      context.contentEl.value = element()
      context.isOpen.value = true
      await flush()

      expect(stop).not.toHaveBeenCalled()

      scope.stop()
      expect(stop).toHaveBeenCalledTimes(1)
    })
  })

  describe('re-entrancy', () => {
    it('should keep two simultaneous setup() calls independent on one instance', async () => {
      const stops = [vi.fn(), vi.fn()]
      let calls = 0
      vi.mocked(autoUpdate).mockImplementation((_anchor, _content, update) => {
        void update()
        const stop = stops[calls] ?? vi.fn()
        calls += 1
        return stop
      })

      const adapter = new FloatingUIPopoverAdapter()
      const first = makeContext()
      const second = makeContext()

      const firstStyles = adapter.setup(first)
      const secondStyles = adapter.setup(second)

      first.anchorEl.value = element()
      first.contentEl.value = element()
      second.anchorEl.value = element()
      second.contentEl.value = element()
      first.isOpen.value = true
      second.isOpen.value = true
      await flush()

      expect(autoUpdate).toHaveBeenCalledTimes(2)
      expect(firstStyles.value).toEqual({ position: 'fixed', top: '34px', left: '12px' })
      expect(secondStyles.value).toEqual({ position: 'fixed', top: '34px', left: '12px' })

      first.isOpen.value = false
      await flush()

      expect(stops[0]).toHaveBeenCalledTimes(1)
      expect(stops[1]).not.toHaveBeenCalled()

      second.isOpen.value = false
      await flush()

      expect(stops[1]).toHaveBeenCalledTimes(1)
    })
  })
})

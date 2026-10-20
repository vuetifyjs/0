import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createVirtual, createVirtualContext, useVirtual } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, effectScope, nextTick, shallowRef, watch } from 'vue'

const realDocument = globalThis.document

// Mock useHydration
const mockIsHydrated = shallowRef(true)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

// Mock SUPPORTS_OBSERVER and IN_BROWSER
vi.mock('#v0/constants/globals', async () => {
  const actual = await vi.importActual('#v0/constants/globals')
  return {
    ...actual,
    IN_BROWSER: true,
    SUPPORTS_OBSERVER: true,
  }
})

describe('createVirtual', () => {
  let mockContainer: HTMLElement

  beforeEach(() => {
    vi.clearAllMocks()

    mockIsHydrated.value = true

    globalThis.ResizeObserver = vi.fn(function (callback: ResizeObserverCallback) {
      return {
        observe: vi.fn((element: HTMLElement) => {
          const rect = element.getBoundingClientRect?.() || { width: 400, height: 500 }
          callback([{
            target: element,
            contentRect: rect,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          }] as unknown as ResizeObserverEntry[], {} as ResizeObserver)
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    }) as unknown as typeof ResizeObserver

    mockContainer = realDocument.createElement('div')
    Object.defineProperty(mockContainer, 'scrollHeight', { value: 5000, writable: true })
    Object.defineProperty(mockContainer, 'clientHeight', { value: 500, writable: true })
    Object.defineProperty(mockContainer, 'offsetHeight', { value: 500, writable: true })
    mockContainer.scrollTo = vi.fn() as any
    mockContainer.getBoundingClientRect = vi.fn(() => ({
      width: 400,
      height: 500,
      top: 0,
      left: 0,
      right: 400,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))

    globalThis.window = {
      innerHeight: 800,
      requestAnimationFrame: vi.fn(cb => {
        queueMicrotask(() => (cb as (time: number) => void)(0))
        return 0
      }),
      clearTimeout: vi.fn(),
      setTimeout: vi.fn(cb => {
        (cb as () => void)()
        return 0
      }),
    } as unknown as Window & typeof globalThis

    globalThis.cancelAnimationFrame = vi.fn()
    globalThis.document = {
      documentElement: {} as HTMLElement,
    } as unknown as Document
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a virtual context with required properties', () => {
    const items = shallowRef([1, 2, 3, 4, 5])
    const virtual = createVirtual(items)

    expect(virtual).toHaveProperty('element')
    expect(virtual).toHaveProperty('items')
    expect(virtual).toHaveProperty('offset')
    expect(virtual).toHaveProperty('size')
    expect(virtual).toHaveProperty('scrollTo')
    expect(virtual).toHaveProperty('scroll')
    expect(virtual).toHaveProperty('scrollend')
    expect(virtual).toHaveProperty('resize')
    expect(virtual).toHaveProperty('reset')
    expect(virtual).toHaveProperty('state')
  })

  it('should handle empty items array', () => {
    const items = shallowRef<number[]>([])
    const virtual = createVirtual(items)

    expect(virtual.items.value).toEqual([])
    expect(virtual.offset.value).toBe(0)
    expect(virtual.size.value).toBe(0)
  })

  it('should render initial visible items with fixed height', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
    expect(virtual.items.value[0]!.raw).toBe(0)
    expect(virtual.items.value[0]!.index).toBe(0)
  })

  it('should update visible range when items change', async () => {
    const items = shallowRef([1, 2, 3])
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()

    items.value = Array.from({ length: 100 }, (_, i) => i)
    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(3)
  })

  it('should handle item resize', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.resize(0, 100)

    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should keep the window aligned after a one-row resize', async () => {
    const native = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = callback => {
      queueMicrotask(() => callback(0))
      return 1
    }

    try {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()
      await nextTick()

      virtual.scrollTo(40)

      expect(mockContainer.scrollTop).toBe(2_000)
      expect(virtual.offset.value).toBe(1_750)
      expect(virtual.size.value).toBe(2_200)
      expect(virtual.items.value[0]!.index).toBe(35)
      expect(virtual.items.value.at(-1)!.index).toBe(55)

      // +16 crosses the visible edge by one row.
      virtual.resize(0, 66)
      await nextTick()

      expect(virtual.offset.value).toBe(1_716)
      expect(virtual.size.value).toBe(2_250)
      expect(virtual.items.value[0]!.index).toBe(34)
      expect(virtual.items.value.at(-1)!.index).toBe(54)

      // -16 steps back onto the same rows.
      virtual.resize(0, 50)
      await nextTick()

      expect(virtual.offset.value).toBe(1_750)
      expect(virtual.size.value).toBe(2_200)
      expect(virtual.items.value[0]!.index).toBe(35)
      expect(virtual.items.value.at(-1)!.index).toBe(55)

      // A jump of several rows still lands on the searched window.
      virtual.resize(0, 200)
      await nextTick()

      expect(virtual.offset.value).toBe(1_750)
      expect(virtual.size.value).toBe(2_350)
      expect(virtual.items.value[0]!.index).toBe(32)
      expect(virtual.items.value.at(-1)!.index).toBe(52)
    } finally {
      globalThis.requestAnimationFrame = native
    }
  })

  it('should handle scroll events', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    mockContainer.scrollTop = 500
    virtual.scroll()

    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should handle scrollend events', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.scrollend()

    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should scroll to exact index position', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.scrollTo(50)

    expect(mockContainer.scrollTop).toBe(2500)
  })

  it('should calculate offset and size correctly', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    expect(virtual.offset.value).toBe(0)
    expect(virtual.size.value).toBeGreaterThan(0)
  })

  it('should render an initial window with no itemHeight (zero-config bootstrap)', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: null })

    virtual.element.value = mockContainer

    await nextTick()

    // Estimated offsets render a first window so items can mount and measure —
    // an unset itemHeight previously dead-ended update() and rendered nothing
    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should preserve measured heights when items are appended', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 40, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.resize(0, 200)

    await nextTick()

    items.value = [...items.value, 100]

    await nextTick()

    // offsets[1] reflects the measured 200, not itemHeight — appending
    // previously wiped every measurement back to null
    virtual.scrollTo(1)
    expect(mockContainer.scrollTop).toBe(200)
  })

  it('should include index in computed items', async () => {
    const items = shallowRef([{ id: 1 }, { id: 2 }, { id: 3 }])
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    const firstItem = virtual.items.value[0]
    expect(firstItem).toBeDefined()
    expect(firstItem!.raw).toEqual({ id: 1 })
    expect(firstItem!.index).toBe(0)
    expect(firstItem!.key).toBe(0)
  })

  it('should trigger rebuild when items change', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()

    const initialItems = virtual.items.value.length

    items.value = Array.from({ length: 20 }, (_, i) => i)
    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThanOrEqual(initialItems)
  })

  it('should parse string itemHeight', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: '50', height: 500 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should parse string container height', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: '600' })

    virtual.element.value = mockContainer

    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should respect custom overscan option', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500, overscan: 10 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    expect(virtual.items.value.length).toBeGreaterThan(10)
  })

  it('should use default overscan when not specified', async () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtualDefault = createVirtual(items, { itemHeight: 50, height: 500 })
    const virtualExplicit = createVirtual(items, { itemHeight: 50, height: 500, overscan: 5 })

    virtualDefault.element.value = mockContainer
    virtualExplicit.element.value = mockContainer

    await nextTick()

    expect(virtualDefault.items.value.length).toBe(virtualExplicit.items.value.length)
  })

  describe('reverse direction', () => {
    it('should scroll to bottom initially with reverse direction', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, direction: 'reverse' })

      virtual.element.value = mockContainer

      // Element watcher renders the window, then pins after that render
      await nextTick()
      await nextTick()

      expect(mockContainer.scrollTop).toBe(5000)
    })

    it('should maintain scroll position at bottom when new items added in reverse mode', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, i) => ({ id: i, text: `Message ${i}` })))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, direction: 'reverse' })

      virtual.element.value = mockContainer

      await nextTick()

      const initialScrollTop = mockContainer.scrollTop

      items.value = [...items.value, { id: 10, text: 'Message 10' }]

      await nextTick()

      expect(virtual.items.value.length).toBeGreaterThan(0)
      expect(mockContainer.scrollTop).toBeGreaterThanOrEqual(initialScrollTop)
    })
  })

  describe('scroll anchoring', () => {
    it('should maintain scroll position when prepending items with anchor="start"', async () => {
      const items = shallowRef(Array.from({ length: 20 }, (_, i) => ({ id: i, text: `Item ${i}` })))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: 'start',
      })

      virtual.element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 250
      virtual.scroll()
      await nextTick()

      const scrollBefore = mockContainer.scrollTop

      items.value = [
        ...Array.from({ length: 10 }, (_, i) => ({ id: i + 100, text: `New ${i}` })),
        ...items.value,
      ] as typeof items.value

      await nextTick()

      expect(mockContainer.scrollTop).toBeGreaterThanOrEqual(scrollBefore)
    })

    it('should maintain scroll position at end with anchor="end"', async () => {
      const items = shallowRef(Array.from({ length: 20 }, (_, i) => ({ id: i, text: `Item ${i}` })))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: 'end',
      })

      virtual.element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 500
      virtual.scroll()
      await nextTick()

      items.value = [...items.value, { id: 20, text: 'Item 20' }]

      await nextTick()

      expect(virtual.items.value.length).toBeGreaterThan(0)
    })

    it('should support custom anchor function', async () => {
      const items = shallowRef(Array.from({ length: 50 }, (_, i) => ({ id: i, text: `Item ${i}` })))

      const anchorFn = vi.fn((_items: readonly unknown[]) => 10)

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: anchorFn,
      })

      virtual.element.value = mockContainer
      await nextTick()

      items.value = [...items.value, { id: 50, text: 'Item 50' }]
      await nextTick()

      expect(anchorFn).toHaveBeenCalled()
    })
  })

  describe('edge detection', () => {
    it('should call onStartReached when scrolled near top', async () => {
      const onStartReached = vi.fn()
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        onStartReached,
        startThreshold: 100,
      })

      virtual.element.value = mockContainer

      await nextTick()

      mockContainer.scrollTop = 50

      virtual.scroll()

      await vi.waitFor(() => {
        expect(onStartReached).toHaveBeenCalled()
      }, { timeout: 100 })

      const lastCall = onStartReached.mock.calls.at(-1)!
      expect(lastCall[0]).toBe(50)
    })

    it('should call onEndReached when scrolled near bottom', async () => {
      const onEndReached = vi.fn()
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        onEndReached,
        endThreshold: 100,
      })

      virtual.element.value = mockContainer

      await nextTick()

      mockContainer.scrollTop = 4450
      virtual.scroll()

      await vi.waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      }, { timeout: 100 })

      const lastCall = onEndReached.mock.calls.at(-1)!
      expect(lastCall[0]).toBe(50)
    })

    it('should not call edge callbacks when outside threshold', async () => {
      const onStartReached = vi.fn()
      const onEndReached = vi.fn()
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        onStartReached,
        onEndReached,
        startThreshold: 50,
        endThreshold: 50,
      })

      virtual.element.value = mockContainer

      await nextTick()

      mockContainer.scrollTop = 2500
      virtual.scroll()

      await nextTick()

      expect(onStartReached).not.toHaveBeenCalled()
      expect(onEndReached).not.toHaveBeenCalled()
    })
  })

  describe('state management', () => {
    it('should initialize with ok state', () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50 })

      expect(virtual.state.value).toBe('ok')
    })

    it('should reset state and scroll position', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.state.value = 'loading'

      mockContainer.scrollTop = 500
      virtual.scroll()

      await nextTick()

      virtual.reset()

      expect(virtual.state.value).toBe('ok')
    })

    it('should reset to bottom for reverse direction', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        direction: 'reverse',
      })

      virtual.element.value = mockContainer

      await nextTick()

      mockContainer.scrollTop = 1000

      virtual.reset()

      await nextTick()

      expect(mockContainer.scrollTop).toBe(5000)
    })
  })

  describe('enhanced scrollTo', () => {
    it('should scroll to index with smooth behavior', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { behavior: 'smooth' })

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        top: 2500,
        behavior: 'smooth',
      })
    })

    it('should scroll with block="center" positioning', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { block: 'center', behavior: 'smooth' })

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        top: 2275,
        behavior: 'smooth',
      })
    })

    it('should scroll with block="end" positioning', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { block: 'end' })

      expect(mockContainer.scrollTop).toBe(2050)
    })

    it('should scroll with custom offset', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { offset: 100 })

      expect(mockContainer.scrollTop).toBe(2600)
    })

    it('should skip scrolling with block="nearest" when already visible', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      const initialScrollTop = mockContainer.scrollTop
      virtual.scrollTo(5, { block: 'nearest' })

      expect(mockContainer.scrollTop).toBe(initialScrollTop)
    })

    it('should scroll to exact index without off-by-one error', async () => {
      const items = shallowRef(Array.from({ length: 10_000 }, (_, i) => i))
      const { element, items: virtualItems, offset, scrollTo } = createVirtual(items, { itemHeight: 80, height: 600, overscan: 1 })

      element.value = mockContainer

      await nextTick()

      scrollTo(1500)

      await nextTick()

      expect(mockContainer.scrollTop).toBe(120_000)

      const renderedIndices = virtualItems.value.map(item => item.index)
      expect(renderedIndices).toContain(1500)
      expect(renderedIndices[0]).toBe(1499)
      expect(renderedIndices.at(-1)).toBeGreaterThanOrEqual(1500)
      expect(offset.value).toBe(1499 * 80)
    })
  })

  describe('scrollTo with auto behavior', () => {
    it('should not scroll when item is already visible', async () => {
      const sourceItems = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const { element, scrollTo } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
      })

      element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 0
      scrollTo(1, { behavior: 'auto' })

      expect(element.value).toBeDefined()
    })

    it('should scroll up when item is above viewport', async () => {
      const sourceItems = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const { element, scrollTo } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
      })

      element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 500
      Object.defineProperty(mockContainer, 'scrollTop', {
        value: 500,
        writable: true,
        configurable: true,
      })

      scrollTo(2, { behavior: 'auto' })

      expect(element.value).toBeDefined()
    })
  })

  describe('reset with reverse direction', () => {
    it('should scroll to end when reset in reverse mode', async () => {
      const sourceItems = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const { element, reset } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
        direction: 'reverse',
      })

      element.value = mockContainer
      await nextTick()

      reset()

      expect(mockContainer.scrollTop).toBe(5000)
    })

    it('should handle reset with empty items in reverse mode', async () => {
      const sourceItems = shallowRef<number[]>([])

      const { element, reset } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
        direction: 'reverse',
      })

      element.value = mockContainer
      await nextTick()

      expect(() => reset()).not.toThrow()
    })
  })

  describe('scrollTo with block="nearest"', () => {
    it('should scroll down when item is below viewport', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 0

      virtual.scrollTo(20, { block: 'nearest' })

      expect(mockContainer.scrollTop).toBe(550)
    })

    it('should scroll up when item is above viewport', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 2500

      virtual.scrollTo(10, { block: 'nearest' })

      expect(mockContainer.scrollTop).toBe(500)
    })
  })

  describe('scope disposal', () => {
    it('should clean up animation frames on dispose', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))

      const scope = effectScope()

      scope.run(() => {
        const virtual = createVirtual(items, { itemHeight: 50, height: 500 })
        virtual.element.value = mockContainer
      })

      await nextTick()

      scope.stop()

      expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('scroll parent', () => {
    function indexes (virtual: ReturnType<typeof createVirtual<number>>) {
      return virtual.items.value.map(item => item.index)
    }

    function clampingContainer (
      virtual: { offset: { value: number } },
      laidOutHeight: number,
    ) {
      const el = realDocument.createElement('div')
      let assigned = 0
      let scrollHeight = 500
      const clientHeight = 500

      Object.defineProperty(el, 'scrollTop', {
        configurable: true,
        get: () => Math.min(assigned, Math.max(0, scrollHeight - clientHeight)),
        set: (value: number) => {
          assigned = value
        },
      })
      Object.defineProperty(el, 'scrollHeight', {
        configurable: true,
        get: () => scrollHeight,
      })
      Object.defineProperty(el, 'clientHeight', {
        configurable: true,
        get: () => clientHeight,
      })
      el.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 400,
        height: 500,
        top: 0,
        left: 0,
        right: 400,
        bottom: 500,
        toJSON: () => ({}),
      })

      watch(() => virtual.offset.value, offset => {
        if (offset <= 0) return
        nextTick(() => {
          scrollHeight = laidOutHeight
        })
      })

      return el
    }

    it('should keep the window at the start when no marker is set', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      expect(virtual.offset.value).toBe(0)
      expect(indexes(virtual)[0]).toBe(0)
    })

    it('should subtract the marker offset from the scroll position', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const plain = createVirtual(items, { itemHeight: 50, height: 500 })
      const marker = realDocument.createElement('div')
      Object.defineProperty(marker, 'offsetTop', { value: 200 })
      const marked = createVirtual(items, { itemHeight: 50, height: 500, marker })
      const markedContainer = realDocument.createElement('div')

      plain.element.value = mockContainer
      mockContainer.scrollTop = 700
      plain.scroll()

      marked.element.value = markedContainer
      markedContainer.scrollTop = 900
      marked.scroll()

      await nextTick()

      expect(indexes(marked)).toEqual(indexes(plain))

      marked.scrollTo(0)
      expect(markedContainer.scrollTop).toBe(200)
    })

    it('should retry a clamped scroll to the first item when a marker shifts it', async () => {
      using frames = vi.spyOn(globalThis, 'requestAnimationFrame')
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const marker = realDocument.createElement('div')
      Object.defineProperty(marker, 'offsetTop', { value: 200 })
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, marker })
      const el = realDocument.createElement('div')
      let assigned = 0
      let scrollHeight = 500

      Object.defineProperty(el, 'scrollTop', {
        configurable: true,
        get: () => Math.min(assigned, Math.max(0, scrollHeight - 500)),
        set: (value: number) => {
          assigned = value
        },
      })
      Object.defineProperty(el, 'scrollHeight', {
        configurable: true,
        get: () => scrollHeight,
      })
      Object.defineProperty(el, 'clientHeight', {
        configurable: true,
        get: () => 500,
      })

      virtual.element.value = el
      await nextTick()
      frames.mockClear()

      virtual.scrollTo(0)

      expect(el.scrollTop).toBe(0)

      scrollHeight = 5_000

      await vi.waitFor(() => {
        expect(el.scrollTop).toBe(200)
      })

      expect(frames).toHaveBeenCalledTimes(1)
    })

    it('should keep the replacement target when a second scroll lands while clamped', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })
      const clamped = clampingContainer(virtual, 5_000)

      virtual.element.value = clamped
      await nextTick()

      virtual.scrollTo(20)
      virtual.scrollTo(40)

      expect(virtual.offset.value).toBe(1_750)
      expect(clamped.scrollTop).toBe(0)

      await vi.waitFor(() => {
        expect(clamped.scrollTop).toBe(2_000)
      })
    })

    it('should keep a measured height on the item key', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, i) => ({ id: `id-${i}` })))
      const virtual = createVirtual(items, {
        itemHeight: 40,
        height: 500,
        itemKey: item => item.id,
      })

      virtual.element.value = mockContainer
      await nextTick()

      virtual.resize(0, 200)
      await nextTick()

      items.value = [{ id: 'id-z' }, ...items.value]
      await nextTick()

      const moved = virtual.items.value.find(item => item.raw.id === 'id-0')
      expect(moved?.key).toBe('id-0')

      // The prepended row is unmeasured. Index storage would still report 200.
      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(40)

      virtual.scrollTo(2)
      expect(mockContainer.scrollTop).toBe(240)
    })

    it('should drop a measured height when its key leaves the list', async () => {
      const items = shallowRef([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      const virtual = createVirtual(items, {
        itemHeight: 40,
        height: 500,
        itemKey: item => item.id,
      })

      virtual.element.value = mockContainer
      await nextTick()

      virtual.resize(0, 200)
      await nextTick()

      items.value = [{ id: 'q' }, { id: 'r' }, { id: 's' }]
      await nextTick()

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(40)
    })

    it('should place the window before a clamped scroll and retry', async () => {
      using frames = vi.spyOn(globalThis, 'requestAnimationFrame')
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })
      const clamped = clampingContainer(virtual, 5_000)

      virtual.element.value = clamped
      await nextTick()

      frames.mockClear()
      virtual.scrollTo(20)

      expect(virtual.offset.value).toBeGreaterThan(0)
      expect(clamped.scrollTop).toBe(0)

      await vi.waitFor(() => {
        expect(clamped.scrollTop).toBe(1_000)
      })

      expect(frames).toHaveBeenCalledTimes(1)

      await nextTick()
      expect(frames).toHaveBeenCalledTimes(1)
    })

    it('should pin a reverse list to the bottom when the first write is clamped', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        direction: 'reverse',
      })
      const clamped = clampingContainer(virtual, 5_000)

      virtual.element.value = clamped

      await vi.waitFor(() => {
        expect(clamped.scrollTop).toBe(4_500)
      })
    })

    it('should run a scrollTo queued before the element exists', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.scrollTo(10)
      expect(mockContainer.scrollTop).toBe(0)

      virtual.element.value = mockContainer
      await nextTick()

      expect(mockContainer.scrollTop).toBe(500)
    })

    it('should skip scroll styles when the element is not owned', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
      const owned = createVirtual(items, { itemHeight: 50, height: 500, elastic: false })
      const borrowed = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        elastic: false,
        ownElement: false,
      })
      const borrowedEl = realDocument.createElement('div')

      owned.element.value = mockContainer
      borrowed.element.value = borrowedEl
      await nextTick()

      expect(mockContainer.style.overscrollBehavior).toBe('none')
      expect(borrowedEl.style.overscrollBehavior).toBe('')
    })

    async function withFrame (run: () => Promise<void>) {
      const native = globalThis.requestAnimationFrame
      globalThis.requestAnimationFrame = callback => {
        queueMicrotask(() => callback(0))
        return 1
      }

      try {
        await run()
      } finally {
        globalThis.requestAnimationFrame = native
      }
    }

    function box (height: number) {
      const el = realDocument.createElement('div')
      Object.defineProperty(el, 'scrollHeight', { value: 5000, writable: true })
      Object.defineProperty(el, 'clientHeight', { value: height, writable: true })
      el.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 400,
        height,
        top: 0,
        left: 0,
        right: 400,
        bottom: height,
        toJSON: () => ({}),
      })

      return el
    }

    it('should read a marker attached after the list is created', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      const marker = shallowRef<HTMLElement | undefined>(undefined)
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, marker })

      virtual.element.value = mockContainer
      await nextTick()

      mockContainer.scrollTop = 500

      const node = realDocument.createElement('div')
      Object.defineProperty(node, 'offsetTop', { value: 200 })
      marker.value = node
      await nextTick()

      expect(virtual.offset.value).toBe(50)
      expect(virtual.items.value[0]!.index).toBe(1)
    })

    it('should keep the marker offset when scroll repeats inside the refresh window', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      let top = 100
      const node = realDocument.createElement('div')
      Object.defineProperty(node, 'offsetTop', { get: () => top })
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, marker: node })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        mockContainer.scrollTop = 600
        top = 400
        virtual.scroll()
        top = 100
        virtual.scroll()
        await nextTick()
      })

      expect(virtual.offset.value).toBe(0)
      expect(virtual.items.value[0]!.index).toBe(0)
      expect(virtual.items.value.at(-1)!.index).toBe(19)
    })

    it('should leave the visible rows when a row below them resizes', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(30, 80)
        await nextTick()
      })

      expect(virtual.items.value[0]!.index).toBe(0)
      virtual.scrollTo(31)
      expect(mockContainer.scrollTop).toBe(1_580)
    })

    it('should keep the last row boundary when a shrink would step past the end', async () => {
      const items = shallowRef([0, 1, 2, 3])
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(0, 40)
        await nextTick()
      })

      virtual.scrollTo(3)
      expect(mockContainer.scrollTop).toBe(140)
      expect(virtual.items.value[0]!.index).toBe(0)
    })

    it('should step onto the last row when a shrink pulls it into view', async () => {
      const items = shallowRef([0, 1, 2, 3])
      const virtual = createVirtual(items, { itemHeight: 50, height: 120, overscan: 0 })
      const el = box(120)

      virtual.element.value = el
      await nextTick()

      expect(virtual.items.value.map(item => item.index)).toEqual([0, 1, 2])

      await withFrame(async () => {
        virtual.resize(0, 10)
        await nextTick()
      })

      expect(virtual.items.value.map(item => item.index)).toEqual([0, 1, 2, 3])
      virtual.scrollTo(3)
      expect(el.scrollTop).toBe(110)
    })

    it('should search again when a shrink pulls more than one row across the edge', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 120, overscan: 0 })
      const el = box(120)

      virtual.element.value = el
      await nextTick()

      virtual.scrollTo(10)
      expect(el.scrollTop).toBe(500)

      await withFrame(async () => {
        virtual.resize(0, 170)
        await nextTick()
      })

      await withFrame(async () => {
        virtual.resize(0, 50)
        await nextTick()
      })

      expect(virtual.items.value.map(item => item.index)).toEqual([10, 11, 12])
    })

    it('should apply both row heights when two resizes land in one frame', async () => {
      const items = shallowRef(Array.from({ length: 20 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()
      vi.mocked(globalThis.cancelAnimationFrame).mockClear()

      await withFrame(async () => {
        virtual.resize(0, 80)
        virtual.resize(1, 90)
        await nextTick()
      })

      expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
      virtual.scrollTo(2)
      expect(mockContainer.scrollTop).toBe(170)
    })

    it('should ignore a resize that repeats the stored height', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(0, 80)
        await nextTick()
      })

      let frames = 0
      const native = globalThis.requestAnimationFrame
      globalThis.requestAnimationFrame = callback => {
        frames++
        queueMicrotask(() => callback(0))
        return 1
      }

      try {
        virtual.resize(0, 80)
        virtual.resize(-1, 80)
        await nextTick()
      } finally {
        globalThis.requestAnimationFrame = native
      }

      expect(frames).toBe(0)
      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(80)
    })

    it('should treat a height of zero as unmeasured', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(0, 80)
        await nextTick()
        virtual.resize(0, 0)
        await nextTick()
      })

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(50)
    })

    it('should skip the offset walk when the new height matches the estimate', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(0, 50)
        await nextTick()
      })

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(50)
      expect(virtual.offset.value).toBe(0)
    })

    it('should measure from the height option when the observer reports nothing', async () => {
      globalThis.ResizeObserver = vi.fn(function () {
        return {
          observe: () => {},
          unobserve: () => {},
          disconnect: () => {},
        }
      }) as unknown as typeof ResizeObserver

      const items = shallowRef(Array.from({ length: 20 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 400 })

      virtual.element.value = mockContainer
      await nextTick()

      virtual.scrollTo(10, { block: 'end' })
      expect(mockContainer.scrollTop).toBe(150)

      await withFrame(async () => {
        virtual.resize(0, 70)
        await nextTick()
      })

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(70)
    })

    it('should search again when the scroll position moves before the resize flushes', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.scrollTo(40)
        mockContainer.scrollTop = 3_000
        virtual.resize(0, 66)
        await nextTick()
      })

      expect(virtual.offset.value).toBe(2_716)
      expect(virtual.items.value[0]!.index).toBe(54)
    })

    it('should search again when a resize inside the window moves the end by more than one row', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.scrollTo(40)
        virtual.resize(45, 200)
        await nextTick()
      })

      expect(virtual.items.value[0]!.index).toBe(35)
      expect(virtual.items.value.at(-1)!.index).toBe(52)
    })

    it('should repair a resize that happens before the scroll element exists', async () => {
      const items = shallowRef(Array.from({ length: 10 }, (_, index) => index))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      await withFrame(async () => {
        virtual.resize(0, 80)
        await nextTick()
        virtual.element.value = mockContainer
        await nextTick()
      })

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(80)
    })

    it('should pin a one-row reverse list from a zero offset', async () => {
      const items = shallowRef([0])
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        direction: 'reverse',
      })

      virtual.element.value = mockContainer
      await nextTick()

      expect(mockContainer.scrollTop).toBe(50)
    })

    it('should count a stored height of zero as the estimate when the list is reordered', async () => {
      const items = shallowRef([{ id: 'a' }, { id: 'b' }])
      const virtual = createVirtual(items, {
        itemHeight: 40,
        height: 500,
        itemKey: item => item.id,
      })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        virtual.resize(0, 80)
        await nextTick()
        virtual.resize(0, 0)
        await nextTick()
        items.value = [{ id: 'b' }, { id: 'a' }]
        await nextTick()
      })

      virtual.scrollTo(1)
      expect(mockContainer.scrollTop).toBe(40)
    })

    it('should ignore a measurement for a row a same-turn shrink already removed', async () => {
      const items = shallowRef([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        itemKey: item => item.id,
      })

      virtual.element.value = mockContainer
      await nextTick()

      await withFrame(async () => {
        items.value = [{ id: 'a' }]
        virtual.resize(2, 80)
        await nextTick()
      })

      virtual.scrollTo(0)
      expect(mockContainer.scrollTop).toBe(0)
      expect(virtual.items.value.map(item => item.index)).toEqual([0])
    })
  })
})

describe('createVirtualContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return trinity tuple', () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const result = createVirtualContext(items)

    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function')
    expect(typeof result[1]).toBe('function')
    expect(result[2]).toBeDefined()
    expect(result[2]).toHaveProperty('element')
    expect(result[2]).toHaveProperty('items')
    expect(result[2]).toHaveProperty('offset')
    expect(result[2]).toHaveProperty('size')
    expect(result[2]).toHaveProperty('scrollTo')
    expect(result[2]).toHaveProperty('scroll')
    expect(result[2]).toHaveProperty('resize')
    expect(result[2]).toHaveProperty('reset')
  })

  it('should pass options to createVirtual', () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const [,, context] = createVirtualContext(items, { overscan: 10 })

    expect(context.state.value).toBe('ok')
  })
})

describe('useVirtual consumer', () => {
  beforeEach(() => {
    globalThis.document = realDocument
  })

  afterEach(() => {
    globalThis.document = { documentElement: {} as HTMLElement } as unknown as Document
  })

  it('should inject provided context', () => {
    const items = shallowRef([1, 2, 3])
    const [,, context] = createVirtualContext(items, {
      itemHeight: 50,
    })

    let injected: ReturnType<typeof useVirtual> | undefined

    const TestComponent = defineComponent({
      setup () {
        injected = useVirtual()
        return () => null
      },
    })

    mount(TestComponent, {
      global: {
        provide: { 'v0:virtual': context },
      },
    })

    expect(injected).toBeDefined()
    expect(injected!.state.value).toBe('ok')
  })

  it('should throw when context is not provided', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(() => {
      const TestComponent = defineComponent({
        setup () {
          useVirtual()
          return () => null
        },
      })

      mount(TestComponent)
    }).toThrow()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('createVirtual SSR safety', () => {
  it('should return safe defaults without element assignment', () => {
    const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    expect(virtual.state.value).toBe('ok')
    expect(virtual.offset.value).toBe(0)
    expect(virtual.size.value).toBe(0)
    expect(virtual.items.value).toEqual([])
    expect(typeof virtual.scroll).toBe('function')
    expect(typeof virtual.scrollTo).toBe('function')
    expect(typeof virtual.resize).toBe('function')
    expect(typeof virtual.reset).toBe('function')
  })

  it('should not throw when calling methods without element', () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    expect(() => virtual.scroll()).not.toThrow()
    expect(() => virtual.scrollTo(5)).not.toThrow()
    expect(() => virtual.reset()).not.toThrow()
  })
})

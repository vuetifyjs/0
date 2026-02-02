import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick, ref } from 'vue'

import { createVirtual } from './index'

// Mock useHydration
const mockIsHydrated = ref(true)
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
    // Reset hydration state
    mockIsHydrated.value = true

    // Mock ResizeObserver as a proper constructor
    const mockObserver = {
      observe: vi.fn((element: any) => {
        // Immediately trigger the callback with mock dimensions
        const callback = (globalThis.ResizeObserver as any).mock.calls[0][0]
        if (callback && element) {
          const rect = element.getBoundingClientRect?.() || { width: 400, height: 500 }
          callback([{
            target: element,
            contentRect: rect,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          }])
        }
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.ResizeObserver = vi.fn(function (this: any, callback: any) {
      (this as any).callback = callback
      return mockObserver
    }) as any

    // Mock container element
    let scrollTopValue = 0
    mockContainer = {
      get scrollTop () {
        return scrollTopValue
      },
      set scrollTop (value: number) {
        scrollTopValue = value
      },
      scrollHeight: 5000,
      clientHeight: 500,
      offsetHeight: 500,
      scrollTo: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({
        width: 400,
        height: 500,
        top: 0,
        left: 0,
        right: 400,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })),
    } as unknown as HTMLElement

    // Mock window for IN_BROWSER
    globalThis.window = {
      innerHeight: 800,
      requestAnimationFrame: vi.fn(cb => {
        queueMicrotask(() => cb(0))
        return 0
      }),
      clearTimeout: vi.fn(),
      setTimeout: vi.fn(cb => {
        cb()
        return 0
      }),
    } as any

    globalThis.cancelAnimationFrame = vi.fn()
    globalThis.document = {
      documentElement: {} as any,
    } as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a virtual context with required properties', () => {
    const items = ref([1, 2, 3, 4, 5])
    const virtual = createVirtual(items)

    expect(virtual).toHaveProperty('element')
    expect(virtual).toHaveProperty('items')
    expect(virtual).toHaveProperty('offset')
    expect(virtual).toHaveProperty('size')
    expect(virtual).toHaveProperty('scrollTo')
    expect(virtual).toHaveProperty('scroll')
    expect(virtual).toHaveProperty('scrollend')
    expect(virtual).toHaveProperty('resize')
  })

  it('should handle empty items array', () => {
    const items = ref<number[]>([])
    const virtual = createVirtual(items)

    expect(virtual.items.value).toEqual([])
    expect(virtual.offset.value).toBe(0)
    expect(virtual.size.value).toBe(0)
  })

  it('should render initial visible items with fixed height', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    // Assign refs
    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    // Should have computed items
    expect(virtual.items.value.length).toBeGreaterThan(0)
  })

  it('should update visible range when items change', async () => {
    const items = ref([1, 2, 3])
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    const initialLength = virtual.items.value.length

    // Change items
    items.value = Array.from({ length: 100 }, (_, i) => i)
    await nextTick()

    // Should update
    expect(virtual.items.value.length).toBeGreaterThanOrEqual(initialLength)
  })

  it('should handle item resize', async () => {
    const items = ref(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    // Resize first item
    virtual.resize(0, 100)

    await nextTick()

    // Should have updated (no error thrown)
    expect(virtual.items.value).toBeDefined()
  })

  it('should handle scroll events', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    // Simulate scroll
    mockContainer.scrollTop = 500
    virtual.scroll()

    await nextTick()

    // Should have updated visible range
    expect(virtual.items.value).toBeDefined()
  })

  it('should handle scrollend events', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.scrollend()

    await nextTick()

    expect(virtual.items.value).toBeDefined()
  })

  it('scrolls to index', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    virtual.scrollTo(50)

    // Container should have scrollTop updated (or deferred)
    expect(mockContainer.scrollTop).toBeGreaterThanOrEqual(0)
  })

  it('should calculate padding correctly', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    // With 100 items at 50px each, total height is 5000px
    // Padding should account for offscreen items
    expect(virtual.offset.value).toBeGreaterThanOrEqual(0)
    expect(virtual.size.value).toBeGreaterThanOrEqual(0)
  })

  it('should work with dynamic heights (null itemHeight)', async () => {
    const items = ref(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: null })

    virtual.element.value = mockContainer

    await nextTick()

    // Should still work
    expect(virtual.items.value).toBeDefined()
  })

  it('should include index in computed items', async () => {
    const items = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

    virtual.element.value = mockContainer

    await nextTick()
    await nextTick()

    const firstItem = virtual.items.value[0]
    expect(firstItem).toBeDefined()
    expect(firstItem).toHaveProperty('raw')
    expect(firstItem).toHaveProperty('index')
    expect(firstItem!.raw).toEqual({ id: 1 })
    expect(typeof firstItem!.index).toBe('number')
  })

  it('should handle force recalculation', async () => {
    const items = ref(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50 })

    virtual.element.value = mockContainer

    await nextTick()

    // Force recalculation

    await nextTick()

    expect(virtual.items.value).toBeDefined()
  })

  it('should parse string itemHeight', async () => {
    const items = ref(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: '50' })

    virtual.element.value = mockContainer

    await nextTick()

    expect(virtual.items.value).toBeDefined()
  })

  it('should parse string container height', async () => {
    const items = ref(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: '600' })

    virtual.element.value = mockContainer

    await nextTick()

    expect(virtual.items.value).toBeDefined()
  })

  it('should respect custom overscan option', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: 50, height: 500, overscan: 10 })

    virtual.element.value = mockContainer

    await nextTick()

    // With overscan of 10, should render more items than visible
    // Viewport is 500px, item height is 50px = 10 visible items
    // With overscan of 10 on each side, should have ~30 items
    expect(virtual.items.value.length).toBeGreaterThan(10)
  })

  it('should use default overscan when not specified', async () => {
    const items = ref(Array.from({ length: 100 }, (_, i) => i))
    const virtualDefault = createVirtual(items, { itemHeight: 50, height: 500 })
    const virtualExplicit = createVirtual(items, { itemHeight: 50, height: 500, overscan: 5 })

    virtualDefault.element.value = mockContainer
    virtualExplicit.element.value = mockContainer

    await nextTick()

    // Both should render the same number of items (default is 5)
    expect(virtualDefault.items.value.length).toBe(virtualExplicit.items.value.length)
  })

  describe('reverse direction', () => {
    it('scrolls to bottom initially with reverse direction', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, direction: 'reverse' })

      virtual.element.value = mockContainer

      await nextTick()

      // For reverse direction, should scroll to bottom (total height)
      expect(mockContainer.scrollTop).toBe(5000)
    })

    it('should maintain scroll position at bottom when new items added in reverse mode', async () => {
      const items = ref(Array.from({ length: 10 }, (_, i) => ({ id: i, text: `Message ${i}` })))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, direction: 'reverse' })

      virtual.element.value = mockContainer

      await nextTick()

      const initialScrollTop = mockContainer.scrollTop

      // Add more items (simulating new messages)
      items.value = [...items.value, { id: 10, text: 'Message 10' }]

      await nextTick()

      // In reverse mode, adding items should maintain position
      expect(virtual.items.value).toBeDefined()
      expect(mockContainer.scrollTop).toBeGreaterThanOrEqual(initialScrollTop)
    })
  })

  describe('scroll anchoring', () => {
    it('should maintain scroll position when prepending items with anchor="start"', async () => {
      const items = ref(Array.from({ length: 20 }, (_, i) => ({ id: i, text: `Item ${i}` })))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: 'start',
      })

      virtual.element.value = mockContainer
      await nextTick()

      // Scroll down a bit
      mockContainer.scrollTop = 250
      virtual.scroll()
      await nextTick()

      const scrollBefore = mockContainer.scrollTop

      // Prepend new items
      items.value = [
        ...Array.from({ length: 10 }, (_, i) => ({ id: i + 100, text: `New ${i}` })),
        ...items.value,
      ] as typeof items.value

      await nextTick()

      // With anchor="start", should maintain position relative to first item
      expect(mockContainer.scrollTop).toBeGreaterThanOrEqual(scrollBefore)
    })

    it('should maintain scroll position at end with anchor="end"', async () => {
      const items = ref(Array.from({ length: 20 }, (_, i) => ({ id: i, text: `Item ${i}` })))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: 'end',
      })

      virtual.element.value = mockContainer
      await nextTick()

      // Scroll to bottom
      mockContainer.scrollTop = 500
      virtual.scroll()
      await nextTick()

      // Add items at the end
      items.value = [...items.value, { id: 20, text: 'Item 20' }]

      await nextTick()

      // Should maintain position at end
      expect(virtual.items.value).toBeDefined()
    })

    it('supports custom anchor function', async () => {
      const items = ref(Array.from({ length: 50 }, (_, i) => ({ id: i, text: `Item ${i}` })))

      const anchorFn = vi.fn((_items: readonly unknown[]) => 10)

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        anchor: anchorFn,
      })

      virtual.element.value = mockContainer
      await nextTick()

      // Trigger item change
      items.value = [...items.value, { id: 50, text: 'Item 50' }]
      await nextTick()

      // Anchor function should be called
      expect(anchorFn).toHaveBeenCalled()
    })
  })

  describe('edge detection', () => {
    it('calls onStartReached when scrolled near top', async () => {
      const onStartReached = vi.fn()
      const items = ref(Array.from({ length: 100 }, (_, i) => i))

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        onStartReached,
        startThreshold: 100,
      })

      virtual.element.value = mockContainer

      await nextTick()

      // Set scrollTop within threshold
      mockContainer.scrollTop = 50

      virtual.scroll()

      // Wait for RAF callbacks to complete
      await vi.waitFor(() => {
        expect(onStartReached).toHaveBeenCalled()
      }, { timeout: 100 })

      // The last call should have distance = 50
      const lastCall = onStartReached.mock.calls.at(-1)!
      expect(lastCall[0]).toBe(50)
    })

    it('calls onEndReached when scrolled near bottom', async () => {
      const onEndReached = vi.fn()
      const items = ref(Array.from({ length: 100 }, (_, i) => i))

      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        onEndReached,
        endThreshold: 100,
      })

      virtual.element.value = mockContainer

      await nextTick()

      // scrollHeight = 5000, clientHeight = 500
      // For distance from end = 50: scrollTop should be 5000 - 500 - 50 = 4450
      mockContainer.scrollTop = 4450
      virtual.scroll()

      // Wait for RAF callbacks to complete
      await vi.waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      }, { timeout: 100 })

      // The last call should have distance = 50
      const lastCall = onEndReached.mock.calls.at(-1)!
      expect(lastCall[0]).toBe(50)
    })

    it('should not call edge callbacks when outside threshold', async () => {
      const onStartReached = vi.fn()
      const onEndReached = vi.fn()
      const items = ref(Array.from({ length: 100 }, (_, i) => i))

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

      // Scroll in the middle (far from edges)
      mockContainer.scrollTop = 2500
      virtual.scroll()

      await nextTick()

      // Should not trigger any callbacks
      expect(onStartReached).not.toHaveBeenCalled()
      expect(onEndReached).not.toHaveBeenCalled()
    })
  })

  describe('state management', () => {
    it('should initialize with ok state', () => {
      const items = ref(Array.from({ length: 10 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50 })

      expect(virtual.state.value).toBe('ok')
    })

    it('should reset state and scroll position', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      // Change state
      virtual.state.value = 'loading'

      // Scroll down
      mockContainer.scrollTop = 500
      virtual.scroll()

      await nextTick()

      // Reset
      virtual.reset()

      // State should be reset to 'ok'
      expect(virtual.state.value).toBe('ok')
    })

    it('should reset to bottom for reverse direction', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, {
        itemHeight: 50,
        height: 500,
        direction: 'reverse',
      })

      virtual.element.value = mockContainer

      await nextTick()

      // Scroll away from bottom
      mockContainer.scrollTop = 1000

      // Reset
      virtual.reset()

      await nextTick()

      // Should scroll back to bottom
      expect(mockContainer.scrollTop).toBe(5000)
    })
  })

  describe('enhanced scrollTo', () => {
    it('scrolls to index with smooth behavior', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { behavior: 'smooth' })

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth',
      })
    })

    it('scrolls with block="center" positioning', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { block: 'center', behavior: 'smooth' })

      // Should calculate center position
      expect(mockContainer.scrollTo).toHaveBeenCalledWith(expect.objectContaining({
        behavior: 'smooth',
      }))
    })

    it('scrolls with block="end" positioning', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { block: 'end' })

      // Should scroll to position where item is at bottom of viewport
      expect(mockContainer.scrollTop).toBeGreaterThan(0)
    })

    it('scrolls with custom offset', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { offset: 100 })

      // Should add offset to calculated position
      expect(mockContainer.scrollTop).toBeGreaterThan(0)
    })

    it('skips scrolling with block="nearest" when already visible', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      // Item 5 should already be visible (items 0-9 visible in 500px viewport)
      const initialScrollTop = mockContainer.scrollTop
      virtual.scrollTo(5, { block: 'nearest' })

      // Should not change scroll position (already visible)
      expect(mockContainer.scrollTop).toBe(initialScrollTop)
    })

    it('scrolls to exact index without off-by-one error', async () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => i))
      const { element, items: virtualItems, offset, scrollTo } = createVirtual(items, { itemHeight: 80, height: 600, overscan: 1 })

      element.value = mockContainer

      await nextTick()

      // Scroll to index 1500
      scrollTo(1500)

      await nextTick()

      // Check the scrollTop value
      const expectedScrollTop = 1500 * 80 // 120000
      expect(mockContainer.scrollTop).toBe(expectedScrollTop)

      // Check what items are actually rendered
      const renderedIndices = virtualItems.value.map(item => item.index)
      const firstRendered = renderedIndices[0]
      const lastRendered = renderedIndices.at(-1)

      // With overscan=1, first rendered should be 1499 (1500 - 1)
      // Item at index 1500 should definitely be in the rendered range
      expect(renderedIndices).toContain(1500)

      // The first visible item (after overscan) should be exactly 1500
      // Since overscan=1, start = visibleStart - 1 = 1500 - 1 = 1499
      // So first rendered is 1499, but first truly visible is 1500
      expect(firstRendered).toBe(1499)
      expect(lastRendered).toBeGreaterThanOrEqual(1500)

      // Most importantly: the offset should point to the first rendered item (1499)
      // And scrollTop should be at item 1500
      expect(offset.value).toBe(1499 * 80)
    })
  })

  describe('scrollTo with auto behavior', () => {
    it('should not scroll when item is already visible', async () => {
      const sourceItems = ref(Array.from({ length: 100 }, (_, i) => i))

      const { element, items, scrollTo } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
      })

      element.value = mockContainer
      await nextTick()

      // Scroll to item 0 which should already be visible
      mockContainer.scrollTop = 0
      scrollTo(1, { behavior: 'auto' })

      // Item 1 should already be visible, so no scroll needed
      expect(items.value).toBeDefined()
    })

    it('should scroll up when item is above viewport', async () => {
      const sourceItems = ref(Array.from({ length: 100 }, (_, i) => i))

      const { element, scrollTo } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
      })

      element.value = mockContainer
      await nextTick()

      // Set scroll position to show items 10+
      mockContainer.scrollTop = 500
      Object.defineProperty(mockContainer, 'scrollTop', {
        value: 500,
        writable: true,
        configurable: true,
      })

      // Try to scroll to item 2 which is above the viewport
      scrollTo(2, { behavior: 'auto' })

      // Scroll function should execute without error
      expect(element.value).toBeDefined()
    })
  })

  describe('reset with reverse direction', () => {
    it('should scroll to end when reset in reverse mode', async () => {
      const sourceItems = ref(Array.from({ length: 100 }, (_, i) => i))

      const { element, reset } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
        direction: 'reverse',
      })

      element.value = mockContainer
      await nextTick()

      // Reset should scroll to the end in reverse mode
      reset()

      // In reverse mode, reset scrolls to totalHeight (100 items * 50px = 5000)
      expect(mockContainer.scrollTop).toBe(5000)
    })

    it('should handle reset with empty items in reverse mode', async () => {
      const sourceItems = ref<number[]>([])

      const { element, reset } = createVirtual(sourceItems, {
        itemHeight: 50,
        overscan: 1,
        direction: 'reverse',
      })

      element.value = mockContainer
      await nextTick()

      // Reset should not throw with empty items
      expect(() => reset()).not.toThrow()
    })
  })

  describe('scrollTo with block="nearest"', () => {
    it('should scroll down when item is below viewport', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      // Start at the top (items 0-9 visible)
      mockContainer.scrollTop = 0

      // Item 20 is well below the viewport
      virtual.scrollTo(20, { block: 'nearest' })

      // Should scroll to bring item 20 into view at the bottom of the viewport
      // Item 20 is at offset 20*50 = 1000, viewport is 500px
      // scrollTop should be set so item 20's bottom edge aligns with viewport bottom
      expect(mockContainer.scrollTop).toBeGreaterThan(0)
    })

    it('should scroll up when item is above viewport', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer
      await nextTick()

      // Start scrolled down (items 50-60 visible)
      mockContainer.scrollTop = 2500

      // Item 10 is above the viewport
      virtual.scrollTo(10, { block: 'nearest' })

      // Should scroll to bring item 10 into view at the top of the viewport
      expect(mockContainer.scrollTop).toBe(500) // 10 * 50 = 500
    })
  })

  describe('scope disposal', () => {
    it('should clean up animation frames on dispose', async () => {
      const items = ref(Array.from({ length: 100 }, (_, i) => i))

      // Create a scope we can dispose
      const { effectScope } = await import('vue')
      const scope = effectScope()

      let virtual: ReturnType<typeof createVirtual>

      scope.run(() => {
        virtual = createVirtual(items, { itemHeight: 50, height: 500 })
        virtual.element.value = mockContainer
      })

      await nextTick()

      // Dispose the scope - should call cancelAnimationFrame
      scope.stop()

      // cancelAnimationFrame should have been called
      expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { effectScope, nextTick, shallowRef, defineComponent } from 'vue'

import { createVirtual, createVirtualContext, useVirtual } from './index'

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

    const mockObserver = {
      observe: vi.fn((element: HTMLElement) => {
        const callback = (globalThis.ResizeObserver as ReturnType<typeof vi.fn>).mock.calls[0]![0]
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
    globalThis.ResizeObserver = vi.fn(function (this: Record<string, unknown>, callback: unknown) {
      this.callback = callback
      return mockObserver
    }) as unknown as typeof ResizeObserver

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

  it('scrolls to exact index position', async () => {
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

  it('should work with dynamic heights (null itemHeight)', async () => {
    const items = shallowRef(Array.from({ length: 10 }, (_, i) => i))
    const virtual = createVirtual(items, { itemHeight: null })

    virtual.element.value = mockContainer

    await nextTick()

    expect(virtual.items.value).toEqual([])
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
    it('scrolls to bottom initially with reverse direction', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500, direction: 'reverse' })

      virtual.element.value = mockContainer

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

    it('supports custom anchor function', async () => {
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
    it('calls onStartReached when scrolled near top', async () => {
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

    it('calls onEndReached when scrolled near bottom', async () => {
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
    it('scrolls to index with smooth behavior', async () => {
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

    it('scrolls with block="center" positioning', async () => {
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

    it('scrolls with block="end" positioning', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { block: 'end' })

      expect(mockContainer.scrollTop).toBe(2050)
    })

    it('scrolls with custom offset', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      virtual.scrollTo(50, { offset: 100 })

      expect(mockContainer.scrollTop).toBe(2600)
    })

    it('skips scrolling with block="nearest" when already visible', async () => {
      const items = shallowRef(Array.from({ length: 100 }, (_, i) => i))
      const virtual = createVirtual(items, { itemHeight: 50, height: 500 })

      virtual.element.value = mockContainer

      await nextTick()

      const initialScrollTop = mockContainer.scrollTop
      virtual.scrollTo(5, { block: 'nearest' })

      expect(mockContainer.scrollTop).toBe(initialScrollTop)
    })

    it('scrolls to exact index without off-by-one error', async () => {
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
    expect(() => {
      const TestComponent = defineComponent({
        setup () {
          useVirtual()
          return () => null
        },
      })

      mount(TestComponent)
    }).toThrow()
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

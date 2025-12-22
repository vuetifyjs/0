// Utilities
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { nextTick, ref, shallowRef } from 'vue'
// Composables
import { createOverflow, createOverflowContext, useOverflow } from './index'

const mockIsHydrated = ref(true)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', () => ({
  SUPPORTS_OBSERVER: true,
}))

describe('createOverflow', () => {
  let mockObserver: { observe: ReturnType<typeof vi.fn>, disconnect: ReturnType<typeof vi.fn> }
  let resizeCallback: ((entries: Array<{ contentRect: { width: number, height: number } }>) => void) | null

  beforeEach(() => {
    resizeCallback = null
    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }

    globalThis.ResizeObserver = vi.fn(function (this: unknown, cb: (entries: Array<{ contentRect: { width: number, height: number } }>) => void) {
      resizeCallback = cb
      return mockObserver
    }) as unknown as typeof ResizeObserver

    vi.clearAllMocks()
  })

  it('should return correct interface', () => {
    const result = createOverflow()

    expect(result).toEqual({
      container: expect.any(Object),
      width: expect.any(Object),
      capacity: expect.any(Object),
      total: expect.any(Object),
      isOverflowing: expect.any(Object),
      measure: expect.any(Function),
      reset: expect.any(Function),
    })
  })

  it('should return Infinity capacity when width is 0 (SSR)', () => {
    const result = createOverflow()

    expect(result.capacity.value).toBe(Infinity)
  })

  it('should measure item widths', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    result.measure(2, el)

    expect(result.total.value).toBe(150)
  })

  it('should include gap in total calculation', async () => {
    const result = createOverflow({ gap: 10 })

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    result.measure(2, el)

    // 50 + (10 + 50) + (10 + 50) = 170
    expect(result.total.value).toBe(170)
  })

  it('should remove measurement when element is undefined', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    expect(result.total.value).toBe(100)

    result.measure(1, undefined)
    expect(result.total.value).toBe(50)
  })

  it('should reset all measurements', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    expect(result.total.value).toBe(100)

    result.reset()
    expect(result.total.value).toBe(0)
  })

  it('should compute capacity based on available space', async () => {
    const result = createOverflow({ reserved: 100 })

    const container = document.createElement('div')
    container.getBoundingClientRect = vi.fn(() => ({
      width: 300,
      height: 50,
      top: 0,
      left: 0,
      right: 300,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))

    result.container.value = container
    await nextTick()

    // Trigger resize observer
    resizeCallback?.([{ contentRect: { width: 300, height: 50 } }])
    await nextTick()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    result.measure(2, el)
    result.measure(3, el)
    result.measure(4, el)

    // Available: 300 - 100 = 200
    // Each item: 50px
    // Capacity: 4 items fit (200 / 50 = 4)
    expect(result.capacity.value).toBe(4)
  })

  it('should compute capacity with gap', async () => {
    const result = createOverflow({ reserved: 0, gap: 10 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    result.measure(2, el)
    result.measure(3, el)
    result.measure(4, el)

    // Available: 200
    // First item: 50, second: 50+10=60, third: 50+10=60
    // 50 + 60 + 60 = 170 (3 fit)
    // 50 + 60 + 60 + 60 = 230 (4 don't fit)
    expect(result.capacity.value).toBe(3)
  })

  it('should compute isOverflowing', async () => {
    const result = createOverflow({ reserved: 0 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 100, height: 50 } }])
    await nextTick()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    expect(result.isOverflowing.value).toBe(false)

    result.measure(2, el)
    expect(result.isOverflowing.value).toBe(true)
  })

  it('should return 0 capacity when no space available', async () => {
    const result = createOverflow({ reserved: 500 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 300, height: 50 } }])
    await nextTick()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)

    expect(result.capacity.value).toBe(0)
  })

  it('should include margins in width measurement', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '5px',
      marginRight: '5px',
    } as CSSStyleDeclaration)

    result.measure(0, el)

    expect(result.total.value).toBe(60) // 50 + 5 + 5
  })

  it('should compute capacity in uniform mode', async () => {
    const result = createOverflow({ itemWidth: 50, reserved: 0 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    // 200px available, 50px per item = 4 items
    expect(result.capacity.value).toBe(4)
  })

  it('should compute capacity in uniform mode with gap', async () => {
    const result = createOverflow({ itemWidth: 50, gap: 10, reserved: 0 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    // First item: 50, subsequent: 50+10=60
    // 50 + 60 + 60 = 170 (3 fit)
    // 50 + 60 + 60 + 60 = 230 (4 don't fit)
    expect(result.capacity.value).toBe(3)
  })

  it('should compute capacity in uniform mode with reserved space', async () => {
    const result = createOverflow({ itemWidth: 50, reserved: 100 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 300, height: 50 } }])
    await nextTick()

    // Available: 300 - 100 = 200
    // 50px per item = 4 items
    expect(result.capacity.value).toBe(4)
  })

  it('should return 0 capacity in uniform mode when no space', async () => {
    const result = createOverflow({ itemWidth: 50, reserved: 300 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    expect(result.capacity.value).toBe(0)
  })

  it('should fall back to variable mode when itemWidth is 0', async () => {
    const result = createOverflow({ itemWidth: 0, reserved: 0 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)
    result.measure(1, el)
    result.measure(2, el)

    // Falls back to variable mode, measures 3 items of 50px each = 150px
    // 200px available, so all 3 fit
    expect(result.capacity.value).toBe(3)
  })

  describe('reverse mode', () => {
    it('should compute capacity from end in reverse mode', async () => {
      const result = createOverflow({ reverse: true, reserved: 0 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 100, height: 50 } }])
      await nextTick()

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)

      // Create items with different widths: [80, 30, 30, 30]
      const el80 = document.createElement('div')
      Object.defineProperty(el80, 'offsetWidth', { value: 80 })

      const el30 = document.createElement('div')
      Object.defineProperty(el30, 'offsetWidth', { value: 30 })

      result.measure(0, el80) // 80px
      result.measure(1, el30) // 30px
      result.measure(2, el30) // 30px
      result.measure(3, el30) // 30px

      // Forward mode would fit: 80px (item 0 only, can't fit 80+30=110)
      // Reverse mode fits from end: 30 + 30 + 30 = 90px (items 3, 2, 1)
      expect(result.capacity.value).toBe(3)
    })

    it('should compute capacity from end with gap', async () => {
      const result = createOverflow({ reverse: true, gap: 10, reserved: 0 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 100, height: 50 } }])
      await nextTick()

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)

      const el30 = document.createElement('div')
      Object.defineProperty(el30, 'offsetWidth', { value: 30 })

      result.measure(0, el30)
      result.measure(1, el30)
      result.measure(2, el30)
      result.measure(3, el30)

      // From end: 30 + (10+30) + (10+30) = 110 > 100, so only 2 fit
      // 30 + (10+30) = 70, fits
      expect(result.capacity.value).toBe(2)
    })

    it('should support reactive reverse option', async () => {
      const reverse = ref(false)
      const result = createOverflow({ reverse, reserved: 0 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 100, height: 50 } }])
      await nextTick()

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)

      // Items: [80, 30, 30]
      const el80 = document.createElement('div')
      Object.defineProperty(el80, 'offsetWidth', { value: 80 })

      const el30 = document.createElement('div')
      Object.defineProperty(el30, 'offsetWidth', { value: 30 })

      result.measure(0, el80)
      result.measure(1, el30)
      result.measure(2, el30)

      // Forward: 80px fits, 80+30=110 doesn't fit
      expect(result.capacity.value).toBe(1)

      // Switch to reverse
      reverse.value = true

      // Reverse: 30 + 30 = 60 fits
      expect(result.capacity.value).toBe(2)
    })
  })

  describe('reactive options', () => {
    it('should react to gap changes', async () => {
      const gap = ref(0)
      const result = createOverflow({ gap, reserved: 0 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      const el = document.createElement('div')
      Object.defineProperty(el, 'offsetWidth', { value: 50 })
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)

      result.measure(0, el)
      result.measure(1, el)
      result.measure(2, el)
      result.measure(3, el)

      // No gap: 50*4 = 200, all 4 fit
      expect(result.capacity.value).toBe(4)

      // Add gap: 50 + 60 + 60 + 60 = 230 > 200, only 3 fit
      gap.value = 10
      expect(result.capacity.value).toBe(3)
    })

    it('should react to reserved changes', async () => {
      const reserved = ref(0)
      const result = createOverflow({ reserved, itemWidth: 50 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      // No reserved: 200 / 50 = 4
      expect(result.capacity.value).toBe(4)

      // Reserved 100: (200-100) / 50 = 2
      reserved.value = 100
      expect(result.capacity.value).toBe(2)
    })

    it('should react to itemWidth changes', async () => {
      const itemWidth = ref(50)
      const result = createOverflow({ itemWidth, reserved: 0 })

      const container = document.createElement('div')
      result.container.value = container
      await nextTick()

      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      // 200 / 50 = 4
      expect(result.capacity.value).toBe(4)

      // 200 / 100 = 2
      itemWidth.value = 100
      expect(result.capacity.value).toBe(2)
    })
  })

  describe('container option', () => {
    it('should accept container as a ref', async () => {
      const container = document.createElement('div')
      container.getBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 50,
        top: 0,
        left: 0,
        right: 200,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }))

      const containerRef = shallowRef<Element | undefined>(container)
      const result = createOverflow({ container: containerRef, itemWidth: 50 })

      await nextTick()
      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      expect(result.capacity.value).toBe(4)
    })

    it('should accept container as a getter function', async () => {
      const container = document.createElement('div')
      container.getBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 50,
        top: 0,
        left: 0,
        right: 200,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }))

      const containerRef = shallowRef<Element | undefined>(container)
      const result = createOverflow({
        container: () => containerRef.value,
        itemWidth: 50,
      })

      await nextTick()
      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      expect(result.capacity.value).toBe(4)
    })

    it('should track reactive changes when container is provided as getter', async () => {
      const container1 = document.createElement('div')
      const container2 = document.createElement('div')

      container1.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 50,
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }))

      container2.getBoundingClientRect = vi.fn(() => ({
        width: 300,
        height: 50,
        top: 0,
        left: 0,
        right: 300,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }))

      // Start with undefined (simulates component before mount)
      const containerRef = shallowRef<Element | undefined>(undefined)
      const result = createOverflow({
        container: () => containerRef.value,
        itemWidth: 50,
      })

      // Initially should be Infinity (no container)
      expect(result.capacity.value).toBe(Infinity)

      // Set first container
      containerRef.value = container1
      await nextTick()
      resizeCallback?.([{ contentRect: { width: 100, height: 50 } }])
      await nextTick()

      expect(result.capacity.value).toBe(2)

      // Change to second container
      containerRef.value = container2
      await nextTick()
      resizeCallback?.([{ contentRect: { width: 300, height: 50 } }])
      await nextTick()

      expect(result.capacity.value).toBe(6)
    })

    it('should handle nested ref access pattern (like atom.value?.element)', async () => {
      // This simulates the pattern: () => atom.value?.element
      // where atom is a ref to an object with an element property
      const container = document.createElement('div')
      container.getBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 50,
        top: 0,
        left: 0,
        right: 200,
        bottom: 50,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }))

      const atom = shallowRef<{ element: Element } | undefined>(undefined)

      const result = createOverflow({
        container: () => atom.value?.element,
        itemWidth: 50,
      })

      // Initially undefined
      expect(result.capacity.value).toBe(Infinity)

      // Simulate component mount - atom.value becomes available
      atom.value = { element: container }
      await nextTick()
      resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
      await nextTick()

      expect(result.capacity.value).toBe(4)
    })
  })
})

describe('createOverflowContext', () => {
  it('should return trinity tuple', () => {
    const result = createOverflowContext()

    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useContext
    expect(typeof result[1]).toBe('function') // provideContext
    expect(result[2]).toEqual({
      container: expect.any(Object),
      width: expect.any(Object),
      capacity: expect.any(Object),
      total: expect.any(Object),
      isOverflowing: expect.any(Object),
      measure: expect.any(Function),
      reset: expect.any(Function),
    })
  })

  it('should pass options to createOverflow', () => {
    const [,, context] = createOverflowContext({ gap: 20, reserved: 100 })

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    context.measure(0, el)
    context.measure(1, el)

    // 50 + (20 + 50) = 120
    expect(context.total.value).toBe(120)
  })
})

describe('useOverflow', () => {
  it('should be a function that accepts namespace', () => {
    expect(typeof useOverflow).toBe('function')
    expect(useOverflow.length).toBe(0) // optional parameter
  })
})

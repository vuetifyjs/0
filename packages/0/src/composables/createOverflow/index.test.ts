import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createOverflow, createOverflowContext, useOverflow } from './index'

// Utilities
import { nextTick, readonly, ref, shallowRef } from 'vue'

const mockIsHydrated = ref(true)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', async () => {
  const actual = await vi.importActual('#v0/constants/globals')
  return {
    ...actual,
    IN_BROWSER: true,
    SUPPORTS_OBSERVER: true,
  }
})

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
      settle: expect.any(Function),
    })
  })

  it('should return Infinity capacity when width is 0 (SSR)', () => {
    const result = createOverflow()

    expect(result.capacity.value).toBe(Infinity)
  })

  it('should not be overflowing when width is 0 even with reserved space (SSR consistency with capacity)', () => {
    const result = createOverflow({ reserved: 20 })

    // capacity says everything fits in SSR (width 0); isOverflowing must agree
    expect(result.capacity.value).toBe(Infinity)
    expect(result.isOverflowing.value).toBe(false)
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

  it('should treat a genuine 0 margin as 0, not as an unreadable length', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '0px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)

    expect(result.total.value).toBe(50)
  })

  it('should fall back to 0 for a margin that does not resolve to a length', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: 'auto',
      marginRight: '',
    } as CSSStyleDeclaration)

    result.measure(0, el)

    expect(result.total.value).toBe(50)
  })

  it('should add both resolved margins to the measured width', async () => {
    const result = createOverflow()

    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 50 })
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      marginLeft: '4px',
      marginRight: '0px',
    } as CSSStyleDeclaration)

    result.measure(0, el)

    expect(result.total.value).toBe(54)
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

  it('should return 0 capacity in uniform mode when available is less than itemWidth', async () => {
    const result = createOverflow({ itemWidth: 100, reserved: 170 })
    const container = document.createElement('div')
    result.container.value = container
    await nextTick()
    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()
    expect(result.capacity.value).toBe(0)
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

  describe('uniform mode isOverflowing', () => {
    function setup () {
      const result = createOverflow({ itemWidth: 50, reserved: 0 })
      const container = document.createElement('div')
      result.container.value = container
      return result
    }

    async function size (width: number) {
      await nextTick()
      resizeCallback?.([{ contentRect: { width, height: 50 } }])
      await nextTick()
    }

    function present (result: ReturnType<typeof createOverflow>, ids: number[]) {
      // Items signal presence via measure() — the width arg is ignored for
      // uniform-mode capacity but the entry count drives isOverflowing.
      const el = document.createElement('div')
      Object.defineProperty(el, 'offsetWidth', { value: 50 })
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)
      for (const id of ids) result.measure(id, el)
    }

    it('should report isOverflowing when registered count exceeds capacity', async () => {
      const result = setup()
      await size(100)
      // capacity = floor(100 / 50) = 2
      expect(result.capacity.value).toBe(2)

      present(result, [0, 1])
      expect(result.isOverflowing.value).toBe(false)

      present(result, [0, 1, 2])
      expect(result.isOverflowing.value).toBe(true)
    })

    it('should report not overflowing when count is at capacity', async () => {
      const result = setup()
      await size(150)
      // capacity = floor(150 / 50) = 3
      expect(result.capacity.value).toBe(3)

      present(result, [0, 1, 2])
      expect(result.isOverflowing.value).toBe(false)
    })

    it('should report not overflowing when no items are registered', async () => {
      const result = setup()
      await size(100)
      expect(result.isOverflowing.value).toBe(false)
    })

    it('should react to an item unregistering', async () => {
      const result = setup()
      await size(100)
      present(result, [0, 1, 2])
      expect(result.isOverflowing.value).toBe(true)

      result.measure(2, undefined)
      expect(result.isOverflowing.value).toBe(false)
    })

    it('should derive isOverflowing from count in uniform mode (ignoring measured per-item widths)', async () => {
      // In uniform mode, items signal presence by calling measure(i, el).
      // The width arg is irrelevant — itemWidth × count is the canonical math.
      // This test passes a deliberately-wrong offsetWidth (0) to prove the
      // count drives isOverflowing, not summed measurements.
      const result = setup()
      await size(100)

      const el = document.createElement('div')
      Object.defineProperty(el, 'offsetWidth', { value: 0 })
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)

      result.measure(0, el)
      result.measure(1, el)
      result.measure(2, el)

      // capacity = 100 / 50 = 2, count = 3 → must report overflowing
      expect(result.capacity.value).toBe(2)
      expect(result.isOverflowing.value).toBe(true)
    })

    it('should stay false when capacity is Infinity (SSR / itemWidth not measured)', async () => {
      const itemWidth = shallowRef(0)
      const result = createOverflow({ itemWidth, reserved: 0 })
      const container = document.createElement('div')
      result.container.value = container
      await size(100)

      present(result, [0, 1, 2, 3, 4])
      expect(result.capacity.value).toBe(Infinity)
      expect(result.isOverflowing.value).toBe(false)
    })

    it('should react to itemWidth changes via reactive option', async () => {
      const itemWidth = shallowRef(50)
      const result = createOverflow({ itemWidth, reserved: 0 })
      const container = document.createElement('div')
      result.container.value = container
      await size(100)

      present(result, [0, 1, 2])
      // capacity = floor(100 / 50) = 2, count = 3 → overflowing
      expect(result.isOverflowing.value).toBe(true)

      // Shrink itemWidth → capacity grows, no longer overflows
      itemWidth.value = 25
      // capacity = floor(100 / 25) = 4, count = 3 → fits
      expect(result.isOverflowing.value).toBe(false)
    })
  })

  it('should return Infinity when itemWidth option provided but value is 0 (not measured yet)', async () => {
    // When itemWidth is provided but value is 0, it means measurement hasn't happened yet
    // This is the case for PaginationRoot where itemWidth is a ref that starts at 0
    const itemWidth = shallowRef(0)
    const result = createOverflow({ itemWidth, reserved: 0 })

    const container = document.createElement('div')
    result.container.value = container
    await nextTick()

    resizeCallback?.([{ contentRect: { width: 200, height: 50 } }])
    await nextTick()

    // Before measurement, capacity should be Infinity (show all/default)
    expect(result.capacity.value).toBe(Infinity)

    // After measurement, capacity should be calculated
    itemWidth.value = 50
    expect(result.capacity.value).toBe(4) // 200px / 50px = 4 items
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

    it('should accept a readonly template-ref shaped container', async () => {
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

      const containerRef = readonly(shallowRef<Element | null>(container))
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

  describe('probe mode', () => {
    beforeEach(() => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        marginLeft: '0px',
        marginRight: '0px',
      } as CSSStyleDeclaration)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    function box (width: number): HTMLElement {
      const el = document.createElement('div')
      Object.defineProperty(el, 'offsetWidth', { value: width })
      return el
    }

    function render (widths: number[], options: Parameters<typeof createOverflow>[0] = {}) {
      const ctx = createOverflow({ probe: true, gap: 0, reserved: 0, budget: 200, ...options })
      ctx.reset()
      for (const [index, width] of widths.entries()) {
        ctx.measure(index, box(width))
      }
      ctx.settle()
      return ctx
    }

    function paint (ctx: ReturnType<typeof createOverflow>, widths: number[]) {
      ctx.reset()
      for (const [index, width] of widths.entries()) ctx.measure(index, box(width))
    }

    it('should ask for more slots when the rendered row has room', () => {
      const overflow = render([40, 40, 40, 40], { budget: 200 })

      expect(overflow.capacity.value).toBe(5)
      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should drop back when that guess overflows', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      overflow.reset()
      for (const [index, width] of [40, 40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      overflow.reset()
      for (const [index, width] of [50, 50, 50, 50, 50].entries()) overflow.measure(index, box(width))
      overflow.settle()

      // 4 already fit, so the bracket closes on 5.
      expect(overflow.capacity.value).toBe(4)
    })

    it('should grow back when the same count gets narrower', () => {
      const overflow = createOverflow({ probe: true, budget: 300, gap: 0, reserved: 0 })
      overflow.reset()
      for (const [index, width] of [100, 100, 100].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(3)

      overflow.reset()
      for (const [index, width] of [50, 50, 50].entries()) overflow.measure(index, box(width))
      overflow.settle()

      expect(overflow.capacity.value).toBe(6)
      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should shrink when the same count gets wider', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      overflow.reset()
      for (const [index, width] of [40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      overflow.reset()
      for (const [index, width] of [80, 80, 80].entries()) overflow.measure(index, box(width))
      overflow.settle()

      // Same count, new widths. The search starts over.
      expect(overflow.capacity.value).toBe(1)
      expect(overflow.isOverflowing.value).toBe(true)
    })

    it('should stop instead of oscillating when a larger count is a wider set', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      function widthsFor (count: number): number[] {
        const width = count >= 6 ? 80 : 30
        return Array.from({ length: count }, () => width)
      }

      let guard = 0
      let cap = overflow.capacity.value
      while (guard++ < 30) {
        const count = cap === Infinity ? 4 : cap
        overflow.reset()
        for (const [index, width] of widthsFor(count).entries()) overflow.measure(index, box(width))
        overflow.settle()
        if (overflow.capacity.value === count) break
        cap = overflow.capacity.value
      }

      expect(guard).toBeLessThan(30)
      const count = overflow.capacity.value
      const used = widthsFor(count).reduce((acc, width) => acc + width, 0)
      expect(used).toBeLessThanOrEqual(200)
      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should not ask past max', () => {
      const overflow = render([40, 40], { budget: 500, max: 3 })

      expect(overflow.capacity.value).toBe(3)
    })

    it('should scale a settled row to the new budget in one step', () => {
      const budget = shallowRef(200)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0 })
      overflow.reset()
      for (const [index, width] of [40, 40, 40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      // Pitch scales 5 to 3. A fresh search would halve to 2.
      budget.value = 120
      overflow.settle()
      expect(overflow.capacity.value).toBe(3)

      budget.value = 40
      overflow.settle()
      expect(overflow.capacity.value).toBe(1)
    })

    it('should accumulate a sub-pitch resize before adding a slot', () => {
      const budget = shallowRef(200)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0 })
      overflow.reset()
      for (const [index, width] of [40, 40, 40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      // Half a pitch. Keep the slack.
      budget.value = 220
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      budget.value = 240
      overflow.settle()
      expect(overflow.capacity.value).toBe(6)

      // Paint the asked count before the next committed settle.
      overflow.reset()
      for (const [index, width] of [40, 40, 40, 40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      expect(overflow.capacity.value).toBe(6)

      budget.value = 250
      overflow.settle()
      expect(overflow.capacity.value).toBe(6)

      budget.value = 280
      overflow.settle()
      expect(overflow.capacity.value).toBe(7)
    })

    it('should spend reserved pixels before counting slots', () => {
      const overflow = render([40, 40, 40], { budget: 200, reserved: 80 })

      expect(overflow.capacity.value).toBe(3)
    })

    it('should step past a count the caller cannot render', () => {
      const overflow = createOverflow({ probe: true, budget: 500, gap: 0, reserved: 0 })
      for (const [index, width] of [40, 40, 40, 40].entries()) overflow.measure(index, box(width))
      overflow.settle()
      const asked = overflow.capacity.value
      expect(asked).toBeGreaterThan(4)

      // Uncommitted. A short row is not a refused count.
      overflow.settle(false)
      expect(overflow.capacity.value).toBe(asked)

      overflow.reset()
      overflow.measure(0, box(40))
      overflow.settle(true)

      expect(overflow.capacity.value).toBeGreaterThan(1)
      expect(overflow.capacity.value).not.toBe(asked)
    })

    it('should do nothing when probe is off', () => {
      const overflow = createOverflow({ budget: 200 })
      overflow.settle()

      expect(overflow.capacity.value).toBe(Infinity)
    })

    it('should do nothing when nothing is measured', () => {
      const overflow = createOverflow({ probe: true, budget: 200 })
      overflow.settle()

      expect(overflow.capacity.value).toBe(Infinity)
    })

    it('should clear the ask when the budget drops to nothing', () => {
      const budget = shallowRef(200)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      budget.value = 0
      overflow.settle()

      expect(overflow.capacity.value).toBe(Infinity)
    })

    it('should stay open when the budget starts empty', () => {
      const overflow = createOverflow({ probe: true, budget: 0, gap: 0, reserved: 0 })
      paint(overflow, [40])
      overflow.settle()

      expect(overflow.capacity.value).toBe(Infinity)
      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should not call a zero-width row a pitch', () => {
      const budget = shallowRef(100)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0 })
      paint(overflow, [0, 0])
      overflow.settle()
      expect(overflow.capacity.value).toBe(2)

      budget.value = 500
      overflow.settle()

      expect(overflow.capacity.value).toBe(2)
    })

    it('should report not overflowing before a budget or a width exists', () => {
      const overflow = createOverflow({ probe: true })

      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should ask for one when the only item does not fit', () => {
      const overflow = render([100], { budget: 50 })

      expect(overflow.capacity.value).toBe(1)
      expect(overflow.isOverflowing.value).toBe(true)
    })

    it('should stay when the rendered count is already the max', () => {
      const overflow = render([10, 10, 10], { budget: 1000, max: 3 })

      expect(overflow.capacity.value).toBe(3)
    })

    it('should pull back when more than max is rendered', () => {
      const overflow = render([10, 10, 10, 10, 10], { budget: 1000, max: 3 })

      expect(overflow.capacity.value).toBe(3)
    })

    it('should stop after the same shortfall twice', () => {
      const overflow = createOverflow({ probe: true, budget: 1000, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(12)

      paint(overflow, [40])
      overflow.settle()
      expect(overflow.capacity.value).toBeGreaterThan(1)

      paint(overflow, [40])
      overflow.settle()

      expect(overflow.capacity.value).toBe(1)
    })

    it('should freeze when the search asks again for a count it already tried', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      paint(overflow, [50, 50, 50, 50, 50])
      overflow.settle()
      expect(overflow.capacity.value).toBe(4)

      paint(overflow, [50, 50, 50, 50, 50, 50, 50, 50])
      overflow.settle()
      expect(overflow.capacity.value).toBe(6)

      paint(overflow, [50, 50, 50, 50, 50, 50])
      overflow.settle()

      expect(overflow.capacity.value).toBe(4)
      expect(overflow.isOverflowing.value).toBe(true)
    })

    it('should freeze at the repeated count when no row has fit yet', () => {
      const overflow = createOverflow({ probe: true, budget: 50, gap: 0, reserved: 0 })
      paint(overflow, [100, 100, 100, 100])
      overflow.settle()
      expect(overflow.capacity.value).toBe(2)

      paint(overflow, [100, 100])
      overflow.settle()
      expect(overflow.capacity.value).toBe(1)

      paint(overflow, [100, 100, 100, 100, 100, 100])
      overflow.settle()
      expect(overflow.capacity.value).toBe(3)

      paint(overflow, [100, 100, 100, 100])
      overflow.settle()

      expect(overflow.capacity.value).toBe(2)
    })

    it('should stop asking once the search has stepped too many times', () => {
      const overflow = createOverflow({ probe: true, budget: 100_000, gap: 0, reserved: 0 })
      let count = 1
      for (let guard = 0; guard < 40; guard++) {
        paint(overflow, Array.from({ length: count }, () => 1))
        overflow.settle()
        if (overflow.capacity.value === count) break
        count = overflow.capacity.value
      }

      expect(overflow.capacity.value).toBe(193)
    })

    it('should drop its lower bound when a shorter row overflows', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      paint(overflow, [50, 50, 50, 50, 50])
      overflow.settle()
      expect(overflow.capacity.value).toBe(4)

      paint(overflow, [30, 30, 30, 30])
      overflow.settle()
      expect(overflow.capacity.value).toBe(4)

      paint(overflow, [80, 80, 80])
      overflow.settle()

      expect(overflow.capacity.value).toBe(1)
    })

    it('should leave an uncommitted overflowing row where it is', () => {
      const overflow = createOverflow({ probe: true, budget: 200, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      const asked = overflow.capacity.value
      expect(asked).toBe(5)

      paint(overflow, [50, 50, 50, 50, 50])
      overflow.settle(false)

      expect(overflow.capacity.value).toBe(asked)
    })

    it('should keep a settled max when the budget grows further', () => {
      const budget = shallowRef(50)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0, max: 5 })
      paint(overflow, [10, 10, 10, 10, 10])
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      budget.value = 200
      overflow.settle()

      expect(overflow.capacity.value).toBe(5)
    })

    it('should step over a count the caller already refused', () => {
      const budget = shallowRef(80)
      const overflow = createOverflow({ probe: true, budget, gap: 0, reserved: 0 })
      paint(overflow, [40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(2)

      paint(overflow, [40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(3)

      paint(overflow, [40, 40, 40])
      overflow.settle()

      expect(overflow.capacity.value).toBe(3)
    })

    it('should stop a shortfall at a count that already overflowed', () => {
      const overflow = createOverflow({ probe: true, budget: 20, gap: 0, reserved: 0 })
      paint(overflow, [10])
      overflow.settle()
      expect(overflow.capacity.value).toBe(2)

      paint(overflow, [15])
      overflow.settle()
      expect(overflow.capacity.value).toBe(3)

      paint(overflow, [10, 10])
      overflow.settle()
      expect(overflow.capacity.value).toBe(4)

      paint(overflow, [20, 20, 20])
      overflow.settle()
      expect(overflow.capacity.value).toBe(2)

      paint(overflow, [10])
      overflow.settle()

      expect(overflow.capacity.value).toBe(1)
      expect(overflow.isOverflowing.value).toBe(false)
    })

    it('should drop one slot when the nav scrolls but the sum still fits', () => {
      let scroll = 100
      const nav = document.createElement('div')
      Object.defineProperty(nav, 'clientWidth', { configurable: true, get: () => 100 })
      Object.defineProperty(nav, 'scrollWidth', { configurable: true, get: () => scroll })
      const overflow = createOverflow({
        probe: true,
        container: nav,
        budget: 160,
        gap: 0,
        reserved: 0,
      })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(4)

      scroll = 300
      overflow.settle()

      expect(overflow.capacity.value).toBe(3)
      expect(overflow.isOverflowing.value).toBe(true)
    })

    it('should ignore scroll until the nav has a client width', () => {
      const nav = document.createElement('div')
      Object.defineProperty(nav, 'clientWidth', { configurable: true, value: 0 })
      Object.defineProperty(nav, 'scrollWidth', { configurable: true, value: 500 })
      const overflow = createOverflow({
        probe: true,
        container: nav,
        budget: 200,
        gap: 0,
        reserved: 0,
      })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()

      expect(overflow.capacity.value).toBe(5)
    })

    it('should claim free space beside the nav when no budget is passed', () => {
      const parent = document.createElement('div')
      const nav = document.createElement('nav')
      const hidden = document.createElement('div')
      const floating = document.createElement('div')
      const pinned = document.createElement('div')
      const fixedMin = document.createElement('div')
      const flexible = document.createElement('div')
      const rigid = document.createElement('div')
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      parent.append(svg, hidden, floating, pinned, nav, fixedMin, flexible, rigid)
      Object.defineProperty(parent, 'clientWidth', { configurable: true, value: 400 })
      Object.defineProperty(rigid, 'getBoundingClientRect', {
        value: () => ({ width: 30, height: 0, top: 0, left: 0, right: 30, bottom: 0, x: 0, y: 0, toJSON () {} }),
      })

      const styles = new Map<Element, Record<string, string>>([
        [parent, { paddingLeft: '10px', paddingRight: '10px', columnGap: '8px' }],
        [hidden, { display: 'none' }],
        [floating, { position: 'absolute' }],
        [pinned, { position: 'fixed' }],
        [nav, {
          marginLeft: '2px',
          marginRight: '2px',
          paddingLeft: '3px',
          paddingRight: '3px',
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
        }],
        [fixedMin, { minWidth: '20px', marginLeft: '4px', marginRight: '4px', flexGrow: '1' }],
        [flexible, { flexGrow: '1', minWidth: 'auto' }],
        [rigid, { flexGrow: '0', minWidth: 'auto' }],
      ])
      vi.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        return {
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '0px',
          marginBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          borderLeftWidth: '0px',
          borderRightWidth: '0px',
          borderTopWidth: '0px',
          borderBottomWidth: '0px',
          minWidth: 'auto',
          flexGrow: '0',
          display: 'block',
          position: 'static',
          columnGap: '0px',
          gap: '0px',
          width: '0px',
          height: '0px',
          boxSizing: 'content-box',
          ...styles.get(el as Element),
        } as CSSStyleDeclaration
      })

      const overflow = createOverflow({
        probe: true,
        container: nav,
        gap: 0,
        reserved: 0,
      })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(7)

      paint(overflow, [40, 40, 40, 40, 40, 40, 40])
      overflow.settle()

      // 286px claimed. Seven 40px buttons fit, eight do not.
      expect(overflow.capacity.value).toBe(7)
    })

    it('should read the parent gap when column-gap does not resolve', () => {
      const parent = document.createElement('div')
      const nav = document.createElement('nav')
      const sibling = document.createElement('div')
      parent.append(nav, sibling)
      Object.defineProperty(parent, 'clientWidth', { configurable: true, value: 200 })
      Object.defineProperty(sibling, 'getBoundingClientRect', {
        value: () => ({ width: 40, height: 0, top: 0, left: 0, right: 40, bottom: 0, x: 0, y: 0, toJSON () {} }),
      })
      vi.spyOn(window, 'getComputedStyle').mockImplementation(el => {
        const gap = el === parent ? { columnGap: '0px', gap: '10px' } : {}
        return {
          marginLeft: '0px',
          marginRight: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          borderLeftWidth: '0px',
          borderRightWidth: '0px',
          borderTopWidth: '0px',
          borderBottomWidth: '0px',
          minWidth: 'auto',
          flexGrow: '0',
          display: 'block',
          position: 'static',
          columnGap: '0px',
          gap: '0px',
          width: '0px',
          height: '0px',
          boxSizing: 'content-box',
          ...gap,
        } as CSSStyleDeclaration
      })

      const overflow = createOverflow({ probe: true, container: nav, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40])
      overflow.settle()

      // 200 - 40 sibling - 10 gap = 150. Three 40px buttons fit and do not ask for a fourth.
      expect(overflow.capacity.value).toBe(3)
    })

    it('should not charge a gap when the nav is the only child', () => {
      const parent = document.createElement('div')
      const nav = document.createElement('nav')
      parent.append(nav)
      Object.defineProperty(parent, 'clientWidth', { configurable: true, value: 200 })
      vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
        marginLeft: '0px',
        marginRight: '0px',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderLeftWidth: '0px',
        borderRightWidth: '0px',
        borderTopWidth: '0px',
        borderBottomWidth: '0px',
        minWidth: 'auto',
        flexGrow: '0',
        display: 'block',
        position: 'static',
        columnGap: '0px',
        gap: '0px',
        width: '0px',
        height: '0px',
        boxSizing: 'content-box',
      }) as CSSStyleDeclaration)

      const overflow = createOverflow({ probe: true, container: nav, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)

      paint(overflow, [40, 40, 40, 40, 40])
      overflow.settle()
      expect(overflow.capacity.value).toBe(5)
    })

    it('should binary search between a fit and a later overflow', () => {
      const overflow = createOverflow({ probe: true, budget: 300, gap: 0, reserved: 0 })
      paint(overflow, [30, 30, 30])
      overflow.settle()
      expect(overflow.capacity.value).toBe(10)

      paint(overflow, Array.from({ length: 10 }, () => 40))
      overflow.settle()
      expect(overflow.capacity.value).toBe(6)

      paint(overflow, [30, 30, 30, 30, 30, 30])
      overflow.settle()
      expect(overflow.capacity.value).toBe(8)
    })

    it('should use the nav width when the nav has no parent', () => {
      const nav = document.createElement('nav')
      const overflow = createOverflow({ probe: true, container: nav, gap: 0, reserved: 0 })
      paint(overflow, [40, 40, 40, 40])
      overflow.settle()

      expect(overflow.capacity.value).toBe(Infinity)
    })

    it('should coalesce probe resizes onto one settle', async () => {
      const queued: FrameRequestCallback[] = []
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        queued.push(cb)
        return queued.length
      })
      const callbacks: Array<(entries: Array<{ contentRect: { width: number, height: number } }>) => void> = []
      globalThis.ResizeObserver = vi.fn(function (cb: (entries: Array<{ contentRect: { width: number, height: number } }>) => void) {
        callbacks.push(cb)
        return { observe: vi.fn(), disconnect: vi.fn() }
      }) as unknown as typeof ResizeObserver

      try {
        const parent = document.createElement('div')
        const nav = document.createElement('nav')
        parent.append(nav)
        createOverflow({
          probe: true,
          container: nav,
          budget: 200,
          gap: 0,
          reserved: 0,
        })
        await nextTick()

        const parentCallback = callbacks.at(-1)
        parentCallback?.([{ contentRect: { width: 100, height: 20 } }])
        parentCallback?.([{ contentRect: { width: 140, height: 20 } }])

        expect(queued.length).toBeGreaterThan(1)
        for (const frame of queued) frame(0)
      } finally {
        vi.unstubAllGlobals()
      }
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
      settle: expect.any(Function),
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
    expect(useOverflow.length).toBe(0)
  })

  it('should throw when context is not provided', () => {
    using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => useOverflow()).toThrow()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('createOverflow SSR', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should return safe defaults when IN_BROWSER is false', async () => {
    vi.doMock('#v0/constants/globals', async () => {
      const actual = await vi.importActual('#v0/constants/globals')
      return {
        ...actual,
        IN_BROWSER: false,
        SUPPORTS_OBSERVER: false,
      }
    })

    const { createOverflow: createOverflowSSR } = await import('./index')
    const result = createOverflowSSR()

    expect(result.capacity.value).toBe(Infinity)
    expect(result.width.value).toBe(0)
    expect(result.total.value).toBe(0)
    expect(result.isOverflowing.value).toBe(false)
  })

  it('should not schedule a probe settle when not in a browser', async () => {
    vi.doMock('#v0/constants/globals', async () => {
      const actual = await vi.importActual('#v0/constants/globals')
      return {
        ...actual,
        IN_BROWSER: false,
        SUPPORTS_OBSERVER: true,
      }
    })

    const frames = vi.fn()
    vi.stubGlobal('requestAnimationFrame', frames)
    const callbacks: Array<(entries: Array<{ contentRect: { width: number, height: number } }>) => void> = []
    globalThis.ResizeObserver = vi.fn(function (cb: (entries: Array<{ contentRect: { width: number, height: number } }>) => void) {
      callbacks.push(cb)
      return { observe: vi.fn(), disconnect: vi.fn() }
    }) as unknown as typeof ResizeObserver

    try {
      const { createOverflow: createOverflowSSR } = await import('./index')
      const parent = document.createElement('div')
      const nav = document.createElement('nav')
      parent.append(nav)
      createOverflowSSR({ probe: true, container: nav, budget: 200 })
      await nextTick()

      expect(callbacks.length).toBeGreaterThan(0)
      for (const callback of callbacks) callback([{ contentRect: { width: 80, height: 20 } }])
      await nextTick()

      expect(frames).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

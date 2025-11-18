// Composables
import { useResizeObserver, useElementSize } from './index'

// Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'

const mockIsHydrated = ref(false)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', () => ({
  SUPPORTS_OBSERVER: true,
}))

describe('useResizeObserver', () => {
  let mockObserver: any
  let element: HTMLDivElement

  beforeEach(() => {
    mockIsHydrated.value = false

    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    globalThis.ResizeObserver = vi.fn(function (this: any) {
      return mockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    element = document.createElement('div')
    element.getBoundingClientRect = vi.fn(() => ({
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

    vi.clearAllMocks()
  })

  it('should not create observer when target is undefined', async () => {
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    useResizeObserver(target, callback)
    await nextTick()

    expect(globalThis.ResizeObserver).not.toHaveBeenCalled()
  })

  it('should create observer when target is provided', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const result = useResizeObserver(target, callback)

    expect(result).toEqual({
      isActive: expect.any(Object),
      isPaused: expect.any(Object),
      pause: expect.any(Function),
      resume: expect.any(Function),
      stop: expect.any(Function),
    })

    expect(typeof result.pause).toBe('function')
    expect(typeof result.resume).toBe('function')
    expect(typeof result.stop).toBe('function')
    expect(typeof result.isActive.value).toBe('boolean')
    expect(typeof result.isPaused.value).toBe('boolean')
  })

  it('should call immediate callback when immediate option is true (hydration changes)', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useResizeObserver(target, callback, { immediate: true })

    mockIsHydrated.value = true

    await nextTick()

    expect(callback).toHaveBeenCalledWith([{
      target: element,
      contentRect: {
        width: 100,
        height: 50,
        top: 0,
        left: 0,
      },
    }])
  })

  it('should call immediate callback when already hydrated at initialization', async () => {
    // Set up hydration BEFORE creating the observer
    mockIsHydrated.value = true

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useResizeObserver(target, callback, { immediate: true })
    await nextTick()

    // The immediate callback should be called even though hydration was already true
    expect(callback).toHaveBeenCalledWith([{
      target: element,
      contentRect: {
        width: 100,
        height: 50,
        top: 0,
        left: 0,
      },
    }])
  })

  it('should handle pause and resume functionality', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { pause, resume, isPaused } = useResizeObserver(target, callback)

    expect(isPaused.value).toBe(false)

    pause()
    expect(isPaused.value).toBe(true)

    resume()
    expect(isPaused.value).toBe(false)
  })
})

describe('useElementSize', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    element = document.createElement('div')
    element.getBoundingClientRect = vi.fn(() => ({
      width: 150,
      height: 75,
      top: 0,
      left: 0,
      right: 150,
      bottom: 75,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
  })

  it('should return reactive width and height refs', async () => {
    const target = ref<Element | undefined>(element)
    const { width, height } = useElementSize(target)

    expect(width.value).toBe(0)
    expect(height.value).toBe(0)

    expect(typeof width.value).toBe('number')
    expect(typeof height.value).toBe('number')
  })

  it('should handle undefined target', async () => {
    const target = ref<Element | undefined>(undefined)
    const { width, height } = useElementSize(target)

    expect(width.value).toBe(0)
    expect(height.value).toBe(0)
  })
})

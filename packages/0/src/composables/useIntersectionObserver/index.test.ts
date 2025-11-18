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
  SUPPORTS_INTERSECTION_OBSERVER: true,
}))

import { useIntersectionObserver, useElementIntersection } from './index'

describe('useIntersectionObserver', () => {
  let mockObserver: any
  let element: HTMLDivElement

  beforeEach(() => {
    // Reset hydration state
    mockIsHydrated.value = false

    // Create mock observer
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    // Mock IntersectionObserver globally
    globalThis.IntersectionObserver = vi.fn(function (this: any) {
      return mockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    // Create test element
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

    // Clear mocks
    vi.clearAllMocks()
  })

  it('should not create observer when target is undefined', async () => {
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    useIntersectionObserver(target, callback)
    await nextTick()

    expect(globalThis.IntersectionObserver).not.toHaveBeenCalled()
  })

  it('should create observer when target is provided', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const result = useIntersectionObserver(target, callback)

    expect(result).toEqual({
      isActive: expect.any(Object), // This is a readonly ref
      isIntersecting: expect.any(Object), // This is a readonly ref
      isPaused: expect.any(Object), // This is a readonly ref
      pause: expect.any(Function),
      resume: expect.any(Function),
      stop: expect.any(Function),
    })

    // Test that functions exist and can be called
    expect(typeof result.pause).toBe('function')
    expect(typeof result.resume).toBe('function')
    expect(typeof result.stop).toBe('function')
    expect(typeof result.isIntersecting.value).toBe('boolean')
    expect(typeof result.isPaused.value).toBe('boolean')
  })

  it('should call immediate callback when immediate option is true (hydration changes)', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useIntersectionObserver(target, callback, { immediate: true })

    // Trigger hydration to make the watch function run
    mockIsHydrated.value = true
    await nextTick()

    // The immediate callback should be called with synthetic intersection data
    expect(callback).toHaveBeenCalledWith([{
      boundingClientRect: expect.any(Object),
      intersectionRatio: 0,
      intersectionRect: expect.any(Object),
      isIntersecting: false,
      rootBounds: null,
      target: element,
      time: expect.any(Number),
    }])
  })

  it('should call immediate callback when already hydrated at initialization', async () => {
    // Set up hydration BEFORE creating the observer
    mockIsHydrated.value = true

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useIntersectionObserver(target, callback, { immediate: true })
    await nextTick()

    // The immediate callback should be called even though hydration was already true
    expect(callback).toHaveBeenCalledWith([{
      boundingClientRect: expect.any(Object),
      intersectionRatio: 0,
      intersectionRect: expect.any(Object),
      isIntersecting: false,
      rootBounds: null,
      target: element,
      time: expect.any(Number),
    }])
  })

  it('should handle pause and resume functionality', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { pause, resume, isPaused } = useIntersectionObserver(target, callback)

    // Initial state should not be paused
    expect(isPaused.value).toBe(false)

    // Test pause
    pause()
    expect(isPaused.value).toBe(true)

    // Test resume
    resume()
    expect(isPaused.value).toBe(false)
  })

  it('should handle observer options correctly', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()
    const options = {
      root: document.body,
      rootMargin: '10px',
      threshold: [0, 0.5, 1],
    }

    useIntersectionObserver(target, callback, options)

    // Trigger hydration
    mockIsHydrated.value = true
    await nextTick()

    // Verify observer was created with correct options
    expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: document.body,
        rootMargin: '10px',
        threshold: [0, 0.5, 1],
      },
    )
  })
})

describe('useElementIntersection', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    // Reset hydration state
    mockIsHydrated.value = false

    // Create test element
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

    // Clear mocks
    vi.clearAllMocks()
  })

  it('should return reactive intersection state', async () => {
    const target = ref<Element | undefined>(element)
    const { isIntersecting, intersectionRatio } = useElementIntersection(target)

    // Should return reactive refs initialized to default values
    expect(isIntersecting.value).toBe(false)
    expect(intersectionRatio.value).toBe(0)

    // Should be reactive refs
    expect(typeof isIntersecting.value).toBe('boolean')
    expect(typeof intersectionRatio.value).toBe('number')
  })

  it('should handle undefined target', async () => {
    const target = ref<Element | undefined>(undefined)
    const { isIntersecting, intersectionRatio } = useElementIntersection(target)

    // Should still return valid refs with default values
    expect(isIntersecting.value).toBe(false)
    expect(intersectionRatio.value).toBe(0)
  })
})

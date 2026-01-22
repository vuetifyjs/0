import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick, readonly, ref, type Ref, shallowRef } from 'vue'

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

import { useElementIntersection, useIntersectionObserver } from './index'

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

  it('should accept readonly refs (useTemplateRef compatibility)', async () => {
    mockIsHydrated.value = true
    // Simulates useTemplateRef return type
    const target = readonly(shallowRef<Element | null>(element)) as Readonly<Ref<Element | null>>
    const callback = vi.fn()

    useIntersectionObserver(target, callback)
    await nextTick()

    expect(globalThis.IntersectionObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element)
  })

  it('should accept shallowRef targets', async () => {
    mockIsHydrated.value = true
    const target = shallowRef<Element | null>(element)
    const callback = vi.fn()

    useIntersectionObserver(target, callback)
    await nextTick()

    expect(globalThis.IntersectionObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element)
  })

  it('should handle null target values', async () => {
    mockIsHydrated.value = true

    const target = ref<Element | null>(null)
    const callback = vi.fn()

    const { isActive } = useIntersectionObserver(target, callback)
    await nextTick()

    // Observer should not be active when target is null
    expect(isActive.value).toBe(false)
  })

  it('should stop observing after first intersection when once option is true', async () => {
    // Set up mock to capture callback BEFORE hydration triggers setup
    let observerCallback: (entries: any[]) => void
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useIntersectionObserver(target, callback, { once: true })

    // Trigger hydration to create observer
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(true)
    expect(localMockObserver.observe).toHaveBeenCalledWith(element)

    // Simulate intersection
    observerCallback!([{
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      isIntersecting: true,
      rootBounds: null,
      target: element,
      time: 0,
    }])

    expect(callback).toHaveBeenCalled()
    expect(localMockObserver.disconnect).toHaveBeenCalled()
    expect(isActive.value).toBe(false)
  })

  it('should not stop when once is true but not intersecting', async () => {
    // Set up mock to capture callback BEFORE hydration triggers setup
    let observerCallback: (entries: any[]) => void
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useIntersectionObserver(target, callback, { once: true })

    // Trigger hydration to create observer
    mockIsHydrated.value = true
    await nextTick()

    expect(localMockObserver.observe).toHaveBeenCalledWith(element)

    // Simulate non-intersection
    observerCallback!([{
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 0,
      intersectionRect: {} as DOMRectReadOnly,
      isIntersecting: false,
      rootBounds: null,
      target: element,
      time: 0,
    }])

    expect(callback).toHaveBeenCalled()
    expect(localMockObserver.disconnect).not.toHaveBeenCalled()
    expect(isActive.value).toBe(true)
  })

  it('should cleanup hydration watch when stop is called before hydration', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    // Start with not hydrated
    mockIsHydrated.value = false

    const { stop, isActive } = useIntersectionObserver(target, callback)

    // Stop before hydration occurs
    stop()

    // Now trigger hydration - observer should NOT be created
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(false)
    expect(globalThis.IntersectionObserver).not.toHaveBeenCalled()
  })

  it('should cleanup observer when target changes to null while paused', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    mockIsHydrated.value = true

    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, isActive } = useIntersectionObserver(target, callback)
    await nextTick()

    expect(isActive.value).toBe(true)
    expect(localMockObserver.observe).toHaveBeenCalledTimes(1)

    // Pause the observer
    pause()
    expect(localMockObserver.disconnect).toHaveBeenCalledTimes(1)

    // Change target to null while paused
    target.value = null
    await nextTick()

    // Observer should be cleaned up (disconnect called again during cleanup)
    expect(localMockObserver.disconnect).toHaveBeenCalledTimes(2)
    expect(isActive.value).toBe(false)
  })

  it('should not create ghost observer when target changes while paused then resumed', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    mockIsHydrated.value = true

    const element2 = document.createElement('div')
    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, resume, isActive } = useIntersectionObserver(target, callback)
    await nextTick()

    expect(isActive.value).toBe(true)

    // Pause
    pause()

    // Change target while paused
    target.value = element2
    await nextTick()

    // Resume should create new observer for new target
    resume()
    await nextTick()

    expect(isActive.value).toBe(true)
    // Original observe + new observe after resume
    expect(localMockObserver.observe).toHaveBeenCalledTimes(2)
    expect(localMockObserver.observe).toHaveBeenLastCalledWith(element2)
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

  it('should reset values when paused', async () => {
    // Set up mock to capture callback BEFORE hydration triggers setup
    let observerCallback: (entries: any[]) => void
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.IntersectionObserver = globalThis.IntersectionObserver

    const target = ref<Element | null>(element)
    const { isIntersecting, intersectionRatio, pause, isPaused } = useElementIntersection(target)

    // Trigger hydration to create observer
    mockIsHydrated.value = true
    await nextTick()

    // Simulate intersection
    observerCallback!([{
      isIntersecting: true,
      intersectionRatio: 0.75,
      target: element,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: performance.now(),
    }])
    await nextTick()

    expect(isIntersecting.value).toBe(true)
    expect(intersectionRatio.value).toBe(0.75)
    expect(isPaused.value).toBe(false)

    // Pause should reset values
    pause()
    await nextTick()

    expect(isIntersecting.value).toBe(false)
    expect(intersectionRatio.value).toBe(0)
    expect(isPaused.value).toBe(true)
  })

  it('should resume correctly after pause', async () => {
    mockIsHydrated.value = true
    await nextTick()

    const target = ref<Element | null>(element)
    const { isIntersecting, pause, resume, isPaused } = useElementIntersection(target)

    // Pause
    pause()
    expect(isPaused.value).toBe(true)
    expect(isIntersecting.value).toBe(false)

    // Resume
    resume()
    expect(isPaused.value).toBe(false)
  })
})

describe('useIntersectionObserver SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return valid API during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_INTERSECTION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useIntersectionObserver: useIntersectionObserverSSR } = await import('./index')
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    const result = useIntersectionObserverSSR(target, callback)

    expect(result).toHaveProperty('isActive')
    expect(result).toHaveProperty('isIntersecting')
    expect(result).toHaveProperty('isPaused')
    expect(result).toHaveProperty('pause')
    expect(result).toHaveProperty('resume')
    expect(result).toHaveProperty('stop')
    expect(result.isActive.value).toBe(false)
    expect(result.isIntersecting.value).toBe(false)
  })

  it('should not create observer during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_INTERSECTION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: true },
        hydrate: vi.fn(),
      }),
    }))

    const { useIntersectionObserver: useIntersectionObserverSSR } = await import('./index')

    const element = document.createElement('div')
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useIntersectionObserverSSR(target, callback)

    expect(isActive.value).toBe(false)
  })

  it('should not throw when pause/resume/stop called during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_INTERSECTION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useIntersectionObserver: useIntersectionObserverSSR } = await import('./index')
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    const { pause, resume, stop } = useIntersectionObserverSSR(target, callback)

    expect(() => pause()).not.toThrow()
    expect(() => resume()).not.toThrow()
    expect(() => stop()).not.toThrow()
  })

  it('useElementIntersection should return default values during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_INTERSECTION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useElementIntersection: useElementIntersectionSSR } = await import('./index')
    const element = document.createElement('div')
    const target = ref<Element | undefined>(element)

    const { isIntersecting, intersectionRatio } = useElementIntersectionSSR(target)

    expect(isIntersecting.value).toBe(false)
    expect(intersectionRatio.value).toBe(0)
  })
})

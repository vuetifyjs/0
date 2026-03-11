import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

// Utilities
import { nextTick, readonly, ref, type Ref, shallowRef } from 'vue'

import { useElementSize, useResizeObserver } from './index'

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
  let mockObserver: { observe: Mock, unobserve: Mock, disconnect: Mock }
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

  it('should accept readonly refs (useTemplateRef compatibility)', async () => {
    mockIsHydrated.value = true
    const target = readonly(shallowRef<Element | null>(element)) as Readonly<Ref<Element | null>>
    const callback = vi.fn()

    useResizeObserver(target, callback)
    await nextTick()

    expect(globalThis.ResizeObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element, { box: 'content-box' })
  })

  it('should accept shallowRef targets', async () => {
    mockIsHydrated.value = true
    const target = shallowRef<Element | null>(element)
    const callback = vi.fn()

    useResizeObserver(target, callback)
    await nextTick()

    expect(globalThis.ResizeObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element, { box: 'content-box' })
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

  it('should stop observing after first resize when once option is true', async () => {
    // Set up mock to capture callback BEFORE hydration triggers setup
    let observerCallback: (entries: any[]) => void
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.ResizeObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useResizeObserver(target, callback, { once: true })

    // Trigger hydration to create observer
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(true)
    expect(localMockObserver.observe).toHaveBeenCalledWith(element, { box: 'content-box' })

    // Simulate resize
    observerCallback!([{
      contentRect: {
        width: 200,
        height: 100,
        top: 0,
        left: 0,
      },
      target: element,
    }])

    expect(callback).toHaveBeenCalledWith([{
      contentRect: {
        width: 200,
        height: 100,
        top: 0,
        left: 0,
      },
      target: element,
    }])
    expect(localMockObserver.disconnect).toHaveBeenCalled()
    expect(isActive.value).toBe(false)
  })

  it('should stop observing after first resize even with multiple entries when once is true', async () => {
    // Set up mock to capture callback BEFORE hydration triggers setup
    let observerCallback: (entries: any[]) => void
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.ResizeObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useResizeObserver(target, callback, { once: true })

    // Trigger hydration to create observer
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(true)

    // Simulate multiple resize entries
    observerCallback!([
      {
        contentRect: {
          width: 200,
          height: 100,
          top: 0,
          left: 0,
        },
        target: element,
      },
      {
        contentRect: {
          width: 250,
          height: 125,
          top: 0,
          left: 0,
        },
        target: element,
      },
    ])

    expect(callback).toHaveBeenCalledTimes(1)
    expect(localMockObserver.disconnect).toHaveBeenCalled()
    expect(isActive.value).toBe(false)
  })

  it('should cleanup hydration watch when stop is called before hydration', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.ResizeObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    // Start with not hydrated
    mockIsHydrated.value = false

    const { stop, isActive } = useResizeObserver(target, callback)

    // Stop before hydration occurs
    stop()

    // Now trigger hydration - observer should NOT be created
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(false)
    expect(globalThis.ResizeObserver).not.toHaveBeenCalled()
  })

  it('should cleanup observer when target changes to null while paused', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.ResizeObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    mockIsHydrated.value = true

    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, isActive } = useResizeObserver(target, callback)
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
    globalThis.ResizeObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    mockIsHydrated.value = true

    const element2 = document.createElement('div')
    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, resume, isActive } = useResizeObserver(target, callback)
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
    expect(localMockObserver.observe).toHaveBeenLastCalledWith(element2, { box: 'content-box' })
  })
})

describe('useElementSize', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    mockIsHydrated.value = false

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

  it('should reset dimensions to zero when pause is called', async () => {
    let observerCallback: ((entries: any[]) => void) | null = null
    const localMockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    globalThis.ResizeObserver = vi.fn(function (this: any, cb: any) {
      observerCallback = cb
      return localMockObserver
    }) as any
    window.ResizeObserver = globalThis.ResizeObserver

    const target = ref<Element | undefined>(element)
    const { width, height, pause } = useElementSize(target)

    // Trigger hydration
    mockIsHydrated.value = true
    await nextTick()

    // Simulate resize to set dimensions
    observerCallback!([{
      contentRect: { width: 200, height: 100 },
      target: element,
    }])

    expect(width.value).toBe(200)
    expect(height.value).toBe(100)

    // Pause should reset dimensions to 0
    pause()

    expect(width.value).toBe(0)
    expect(height.value).toBe(0)
  })
})

describe('useResizeObserver SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return valid API during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useResizeObserver: useResizeObserverSSR } = await import('./index')
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    const result = useResizeObserverSSR(target, callback)

    expect(result).toHaveProperty('isActive')
    expect(result).toHaveProperty('isPaused')
    expect(result).toHaveProperty('pause')
    expect(result).toHaveProperty('resume')
    expect(result).toHaveProperty('stop')
    expect(result.isActive.value).toBe(false)
  })

  it('should not create observer during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: true },
        hydrate: vi.fn(),
      }),
    }))

    const { useResizeObserver: useResizeObserverSSR } = await import('./index')

    const element = document.createElement('div')
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useResizeObserverSSR(target, callback)

    expect(isActive.value).toBe(false)
  })

  it('should not throw when pause/resume/stop called during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useResizeObserver: useResizeObserverSSR } = await import('./index')
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    const { pause, resume, stop } = useResizeObserverSSR(target, callback)

    expect(() => pause()).not.toThrow()
    expect(() => resume()).not.toThrow()
    expect(() => stop()).not.toThrow()
  })

  it('useElementSize should return zero dimensions during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useElementSize: useElementSizeSSR } = await import('./index')
    const element = document.createElement('div')
    const target = ref<Element | undefined>(element)

    const { width, height } = useElementSizeSSR(target)

    expect(width.value).toBe(0)
    expect(height.value).toBe(0)
  })
})

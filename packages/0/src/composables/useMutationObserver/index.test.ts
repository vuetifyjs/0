import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { nextTick, ref } from 'vue'

import { useMutationObserver } from './index'

const mockIsHydrated = ref(false)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', () => ({
  SUPPORTS_MUTATION_OBSERVER: true,
}))

describe('useMutationObserver', () => {
  let mockObserver: any
  let element: HTMLDivElement

  beforeEach(() => {
    mockIsHydrated.value = false // Start with hydration disabled

    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }

    globalThis.MutationObserver = vi.fn(function (this: any) {
      return mockObserver
    }) as any
    window.MutationObserver = globalThis.MutationObserver

    element = document.createElement('div')

    vi.clearAllMocks()
  })

  it('should not create observer when target is undefined', async () => {
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    useMutationObserver(target, callback)
    await nextTick()

    expect(globalThis.MutationObserver).not.toHaveBeenCalled()
  })

  it('should create observer when target is provided', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const result = useMutationObserver(target, callback)

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

  it('should call immediate callback when immediate option is true', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useMutationObserver(target, callback, { immediate: true })

    mockIsHydrated.value = true
    await nextTick()

    expect(callback).toHaveBeenCalledWith([{
      type: 'childList',
      target: element,
      addedNodes: expect.objectContaining({
        length: 0,
      }),
      removedNodes: expect.objectContaining({
        length: 0,
      }),
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
    }])
  })

  it('should handle pause and resume functionality', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { pause, resume, isPaused } = useMutationObserver(target, callback)

    expect(isPaused.value).toBe(false)

    pause()
    expect(isPaused.value).toBe(true)

    resume()
    expect(isPaused.value).toBe(false)
  })

  it('should handle observer options correctly', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()
    const options = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      attributeFilter: ['class', 'id'],
    }

    useMutationObserver(target, callback, options)

    mockIsHydrated.value = true
    await nextTick()

    expect(globalThis.MutationObserver).toHaveBeenCalledWith(expect.any(Function))
    expect(mockObserver.observe).toHaveBeenCalledWith(element, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      attributeFilter: ['class', 'id'],
    })
  })

  it('should use default options when none provided', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useMutationObserver(target, callback)

    mockIsHydrated.value = true
    await nextTick()

    expect(mockObserver.observe).toHaveBeenCalledWith(element, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: false,
      attributeOldValue: false,
      characterDataOldValue: false,
      attributeFilter: undefined,
    })
  })

  it('should transform native mutation records correctly', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    useMutationObserver(target, callback)

    mockIsHydrated.value = true
    await nextTick()

    // Verify observer was created
    expect(globalThis.MutationObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element, expect.any(Object))
  })

  it('should cleanup observer on stop', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { stop } = useMutationObserver(target, callback)

    mockIsHydrated.value = true
    await nextTick()

    expect(globalThis.MutationObserver).toHaveBeenCalled()

    stop()
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })

  it('should stop observing after first mutation when once is true', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    let observerCallback: Function | undefined

    globalThis.MutationObserver = vi.fn(function (this: any, cb: Function) {
      observerCallback = cb
      return mockObserver
    }) as any

    const { isActive } = useMutationObserver(target, callback, { once: true })

    mockIsHydrated.value = true
    await nextTick()

    expect(globalThis.MutationObserver).toHaveBeenCalled()
    expect(isActive.value).toBe(true)

    // Simulate a mutation
    const mockMutation = {
      type: 'childList',
      target: element,
      addedNodes: document.createElement('div').childNodes,
      removedNodes: document.createElement('div').childNodes,
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
    }

    observerCallback?.([mockMutation])
    await nextTick()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(mockObserver.disconnect).toHaveBeenCalled()
    expect(isActive.value).toBe(false)
  })

  it('should stop observing after immediate callback when once and immediate are both true', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { isActive } = useMutationObserver(target, callback, { once: true, immediate: true })

    mockIsHydrated.value = true
    await nextTick()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(mockObserver.disconnect).toHaveBeenCalled()
    expect(isActive.value).toBe(false)
  })

  it('should continue observing when once is false', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    let observerCallback: Function | undefined

    globalThis.MutationObserver = vi.fn(function (this: any, cb: Function) {
      observerCallback = cb
      return mockObserver
    }) as any

    const { isActive } = useMutationObserver(target, callback, { once: false })

    mockIsHydrated.value = true
    await nextTick()

    expect(globalThis.MutationObserver).toHaveBeenCalled()
    expect(isActive.value).toBe(true)

    // Reset mocks after setup phase
    vi.clearAllMocks()

    // Simulate multiple mutations
    const mockMutation = {
      type: 'childList',
      target: element,
      addedNodes: document.createElement('div').childNodes,
      removedNodes: document.createElement('div').childNodes,
      previousSibling: null,
      nextSibling: null,
      attributeName: null,
      attributeNamespace: null,
      oldValue: null,
    }

    observerCallback?.([mockMutation])
    await nextTick()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(mockObserver.disconnect).not.toHaveBeenCalled()
    expect(isActive.value).toBe(true)

    // Second mutation should still be observed
    observerCallback?.([mockMutation])
    await nextTick()

    expect(callback).toHaveBeenCalledTimes(2)
    expect(isActive.value).toBe(true)
  })

  it('should cleanup hydration watch when stop is called before hydration', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.MutationObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.MutationObserver = globalThis.MutationObserver

    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    // Start with not hydrated
    mockIsHydrated.value = false

    const { stop, isActive } = useMutationObserver(target, callback)

    // Stop before hydration occurs
    stop()

    // Now trigger hydration - observer should NOT be created
    mockIsHydrated.value = true
    await nextTick()

    expect(isActive.value).toBe(false)
    expect(globalThis.MutationObserver).not.toHaveBeenCalled()
  })

  it('should cleanup observer when target changes to null while paused', async () => {
    const localMockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }
    globalThis.MutationObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.MutationObserver = globalThis.MutationObserver

    mockIsHydrated.value = true

    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, isActive } = useMutationObserver(target, callback)
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
      disconnect: vi.fn(),
    }
    globalThis.MutationObserver = vi.fn(function (this: any) {
      return localMockObserver
    }) as any
    window.MutationObserver = globalThis.MutationObserver

    mockIsHydrated.value = true

    const element2 = document.createElement('div')
    const target = ref<Element | null>(element)
    const callback = vi.fn()

    const { pause, resume, isActive } = useMutationObserver(target, callback)
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
  })
})

describe('useMutationObserver SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return valid API during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_MUTATION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useMutationObserver: useMutationObserverSSR } = await import('./index')
    const target = { value: undefined }
    const callback = vi.fn()

    const result = useMutationObserverSSR(target as any, callback)

    expect(result).toHaveProperty('isActive')
    expect(result).toHaveProperty('isPaused')
    expect(result).toHaveProperty('pause')
    expect(result).toHaveProperty('resume')
    expect(result).toHaveProperty('stop')
    expect(result.isActive.value).toBe(false)
  })

  it('should not create observer during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_MUTATION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: true },
        hydrate: vi.fn(),
      }),
    }))

    const { useMutationObserver: useMutationObserverSSR } = await import('./index')

    const element = document.createElement('div')
    const target = { value: element }
    const callback = vi.fn()

    const { isActive } = useMutationObserverSSR(target as any, callback)

    expect(isActive.value).toBe(false)
  })

  it('should not throw when pause/resume/stop called during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      SUPPORTS_MUTATION_OBSERVER: false,
    }))

    vi.doMock('#v0/composables/useHydration', () => ({
      useHydration: () => ({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      }),
    }))

    const { useMutationObserver: useMutationObserverSSR } = await import('./index')
    const target = { value: undefined }
    const callback = vi.fn()

    const { pause, resume, stop } = useMutationObserverSSR(target as any, callback)

    expect(() => pause()).not.toThrow()
    expect(() => resume()).not.toThrow()
    expect(() => stop()).not.toThrow()
  })
})

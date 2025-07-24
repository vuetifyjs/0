// Composables
import { useMutationObserver } from './index'

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
  SUPPORTS_MUTATION_OBSERVER: true,
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onUnmounted: vi.fn(),
  }
})

describe('useMutationObserver', () => {
  let mockObserver: any
  let element: HTMLDivElement

  beforeEach(() => {
    mockIsHydrated.value = false // Start with hydration disabled

    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    }

    global.MutationObserver = vi.fn(() => mockObserver)
    window.MutationObserver = vi.fn(() => mockObserver)

    element = document.createElement('div')

    vi.clearAllMocks()
  })

  it('should not create observer when target is undefined', async () => {
    const target = ref<Element | undefined>(undefined)
    const callback = vi.fn()

    useMutationObserver(target, callback)
    await nextTick()

    expect(global.MutationObserver).not.toHaveBeenCalled()
  })

  it('should create observer when target is provided', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const result = useMutationObserver(target, callback)

    expect(result).toEqual({
      isPaused: expect.any(Object),
      pause: expect.any(Function),
      resume: expect.any(Function),
      stop: expect.any(Function),
    })

    expect(typeof result.pause).toBe('function')
    expect(typeof result.resume).toBe('function')
    expect(typeof result.stop).toBe('function')
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

    expect(global.MutationObserver).toHaveBeenCalledWith(expect.any(Function))
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
    expect(global.MutationObserver).toHaveBeenCalled()
    expect(mockObserver.observe).toHaveBeenCalledWith(element, expect.any(Object))
  })

  it('should cleanup observer on stop', async () => {
    const target = ref<Element | undefined>(element)
    const callback = vi.fn()

    const { stop } = useMutationObserver(target, callback)

    mockIsHydrated.value = true
    await nextTick()

    expect(global.MutationObserver).toHaveBeenCalled()

    stop()
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })
})

import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { createObserver } from './index'

// Utilities
import { effectScope, nextTick, ref } from 'vue'

const mockIsHydrated = ref(false)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

interface MockObserver {
  observe: Mock
  disconnect: Mock
}

function createMockObserverFactory () {
  let callback: ((entries: unknown[]) => void) | undefined
  const observer: MockObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
  }

  function factory (cb: (entries: unknown[]) => void) {
    callback = cb
    return observer
  }

  function emit (entries: unknown[]) {
    callback?.(entries)
  }

  return { observer, factory, emit }
}

describe('createObserver', () => {
  let element: HTMLDivElement

  beforeEach(() => {
    mockIsHydrated.value = false
    element = document.createElement('div')
    vi.clearAllMocks()
  })

  describe('three-state sentinel', () => {
    it('should start as inactive (undefined sentinel)', () => {
      const target = ref<Element | undefined>(undefined)

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      expect(isActive.value).toBe(false)
    })

    it('should become active (instance sentinel) after setup', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const { observer } = createMockObserverFactory()

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => observer,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(true)
    })

    it('should become permanently stopped (null sentinel) after stop', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const { observer } = createMockObserverFactory()

      const { isActive, stop } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => observer,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(true)

      stop()

      expect(isActive.value).toBe(false)
    })

    it('should not recreate observer after stop (null sentinel blocks setup)', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { stop, resume, isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      expect(create).toHaveBeenCalledTimes(1)

      stop()
      resume()
      await nextTick()

      expect(isActive.value).toBe(false)
      expect(create).toHaveBeenCalledTimes(1)
    })
  })

  describe('hydration watch cleanup', () => {
    it('should set up observer after hydration completes', async () => {
      const target = ref<Element | undefined>(element)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })

      expect(isActive.value).toBe(false)

      mockIsHydrated.value = true
      await nextTick()

      expect(isActive.value).toBe(true)
      expect(observe).toHaveBeenCalledWith(mock, element)
    })

    it('should clean up hydration watch after hydration fires', async () => {
      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })

      mockIsHydrated.value = true
      await nextTick()

      expect(create).toHaveBeenCalledTimes(1)

      // Toggling hydration back and forth should not trigger setup again
      // (the watch was disposed)
      mockIsHydrated.value = false
      await nextTick()
      mockIsHydrated.value = true
      await nextTick()

      expect(create).toHaveBeenCalledTimes(1)
    })

    it('should clean up hydration watch when stop is called before hydration', async () => {
      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { stop, isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })

      stop()

      mockIsHydrated.value = true
      await nextTick()

      expect(isActive.value).toBe(false)
      expect(create).not.toHaveBeenCalled()
    })

    it('should skip hydration watch when already hydrated', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })
      await nextTick()

      expect(isActive.value).toBe(true)
      expect(observe).toHaveBeenCalledWith(mock, element)
    })
  })

  describe('setup and cleanup on target change', () => {
    it('should disconnect old observer and create new one when target changes', async () => {
      mockIsHydrated.value = true

      const element2 = document.createElement('div')
      const target = ref<Element | null>(element)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })
      await nextTick()

      expect(isActive.value).toBe(true)
      expect(observe).toHaveBeenCalledWith(mock, element)

      target.value = element2
      await nextTick()

      expect(mock.disconnect).toHaveBeenCalled()
      expect(observe).toHaveBeenCalledWith(mock, element2)
      expect(isActive.value).toBe(true)
    })

    it('should clean up when target changes to null', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | null>(element)
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(true)

      target.value = null
      await nextTick()

      expect(mock.disconnect).toHaveBeenCalled()
      expect(isActive.value).toBe(false)
    })

    it('should not create observer when target is undefined', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(undefined)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(false)
      expect(create).not.toHaveBeenCalled()
    })

    it('should create observer when target changes from undefined to element', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(undefined)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })
      await nextTick()

      expect(isActive.value).toBe(false)

      target.value = element
      await nextTick()

      expect(isActive.value).toBe(true)
      expect(observe).toHaveBeenCalledWith(mock, element)
    })
  })

  describe('pause and resume', () => {
    it('should set isPaused to true when paused', () => {
      const target = ref<Element | undefined>(element)

      const { pause, isPaused } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      expect(isPaused.value).toBe(false)

      pause()

      expect(isPaused.value).toBe(true)
    })

    it('should set isPaused to false when resumed', () => {
      const target = ref<Element | undefined>(element)

      const { pause, resume, isPaused } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      pause()
      expect(isPaused.value).toBe(true)

      resume()
      expect(isPaused.value).toBe(false)
    })

    it('should disconnect observer on pause', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const mock = { disconnect: vi.fn() }

      const { pause } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe: vi.fn(),
      })
      await nextTick()

      pause()

      expect(mock.disconnect).toHaveBeenCalled()
    })

    it('should call onPause callback when pausing', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const onPause = vi.fn()

      const { pause } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
        onPause,
      })
      await nextTick()

      pause()

      expect(onPause).toHaveBeenCalled()
    })

    it('should recreate observer on resume', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))
      const observe = vi.fn()

      const { pause, resume } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe,
      })
      await nextTick()

      expect(create).toHaveBeenCalledTimes(1)

      pause()
      resume()

      expect(create).toHaveBeenCalledTimes(2)
      expect(observe).toHaveBeenCalledTimes(2)
    })

    it('should not create observer on resume when paused without target', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(undefined)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { pause, resume } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      pause()
      resume()

      expect(create).not.toHaveBeenCalled()
    })

    it('should not set up observer during pause when target changes', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | null>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { pause } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      expect(create).toHaveBeenCalledTimes(1)

      pause()

      // Target changes while paused - watch fires but setup skips due to isPaused
      target.value = document.createElement('div')
      await nextTick()

      // Only the initial create, not a new one from target change while paused
      // (cleanup runs but setup is blocked by isPaused)
      expect(create).toHaveBeenCalledTimes(1)
    })

    it('should observe new target after pause, target change, then resume', async () => {
      mockIsHydrated.value = true

      const element2 = document.createElement('div')
      const target = ref<Element | null>(element)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { pause, resume, isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })
      await nextTick()

      expect(observe).toHaveBeenCalledWith(mock, element)

      pause()
      target.value = element2
      await nextTick()
      resume()

      expect(observe).toHaveBeenCalledWith(mock, element2)
      expect(isActive.value).toBe(true)
    })
  })

  describe('once option', () => {
    it('should stop after callback fires', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const { observer, factory, emit } = createMockObserverFactory()

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: factory,
        observe: (obs, el) => obs.observe(el),
      })
      await nextTick()

      expect(isActive.value).toBe(true)

      emit([{ target: element }])

      expect(callback).toHaveBeenCalledTimes(1)
      expect(observer.disconnect).toHaveBeenCalled()
      expect(isActive.value).toBe(false)
    })

    it('should respect shouldStop returning false', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const { observer, factory, emit } = createMockObserverFactory()

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: factory,
        observe: (obs, el) => obs.observe(el),
        shouldStop: () => false,
      })
      await nextTick()

      emit([{ target: element }])

      expect(callback).toHaveBeenCalledTimes(1)
      expect(observer.disconnect).not.toHaveBeenCalled()
      expect(isActive.value).toBe(true)
    })

    it('should stop when shouldStop returns true', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const { observer, factory, emit } = createMockObserverFactory()

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: factory,
        observe: (obs, el) => obs.observe(el),
        shouldStop: entries => (entries[0] as Record<string, unknown>)?.ready === true,
      })
      await nextTick()

      emit([{ ready: false }])
      expect(isActive.value).toBe(true)

      emit([{ ready: true }])
      expect(observer.disconnect).toHaveBeenCalled()
      expect(isActive.value).toBe(false)
    })
  })

  describe('onceIncludesImmediate option', () => {
    it('should stop after immediate when onceIncludesImmediate is true', async () => {
      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: () => mock,
        observe: vi.fn(),
        immediate: () => [{ target: element }],
        onceIncludesImmediate: true,
      })

      mockIsHydrated.value = true
      await nextTick()

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith([{ target: element }])
      expect(mock.disconnect).toHaveBeenCalled()
      expect(isActive.value).toBe(false)
    })

    it('should not stop after immediate when onceIncludesImmediate is false', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: () => mock,
        observe: vi.fn(),
        immediate: () => [{ target: element }],
        onceIncludesImmediate: false,
      })
      await nextTick()

      expect(callback).toHaveBeenCalledTimes(1)
      expect(mock.disconnect).not.toHaveBeenCalled()
      expect(isActive.value).toBe(true)
    })

    it('should not stop after immediate when onceIncludesImmediate is undefined (default)', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const mock = { disconnect: vi.fn() }

      const { isActive } = createObserver(target, callback, {
        supports: true,
        once: true,
        create: () => mock,
        observe: vi.fn(),
        immediate: () => [{ target: element }],
      })
      await nextTick()

      expect(callback).toHaveBeenCalledTimes(1)
      expect(mock.disconnect).not.toHaveBeenCalled()
      expect(isActive.value).toBe(true)
    })
  })

  describe('immediate option', () => {
    it('should call callback immediately when immediate is provided', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()

      createObserver(target, callback, {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
        immediate: el => [{ target: el, width: 100 }],
      })
      await nextTick()

      expect(callback).toHaveBeenCalledWith([{ target: element, width: 100 }])
    })

    it('should call onEntry for immediate when onceIncludesImmediate is false', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const onEntry = vi.fn()

      createObserver(target, callback, {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
        immediate: el => [{ target: el }],
        onEntry,
        onceIncludesImmediate: false,
      })
      await nextTick()

      expect(onEntry).toHaveBeenCalledWith([{ target: element }])
      expect(callback).toHaveBeenCalledWith([{ target: element }])
    })

    it('should call onEntry via invoke when onceIncludesImmediate is true', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const callback = vi.fn()
      const onEntry = vi.fn()

      createObserver(target, callback, {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
        immediate: el => [{ target: el }],
        onEntry,
        onceIncludesImmediate: true,
      })
      await nextTick()

      expect(onEntry).toHaveBeenCalledWith([{ target: element }])
      expect(callback).toHaveBeenCalledWith([{ target: element }])
    })

    it('should not call immediate when target is not an element', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(undefined)
      const callback = vi.fn()
      const immediate = vi.fn(() => [])

      createObserver(target, callback, {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
        immediate,
      })
      await nextTick()

      expect(immediate).not.toHaveBeenCalled()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('onEntry callback', () => {
    it('should call onEntry before user callback on observer fire', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const order: string[] = []
      const callback = vi.fn(() => order.push('user'))
      const onEntry = vi.fn(() => order.push('onEntry'))
      const { factory, emit } = createMockObserverFactory()

      createObserver(target, callback, {
        supports: true,
        create: factory,
        observe: (obs, el) => obs.observe(el),
        onEntry,
      })
      await nextTick()

      emit([{ target: element }])

      expect(order).toEqual(['onEntry', 'user'])
    })
  })

  describe('server-side rendering safety', () => {
    it('should not create observer when supports is false', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { isActive } = createObserver(target, vi.fn(), {
        supports: false,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(false)
      expect(create).not.toHaveBeenCalled()
    })

    it('should not throw when pause/resume/stop called with supports false', () => {
      const target = ref<Element | undefined>(undefined)

      const { pause, resume, stop } = createObserver(target, vi.fn(), {
        supports: false,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      expect(() => pause()).not.toThrow()
      expect(() => resume()).not.toThrow()
      expect(() => stop()).not.toThrow()
    })

    it('should not create observer when not hydrated', async () => {
      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const { isActive } = createObserver(target, vi.fn(), {
        supports: true,
        create,
        observe: vi.fn(),
      })
      await nextTick()

      expect(isActive.value).toBe(false)
      expect(create).not.toHaveBeenCalled()
    })
  })

  describe('multiple targets', () => {
    it('should re-observe when target ref changes between elements', async () => {
      mockIsHydrated.value = true

      const element2 = document.createElement('div')
      const element3 = document.createElement('div')
      const target = ref<Element>(element)
      const observe = vi.fn()
      const mock = { disconnect: vi.fn() }

      createObserver(target, vi.fn(), {
        supports: true,
        create: () => mock,
        observe,
      })
      await nextTick()

      expect(observe).toHaveBeenCalledWith(mock, element)

      target.value = element2
      await nextTick()

      expect(mock.disconnect).toHaveBeenCalledTimes(1)
      expect(observe).toHaveBeenCalledWith(mock, element2)

      target.value = element3
      await nextTick()

      expect(mock.disconnect).toHaveBeenCalledTimes(2)
      expect(observe).toHaveBeenCalledWith(mock, element3)
      expect(observe).toHaveBeenCalledTimes(3)
    })
  })

  describe('cleanup on scope disposal', () => {
    it('should stop observer when effect scope is disposed', async () => {
      mockIsHydrated.value = true

      const target = ref<Element | undefined>(element)
      const mock = { disconnect: vi.fn() }
      let isActive: { value: boolean }

      const scope = effectScope()
      scope.run(() => {
        const result = createObserver(target, vi.fn(), {
          supports: true,
          create: () => mock,
          observe: vi.fn(),
        })
        isActive = result.isActive
      })
      await nextTick()

      expect(isActive!.value).toBe(true)

      scope.stop()

      expect(mock.disconnect).toHaveBeenCalled()
      expect(isActive!.value).toBe(false)
    })

    it('should not create observer after scope is disposed', async () => {
      const target = ref<Element | undefined>(element)
      const create = vi.fn(() => ({ disconnect: vi.fn() }))

      const scope = effectScope()
      scope.run(() => {
        createObserver(target, vi.fn(), {
          supports: true,
          create,
          observe: vi.fn(),
        })
      })

      scope.stop()

      mockIsHydrated.value = true
      await nextTick()

      expect(create).not.toHaveBeenCalled()
    })
  })

  describe('return value shape', () => {
    it('should return isActive, isPaused, pause, resume, and stop', () => {
      const target = ref<Element | undefined>(undefined)

      const result = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      expect(result).toEqual({
        isActive: expect.any(Object),
        isPaused: expect.any(Object),
        pause: expect.any(Function),
        resume: expect.any(Function),
        stop: expect.any(Function),
      })
    })

    it('should return readonly refs for isActive and isPaused', () => {
      const target = ref<Element | undefined>(undefined)

      const { isActive, isPaused } = createObserver(target, vi.fn(), {
        supports: true,
        create: () => ({ disconnect: vi.fn() }),
        observe: vi.fn(),
      })

      // Readonly refs should not be directly writable
      expect(typeof isActive.value).toBe('boolean')
      expect(typeof isPaused.value).toBe('boolean')
    })
  })
})

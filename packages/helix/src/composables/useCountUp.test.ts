import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, ref } from 'vue'

// Mock useIntersectionObserver before importing the composable
vi.mock('@vuetify/v0', async importOriginal => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useIntersectionObserver: (_el: unknown, callback: (entries: IntersectionObserverEntry[]) => void) => {
      // Store the callback so tests can trigger it
      ;(globalThis as any).__intersectionCallback = callback
      return {
        stop: vi.fn(),
      }
    },
  }
})

// Composables
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    ;(globalThis as any).__intersectionCallback = undefined
  })

  afterEach(() => {
    vi.useRealTimers()
    delete (globalThis as any).__intersectionCallback
  })

  it('current starts at 0 by default', () => {
    const scope = effectScope()
    scope.run(() => {
      const el = ref(document.createElement('div'))
      const { current } = useCountUp(el, 100)
      expect(current.value).toBe(0)
    })
    scope.stop()
  })

  it('current starts at the from value', () => {
    const scope = effectScope()
    scope.run(() => {
      const el = ref(document.createElement('div'))
      const { current } = useCountUp(el, 100, { from: 50 })
      expect(current.value).toBe(50)
    })
    scope.stop()
  })

  it('animates toward target after intersection fires', () => {
    const scope = effectScope()
    scope.run(() => {
      const el = ref(document.createElement('div'))
      const { current } = useCountUp(el, 100, { duration: 100 })

      // Simulate intersection
      const callback = (globalThis as any).__intersectionCallback
      expect(callback).toBeDefined()

      // Trigger intersection entry
      callback([{ isIntersecting: true }])

      // After full duration of rAF frames, value should reach target.
      // We need to simulate requestAnimationFrame progression.
      // happy-dom supports rAF with fake timers.
      vi.advanceTimersByTime(200)

      expect(current.value).toBe(100)
    })
    scope.stop()
  })

  it('does not animate when entry is not intersecting', () => {
    const scope = effectScope()
    scope.run(() => {
      const el = ref(document.createElement('div'))
      const { current } = useCountUp(el, 100, { duration: 100 })

      const callback = (globalThis as any).__intersectionCallback
      callback([{ isIntersecting: false }])

      vi.advanceTimersByTime(200)
      expect(current.value).toBe(0)
    })
    scope.stop()
  })
})

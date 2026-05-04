import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDelay } from './index'

// Utilities
import { effectScope, shallowRef } from 'vue'

describe('useDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic lifecycle', () => {
    it('should fire callback after open delay elapses', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000 })

      const promise = delay.start(true)

      expect(callback).not.toHaveBeenCalled()
      expect(delay.isActive.value).toBe(true)
      expect(delay.isOpening.value).toBe(true)

      vi.advanceTimersByTime(1000)
      await promise

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(true)
      expect(delay.isActive.value).toBe(false)
    })

    it('should fire callback after close delay elapses', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { closeDelay: 500 })

      const promise = delay.start(false)

      expect(delay.isOpening.value).toBe(false)
      vi.advanceTimersByTime(500)
      await promise

      expect(callback).toHaveBeenCalledWith(false)
    })

    it('should resolve promise with direction', async () => {
      const delay = useDelay(undefined, { openDelay: 200 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(200)

      await expect(promise).resolves.toBe(true)
    })

    it('should work without a callback', async () => {
      const delay = useDelay(undefined, { openDelay: 100 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(100)

      await expect(promise).resolves.toBe(true)
    })

    it('should default both delays to 0 (synchronous fire)', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback)

      await delay.start(true)

      expect(callback).toHaveBeenCalledWith(true)
      expect(delay.isActive.value).toBe(false)
    })
  })

  describe('reactive delays', () => {
    it('should accept a plain number', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 750 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(750)
      await promise

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('should accept a ref and read fresh on each start', async () => {
      const openDelay = shallowRef(500)
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay })

      const first = delay.start(true)
      vi.advanceTimersByTime(500)
      await first

      openDelay.value = 1000

      const second = delay.start(true)
      vi.advanceTimersByTime(999)
      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1)
      await second

      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should accept a getter', async () => {
      let target = 300
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: () => target })

      const first = delay.start(true)
      vi.advanceTimersByTime(300)
      await first

      target = 800

      const second = delay.start(true)
      vi.advanceTimersByTime(799)
      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1)
      await second

      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should not affect in-flight delay when source changes', async () => {
      const openDelay = shallowRef(1000)
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay })

      const promise = delay.start(true)

      openDelay.value = 100

      vi.advanceTimersByTime(999)
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      await promise

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('minDelay floor', () => {
    it('should enforce minDelay when greater than configured delay', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { closeDelay: 200 })

      const promise = delay.start(false, { minDelay: 800 })

      vi.advanceTimersByTime(799)
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      await promise

      expect(callback).toHaveBeenCalledWith(false)
    })

    it('should defer to configured delay when minDelay is smaller', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { closeDelay: 1000 })

      const promise = delay.start(false, { minDelay: 200 })

      vi.advanceTimersByTime(999)
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      await promise

      expect(callback).toHaveBeenCalledWith(false)
    })

    it('should reset minDelay between calls', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 100 })

      // First call with minDelay=500
      const first = delay.start(true, { minDelay: 500 })
      vi.advanceTimersByTime(500)
      await first

      // Second call without minDelay should use raw openDelay
      const second = delay.start(true)
      vi.advanceTimersByTime(99)
      expect(callback).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1)
      await second

      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('re-entrancy', () => {
    it('should resolve previous promise with new direction on back-to-back start', async () => {
      const delay = useDelay(undefined, { openDelay: 1000, closeDelay: 1000 })

      const first = delay.start(true)
      vi.advanceTimersByTime(300)

      const second = delay.start(false)

      // Previous promise resolves with the NEW direction
      await expect(first).resolves.toBe(false)

      vi.advanceTimersByTime(1000)
      await expect(second).resolves.toBe(false)
    })

    it('should cancel the in-flight timer when restarting', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000, closeDelay: 500 })

      delay.start(true)
      vi.advanceTimersByTime(700)

      const second = delay.start(false)

      // Original openDelay (300ms remaining) should NOT fire
      vi.advanceTimersByTime(300)
      expect(callback).not.toHaveBeenCalled()

      // New closeDelay should fire after 500ms total since restart
      vi.advanceTimersByTime(200)
      await second

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(false)
    })
  })

  describe('stop', () => {
    it('should cancel pending delay', () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000 })

      delay.start(true)
      vi.advanceTimersByTime(500)

      delay.stop()

      vi.advanceTimersByTime(2000)
      expect(callback).not.toHaveBeenCalled()
      expect(delay.isActive.value).toBe(false)
    })

    it('should resolve pending promise with current isOpening', async () => {
      const delay = useDelay(undefined, { openDelay: 1000 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(300)

      delay.stop()

      await expect(promise).resolves.toBe(true)
    })

    it('should not invoke the callback', () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000 })

      delay.start(true)
      delay.stop()

      vi.advanceTimersByTime(2000)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should be a no-op when nothing is pending', () => {
      const delay = useDelay(vi.fn(), { openDelay: 1000 })

      expect(() => delay.stop()).not.toThrow()
      expect(delay.isActive.value).toBe(false)
    })
  })

  describe('pause and resume', () => {
    it('should pause and preserve remaining', () => {
      const delay = useDelay(undefined, { openDelay: 1000 })

      delay.start(true)
      vi.advanceTimersByTime(400)

      delay.pause()

      expect(delay.isPaused.value).toBe(true)
      expect(delay.isActive.value).toBe(true)
      expect(delay.remaining.value).toBe(600)
    })

    it('should resume from where paused', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(400)

      delay.pause()
      vi.advanceTimersByTime(5000)
      delay.resume()

      vi.advanceTimersByTime(599)
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      await promise

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('should keep isOpening unchanged through pause/resume', () => {
      const delay = useDelay(undefined, { openDelay: 1000 })

      delay.start(true)
      delay.pause()
      expect(delay.isOpening.value).toBe(true)

      delay.resume()
      expect(delay.isOpening.value).toBe(true)
    })
  })

  describe('synchronous fire (zero delay)', () => {
    it('should fire synchronously when openDelay is 0', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 0 })

      await delay.start(true)

      expect(callback).toHaveBeenCalledWith(true)
      expect(delay.isActive.value).toBe(false)
    })

    it('should fire synchronously when resolved delay is negative', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: -100 })

      await delay.start(true)

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('should cancel any in-flight timer on sync fire', async () => {
      const callback = vi.fn()
      const delay = useDelay(callback, { openDelay: 1000, closeDelay: 0 })

      delay.start(true)
      vi.advanceTimersByTime(500)

      const second = delay.start(false)

      // Sync fire happened
      await second
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenLastCalledWith(false)

      // Original 1000ms timer should NOT fire
      vi.advanceTimersByTime(2000)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('isOpening tracking', () => {
    it('should reflect direction set by start', () => {
      const delay = useDelay(undefined, { openDelay: 1000, closeDelay: 1000 })

      delay.start(true)
      expect(delay.isOpening.value).toBe(true)

      delay.start(false)
      expect(delay.isOpening.value).toBe(false)
    })

    it('should be readonly at the type boundary', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const delay = useDelay()
      // Runtime guard — shallowReadonly rejects writes (warns in dev, ignores in prod)
      const ref = delay.isOpening as { value: boolean }
      const before = ref.value
      ref.value = true

      expect(ref.value).toBe(before)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('readonly'), expect.anything())
      spy.mockRestore()
    })
  })

  describe('callback throw safety', () => {
    it('should resolve promise even if callback throws', async () => {
      const callback = vi.fn(() => {
        throw new Error('boom')
      })
      const delay = useDelay(callback, { openDelay: 100 })

      const promise = delay.start(true)
      try {
        vi.advanceTimersByTime(100)
      } catch { /* fake-timer surfaces the throw — ignored */ }

      await expect(promise).resolves.toBe(true)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('auto-cleanup', () => {
    it('should clear timer on scope disposal', () => {
      const callback = vi.fn()
      const scope = effectScope()

      scope.run(() => {
        const delay = useDelay(callback, { openDelay: 1000 })
        delay.start(true)
      })

      scope.stop()

      vi.advanceTimersByTime(2000)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should resolve pending promise on scope disposal with current isOpening', async () => {
      const scope = effectScope()
      let pending: Promise<boolean>

      scope.run(() => {
        const delay = useDelay(undefined, { openDelay: 1000 })
        pending = delay.start(true)
      })

      scope.stop()

      await expect(pending!).resolves.toBe(true)
    })
  })

  describe('remaining tracking', () => {
    it('should expose remaining time during in-flight delay', () => {
      const delay = useDelay(undefined, { openDelay: 1000 })

      delay.start(true)
      expect(delay.remaining.value).toBe(1000)

      vi.advanceTimersByTime(400)
      expect(delay.remaining.value).toBe(600)
    })

    it('should be 0 after the delay fires', async () => {
      const delay = useDelay(undefined, { openDelay: 500 })

      const promise = delay.start(true)
      vi.advanceTimersByTime(500)
      await promise

      expect(delay.remaining.value).toBe(0)
    })
  })
})

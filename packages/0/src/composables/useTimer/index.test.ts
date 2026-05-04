import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTimer } from './index'

// Utilities
import { effectScope } from 'vue'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic lifecycle', () => {
    it('should fire handler after duration', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()

      expect(handler).not.toHaveBeenCalled()
      expect(timer.isActive.value).toBe(true)

      vi.advanceTimersByTime(1000)

      expect(handler).toHaveBeenCalledOnce()
      expect(timer.isActive.value).toBe(false)
    })

    it('should use default duration of 1000ms', () => {
      const handler = vi.fn()
      const timer = useTimer(handler)

      timer.start()

      vi.advanceTimersByTime(999)
      expect(handler).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(handler).toHaveBeenCalledOnce()
    })

    it('should not be active before start', () => {
      const timer = useTimer(vi.fn())

      expect(timer.isActive.value).toBe(false)
      expect(timer.isPaused.value).toBe(false)
    })
  })

  describe('repeat mode', () => {
    it('should fire handler multiple times', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 500, repeat: true })

      timer.start()

      vi.advanceTimersByTime(500)
      expect(handler).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(500)
      expect(handler).toHaveBeenCalledTimes(2)

      vi.advanceTimersByTime(500)
      expect(handler).toHaveBeenCalledTimes(3)

      expect(timer.isActive.value).toBe(true)
    })

    it('should stop repeating when stop is called', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 500, repeat: true })

      timer.start()

      vi.advanceTimersByTime(500)
      expect(handler).toHaveBeenCalledTimes(1)

      timer.stop()

      vi.advanceTimersByTime(500)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('pause and resume', () => {
    it('should pause and preserve remaining time', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(400)

      timer.pause()

      expect(timer.isPaused.value).toBe(true)
      expect(timer.isActive.value).toBe(true)
      expect(timer.remaining.value).toBe(600)

      // Handler should not fire while paused
      vi.advanceTimersByTime(2000)
      expect(handler).not.toHaveBeenCalled()
    })

    it('should resume from where it left off', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(400)

      timer.pause()
      timer.resume()

      expect(timer.isPaused.value).toBe(false)

      // Should fire after remaining 600ms
      vi.advanceTimersByTime(599)
      expect(handler).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(handler).toHaveBeenCalledOnce()
    })

    it('should support multiple pause/resume cycles', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(300)

      timer.pause()
      expect(timer.remaining.value).toBe(700)

      vi.advanceTimersByTime(5000)

      timer.resume()
      vi.advanceTimersByTime(200)

      timer.pause()
      expect(timer.remaining.value).toBe(500)

      timer.resume()
      vi.advanceTimersByTime(500)

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('stop', () => {
    it('should cancel pending timer and reset state', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(500)

      timer.stop()

      expect(timer.isActive.value).toBe(false)
      expect(timer.isPaused.value).toBe(false)
      expect(timer.remaining.value).toBe(1000)

      vi.advanceTimersByTime(2000)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('restart', () => {
    it('should restart when calling start while running', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(700)

      timer.start() // restart

      // Original timer at t=1000 should not fire
      vi.advanceTimersByTime(300)
      expect(handler).not.toHaveBeenCalled()

      // New timer should fire after full duration from restart
      vi.advanceTimersByTime(700)
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('remaining tracking', () => {
    it('should decrease remaining over time', () => {
      const timer = useTimer(vi.fn(), { duration: 1000 })

      timer.start()
      expect(timer.remaining.value).toBe(1000)

      vi.advanceTimersByTime(500)
      expect(timer.remaining.value).toBe(500)
    })

    it('should reset remaining on stop', () => {
      const timer = useTimer(vi.fn(), { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(500)

      timer.stop()
      expect(timer.remaining.value).toBe(1000)
    })

    it('should be 0 after one-shot timer fires', () => {
      const timer = useTimer(vi.fn(), { duration: 1000 })

      timer.start()
      vi.advanceTimersByTime(1000)

      expect(timer.remaining.value).toBe(0)
    })

    it('should reset to full duration after repeat fires', () => {
      const timer = useTimer(vi.fn(), { duration: 1000, repeat: true })

      timer.start()
      vi.advanceTimersByTime(1000)

      // After firing, remaining resets to full duration for next cycle
      expect(timer.remaining.value).toBe(1000)
    })
  })

  describe('no-ops', () => {
    it('should no-op pause when not running', () => {
      const timer = useTimer(vi.fn())

      timer.pause()

      expect(timer.isPaused.value).toBe(false)
      expect(timer.isActive.value).toBe(false)
    })

    it('should no-op resume when not paused', () => {
      const timer = useTimer(vi.fn())

      timer.resume()

      expect(timer.isPaused.value).toBe(false)
    })

    it('should no-op resume on active timer', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 1000 })

      timer.start()
      timer.resume() // not paused, should be no-op

      vi.advanceTimersByTime(1000)
      expect(handler).toHaveBeenCalledOnce()
    })

    it('should no-op stop when not running', () => {
      const timer = useTimer(vi.fn(), { duration: 1000 })

      timer.stop()

      expect(timer.isActive.value).toBe(false)
      expect(timer.remaining.value).toBe(1000)
    })
  })

  describe('auto-cleanup', () => {
    it('should clear timer on scope disposal', () => {
      const handler = vi.fn()
      const scope = effectScope()

      scope.run(() => {
        const timer = useTimer(handler, { duration: 1000 })
        timer.start()
      })

      scope.stop()

      vi.advanceTimersByTime(2000)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should fire on next tick with duration 0', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: 0 })

      timer.start()

      expect(handler).not.toHaveBeenCalled()
      expect(timer.isActive.value).toBe(true)

      vi.advanceTimersByTime(0)

      expect(handler).toHaveBeenCalledOnce()
      expect(timer.isActive.value).toBe(false)
    })

    it('should not start with negative duration', () => {
      const handler = vi.fn()
      const timer = useTimer(handler, { duration: -1 })

      timer.start()

      expect(timer.isActive.value).toBe(false)

      vi.advanceTimersByTime(10_000)
      expect(handler).not.toHaveBeenCalled()
    })
  })
})

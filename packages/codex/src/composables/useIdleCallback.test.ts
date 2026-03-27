import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { useIdleCallback } from './useIdleCallback'

// Utilities
import { effectScope } from 'vue'

describe('useIdleCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls setTimeout as fallback when requestIdleCallback is unavailable', () => {
    const scope = effectScope()
    const fn = vi.fn()

    scope.run(() => {
      useIdleCallback(fn, 100)
    })

    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('callback fires after the default timeout (200ms)', () => {
    const scope = effectScope()
    const fn = vi.fn()

    scope.run(() => {
      useIdleCallback(fn)
    })

    vi.advanceTimersByTime(199)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)

    scope.stop()
  })

  it('cleanup function cancels the timeout', () => {
    const scope = effectScope()
    const fn = vi.fn()
    let cancel: (() => void) | undefined

    scope.run(() => {
      cancel = useIdleCallback(fn, 100)
    })

    cancel!()
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()

    scope.stop()
  })

  it('scope disposal cancels the timeout', () => {
    const scope = effectScope()
    const fn = vi.fn()

    scope.run(() => {
      useIdleCallback(fn, 100)
    })

    scope.stop()
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()
  })
})

import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

import { useTimer } from './index'

describe('useTimer (SSR)', () => {
  it('should not start interval tracking when not in browser', () => {
    const scope = effectScope()
    const handler = vi.fn()

    let timer: ReturnType<typeof useTimer>
    scope.run(() => {
      timer = useTimer(handler, { duration: 100 })
      timer.start()
    })

    // start() schedules setTimeout, but startTracking should bail early
    // because IN_BROWSER is false. The timer is "active" but no interval runs.
    expect(timer!.isActive.value).toBe(true)

    scope.stop()
  })

  it('should bail tracking on resume when not in browser', () => {
    const scope = effectScope()
    const handler = vi.fn()

    let timer: ReturnType<typeof useTimer>
    scope.run(() => {
      timer = useTimer(handler, { duration: 100 })
      timer.start()
      timer.pause()
      timer.resume()
    })

    expect(timer!.isPaused.value).toBe(false)

    scope.stop()
  })
})

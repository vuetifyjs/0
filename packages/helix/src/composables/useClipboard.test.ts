import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { useClipboard } from './useClipboard'

// Utilities
import { effectScope } from 'vue'

describe('useClipboard', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    vi.useFakeTimers()
    scope = effectScope()

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  it('copied starts as false', () => {
    scope.run(() => {
      const { copied } = useClipboard()
      expect(copied.value).toBe(false)
    })
  })

  it('copy() sets copied to true', async () => {
    await scope.run(async () => {
      const { copied, copy } = useClipboard()

      await copy('hello')

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
      expect(copied.value).toBe(true)
    })
  })

  it('copied resets to false after timeout', async () => {
    await scope.run(async () => {
      const { copied, copy } = useClipboard(500)

      await copy('hello')
      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(500)
      expect(copied.value).toBe(false)
    })
  })

  it('uses default timeout of 2000ms', async () => {
    await scope.run(async () => {
      const { copied, copy } = useClipboard()

      await copy('hello')
      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(1999)
      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(1)
      expect(copied.value).toBe(false)
    })
  })

  it('returns false when clipboard write fails', async () => {
    await scope.run(async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('denied'))
      const { copied, copy } = useClipboard()

      const result = await copy('hello')

      expect(result).toBe(false)
      expect(copied.value).toBe(false)
    })
  })

  it('reset() clears copied and cancels pending timeout', async () => {
    await scope.run(async () => {
      const { copied, copy, reset } = useClipboard()

      await copy('hello')
      expect(copied.value).toBe(true)

      reset()
      expect(copied.value).toBe(false)

      // The timeout should have been cleared — advancing shouldn't cause issues
      vi.advanceTimersByTime(3000)
      expect(copied.value).toBe(false)
    })
  })
})

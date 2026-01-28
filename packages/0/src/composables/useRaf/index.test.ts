import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

import { useRaf } from './index'

describe('useRaf', () => {
  let mockRequestAnimationFrame: ReturnType<typeof vi.fn>
  let mockCancelAnimationFrame: ReturnType<typeof vi.fn>
  let rafId = 0
  let rafCallback: ((timestamp: number) => void) | null = null

  beforeEach(() => {
    rafId = 0
    rafCallback = null

    mockRequestAnimationFrame = vi.fn((cb: (timestamp: number) => void) => {
      rafCallback = cb
      return ++rafId
    })

    mockCancelAnimationFrame = vi.fn()

    globalThis.requestAnimationFrame = mockRequestAnimationFrame as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = mockCancelAnimationFrame as typeof cancelAnimationFrame
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should request animation frame when called', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()

      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1)
    })

    it('should call callback with timestamp', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      rafCallback?.(1234.56)

      expect(callback).toHaveBeenCalledWith(1234.56)
    })

    it('should return callable function', () => {
      const raf = useRaf(vi.fn())

      expect(raf).toBeTypeOf('function')
    })

    it('should expose cancel method', () => {
      const raf = useRaf(vi.fn())

      expect(raf.cancel).toBeTypeOf('function')
    })

    it('should expose isActive ref', () => {
      const raf = useRaf(vi.fn())

      expect(raf.isActive).toBeDefined()
      expect(raf.isActive.value).toBe(false)
    })
  })

  describe('cancel-then-request pattern', () => {
    it('should cancel pending frame before requesting new one', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      raf()

      expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1)
      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1)
      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2)
    })

    it('should deduplicate rapid calls', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      raf()
      raf()
      raf()

      // Execute the last frame
      rafCallback?.(100)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should only execute latest callback on frame', () => {
      const callOrder: number[] = []
      const raf = useRaf(() => callOrder.push(1))

      raf()
      raf()
      raf()

      rafCallback?.(100)

      expect(callOrder).toEqual([1])
    })
  })

  describe('isActive state', () => {
    it('should be false initially', () => {
      const raf = useRaf(vi.fn())

      expect(raf.isActive.value).toBe(false)
    })

    it('should be true after request', () => {
      const raf = useRaf(vi.fn())

      raf()

      expect(raf.isActive.value).toBe(true)
    })

    it('should be false after callback executes', () => {
      const raf = useRaf(vi.fn())

      raf()
      expect(raf.isActive.value).toBe(true)

      rafCallback?.(100)
      expect(raf.isActive.value).toBe(false)
    })

    it('should be false after cancel', () => {
      const raf = useRaf(vi.fn())

      raf()
      expect(raf.isActive.value).toBe(true)

      raf.cancel()
      expect(raf.isActive.value).toBe(false)
    })

    it('should be readonly', () => {
      const raf = useRaf(vi.fn())

      // toRef with getter returns a true readonly ref that throws on set
      expect(() => {
        // @ts-expect-error - testing readonly
        raf.isActive.value = true
      }).toThrow()
    })
  })

  describe('cancel', () => {
    it('should cancel pending animation frame', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      raf.cancel()

      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1)
    })

    it('should prevent callback from executing', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      raf.cancel()

      // Simulate frame firing (shouldn't happen after cancel, but testing safety)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle multiple cancel calls gracefully', () => {
      const raf = useRaf(vi.fn())

      raf()

      expect(() => {
        raf.cancel()
        raf.cancel()
        raf.cancel()
      }).not.toThrow()

      // Should only cancel once (when rafId was defined)
      expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1)
    })

    it('should handle cancel when no frame is pending', () => {
      const raf = useRaf(vi.fn())

      expect(() => {
        raf.cancel()
      }).not.toThrow()

      expect(mockCancelAnimationFrame).not.toHaveBeenCalled()
    })
  })

  describe('reusability', () => {
    it('should allow requesting after cancel', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      raf.cancel()
      raf()

      expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2)
    })

    it('should allow requesting after callback executes', () => {
      const callback = vi.fn()
      const raf = useRaf(callback)

      raf()
      rafCallback?.(100)

      raf()
      rafCallback?.(200)

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 100)
      expect(callback).toHaveBeenNthCalledWith(2, 200)
    })
  })

  describe('scope disposal', () => {
    it('should cleanup pending RAF on scope disposal', async () => {
      const { effectScope } = await import('vue')
      const callback = vi.fn()

      const scope = effectScope()
      let raf: ReturnType<typeof useRaf>

      scope.run(() => {
        raf = useRaf(callback)
        raf()
      })

      expect(raf!.isActive.value).toBe(true)

      // Dispose scope - should cancel pending RAF
      scope.stop()

      expect(mockCancelAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should set isActive to false even if callback throws', () => {
      const callback = vi.fn(() => {
        throw new Error('test error')
      })
      const raf = useRaf(callback)

      raf()
      expect(raf.isActive.value).toBe(true)

      // Callback throws but isActive should still be false after
      expect(() => rafCallback?.(100)).toThrow('test error')
      expect(raf.isActive.value).toBe(false)
    })

    it('should allow subsequent requests after callback throws', () => {
      let shouldThrow = true
      const callback = vi.fn(() => {
        if (shouldThrow) throw new Error('test error')
      })
      const raf = useRaf(callback)

      // First call throws
      raf()
      expect(() => rafCallback?.(100)).toThrow()

      // Second call should work
      shouldThrow = false
      raf()
      rafCallback?.(200)

      expect(callback).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useRaf SSR', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('should not call requestAnimationFrame during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const mockRaf = vi.fn()
    globalThis.requestAnimationFrame = mockRaf

    const { useRaf: useRafSSR } = await import('./index')
    const callback = vi.fn()
    const raf = useRafSSR(callback)

    raf()

    expect(mockRaf).not.toHaveBeenCalled()
    expect(callback).not.toHaveBeenCalled()
  })

  it('should return valid interface during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useRaf: useRafSSR } = await import('./index')
    const raf = useRafSSR(vi.fn())

    expect(raf).toBeTypeOf('function')
    expect(raf.cancel).toBeTypeOf('function')
    expect(raf.isActive.value).toBe(false)
  })

  it('should not throw when calling during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useRaf: useRafSSR } = await import('./index')
    const raf = useRafSSR(vi.fn())

    expect(() => {
      raf()
      raf.cancel()
    }).not.toThrow()
  })

  it('should always report isActive as false during SSR', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: false,
    }))

    const { useRaf: useRafSSR } = await import('./index')
    const raf = useRafSSR(vi.fn())

    raf()

    expect(raf.isActive.value).toBe(false)
  })
})

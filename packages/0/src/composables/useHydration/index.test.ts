import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createHydration, useHydration, installHydrationPlugin } from './index'

// Mock Vue's onMounted to control when it executes
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn(),
  }
})

describe('useHydration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createHydration', () => {
    it('should create hydration context with correct interface', () => {
      const context = createHydration()

      expect(context).toHaveProperty('isHydrated')
      expect(context).toHaveProperty('hydrate')
      expect(typeof context.hydrate).toBe('function')
      expect(context.isHydrated.value).toBe(false)
    })

    it('should register onMounted callback', async () => {
      const { onMounted } = await import('vue')
      const mockOnMounted = vi.mocked(onMounted)

      createHydration()

      expect(mockOnMounted).toHaveBeenCalledOnce()
      expect(typeof mockOnMounted.mock.calls[0][0]).toBe('function')
    })

    it('should hydrate when hydrate() is called', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      context.hydrate()

      expect(context.isHydrated.value).toBe(true)
    })

    it('should hydrate when onMounted callback is executed', async () => {
      const { onMounted } = await import('vue')
      const mockOnMounted = vi.mocked(onMounted)

      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      // Execute the onMounted callback
      const mountedCallback = mockOnMounted.mock.calls[0][0]
      mountedCallback()

      expect(context.isHydrated.value).toBe(true)
    })

    it('should handle multiple hydrate calls gracefully', () => {
      const context = createHydration()

      context.hydrate()
      context.hydrate()
      context.hydrate()

      expect(context.isHydrated.value).toBe(true)
    })
  })

  describe('useHydration', () => {
    it('should be a function', () => {
      expect(typeof useHydration).toBe('function')
    })

    // Note: Full testing of useHydration requires component context
    // since it uses inject/provide. This would typically be tested
    // in component tests or with a testing harness.
  })

  describe('installHydrationPlugin', () => {
    it('should be a function that accepts an app instance', () => {
      expect(typeof installHydrationPlugin).toBe('function')
      expect(installHydrationPlugin.length).toBe(1) // expects 1 parameter
    })

    it('should call app.runWithContext', () => {
      const mockApp = {
        runWithContext: vi.fn((callback: () => void) => callback()),
      }

      installHydrationPlugin(mockApp as any)

      expect(mockApp.runWithContext).toHaveBeenCalledOnce()
      expect(typeof mockApp.runWithContext.mock.calls[0][0]).toBe('function')
    })
  })

  describe('integration', () => {
    it('should maintain reactivity of isHydrated', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      // Change it back
      context.hydrate()

      expect(context.isHydrated.value).toBe(true)
    })

    it('should work with Vue reactivity system', () => {
      const context1 = createHydration()
      const context2 = createHydration()

      // Each context should be independent
      context1.hydrate()

      expect(context1.isHydrated.value).toBe(true)
      expect(context2.isHydrated.value).toBe(false)
    })
  })
})

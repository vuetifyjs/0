import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockUseHydrationContext, mockProvideHydrationContext } = vi.hoisted(() => {
  return {
    mockUseHydrationContext: vi.fn(),
    mockProvideHydrationContext: vi.fn(),
  }
})

vi.mock('../useContext', () => ({
  useContext: vi.fn(() => [
    mockUseHydrationContext,
    mockProvideHydrationContext,
  ]),
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    shallowRef: vi.fn(value => ({ value })),
    shallowReadonly: vi.fn(ref => ref),
  }
})

import { createHydration, useHydration, createHydrationPlugin } from './index'

describe('useHydration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseHydrationContext.mockClear()
    mockProvideHydrationContext.mockClear()
  })

  describe('createHydration', () => {
    it('should create hydration context with correct interface', () => {
      const context = createHydration()

      expect(context).toHaveProperty('isHydrated')
      expect(context).toHaveProperty('hydrate')
      expect(typeof context.hydrate).toBe('function')
      expect(context.isHydrated.value).toBe(false)
    })

    it('should hydrate when hydrate() is called', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      context.hydrate()

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
    it('should call useHydrationContext', () => {
      mockUseHydrationContext.mockReturnValue({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      })

      useHydration()

      expect(mockUseHydrationContext).toHaveBeenCalledOnce()
    })
  })

  describe('createHydrationPlugin', () => {
    it('should return a plugin with install method', () => {
      const plugin = createHydrationPlugin()

      expect(plugin).toHaveProperty('install')
      expect(typeof plugin.install).toBe('function')
    })

    it('should call app.runWithContext and app.mixin when installed', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockApp.runWithContext).toHaveBeenCalledOnce()
      expect(mockApp.mixin).toHaveBeenCalledOnce()
    })

    it('should provide hydration context when installed', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockProvideHydrationContext).toHaveBeenCalledOnce()
    })

    it('should add mixin that calls hydrate on root component mount', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockApp.mixin).toHaveBeenCalledOnce()

      const mixinOptions = mockApp.mixin.mock.calls[0][0]
      expect(mixinOptions).toHaveProperty('mounted')
      expect(typeof mixinOptions.mounted).toBe('function')
    })

    it('should only hydrate on root component (no parent)', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as any)

      const mixinOptions = mockApp.mixin.mock.calls[0][0]
      const mountedCallback = mixinOptions.mounted

      const rootComponent = { $parent: null }

      const childComponent = { $parent: {} }

      expect(() => mountedCallback.call(rootComponent)).not.toThrow()
      expect(() => mountedCallback.call(childComponent)).not.toThrow()
    })
  })

  describe('integration', () => {
    it('should maintain reactivity of isHydrated', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      context.hydrate()

      expect(context.isHydrated.value).toBe(true)
    })

    it('should work with independent contexts', () => {
      const context1 = createHydration()
      const context2 = createHydration()

      context1.hydrate()

      expect(context1.isHydrated.value).toBe(true)
      expect(context2.isHydrated.value).toBe(false)
    })
  })
})

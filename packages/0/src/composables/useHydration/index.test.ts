import { beforeEach, describe, expect, it, vi } from 'vitest'

// Types
import type { App } from 'vue'

const { mockUseHydrationContext, mockProvideHydrationContext, mockUseContext } = vi.hoisted(() => {
  return {
    mockUseHydrationContext: vi.fn(),
    mockProvideHydrationContext: vi.fn(),
    mockUseContext: vi.fn(),
  }
})

vi.mock('#v0/composables/createContext', () => ({
  createContext: vi.fn(() => [
    mockUseHydrationContext,
    mockProvideHydrationContext,
  ]),
  useContext: mockUseContext,
}))

import { createHydration, createHydrationPlugin, useHydration } from './index'

// Utilities
import { nextTick } from 'vue'

describe('useHydration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseHydrationContext.mockClear()
    mockProvideHydrationContext.mockClear()
    mockUseContext.mockClear()
  })

  describe('createHydration', () => {
    it('should create hydration context with correct interface', () => {
      const context = createHydration()

      expect(context).toHaveProperty('isHydrated')
      expect(context).toHaveProperty('isSettled')
      expect(context).toHaveProperty('hydrate')
      expect(context).toHaveProperty('settle')
      expect(typeof context.hydrate).toBe('function')
      expect(typeof context.settle).toBe('function')
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

  describe('isSettled and settle()', () => {
    it('should start with isSettled false', () => {
      const context = createHydration()

      expect(context.isSettled.value).toBe(false)
    })

    it('should transition to true after settle() is called', () => {
      const context = createHydration()

      expect(context.isSettled.value).toBe(false)

      context.settle()

      expect(context.isSettled.value).toBe(true)
    })

    it('should handle settle() called multiple times', () => {
      const context = createHydration()

      context.settle()
      context.settle()

      expect(context.isSettled.value).toBe(true)
    })

    it('should allow hydrate and settle to be called independently', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)
      expect(context.isSettled.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
      expect(context.isSettled.value).toBe(false)

      context.settle()
      expect(context.isHydrated.value).toBe(true)
      expect(context.isSettled.value).toBe(true)
    })
  })

  describe('useHydration', () => {
    it('should return fallback context when called outside a component', () => {
      const context = useHydration()

      expect(context).toHaveProperty('isHydrated')
      expect(context).toHaveProperty('isSettled')
      expect(context).toHaveProperty('hydrate')
      expect(context).toHaveProperty('settle')
      expect(typeof context.hydrate).toBe('function')
      expect(typeof context.settle).toBe('function')
    })
  })

  describe('createHydrationPlugin', () => {
    it('should return a plugin with install method', () => {
      const plugin = createHydrationPlugin()

      expect(plugin).toHaveProperty('install')
      expect(typeof plugin.install).toBe('function')
    })

    it('should call app.runWithContext and wrap app.mount when installed', () => {
      const originalMount = vi.fn()
      const plugin = createHydrationPlugin()
      const mockApp = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.runWithContext).toHaveBeenCalledTimes(1)
      expect(mockApp.mount).not.toBe(originalMount)
    })

    it('should provide hydration context when installed', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: vi.fn(),
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockProvideHydrationContext).toHaveBeenCalledTimes(1)
    })

    it('should wrap app.mount and restore original after first call', () => {
      const plugin = createHydrationPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      const wrappedMount = mockApp.mount
      expect(wrappedMount).not.toBe(originalMount)

      wrappedMount('#app')

      expect(originalMount).toHaveBeenCalledWith('#app')
      expect(mockApp.mount).toBe(originalMount)
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

    it('should return shallowReadonly ref for isHydrated', () => {
      const context = createHydration()

      expect(context.isHydrated).toHaveProperty('value')
      expect(context.isHydrated.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should only run once via app.mount wrapper', () => {
      const plugin = createHydrationPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.mount).not.toBe(originalMount)

      mockApp.mount('#app')

      // After first call, original mount is restored
      expect(mockApp.mount).toBe(originalMount)
    })

    it('should not hydrate twice on root component', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
    })

    it('should return the vm from the wrapped mount call', () => {
      const expectedVm = { $el: document.createElement('div') }
      const originalMount = vi.fn(() => expectedVm as any)
      const plugin = createHydrationPlugin()
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      const result = mockApp.mount('#app')

      expect(result).toBe(expectedVm)
    })

    it('should pass all arguments through to original mount', () => {
      const originalMount = vi.fn(() => ({}) as any)
      const plugin = createHydrationPlugin()
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app', true)

      expect(originalMount).toHaveBeenCalledWith('#app', true)
    })

    it('should handle settle() being called before hydrate()', () => {
      const context = createHydration()

      context.settle()
      expect(context.isSettled.value).toBe(true)
      expect(context.isHydrated.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
    })

    it('should call hydrate and settle via nextTick after mount', async () => {
      const plugin = createHydrationPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn(callback => callback()),
        mount: originalMount,
        provide: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app')

      // Wait for the two nextTick cycles in the setup callback
      await nextTick()
      await nextTick()

      expect(originalMount).toHaveBeenCalledTimes(1)
    })
  })
})

describe('useHydration SSR', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('createHydration should start with isHydrated false for SSR', async () => {
    const { createHydration: createHydrationSSR } = await import('./index')
    const context = createHydrationSSR()

    expect(context.isHydrated.value).toBe(false)
    expect(context.isSettled.value).toBe(false)
  })

  it('createFallbackHydration should have isHydrated and isSettled true', async () => {
    const { createFallbackHydration } = await import('./index')
    const context = createFallbackHydration()

    expect(context.isHydrated.value).toBe(true)
    expect(context.isSettled.value).toBe(true)
  })

  it('createFallbackHydration hydrate and settle should be safe no-ops', async () => {
    const { createFallbackHydration } = await import('./index')
    const context = createFallbackHydration()

    // Calling no-op functions should not throw or change state
    expect(() => context.hydrate()).not.toThrow()
    expect(() => context.settle()).not.toThrow()
    expect(context.isHydrated.value).toBe(true)
    expect(context.isSettled.value).toBe(true)
  })

  it('useHydration should return fallback when no Vue instance exists', async () => {
    vi.doMock('#v0/utilities/instance', () => ({
      instanceExists: () => false,
    }))

    const { useHydration: useHydrationSSR } = await import('./index')
    const context = useHydrationSSR()

    expect(context.isHydrated.value).toBe(true)
    expect(typeof context.hydrate).toBe('function')
    expect(typeof context.settle).toBe('function')
  })

  it('hydrate() should be safe to call during SSR', async () => {
    const { createHydration: createHydrationSSR } = await import('./index')
    const context = createHydrationSSR()

    expect(() => context.hydrate()).not.toThrow()
    expect(context.isHydrated.value).toBe(true)
  })

  it('createHydrationPlugin should work during SSR', async () => {
    const { createHydrationPlugin: createHydrationPluginSSR } = await import('./index')
    const plugin = createHydrationPluginSSR()

    expect(plugin).toBeDefined()
    expect(typeof plugin.install).toBe('function')
  })

  it('createHydrationContext should work during SSR', async () => {
    const { createHydrationContext: createHydrationContextSSR } = await import('./index')
    const [,, context] = createHydrationContextSSR()

    expect(context.isHydrated.value).toBe(false)
    expect(context.isSettled.value).toBe(false)
    context.hydrate()
    expect(context.isHydrated.value).toBe(true)
    context.settle()
    expect(context.isSettled.value).toBe(true)
  })
})

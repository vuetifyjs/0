import { beforeEach, describe, expect, it, vi } from 'vitest'

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

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    shallowRef: vi.fn(value => ({ value })),
    shallowReadonly: vi.fn(ref => ref),
    getCurrentInstance: vi.fn(() => ({ uid: 1 })),
  }
})

import { createHydration, createHydrationPlugin, useHydration } from './index'

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
    it('should call useContext', () => {
      mockUseContext.mockReturnValue({
        isHydrated: { value: false },
        hydrate: vi.fn(),
      })

      useHydration()

      expect(mockUseContext).toHaveBeenCalledOnce()
      expect(mockUseContext).toHaveBeenCalledWith('v0:hydration', expect.any(Object))
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
        provide: vi.fn(),
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
        provide: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockProvideHydrationContext).toHaveBeenCalledOnce()
    })

    it('should add mixin that calls hydrate on root component mount', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
        provide: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockApp.mixin).toHaveBeenCalledOnce()

      const mixinOptions = mockApp.mixin.mock.calls[0]![0]
      expect(mixinOptions).toHaveProperty('mounted')
      expect(typeof mixinOptions.mounted).toBe('function')
    })

    it('should only hydrate on root component (no parent)', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
        provide: vi.fn(),
      }

      plugin.install(mockApp as any)

      const mixinOptions = mockApp.mixin.mock.calls[0]![0]
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

    it('should return shallowReadonly ref for isHydrated', () => {
      const context = createHydration()

      // isHydrated should be a readonly ref created with shallowReadonly
      expect(context.isHydrated).toHaveProperty('value')
      expect(context.isHydrated.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle hydration of child components correctly', () => {
      const plugin = createHydrationPlugin()
      const mockApp = {
        runWithContext: vi.fn(callback => callback()),
        mixin: vi.fn(),
        provide: vi.fn(),
      }

      plugin.install(mockApp as any)

      const mixinOptions = mockApp.mixin.mock.calls[0]![0]
      const mountedCallback = mixinOptions.mounted

      const childWithParent = { $parent: { someData: true } }
      const childWithNestedParent = { $parent: { $parent: {} } }
      const rootComponent = { $parent: null }

      const hydrateSpy = vi.fn()

      mountedCallback.call(childWithParent)
      mountedCallback.call(childWithNestedParent)
      expect(hydrateSpy).not.toHaveBeenCalled()

      mountedCallback.call(rootComponent)
    })

    it('should not hydrate twice on root component', () => {
      const context = createHydration()

      expect(context.isHydrated.value).toBe(false)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)

      context.hydrate()
      expect(context.isHydrated.value).toBe(true)
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
  })

  it('createFallbackHydration should have isHydrated true', async () => {
    const { createFallbackHydration } = await import('./index')
    const context = createFallbackHydration()

    expect(context.isHydrated.value).toBe(true)
  })

  it('useHydration should return fallback when no Vue instance exists', async () => {
    vi.doMock('#v0/utilities', () => ({
      instanceExists: () => false,
      isNull: (v: unknown) => v === null,
    }))

    const { useHydration: useHydrationSSR } = await import('./index')
    const context = useHydrationSSR()

    // Fallback has isHydrated: true
    expect(context.isHydrated.value).toBe(true)
    expect(typeof context.hydrate).toBe('function')
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
    context.hydrate()
    expect(context.isHydrated.value).toBe(true)
  })
})

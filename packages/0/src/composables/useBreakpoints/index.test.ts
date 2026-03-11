import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { getCurrentInstance, hasInjectionContext, onMounted, onScopeDispose, shallowRef } from 'vue'

// Types
import type { App } from 'vue'

import { createBreakpoints, createBreakpointsPlugin, useBreakpoints } from './index'

// Mock Vue functions
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    hasInjectionContext: vi.fn(),
    onMounted: vi.fn(),
    onScopeDispose: vi.fn(),
    inject: vi.fn(),
  }
})

// Mock useHydration
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: vi.fn(),
}))

// Mock globals
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

const mockGetCurrentInstance = vi.mocked(getCurrentInstance)
const mockHasInjectionContext = vi.mocked(hasInjectionContext)
const mockOnMounted = vi.mocked(onMounted)
const mockOnScopeDispose = vi.mocked(onScopeDispose)
const mockUseHydration = vi.mocked(useHydration)

describe('useBreakpoints', () => {
  let originalWindow: Window & typeof globalThis
  let mockWindow: Record<string, unknown>

  beforeEach(() => {
    vi.clearAllMocks()

    originalWindow = globalThis.window
    mockWindow = {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    globalThis.window = mockWindow as unknown as Window & typeof globalThis

    mockUseHydration.mockReturnValue({
      isHydrated: shallowRef(true),
      isSettled: shallowRef(true),
      hydrate: vi.fn(),
      settle: vi.fn(),
    })
  })

  afterEach(() => {
    globalThis.window = originalWindow
    vi.restoreAllMocks()
  })

  describe('createBreakpoints', () => {
    it('should create breakpoints context with default values', () => {
      const context = createBreakpoints()

      expect(context).toHaveProperty('breakpoints')
      expect(context).toHaveProperty('name')
      expect(context).toHaveProperty('width')
      expect(context).toHaveProperty('height')
      expect(context).toHaveProperty('isMobile')
      expect(context).toHaveProperty('xs')
      expect(context).toHaveProperty('sm')
      expect(context).toHaveProperty('md')
      expect(context).toHaveProperty('lg')
      expect(context).toHaveProperty('xl')
      expect(context).toHaveProperty('xxl')
      expect(context).toHaveProperty('smAndUp')
      expect(context).toHaveProperty('mdAndUp')
      expect(context).toHaveProperty('lgAndUp')
      expect(context).toHaveProperty('xlAndUp')
      expect(context).toHaveProperty('xxlAndUp')
      expect(context).toHaveProperty('smAndDown')
      expect(context).toHaveProperty('mdAndDown')
      expect(context).toHaveProperty('lgAndDown')
      expect(context).toHaveProperty('xlAndDown')
      expect(context).toHaveProperty('xxlAndDown')
    })

    it('should initialize with default breakpoint values', () => {
      mockWindow.innerWidth = 1024
      mockWindow.innerHeight = 768

      const context = createBreakpoints()

      expect(context.name.value).toBe('xs')
      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)
      expect(context.isMobile.value).toBe(true)
      expect(context.xs.value).toBe(true)
      expect(context.sm.value).toBe(false)
      expect(context.md.value).toBe(false)
      expect(context.lg.value).toBe(false)
      expect(context.xl.value).toBe(false)
      expect(context.xxl.value).toBe(false)
    })

    it('should accept custom breakpoint options', () => {
      const customOptions = {
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 'lg' as const,
        breakpoints: {
          sm: 768,
          md: 1024,
        },
      }

      const context = createBreakpoints(customOptions)

      expect(context.breakpoints).toBeDefined()
    })

    it('should handle numeric mobile breakpoint', () => {
      const customOptions = {
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 800,
      }

      const context = createBreakpoints(customOptions)

      expect(context.isMobile.value).toBeDefined()
    })

    it('should not call onMounted directly in createBreakpoints', () => {
      mockGetCurrentInstance.mockReturnValue({} as ReturnType<typeof getCurrentInstance>)

      createBreakpoints()

      expect(mockOnMounted).not.toHaveBeenCalled()
    })

    it('should provide an update method', () => {
      const context = createBreakpoints()

      expect(context.update).toBeDefined()
      expect(typeof context.update).toBe('function')
    })

    it('should not register resize listener directly in createBreakpoints', () => {
      mockGetCurrentInstance.mockReturnValue({} as ReturnType<typeof getCurrentInstance>)

      createBreakpoints()

      expect(mockWindow.addEventListener).not.toHaveBeenCalled()
      expect(mockOnScopeDispose).not.toHaveBeenCalled()
    })

    it('should update dimensions when update is called', () => {
      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800

      const context = createBreakpoints()

      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)

      context.update()

      expect(context.width.value).toBe(1200)
      expect(context.height.value).toBe(800)
    })

    it('should detect correct breakpoint when update is called', () => {
      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800

      const context = createBreakpoints()

      expect(context.name.value).toBe('xs')

      context.update()

      expect(context.name.value).toBe('lg')
      expect(context.lg.value).toBe(true)
    })
  })

  describe('breakpoint detection', () => {
    it('should detect xs breakpoint correctly', () => {
      mockWindow.innerWidth = 500
      mockWindow.innerHeight = 400

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xs')
      expect(context.xs.value).toBe(true)
      expect(context.sm.value).toBe(false)
      expect(context.isMobile.value).toBe(true)
      expect(context.smAndUp.value).toBe(false)
      expect(context.smAndDown.value).toBe(true)
    })

    it('should detect sm breakpoint correctly', () => {
      mockWindow.innerWidth = 700
      mockWindow.innerHeight = 500

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('sm')
      expect(context.xs.value).toBe(false)
      expect(context.sm.value).toBe(true)
      expect(context.md.value).toBe(false)
      expect(context.isMobile.value).toBe(true)
      expect(context.smAndUp.value).toBe(true)
      expect(context.smAndDown.value).toBe(true)
      expect(context.mdAndUp.value).toBe(false)
    })

    it('should detect md breakpoint correctly', () => {
      mockWindow.innerWidth = 1000
      mockWindow.innerHeight = 600

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('md')
      expect(context.md.value).toBe(true)
      expect(context.isMobile.value).toBe(true)
      expect(context.mdAndUp.value).toBe(true)
      expect(context.mdAndDown.value).toBe(true)
    })

    it('should detect lg breakpoint correctly', () => {
      mockWindow.innerWidth = 1400
      mockWindow.innerHeight = 800

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('lg')
      expect(context.lg.value).toBe(true)
      expect(context.isMobile.value).toBe(false)
      expect(context.lgAndUp.value).toBe(true)
      expect(context.lgAndDown.value).toBe(true)
      expect(context.xlAndUp.value).toBe(false)
    })

    it('should detect xl breakpoint correctly', () => {
      mockWindow.innerWidth = 2000
      mockWindow.innerHeight = 1200

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xl')
      expect(context.xl.value).toBe(true)
      expect(context.isMobile.value).toBe(false)
      expect(context.xlAndUp.value).toBe(true)
      expect(context.xlAndDown.value).toBe(true)
      expect(context.xxlAndUp.value).toBe(false)
    })

    it('should detect xxl breakpoint correctly', () => {
      mockWindow.innerWidth = 2800
      mockWindow.innerHeight = 1600

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xxl')
      expect(context.xxl.value).toBe(true)
      expect(context.isMobile.value).toBe(false)
      expect(context.xxlAndUp.value).toBe(true)
      expect(context.xxlAndDown.value).toBe(true)
    })
  })

  describe('window resize handling', () => {
    it('should update breakpoint when update is called multiple times', () => {
      mockWindow.innerWidth = 500

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xs')

      mockWindow.innerWidth = 1400
      context.update()

      expect(context.name.value).toBe('lg')
      expect(context.width.value).toBe(1400)
    })

    it('should expose update method for manual breakpoint updates', () => {
      const context = createBreakpoints()

      expect(typeof context.update).toBe('function')
      expect(() => context.update()).not.toThrow()
    })
  })

  describe('non-browser environment', () => {
    it('should work without addEventListener in browser environment', () => {
      const context = createBreakpoints()

      expect(context).toHaveProperty('update')
      expect(context).toHaveProperty('width')
      expect(context).toHaveProperty('height')
    })

    it('should update dimensions correctly in browser environment', () => {
      mockWindow.innerWidth = 1000
      mockWindow.innerHeight = 600

      const context = createBreakpoints()
      context.update()

      expect(context.width.value).toBe(1000)
      expect(context.height.value).toBe(600)
    })
  })

  describe('useBreakpoints', () => {
    it('should be a function', () => {
      expect(typeof useBreakpoints).toBe('function')
    })

    it('should return provided context via inject', async () => {
      const { inject } = vi.mocked(await import('vue'))
      const mockContext = createBreakpoints()
      mockHasInjectionContext.mockReturnValue(true)
      inject.mockReturnValue(mockContext)

      const result = useBreakpoints()

      expect(result).toBe(mockContext)
    })
  })

  describe('createBreakpointsPlugin', () => {
    it('should return a plugin object with install method', () => {
      const plugin = createBreakpointsPlugin()

      expect(plugin).toHaveProperty('install')
      expect(typeof plugin.install).toBe('function')
    })

    it('should accept options parameter', () => {
      const options = {
        mobileBreakpoint: 'lg' as const,
        breakpoints: { sm: 768 },
      }

      const plugin = createBreakpointsPlugin(options)

      expect(plugin).toHaveProperty('install')
      expect(typeof plugin.install).toBe('function')
    })

    it('should call app.runWithContext during installation', () => {
      const plugin = createBreakpointsPlugin()
      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.runWithContext).toHaveBeenCalledOnce()
      expect(typeof mockApp.runWithContext.mock.calls[0]![0]).toBe('function')
    })

    it('should work with empty options', () => {
      const plugin = createBreakpointsPlugin({})
      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn(),
      }

      expect(() => plugin.install(mockApp as unknown as App)).not.toThrow()
    })
  })

  describe('custom breakpoint configurations', () => {
    it('should handle custom breakpoint values', () => {
      const customBreakpoints = {
        namespace: 'v0:breakpoints',
        breakpoints: {
          xs: 0,
          sm: 480,
          md: 768,
          lg: 1024,
          xl: 1440,
          xxl: 1920,
        },
      }

      const context = createBreakpoints(customBreakpoints)

      expect(context.breakpoints).toBeDefined()
    })

    it('should handle custom mobile breakpoint as string', () => {
      mockWindow.innerWidth = 1100

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 'lg',
      })

      context.update()

      expect(context.isMobile.value).toBe(true)
    })

    it('should handle custom mobile breakpoint as number', () => {
      mockWindow.innerWidth = 1000

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 1200,
      })

      context.update()

      expect(context.isMobile.value).toBe(true)
    })

    it('should fallback to md breakpoint when custom mobile breakpoint is not found', () => {
      mockWindow.innerWidth = 1000

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 'invalid' as 'xs',
      })

      context.update()

      expect(context.isMobile.value).toBe(false)
    })
  })

  describe('sSR safety', () => {
    it('should initialize with default values in SSR mode', () => {
      const context = createBreakpoints()

      expect(context.name.value).toBe('xs')
      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)
      expect(context.isMobile.value).toBe(true)
    })

    it('should handle context creation without errors', () => {
      expect(() => {
        const context = createBreakpoints()
        expect(context).toHaveProperty('update')
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle window width of 0', () => {
      mockWindow.innerWidth = 0
      mockWindow.innerHeight = 0

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xs')
      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)
    })

    it('should handle very large window width', () => {
      mockWindow.innerWidth = 5000
      mockWindow.innerHeight = 3000

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xxl')
      expect(context.width.value).toBe(5000)
      expect(context.height.value).toBe(3000)
    })

    it('should handle breakpoint exactly at threshold', () => {
      mockWindow.innerWidth = 840

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('md')
      expect(context.md.value).toBe(true)
    })
  })

  describe('plugin mixin behavior', () => {
    it('should register mixin on app.mixin during install', () => {
      const plugin = createBreakpointsPlugin()
      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.mixin).toHaveBeenCalled()
      const mixinArg = mockApp.mixin.mock.calls[0]![0]
      expect(mixinArg).toHaveProperty('mounted')
    })

    it('should skip mixin mounted logic when component has parent', () => {
      const plugin = createBreakpointsPlugin()
      let registeredMixin: Record<string, (...args: unknown[]) => void>

      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn((mixin: Record<string, (...args: unknown[]) => void>) => {
          registeredMixin = mixin
        }),
      }

      plugin.install(mockApp as unknown as App)

      const mockComponentWithParent = {
        $parent: {},
      }

      expect(() => registeredMixin!.mounted!.call(mockComponentWithParent)).not.toThrow()
    })

    it('should setup resize listener for root component', () => {
      const plugin = createBreakpointsPlugin()
      let registeredMixin: Record<string, (...args: unknown[]) => void>

      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn((mixin: Record<string, (...args: unknown[]) => void>) => {
          registeredMixin = mixin
        }),
      }

      plugin.install(mockApp as unknown as App)

      const mockRootComponent = {
        $parent: null,
      }

      expect(() => registeredMixin!.mounted!.call(mockRootComponent)).not.toThrow()

      expect(mockUseHydration).toHaveBeenCalled()
    })

    it('should register cleanup on scope dispose', () => {
      const plugin = createBreakpointsPlugin()
      let registeredMixin: Record<string, (...args: unknown[]) => void>

      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn((mixin: Record<string, (...args: unknown[]) => void>) => {
          registeredMixin = mixin
        }),
      }

      plugin.install(mockApp as unknown as App)

      const mockRootComponent = {
        $parent: null,
      }

      registeredMixin!.mounted!.call(mockRootComponent)

      expect(mockOnScopeDispose).toHaveBeenCalled()
      expect(mockOnScopeDispose.mock.calls[0]![1]).toBe(true)
    })

    it('should call cleanup function when scope is disposed', () => {
      const plugin = createBreakpointsPlugin()
      let registeredMixin: Record<string, (...args: unknown[]) => void>
      let cleanupFn: (() => void) | undefined

      mockOnScopeDispose.mockImplementation((fn: () => void) => {
        cleanupFn = fn
      })

      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn((mixin: Record<string, (...args: unknown[]) => void>) => {
          registeredMixin = mixin
        }),
      }

      plugin.install(mockApp as unknown as App)

      const mockRootComponent = {
        $parent: null,
      }

      registeredMixin!.mounted!.call(mockRootComponent)

      expect(cleanupFn).toBeDefined()

      expect(() => cleanupFn!()).not.toThrow()
    })
  })
})

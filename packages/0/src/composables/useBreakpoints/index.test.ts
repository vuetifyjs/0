import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { useHydration } from '#v0/composables/useHydration'

import { createBreakpoints, createBreakpointsPlugin, useBreakpoints } from './index'

// Utilities
import { getCurrentInstance, hasInjectionContext, onMounted, onScopeDispose, shallowRef } from 'vue'

// Types
import type { App } from 'vue'

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

// Mock globals — use getter so SSR tests can toggle IN_BROWSER
const { inBrowser } = vi.hoisted(() => ({ inBrowser: { value: true } }))
vi.mock('#v0/constants/globals', () => ({
  get IN_BROWSER () {
    return inBrowser.value
  },
  SUPPORTS_MATCH_MEDIA: true,
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
      matchMedia: (query: string) => {
        const match = query.match(/\(min-width:\s*(\d+)px\)/)
        return { matches: match ? (mockWindow.innerWidth as number) >= Number(match[1]) : false }
      },
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
      expect(context).toHaveProperty('smAndDown')
      expect(context).toHaveProperty('mdAndDown')
      expect(context).toHaveProperty('lgAndDown')
      expect(context).toHaveProperty('xlAndDown')
    })

    it('should initialize with window dimensions in browser', () => {
      mockWindow.innerWidth = 1024
      mockWindow.innerHeight = 768

      const context = createBreakpoints()

      expect(context.name.value).toBe('md')
      expect(context.width.value).toBe(1024)
      expect(context.height.value).toBe(768)
      expect(context.isMobile.value).toBe(true)
      expect(context.xs.value).toBe(false)
      expect(context.sm.value).toBe(false)
      expect(context.md.value).toBe(true)
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
      mockWindow.innerWidth = 1024
      mockWindow.innerHeight = 768

      const context = createBreakpoints()

      expect(context.width.value).toBe(1024)
      expect(context.height.value).toBe(768)

      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800
      context.update()

      expect(context.width.value).toBe(1200)
      expect(context.height.value).toBe(800)
    })

    it('should detect correct breakpoint when update is called', () => {
      mockWindow.innerWidth = 1024
      mockWindow.innerHeight = 768

      const context = createBreakpoints()

      expect(context.name.value).toBe('md')

      mockWindow.innerWidth = 1200
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
    })

    it('should detect xxl breakpoint correctly', () => {
      mockWindow.innerWidth = 2800
      mockWindow.innerHeight = 1600

      const context = createBreakpoints()
      context.update()

      expect(context.name.value).toBe('xxl')
      expect(context.xxl.value).toBe(true)
      expect(context.isMobile.value).toBe(false)
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
        mount: vi.fn(() => ({}) as any),
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.runWithContext).toHaveBeenCalledTimes(1)
      expect(typeof mockApp.runWithContext.mock.calls[0]![0]).toBe('function')
    })

    it('should work with empty options', () => {
      const plugin = createBreakpointsPlugin({})
      const mockApp = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: vi.fn(() => ({}) as any),
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

  describe('sSR options', () => {
    beforeEach(() => {
      inBrowser.value = false
    })

    afterEach(() => {
      inBrowser.value = true
    })

    it('should initialize with SSR dimensions when not in browser', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 1200, clientHeight: 800 },
      })

      expect(context.width.value).toBe(1200)
      expect(context.height.value).toBe(800)
    })

    it('should compute correct breakpoint from SSR width', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 1200 },
      })

      expect(context.name.value).toBe('lg')
      expect(context.lg.value).toBe(true)
      expect(context.lgAndUp.value).toBe(true)
      expect(context.lgAndDown.value).toBe(true)
      expect(context.mdAndUp.value).toBe(true)
      expect(context.xlAndUp.value).toBe(false)
    })

    it('should compute isMobile from SSR width', () => {
      const mobile = createBreakpoints({
        ssr: { clientWidth: 500 },
      })
      expect(mobile.isMobile.value).toBe(true)

      const desktop = createBreakpoints({
        ssr: { clientWidth: 1400 },
      })
      expect(desktop.isMobile.value).toBe(false)
    })

    it('should set ssr flag to true', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 1024 },
      })

      expect(context.ssr).toBe(true)
    })

    it('should default clientHeight to 0 when omitted', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 1024 },
      })

      expect(context.height.value).toBe(0)
    })

    it('should detect xs from narrow SSR width', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 400 },
      })

      expect(context.name.value).toBe('xs')
      expect(context.xs.value).toBe(true)
      expect(context.smAndUp.value).toBe(false)
    })

    it('should detect xxl from wide SSR width', () => {
      const context = createBreakpoints({
        ssr: { clientWidth: 2500 },
      })

      expect(context.name.value).toBe('xxl')
      expect(context.xxl.value).toBe(true)
    })

    it('should respect custom breakpoints with SSR', () => {
      const context = createBreakpoints({
        breakpoints: { sm: 480, md: 768 },
        ssr: { clientWidth: 500 },
      })

      expect(context.name.value).toBe('sm')
      expect(context.sm.value).toBe(true)
    })

    it('should use SSR dimensions in browser for hydration match', () => {
      inBrowser.value = true

      const context = createBreakpoints({
        ssr: { clientWidth: 1400, clientHeight: 900 },
      })

      expect(context.ssr).toBe(true)
      expect(context.width.value).toBe(1400)
      expect(context.height.value).toBe(900)
    })
  })

  describe('sSR safety', () => {
    it('should initialize with window dimensions when no SSR config', () => {
      const context = createBreakpoints()

      expect(context.width.value).toBe(1024)
      expect(context.height.value).toBe(768)
      expect(context.ssr).toBe(false)
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

  describe('plugin app.mount wrapping', () => {
    it('should wrap app.mount during install', () => {
      const plugin = createBreakpointsPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: originalMount,
      }

      plugin.install(mockApp as unknown as App)

      expect(mockApp.mount).not.toBe(originalMount)
    })

    it('should setup hydration watcher and resize listener on mount', () => {
      const plugin = createBreakpointsPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: originalMount,
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app')

      expect(originalMount).toHaveBeenCalledWith('#app')
      expect(mockUseHydration).toHaveBeenCalled()
    })

    it('should restore original mount after first call', () => {
      const plugin = createBreakpointsPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: originalMount,
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app')

      expect(mockApp.mount).toBe(originalMount)
    })

    it('should register cleanup on scope dispose', () => {
      const plugin = createBreakpointsPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: originalMount,
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app')

      expect(mockOnScopeDispose).toHaveBeenCalled()
      expect(mockOnScopeDispose.mock.calls[0]![1]).toBe(true)
    })

    it('should call cleanup function when scope is disposed', () => {
      let cleanupFn: (() => void) | undefined

      mockOnScopeDispose.mockImplementation((fn: () => void) => {
        cleanupFn = fn
      })

      const plugin = createBreakpointsPlugin()
      const originalMount = vi.fn(() => ({}) as any)
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: originalMount,
      }

      plugin.install(mockApp as unknown as App)

      mockApp.mount('#app')

      expect(cleanupFn).toBeDefined()
      expect(() => cleanupFn!()).not.toThrow()
    })
  })

  describe('fallback context', () => {
    it('should return fallback when called outside plugin context', () => {
      mockHasInjectionContext.mockReturnValue(false)

      const result = useBreakpoints()

      expect(result).toBeDefined()
      expect(result.name.value).toBe('xs')
      expect(result.width.value).toBe(0)
      expect(result.height.value).toBe(0)
      expect(result.isMobile.value).toBe(true)
      expect(result.xs.value).toBe(true)
      expect(result.sm.value).toBe(false)
      expect(result.md.value).toBe(false)
      expect(result.lg.value).toBe(false)
      expect(result.xl.value).toBe(false)
      expect(result.xxl.value).toBe(false)
      expect(result.ssr).toBe(false)
    })

    it('should have correct compound flags in fallback', () => {
      mockHasInjectionContext.mockReturnValue(false)

      const result = useBreakpoints()

      expect(result.smAndUp.value).toBe(false)
      expect(result.mdAndUp.value).toBe(false)
      expect(result.lgAndUp.value).toBe(false)
      expect(result.xlAndUp.value).toBe(false)
      expect(result.smAndDown.value).toBe(true)
      expect(result.mdAndDown.value).toBe(true)
      expect(result.lgAndDown.value).toBe(true)
      expect(result.xlAndDown.value).toBe(true)
    })

    it('should have noop update in fallback', () => {
      mockHasInjectionContext.mockReturnValue(false)

      const result = useBreakpoints()

      expect(() => result.update()).not.toThrow()
    })

    it('should have default breakpoint values in fallback', () => {
      mockHasInjectionContext.mockReturnValue(false)

      const result = useBreakpoints()

      expect(result.breakpoints).toEqual({
        xs: 0,
        sm: 600,
        md: 840,
        lg: 1145,
        xl: 1545,
        xxl: 2138,
      })
      expect(result.mobileBreakpoint).toBe('lg')
    })
  })

  describe('update in non-browser environment', () => {
    it('should be a noop when not in browser', () => {
      inBrowser.value = false

      const context = createBreakpoints()
      const initialWidth = context.width.value

      context.update()

      // Width should not change since IN_BROWSER is false
      expect(context.width.value).toBe(initialWidth)

      inBrowser.value = true
    })
  })

  describe('isMobile with named mobileBreakpoint', () => {
    it('should correctly evaluate isMobile with named breakpoint at various widths', () => {
      // Below lg threshold -> mobile
      mockWindow.innerWidth = 500
      const context = createBreakpoints({ mobileBreakpoint: 'lg' })
      context.update()
      expect(context.isMobile.value).toBe(true)

      // At lg threshold -> not mobile
      mockWindow.innerWidth = 1145
      context.update()
      expect(context.isMobile.value).toBe(false)
    })
  })

  describe('isMobile with numeric mobileBreakpoint after update', () => {
    it('should update isMobile when window resizes past numeric threshold', () => {
      mockWindow.innerWidth = 700
      const context = createBreakpoints({ mobileBreakpoint: 800 })
      context.update()
      expect(context.isMobile.value).toBe(true)

      mockWindow.innerWidth = 900
      context.update()
      expect(context.isMobile.value).toBe(false)
    })
  })

  describe('sSR with initial update skip', () => {
    it('should skip initial update when ssr option is provided', () => {
      const plugin = createBreakpointsPlugin({ ssr: { clientWidth: 1200 } })
      const mockApp: Record<string, any> = {
        _context: {},
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mount: vi.fn(() => ({}) as any),
      }

      plugin.install(mockApp as unknown as App)

      // Width should remain from SSR, not window
      // The plugin should not call update() synchronously when ssr is set
      expect(mockApp.runWithContext).toHaveBeenCalled()
    })
  })

  describe('non-browser initial values', () => {
    it('should initialize with zeros when not in browser and no SSR', () => {
      inBrowser.value = false

      const context = createBreakpoints()

      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)
      expect(context.name.value).toBe('xs')
      expect(context.ssr).toBe(false)

      inBrowser.value = true
    })
  })
})

describe('useBreakpoints without matchMedia', () => {
  let mockWindow: Record<string, unknown>

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

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
    vi.restoreAllMocks()
  })

  it('should fall back to innerWidth comparison when matchMedia is unavailable', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
      SUPPORTS_MATCH_MEDIA: false,
    }))

    const { createBreakpoints: create } = await import('./index')

    mockWindow.innerWidth = 1400

    const context = create()
    context.update()

    expect(context.name.value).toBe('lg')
    expect(context.lg.value).toBe(true)
    expect(context.isMobile.value).toBe(false)
  })

  it('should detect mobile via innerWidth with numeric mobileBreakpoint when matchMedia unavailable', async () => {
    vi.doMock('#v0/constants/globals', () => ({
      IN_BROWSER: true,
      SUPPORTS_MATCH_MEDIA: false,
    }))

    const { createBreakpoints: create } = await import('./index')

    mockWindow.innerWidth = 700

    const context = create({ mobileBreakpoint: 800 })
    context.update()

    expect(context.isMobile.value).toBe(true)

    mockWindow.innerWidth = 900
    context.update()

    expect(context.isMobile.value).toBe(false)
  })
})

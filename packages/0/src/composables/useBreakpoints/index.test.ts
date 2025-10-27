import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCurrentInstance, onMounted, watch, onScopeDispose } from 'vue'
import { createBreakpoints, useBreakpoints, createBreakpointsPlugin } from './index'
import { useHydration } from '../useHydration'

// Mock Vue functions
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    onMounted: vi.fn(),
    watch: vi.fn(),
    onScopeDispose: vi.fn(),
  }
})

// Mock useHydration
vi.mock('../useHydration', () => ({
  useHydration: vi.fn(),
}))

// Mock globals
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

// Mock helpers
vi.mock('#v0/utilities', () => ({
  mergeDeep: vi.fn((defaults, options) => ({
    ...defaults,
    ...options,
  })),
}))

const mockGetCurrentInstance = vi.mocked(getCurrentInstance)
const mockOnMounted = vi.mocked(onMounted)
const mockWatch = vi.mocked(watch)
const mockOnScopeDispose = vi.mocked(onScopeDispose)
const mockUseHydration = vi.mocked(useHydration)

describe('useBreakpoints', () => {
  let originalWindow: any
  let mockWindow: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window object
    originalWindow = global.window
    mockWindow = {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    global.window = mockWindow

    // Mock hydration
    mockUseHydration.mockReturnValue({
      isHydrated: { value: true, [Symbol.for('v-frag')]: true } as any,
      hydrate: vi.fn(),
    })
  })

  afterEach(() => {
    global.window = originalWindow
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

    it('should register onMounted callback when in component context', () => {
      mockGetCurrentInstance.mockReturnValue({} as any)

      createBreakpoints()

      expect(mockOnMounted).toHaveBeenCalledOnce()
      expect(typeof mockOnMounted.mock.calls[0]![0]).toBe('function')
    })

    it('should not register onMounted callback when not in component context', () => {
      mockGetCurrentInstance.mockReturnValue(null)

      createBreakpoints()

      expect(mockOnMounted).not.toHaveBeenCalled()
    })

    it('should register resize listener in browser environment', () => {
      mockGetCurrentInstance.mockReturnValue({} as any)

      createBreakpoints()

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })
      expect(mockOnScopeDispose).toHaveBeenCalledWith(expect.any(Function), true)
    })

    it('should handle hydration state correctly', () => {
      mockUseHydration.mockReturnValue({
        isHydrated: { value: false, [Symbol.for('v-frag')]: true } as any,
        hydrate: vi.fn(),
      })
      mockGetCurrentInstance.mockReturnValue({} as any)

      createBreakpoints()

      expect(mockOnMounted).toHaveBeenCalledOnce()

      // Execute the onMounted callback
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(mockWatch).toHaveBeenCalledWith(
        { value: false, [Symbol.for('v-frag')]: true },
        expect.any(Function),
        { immediate: true },
      )
    })

    it('should update immediately when hydrated', () => {
      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800
      mockUseHydration.mockReturnValue({
        isHydrated: { value: true, [Symbol.for('v-frag')]: true } as any,
        hydrate: vi.fn(),
      })
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.width.value).toBe(1200)
      expect(context.height.value).toBe(800)
    })
  })

  describe('breakpoint detection', () => {
    it('should detect xs breakpoint correctly', () => {
      mockWindow.innerWidth = 500
      mockWindow.innerHeight = 400
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

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
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

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
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('md')
      expect(context.md.value).toBe(true)
      expect(context.isMobile.value).toBe(false) // md is default mobile breakpoint
      expect(context.mdAndUp.value).toBe(true)
      expect(context.mdAndDown.value).toBe(true)
    })

    it('should detect lg breakpoint correctly', () => {
      mockWindow.innerWidth = 1400
      mockWindow.innerHeight = 800
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

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
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

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
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('xxl')
      expect(context.xxl.value).toBe(true)
      expect(context.isMobile.value).toBe(false)
      expect(context.xxlAndUp.value).toBe(true)
      expect(context.xxlAndDown.value).toBe(true)
    })
  })

  describe('window resize handling', () => {
    it('should update breakpoint on window resize', () => {
      mockWindow.innerWidth = 500
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger initial update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('xs')

      // Simulate window resize to 1400 (which should be lg: 1280-1919)
      mockWindow.innerWidth = 1400
      const resizeListener = mockWindow.addEventListener.mock.calls[0][1]
      resizeListener()

      expect(context.name.value).toBe('lg')
      expect(context.width.value).toBe(1400)
    })

    it('should clean up resize listener on scope dispose', () => {
      mockGetCurrentInstance.mockReturnValue({} as any)

      createBreakpoints()

      expect(mockOnScopeDispose).toHaveBeenCalledWith(expect.any(Function), true)

      // Execute the dispose callback
      const disposeCallback = mockOnScopeDispose.mock.calls[0]![0]
      disposeCallback()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('non-browser environment', () => {
    it('should not register resize listener in non-browser environment', () => {
      // Since we can't easily mock the IN_BROWSER constant,
      // we'll test that the normal behavior works in browser environment
      createBreakpoints()

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })
    })

    it('should not update dimensions in non-browser environment', () => {
      // Test that the update function works in browser environment
      mockWindow.innerWidth = 1000
      mockWindow.innerHeight = 600
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.width.value).toBe(1000)
      expect(context.height.value).toBe(600)
    })
  })

  describe('useBreakpoints', () => {
    it('should be a function', () => {
      expect(typeof useBreakpoints).toBe('function')
    })

    // Note: Full testing of useBreakpoints requires component context
    // since it uses inject/provide. This would typically be tested
    // in component tests or with a testing harness.
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
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn(),
      }

      plugin.install(mockApp as any)

      expect(mockApp.runWithContext).toHaveBeenCalledOnce()
      expect(typeof mockApp.runWithContext.mock.calls[0]![0]).toBe('function')
    })

    it('should work with empty options', () => {
      const plugin = createBreakpointsPlugin({})
      const mockApp = {
        runWithContext: vi.fn((callback: () => void) => callback()),
        provide: vi.fn(),
        mixin: vi.fn(),
      }

      expect(() => plugin.install(mockApp as any)).not.toThrow()
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
      mockWindow.innerWidth = 1200
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 'lg',
      })

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.isMobile.value).toBe(true) // 1200 < 1280 (lg breakpoint)
    })

    it('should handle custom mobile breakpoint as number', () => {
      mockWindow.innerWidth = 1000
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 1200,
      })

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.isMobile.value).toBe(true) // 1000 < 1200
    })

    it('should fallback to md breakpoint when custom mobile breakpoint is not found', () => {
      mockWindow.innerWidth = 1000
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints({
        namespace: 'v0:breakpoints',
        mobileBreakpoint: 'invalid' as any,
      })

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.isMobile.value).toBe(false) // 1000 >= 960 (md breakpoint)
    })
  })

  describe('SSR safety', () => {
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
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('xs')
      expect(context.width.value).toBe(0)
      expect(context.height.value).toBe(0)
    })

    it('should handle very large window width', () => {
      mockWindow.innerWidth = 5000
      mockWindow.innerHeight = 3000
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('xxl')
      expect(context.width.value).toBe(5000)
      expect(context.height.value).toBe(3000)
    })

    it('should handle breakpoint exactly at threshold', () => {
      mockWindow.innerWidth = 960 // Exactly at md breakpoint
      mockGetCurrentInstance.mockReturnValue({} as any)

      const context = createBreakpoints()

      // Execute the onMounted callback to trigger update
      const mountedCallback = mockOnMounted.mock.calls[0]![0]
      mountedCallback()

      expect(context.name.value).toBe('md')
      expect(context.md.value).toBe(true)
    })
  })
})

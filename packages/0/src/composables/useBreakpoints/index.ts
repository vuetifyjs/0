// Factories
import { createContext } from '#v0/factories/createContext'
import { createPlugin } from '#v0/factories/createPlugin'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { onScopeDispose, shallowReactive, getCurrentInstance, onMounted, watch } from 'vue'
import { mergeDeep } from '#v0/utilities/helpers'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App } from 'vue'

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface BreakpointsContext {
  breakpoints: Readonly<Record<BreakpointName, number>>
  name: BreakpointName
  width: number
  height: number
  isMobile: boolean
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
  smAndUp: boolean
  mdAndUp: boolean
  lgAndUp: boolean
  xlAndUp: boolean
  xxlAndUp: boolean
  smAndDown: boolean
  mdAndDown: boolean
  lgAndDown: boolean
  xlAndDown: boolean
  xxlAndDown: boolean
  update: () => void
}

export interface BreakpointsOptions {
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
}

export interface BreakpointsPlugin {
  install: (app: App, ...options: any[]) => any
}

export const [useBreakpointsContext, provideBreakpointsContext] = createContext<BreakpointsContext>('v0:breakpoints')

/**
 * Simple hook to access the breakpoints context.
 *
 * @returns The breakpoints context containing current breakpoint information.
 */
export function useBreakpoints (): BreakpointsContext {
  return useBreakpointsContext()
}

/**
 * Creates default breakpoint configuration.
 *
 * @returns The default breakpoint configuration object.
 */
function createDefaultBreakpoints () {
  return {
    mobileBreakpoint: 'md',
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  } as const
}

/**
 * Creates a reactive breakpoints system for responsive behavior management.
 * This function provides access to viewport dimensions, breakpoint detection, and helper flags
 * for determining current screen size and implementing responsive logic.
 *
 * @param options Optional configuration for breakpoint thresholds and mobile breakpoint.
 * @returns A breakpoints context object with reactive state and utility methods.
 */
export function createBreakpoints (options: BreakpointsOptions = {}) {
  const defaults = createDefaultBreakpoints()
  const { mobileBreakpoint, breakpoints } = mergeDeep(defaults, options as any)
  const sorted = Object.entries(breakpoints!).sort((a, b) => a[1] - b[1]) as [BreakpointName, number][]
  const names = sorted.map(([n]) => n)
  const mb = typeof mobileBreakpoint === 'number' ? mobileBreakpoint : breakpoints[mobileBreakpoint] ?? breakpoints.md

  const state = shallowReactive({
    breakpoints,
    name: 'xs' as BreakpointName,
    width: 0,
    height: 0,
    isMobile: true,
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    smAndUp: false,
    mdAndUp: false,
    lgAndUp: false,
    xlAndUp: false,
    xxlAndUp: false,
    smAndDown: true,
    mdAndDown: true,
    lgAndDown: true,
    xlAndDown: true,
    xxlAndDown: true,
    update,
  })

  function update () {
    if (!IN_BROWSER) return

    state.width = window.innerWidth
    state.height = window.innerHeight

    let current: BreakpointName = 'xs'
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (state.width >= sorted[i][1]) {
        current = sorted[i][0]
        break
      }
    }

    state.name = current

    const index = names.indexOf(current)

    state.isMobile = state.width < mb!
    state.xs = index === 0
    state.sm = index === 1
    state.md = index === 2
    state.lg = index === 3
    state.xl = index === 4
    state.xxl = index === 5
    state.smAndUp = index >= 1
    state.mdAndUp = index >= 2
    state.lgAndUp = index >= 3
    state.xlAndUp = index >= 4
    state.xxlAndUp = index >= 5
    state.smAndDown = index <= 1
    state.mdAndDown = index <= 2
    state.lgAndDown = index <= 3
    state.xlAndDown = index <= 4
    state.xxlAndDown = index <= 5
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      const { isHydrated } = useHydration()

      if (isHydrated.value) update()

      watch(isHydrated, hydrated => {
        if (hydrated) update()
      }, { immediate: true })
    })
  }

  if (IN_BROWSER) {
    const listener = () => update()
    window.addEventListener('resize', listener, { passive: true })

    if (getCurrentInstance()) {
      onScopeDispose(() => window.removeEventListener('resize', listener))
    }
  }

  return state
}

/**
 * Creates a Vue plugin for managing responsive breakpoints with automatic updates.
 * This plugin sets up breakpoint tracking and updates the context when the window
 * is resized, providing reactive breakpoint state throughout the application.
 *
 * @param options Optional configuration for breakpoint thresholds and mobile breakpoint.
 * @returns A Vue plugin object with install method.
 */
export function createBreakpointsPlugin (options: BreakpointsOptions = {}): BreakpointsPlugin {
  const context = createBreakpoints(options)

  return createPlugin<BreakpointsPlugin>({
    namespace: 'v0:breakpoints',
    provide: (app: App) => {
      provideBreakpointsContext(context, app)
    },
    setup: (app: App) => {
      app.mixin({
        mounted () {
          context.update()
        },
      })
    },
  })
}

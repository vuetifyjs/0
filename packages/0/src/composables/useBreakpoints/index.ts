// Composables
import { useContext } from '#v0/composables/useContext'
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { getCurrentInstance, onMounted, onScopeDispose, shallowReactive, watch } from 'vue'
import { mergeDeep } from '#v0/utils/helpers'

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
}

export interface BreakpointsOptions {
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
}

export const [useBreakpointsContext, provideBreakpointsContext] = useContext<BreakpointsContext>('v0:breakpoints')

export function useBreakpoints (): BreakpointsContext {
  return useBreakpointsContext()
}

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

export function createBreakpoints (options: BreakpointsOptions = {}) {
  const { isHydrated } = useHydration()

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
      if (isHydrated.value) update()
      else watch(isHydrated, update, { immediate: true })
    })
  }

  if (IN_BROWSER) {
    const listener = () => update()
    window.addEventListener('resize', listener, { passive: true })
    onScopeDispose(() => window.removeEventListener('resize', listener))
  }

  return state
}

export function createBreakpointsPlugin (options: BreakpointsOptions = {}) {
  return {
    install (app: App) {
      const context = createBreakpoints(options)

      app.runWithContext(() => {
        provideBreakpointsContext(context, app)
      })
    },
  }
}

// Composables
import { useContext } from '#v0/composables/useContext'

// Types
import { reactive, shallowRef, type App } from 'vue'

export interface BreakpointsContext {

}

export interface BreakpointsOptions {
  mobileBreakpoint?: number | string
  breakpoints?: Record<string, number | string>
}

export const [useBreakpointsContext, provideBreakpointsContext] = useContext<BreakpointsContext>('v0:breakpoints')

export function useBreakpoints () {
  return useBreakpointsContext()
}

function createDefaultBreakpoints () {
  return {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560,
  }
}

export function createBreakpoints (options: BreakpointsOptions = {}) {
  const { mobileBreakpoint, breakpoints } = deepMerge(options, createDefaultBreakpoints())
  const context = reactive({} as BreakpointsContext)
  const height = shallowRef<number | string>(0)
  const width = shallowRef<number | string>(0)
}

export function createBreakpointsPlugin (options: BreakpointsOptions = {}) {
  return {
    install (app: App) {
      const context = createBreakpoints(options)

      app.runWithContext(() => {
        provideBreakpointsContext(context)
      })
    },
  }
}

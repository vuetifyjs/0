// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { onScopeDispose, shallowRef, readonly, getCurrentInstance, onMounted, watch } from 'vue'
import { mergeDeep } from '#v0/utilities'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App, ShallowRef } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface BreakpointsContext {
  breakpoints: Readonly<Record<BreakpointName, number>>
  name: Readonly<ShallowRef<BreakpointName>>
  width: Readonly<ShallowRef<number>>
  height: Readonly<ShallowRef<number>>
  isMobile: Readonly<ShallowRef<boolean>>
  xs: Readonly<ShallowRef<boolean>>
  sm: Readonly<ShallowRef<boolean>>
  md: Readonly<ShallowRef<boolean>>
  lg: Readonly<ShallowRef<boolean>>
  xl: Readonly<ShallowRef<boolean>>
  xxl: Readonly<ShallowRef<boolean>>
  smAndUp: Readonly<ShallowRef<boolean>>
  mdAndUp: Readonly<ShallowRef<boolean>>
  lgAndUp: Readonly<ShallowRef<boolean>>
  xlAndUp: Readonly<ShallowRef<boolean>>
  xxlAndUp: Readonly<ShallowRef<boolean>>
  smAndDown: Readonly<ShallowRef<boolean>>
  mdAndDown: Readonly<ShallowRef<boolean>>
  lgAndDown: Readonly<ShallowRef<boolean>>
  xlAndDown: Readonly<ShallowRef<boolean>>
  xxlAndDown: Readonly<ShallowRef<boolean>>
  update: () => void
}

export interface BreakpointsOptions extends BreakpointsPluginOptions {}

export interface BreakpointsPluginOptions {
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
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
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 */
export function createBreakpoints<
  E extends BreakpointsContext = BreakpointsContext,
> (
  namespace = 'v0:breakpoints',
  options: BreakpointsOptions = {},
): ContextTrinity<E> {
  const [useBreakpointsContext, _provideBreakpointsContext] = createContext<E>(namespace)
  const defaults = createDefaultBreakpoints()
  const { mobileBreakpoint, breakpoints } = mergeDeep(defaults, options as any)
  const sorted = Object.entries(breakpoints!).sort((a, b) => a[1] - b[1]) as [BreakpointName, number][]
  const names = sorted.map(([n]) => n)
  const mb = typeof mobileBreakpoint === 'number' ? mobileBreakpoint : breakpoints[mobileBreakpoint] ?? breakpoints.md

  const name = shallowRef<BreakpointName>('xs')
  const width = shallowRef(0)
  const height = shallowRef(0)
  const isMobile = shallowRef(false)
  const xs = shallowRef(false)
  const sm = shallowRef(false)
  const md = shallowRef(false)
  const lg = shallowRef(false)
  const xl = shallowRef(false)
  const xxl = shallowRef(false)
  const smAndUp = shallowRef(false)
  const mdAndUp = shallowRef(false)
  const lgAndUp = shallowRef(false)
  const xlAndUp = shallowRef(false)
  const xxlAndUp = shallowRef(false)
  const smAndDown = shallowRef(false)
  const mdAndDown = shallowRef(false)
  const lgAndDown = shallowRef(false)
  const xlAndDown = shallowRef(false)
  const xxlAndDown = shallowRef(false)

  function update () {
    if (!IN_BROWSER) return

    width.value = window.innerWidth
    height.value = window.innerHeight

    let current: BreakpointName = 'xs'
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (width.value >= sorted[i]![1]) {
        current = sorted[i]![0]
        break
      }
    }

    name.value = current

    const index = names.indexOf(current)

    isMobile.value = width.value < mb!
    xs.value = index === 0
    sm.value = index === 1
    md.value = index === 2
    lg.value = index === 3
    xl.value = index === 4
    xxl.value = index === 5
    smAndUp.value = index >= 1
    mdAndUp.value = index >= 2
    lgAndUp.value = index >= 3
    xlAndUp.value = index >= 4
    xxlAndUp.value = index >= 5
    smAndDown.value = index <= 1
    mdAndDown.value = index <= 2
    lgAndDown.value = index <= 3
    xlAndDown.value = index <= 4
    xxlAndDown.value = index <= 5
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
    function listener () {
      update()
    }
    window.addEventListener('resize', listener, { passive: true })

    if (getCurrentInstance()) {
      onScopeDispose(() => window.removeEventListener('resize', listener))
    }
  }

  const context = {
    breakpoints,
    name: readonly(name),
    width: readonly(width),
    height: readonly(height),
    isMobile: readonly(isMobile),
    xs: readonly(xs),
    sm: readonly(sm),
    md: readonly(md),
    lg: readonly(lg),
    xl: readonly(xl),
    xxl: readonly(xxl),
    smAndUp: readonly(smAndUp),
    mdAndUp: readonly(mdAndUp),
    lgAndUp: readonly(lgAndUp),
    xlAndUp: readonly(xlAndUp),
    xxlAndUp: readonly(xxlAndUp),
    smAndDown: readonly(smAndDown),
    mdAndDown: readonly(mdAndDown),
    lgAndDown: readonly(lgAndDown),
    xlAndDown: readonly(xlAndDown),
    xxlAndDown: readonly(xxlAndDown),
    update,
  } as E

  function provideBreakpointsContext (_context: E = context, app?: App): E {
    return _provideBreakpointsContext(_context, app)
  }

  return createTrinity<E>(useBreakpointsContext, provideBreakpointsContext, context)
}

/**
 * Simple hook to access the breakpoints context.
 *
 * @returns The breakpoints context containing current breakpoint information.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 */
export function useBreakpoints (): BreakpointsContext {
  return useContext<BreakpointsContext>('v0:breakpoints')
}

/**
 * Creates a Vue plugin for managing responsive breakpoints with automatic updates.
 * This plugin sets up breakpoint tracking and updates the context when the window
 * is resized, providing reactive breakpoint state throughout the application.
 *
 * @param options Optional configuration for breakpoint thresholds and mobile breakpoint.
 * @returns A Vue plugin object with install method.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 */
export function createBreakpointsPlugin<
  E extends BreakpointsContext = BreakpointsContext,
> (options: BreakpointsPluginOptions = {}) {
  const [, provideBreakpointsContext, context] = createBreakpoints<E>('v0:breakpoints', options)

  return createPlugin({
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

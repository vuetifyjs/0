/**
 * @module useBreakpoints
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 *
 * @remarks
 * Responsive breakpoint detection composable with window resize handling.
 *
 * Key features:
 * - Window matchMedia integration
 * - Six built-in breakpoints (xs, sm, md, lg, xl, xxl)
 * - Automatic resize listener with cleanup
 * - SSR-safe (checks IN_BROWSER)
 * - Hydration-aware
 * - Custom breakpoint configuration
 *
 * Perfect for responsive layouts and conditional rendering based on screen size.
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { useWindowEventListener } from '#v0/composables/useEventListener'
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { isNull, isNumber, mergeDeep } from '#v0/utilities'
import { onScopeDispose, readonly, shallowRef, watch } from 'vue'

// Types
import type { ShallowRef } from 'vue'

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

export interface BreakpointsOptions {
  namespace?: string
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
}

export interface BreakpointsPluginOptions extends BreakpointsOptions {}

export interface BreakpointsContextOptions extends BreakpointsOptions {}

/**
 * Creates default breakpoint configuration.
 *
 * @returns The default breakpoint configuration object.
 */
function createDefaultBreakpoints () {
  return {
    mobileBreakpoint: 'lg',
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  } as const
}

/**
 * Creates a new breakpoints instance.
 *
 * @param options The options for the breakpoints instance.
 * @template E The type of the breakpoints context.
 * @returns A new breakpoints instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 *
 * @example
 * ```ts
 * import { createBreakpoints } from '@vuetify/v0'
 *
 * export const [useBreakpoints, provideBreakpoints] = createBreakpoints({
 *   namespace: 'v0:breakpoints',
 *   mobileBreakpoint: 'md',
 *   breakpoints: {
 *     xs: 0,
 *     sm: 600,
 *     md: 840,
 *     lg: 1145,
 *     xl: 1545,
 *     xxl: 2138,
 *   },
 * })
 * ```
 */
export function createBreakpoints<
  E extends BreakpointsContext = BreakpointsContext,
> (_options: BreakpointsOptions = {}): E {
  const defaults = createDefaultBreakpoints()
  const { mobileBreakpoint, breakpoints } = mergeDeep(defaults, _options as any)
  const sorted = Object.entries(breakpoints!).toSorted((a, b) => a[1] - b[1]) as [BreakpointName, number][]
  const names = sorted.map(([n]) => n)
  const mb = isNumber(mobileBreakpoint) ? mobileBreakpoint : breakpoints[mobileBreakpoint] ?? breakpoints.md

  const name = shallowRef<BreakpointName>('xs')
  const width = shallowRef(0)
  const height = shallowRef(0)
  const isMobile = shallowRef(true)
  const xs = shallowRef(true)
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
  const smAndDown = shallowRef(true)
  const mdAndDown = shallowRef(true)
  const lgAndDown = shallowRef(true)
  const xlAndDown = shallowRef(true)
  const xxlAndDown = shallowRef(true)

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

  return {
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
}

export const [createBreakpointsContext, createBreakpointsPlugin, useBreakpoints] =
  createPluginContext<BreakpointsContextOptions, BreakpointsContext>(
    'v0:breakpoints',
    options => createBreakpoints(options),
    {
      setup: (context, app, _options) => {
        app.mixin({
          mounted () {
            if (!isNull(this.$parent)) return

            const hydration = useHydration()

            function listener () {
              context.update()
            }

            const unwatch = watch(hydration.isHydrated, hydrated => {
              if (hydrated) listener()
            }, { immediate: true })

            const cleanup = useWindowEventListener('resize', listener, { passive: true })
            onScopeDispose(() => {
              cleanup()
              unwatch()
            }, true)
          },
        })
      },
    },
  )

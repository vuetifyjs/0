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
  mobileBreakpoint: BreakpointName | number
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
  smAndDown: Readonly<ShallowRef<boolean>>
  mdAndDown: Readonly<ShallowRef<boolean>>
  lgAndDown: Readonly<ShallowRef<boolean>>
  xlAndDown: Readonly<ShallowRef<boolean>>
  ssr: boolean
  update: () => void
}

export interface BreakpointsOptions {
  namespace?: string
  mobileBreakpoint?: BreakpointName | number
  breakpoints?: Partial<Record<BreakpointName, number>>
  ssr?: { clientWidth: number, clientHeight?: number }
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
  const { ssr, ...options } = _options
  const defaults = createDefaultBreakpoints()
  const { mobileBreakpoint, breakpoints } = mergeDeep(defaults, options as any)
  const sorted = Object.entries(breakpoints!).toSorted((a, b) => a[1] - b[1]) as [BreakpointName, number][]
  const names = sorted.map(([n]) => n)
  const mb = isNumber(mobileBreakpoint) ? mobileBreakpoint : breakpoints[mobileBreakpoint] ?? breakpoints.md

  // When SSR options are provided and not in browser, use them for initial values
  // so server-rendered markup reflects the expected viewport size.
  // On hydration, update() replaces these with real window dimensions.
  const isSSR = !IN_BROWSER && !!ssr
  const initialWidth = isSSR ? ssr!.clientWidth : 0
  const initialHeight = isSSR ? (ssr!.clientHeight ?? 0) : 0

  let initialName: BreakpointName = 'xs'
  if (isSSR) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (initialWidth >= sorted[i]![1]) {
        initialName = sorted[i]![0]
        break
      }
    }
  }
  const initialIndex = names.indexOf(initialName)

  const name = shallowRef<BreakpointName>(initialName)
  const width = shallowRef(initialWidth)
  const height = shallowRef(initialHeight)
  const isMobile = shallowRef(isSSR ? initialWidth < mb! : true)
  const xs = shallowRef(initialIndex === 0)
  const sm = shallowRef(initialIndex === 1)
  const md = shallowRef(initialIndex === 2)
  const lg = shallowRef(initialIndex === 3)
  const xl = shallowRef(initialIndex === 4)
  const xxl = shallowRef(initialIndex === 5)
  const smAndUp = shallowRef(initialIndex >= 1)
  const mdAndUp = shallowRef(initialIndex >= 2)
  const lgAndUp = shallowRef(initialIndex >= 3)
  const xlAndUp = shallowRef(initialIndex >= 4)
  const smAndDown = shallowRef(initialIndex <= 1)
  const mdAndDown = shallowRef(initialIndex <= 2)
  const lgAndDown = shallowRef(initialIndex <= 3)
  const xlAndDown = shallowRef(initialIndex <= 4)

  function update () {
    if (!IN_BROWSER) return

    width.value = window.innerWidth
    height.value = window.innerHeight

    // Use matchMedia for breakpoint detection to guarantee
    // alignment with CSS media queries at any zoom level.
    let current: BreakpointName = 'xs'
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (window.matchMedia(`(min-width: ${sorted[i]![1]}px)`).matches) {
        current = sorted[i]![0]
        break
      }
    }

    name.value = current

    const index = names.indexOf(current)

    isMobile.value = isNumber(mb)
      ? !window.matchMedia(`(min-width: ${mb}px)`).matches
      : index < names.indexOf(mobileBreakpoint as BreakpointName)
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
    smAndDown.value = index <= 1
    mdAndDown.value = index <= 2
    lgAndDown.value = index <= 3
    xlAndDown.value = index <= 4
  }

  return {
    breakpoints,
    mobileBreakpoint,
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
    smAndDown: readonly(smAndDown),
    mdAndDown: readonly(mdAndDown),
    lgAndDown: readonly(lgAndDown),
    xlAndDown: readonly(xlAndDown),
    ssr: isSSR,
    update,
  } as E
}

function createBreakpointsFallback<
  E extends BreakpointsContext = BreakpointsContext,
> (options: BreakpointsOptions = {}): E {
  if (options.ssr) return createBreakpoints(options)

  const defaults = createDefaultBreakpoints()

  return {
    breakpoints: defaults.breakpoints,
    mobileBreakpoint: defaults.mobileBreakpoint,
    name: readonly(shallowRef<BreakpointName>('xs')),
    width: readonly(shallowRef(0)),
    height: readonly(shallowRef(0)),
    isMobile: readonly(shallowRef(true)),
    xs: readonly(shallowRef(true)),
    sm: readonly(shallowRef(false)),
    md: readonly(shallowRef(false)),
    lg: readonly(shallowRef(false)),
    xl: readonly(shallowRef(false)),
    xxl: readonly(shallowRef(false)),
    smAndUp: readonly(shallowRef(false)),
    mdAndUp: readonly(shallowRef(false)),
    lgAndUp: readonly(shallowRef(false)),
    xlAndUp: readonly(shallowRef(false)),
    smAndDown: readonly(shallowRef(true)),
    mdAndDown: readonly(shallowRef(true)),
    lgAndDown: readonly(shallowRef(true)),
    xlAndDown: readonly(shallowRef(true)),
    ssr: false,
    update: () => {},
  } as E
}

export const [createBreakpointsContext, createBreakpointsPlugin, useBreakpoints] =
  createPluginContext<BreakpointsContextOptions, BreakpointsContext>(
    'v0:breakpoints',
    options => createBreakpoints(options),
    {
      fallback: () => createBreakpointsFallback(),
      setup: (context, app, _options) => {
        // Flush initial values synchronously so they're correct
        // before any component's onMounted runs.
        if (IN_BROWSER) context.update()

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

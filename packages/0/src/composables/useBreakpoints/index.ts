/**
 * @module useBreakpoints
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-breakpoints
 *
 * @remarks
 * Responsive breakpoint detection composable with window resize handling.
 *
 * Key features:
 * - matchMedia-based detection for zoom-accurate breakpoints
 * - Six built-in breakpoints (xs, sm, md, lg, xl, xxl) with Vuetify 4 default widths
 * - `isMobile` flag and configurable `mobileBreakpoint`
 * - Automatic resize listener with cleanup
 * - SSR-safe with hydration flush
 * - Custom breakpoint configuration
 *
 * Perfect for responsive layouts and conditional rendering based on screen size.
 *
 * @example
 * ```ts
 * import { useBreakpoints } from '@vuetify/v0'
 *
 * const { current, isMobile, smAndUp } = useBreakpoints()
 * console.log(current.value) // 'md'
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { useWindowEventListener } from '#v0/composables/useEventListener'
import { useHydration } from '#v0/composables/useHydration'

// Constants
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Utilities
import { isNumber, mergeDeep } from '#v0/utilities'
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
export function createBreakpoints (_options: BreakpointsOptions = {}): BreakpointsContext {
  const { ssr, ...options } = _options
  const defaults = createDefaultBreakpoints()
  const { mobileBreakpoint, breakpoints } = mergeDeep(defaults, options as typeof defaults)
  const sorted = Object.entries(breakpoints!).toSorted((a, b) => a[1] - b[1]) as [BreakpointName, number][]
  const names = sorted.map(([n]) => n)
  const mb = isNumber(mobileBreakpoint) ? mobileBreakpoint : breakpoints[mobileBreakpoint] ?? breakpoints.md

  // When SSR is configured, both server and client use the same dimensions
  // so rendered markup matches and avoids hydration mismatch.
  // After hydration, update() replaces these with real window dimensions.
  // Without SSR, browser reads window dimensions immediately.
  const initialWidth = ssr
    ? ssr.clientWidth
    : (IN_BROWSER ? window.innerWidth : 0)
  const initialHeight = ssr
    ? (ssr.clientHeight ?? 0)
    : (IN_BROWSER ? window.innerHeight : 0)

  let initialName: BreakpointName = 'xs'
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (initialWidth >= sorted[i]![1]) {
      initialName = sorted[i]![0]
      break
    }
  }
  const initialIndex = names.indexOf(initialName)

  const name = shallowRef<BreakpointName>(initialName)
  const width = shallowRef(initialWidth)
  const height = shallowRef(initialHeight)
  const isMobile = shallowRef(initialWidth < mb!)
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
    // Falls back to innerWidth comparison when matchMedia is unavailable.
    let current: BreakpointName = 'xs'
    for (let i = sorted.length - 1; i >= 0; i--) {
      const px = sorted[i]![1]
      if (SUPPORTS_MATCH_MEDIA ? window.matchMedia(`(min-width: ${px}px)`).matches : width.value >= px) {
        current = sorted[i]![0]
        break
      }
    }

    name.value = current

    const index = names.indexOf(current)

    isMobile.value = isNumber(mb)
      ? (SUPPORTS_MATCH_MEDIA ? !window.matchMedia(`(min-width: ${mb}px)`).matches : width.value < mb)
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
    ssr: !!ssr,
    update,
  }
}

function createBreakpointsFallback (options: BreakpointsOptions = {}): BreakpointsContext {
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
  }
}

export const [createBreakpointsContext, createBreakpointsPlugin, useBreakpoints] =
  createPluginContext<BreakpointsContextOptions, BreakpointsContext>(
    'v0:breakpoints',
    options => createBreakpoints(options),
    {
      fallback: () => createBreakpointsFallback(),
      setup: (context, app, _options) => {
        // In SSR mode, skip the synchronous update to avoid hydration mismatch.
        // The hydration watcher below will call update() after hydration completes.
        if (IN_BROWSER && !_options?.ssr) context.update()

        const { mount } = app
        app.mount = (...args) => {
          const vm = mount(...args)

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

          app.mount = mount
          return vm
        }
      },
    },
  )

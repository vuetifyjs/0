/**
 * @module useMediaQuery
 *
 * @see https://0.vuetifyjs.com/composables/system/use-media-query
 *
 * @remarks
 * Reactive media query composable with automatic cleanup.
 *
 * Key features:
 * - Synchronous matchMedia read on client mount (prevents FOUC)
 * - Window matchMedia integration
 * - Reactive query string support
 * - SSR-safe (returns false on server)
 * - Hydration-aware (defers client updates until hydrated)
 * - Automatic listener cleanup on scope disposal
 * - Supports both static and dynamic queries
 *
 * Perfect for responsive conditionals beyond breakpoint detection.
 *
 * @example
 * ```ts
 * import { useMediaQuery } from '@vuetify/v0'
 *
 * const { matches } = useMediaQuery('(prefers-color-scheme: dark)')
 * console.log(matches.value) // true/false
 * ```
 */

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Constants
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Utilities
import { onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export interface MediaQueryContext {
  /** Whether the media query currently matches */
  readonly matches: Readonly<ShallowRef<boolean>>
  /** The current media query string */
  readonly query: Readonly<Ref<string>>
  /** The underlying MediaQueryList (null on server) */
  readonly mediaQueryList: Readonly<ShallowRef<MediaQueryList | null>>
  /** Stop listening and clean up */
  stop: () => void
}

/**
 * Reactive media query matching.
 *
 * @param query CSS media query string (reactive).
 * @returns The media query context.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-media-query
 *
 * @example
 * ```ts
 * // Static query
 * const { matches } = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * // Dynamic query
 * const minWidth = ref(768)
 * const { matches } = useMediaQuery(() => `(min-width: ${minWidth.value}px)`)
 *
 * // Manual cleanup
 * const { matches, stop } = useMediaQuery('(hover: hover)')
 * stop() // Remove listener early
 * ```
 */
export function useMediaQuery (query: MaybeRefOrGetter<string>): MediaQueryContext {
  const resolvedQuery = toRef(() => toValue(query))

  // Read matchMedia synchronously on the client so consumers get the real
  // value immediately (e.g. usePrefersDark during theme resolution).
  // Only the change *listener* is deferred until after hydration.
  const initialQuery = toValue(query)
  const initialMql = IN_BROWSER && SUPPORTS_MATCH_MEDIA
    ? window.matchMedia(initialQuery)
    : null
  const matches = shallowRef(initialMql?.matches ?? false)
  const mediaQueryList = shallowRef<MediaQueryList | null>(initialMql)

  const hydration = useHydration()
  let cleanup: (() => void) | null = null

  function listen (): void {
    if (!IN_BROWSER || !SUPPORTS_MATCH_MEDIA) return

    cleanup?.()
    cleanup = null

    const mql = window.matchMedia(resolvedQuery.value)
    mediaQueryList.value = mql
    matches.value = mql.matches

    function handler (e: MediaQueryListEvent): void {
      matches.value = e.matches
    }

    mql.addEventListener('change', handler)
    cleanup = () => mql.removeEventListener('change', handler)
  }

  // Defer the change listener until after hydration to avoid SSR mismatches
  // from event-driven updates. The initial value is already correct from the
  // synchronous matchMedia read above.
  const stopWatch = watch(
    [resolvedQuery, () => hydration.isHydrated.value],
    ([_, hydrated]) => {
      if (hydrated) listen()
    },
    { immediate: true },
  )

  function stop (): void {
    stopWatch()
    cleanup?.()
    cleanup = null
  }

  onScopeDispose(stop, true)

  return {
    matches: shallowReadonly(matches),
    query: resolvedQuery,
    mediaQueryList: shallowReadonly(mediaQueryList),
    stop,
  }
}

/**
 * Check if the user prefers dark color scheme.
 *
 * @returns The media query context.
 *
 * @example
 * ```ts
 * const { matches: prefersDark } = usePrefersDark()
 * ```
 */
export function usePrefersDark (): MediaQueryContext {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

/**
 * Check if the user prefers reduced motion.
 *
 * @returns The media query context.
 *
 * @example
 * ```ts
 * const { matches: prefersReducedMotion } = usePrefersReducedMotion()
 * ```
 */
export function usePrefersReducedMotion (): MediaQueryContext {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Check if the user prefers more contrast.
 *
 * @returns The media query context.
 *
 * @example
 * ```ts
 * const { matches: prefersContrast } = usePrefersContrast()
 * ```
 */
export function usePrefersContrast (): MediaQueryContext {
  return useMediaQuery('(prefers-contrast: more)')
}

/**
 * @module useMediaQuery
 *
 * @see https://0.vuetifyjs.com/composables/system/use-media-query
 *
 * @remarks
 * Reactive media query composable with automatic cleanup.
 *
 * Key features:
 * - Window matchMedia integration
 * - Reactive query string support
 * - SSR-safe (returns false on server)
 * - Hydration-aware (defers client updates until hydrated)
 * - Automatic listener cleanup on scope disposal
 * - Supports both static and dynamic queries
 *
 * Perfect for responsive conditionals beyond breakpoint detection.
 */

// Constants
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { computed, onScopeDispose, shallowReadonly, shallowRef, toValue, watch } from 'vue'

// Types
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export interface MediaQueryContext {
  /** Whether the media query currently matches */
  readonly matches: Readonly<ShallowRef<boolean>>
  /** The current media query string */
  readonly query: ComputedRef<string>
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
  const matches = shallowRef(false)
  const mediaQueryList = shallowRef<MediaQueryList | null>(null)
  const resolvedQuery = computed(() => toValue(query))
  const hydration = useHydration()

  let cleanup: (() => void) | null = null

  function update (): void {
    if (!IN_BROWSER || !SUPPORTS_MATCH_MEDIA) return

    // Clean up previous listener
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

  // Watch for query changes, defer until hydrated to prevent SSR mismatch.
  // During SSR and hydration, matches stays false. Once hydration completes,
  // the effect runs and updates to the actual media query value.
  // Query changes during hydration are queued and applied after hydration.
  const stopWatch = watch(
    [resolvedQuery, () => hydration.isHydrated.value],
    ([_, hydrated]) => {
      if (hydrated) update()
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

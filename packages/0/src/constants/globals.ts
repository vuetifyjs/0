/**
 * @module constants/globals
 *
 * @remarks
 * Runtime environment detection constants for SSR safety and feature detection.
 * All constants are evaluated at module load time.
 */

/**
 * Whether code is running in a browser environment
 *
 * @remarks
 * Use this to guard browser-only code paths in SSR-compatible composables.
 *
 * @example
 * ```ts
 * if (IN_BROWSER) {
 *   window.addEventListener('resize', handler)
 * }
 * ```
 */
export const IN_BROWSER = typeof window !== 'undefined'

/**
 * Whether the browser supports touch events
 *
 * @remarks
 * Checks for `ontouchstart` event or `maxTouchPoints > 0`.
 * Always false during SSR.
 */
export const SUPPORTS_TOUCH = IN_BROWSER && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0)

/**
 * Whether the browser supports the matchMedia API
 *
 * @remarks
 * Required for responsive breakpoint detection.
 * Always false during SSR.
 */
export const SUPPORTS_MATCH_MEDIA = IN_BROWSER && 'matchMedia' in window && typeof window.matchMedia === 'function'

/**
 * Whether the browser supports ResizeObserver
 *
 * @remarks
 * Required for `useResizeObserver` composable.
 * Always false during SSR.
 */
export const SUPPORTS_OBSERVER = IN_BROWSER && 'ResizeObserver' in window

/**
 * Whether the browser supports IntersectionObserver
 *
 * @remarks
 * Required for `useIntersectionObserver` composable.
 * Always false during SSR.
 */
export const SUPPORTS_INTERSECTION_OBSERVER = IN_BROWSER && 'IntersectionObserver' in window

/**
 * Whether the browser supports MutationObserver
 *
 * @remarks
 * Required for `useMutationObserver` composable.
 * Always false during SSR.
 */
export const SUPPORTS_MUTATION_OBSERVER = IN_BROWSER && 'MutationObserver' in window

/**
 * Current package version
 *
 * @remarks
 * Injected at build time via `__VERSION__` define.
 */
export const version = __VERSION__

/**
 * Whether logger output is enabled
 *
 * @remarks
 * True in development mode or when `VITE_LOGGER_ENABLED=true`.
 * Controls whether `useLogger` produces console output.
 */
export const __LOGGER_ENABLED__ = __DEV__ || __VITE_LOGGER_ENABLED__ === 'true'

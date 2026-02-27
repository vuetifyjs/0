export const IN_BROWSER = typeof window !== 'undefined'
export const SUPPORTS_TOUCH = IN_BROWSER && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0)
export const SUPPORTS_MATCH_MEDIA = IN_BROWSER && 'matchMedia' in window && typeof window.matchMedia === 'function'
export const SUPPORTS_OBSERVER = IN_BROWSER && 'ResizeObserver' in window
export const SUPPORTS_INTERSECTION_OBSERVER = IN_BROWSER && 'IntersectionObserver' in window
export const SUPPORTS_MUTATION_OBSERVER = IN_BROWSER && 'MutationObserver' in window

export const version = typeof __VERSION__ === 'undefined' ? '0.0.0' : __VERSION__

/* v8 ignore next -- build-time constant, __DEV__ short-circuits in tests */
export const __LOGGER_ENABLED__ = (typeof __DEV__ !== 'undefined' && __DEV__)
  || (typeof __VITE_LOGGER_ENABLED__ !== 'undefined' && __VITE_LOGGER_ENABLED__ === 'true')

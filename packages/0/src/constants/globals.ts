export const IN_BROWSER = typeof window !== 'undefined'
export const SUPPORTS_TOUCH = IN_BROWSER && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0)
export const SUPPORTS_MATCH_MEDIA = IN_BROWSER && 'matchMedia' in window && typeof window.matchMedia === 'function'
export const SUPPORTS_OBSERVER = IN_BROWSER && 'ResizeObserver' in window

export const __LOGGER_ENABLED__ = __DEV__ || process.env.VITE_LOGGER_ENABLED === 'true'

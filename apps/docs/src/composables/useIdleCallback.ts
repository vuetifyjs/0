/**
 * Schedules a callback to run during idle time, falling back to setTimeout
 * for browsers that don't support requestIdleCallback (Safari/iOS).
 */
export function useIdleCallback (fn: () => void, timeout = 200): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fn, { timeout })
  } else {
    setTimeout(fn, timeout)
  }
}

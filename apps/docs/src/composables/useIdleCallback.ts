// Utilities
import { onScopeDispose } from 'vue'

/**
 * Schedules a callback to run during idle time, falling back to setTimeout
 * for browsers that don't support requestIdleCallback (Safari/iOS).
 *
 * Automatically cancels the scheduled callback when the current effect scope
 * is disposed (e.g., component unmount). Safe to call outside effect scopes
 * (e.g., module-level initialization).
 */
export function useIdleCallback (fn: () => void, timeout = 200): void {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(fn, { timeout })
    onScopeDispose(() => cancelIdleCallback(id), true)
  } else {
    const id = setTimeout(fn, timeout)
    onScopeDispose(() => clearTimeout(id), true)
  }
}

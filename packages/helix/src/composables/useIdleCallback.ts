// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { onScopeDispose } from 'vue'

/**
 * Schedules a callback to run during idle time, falling back to setTimeout
 * for browsers that don't support requestIdleCallback (Safari/iOS).
 *
 * Automatically cancels the scheduled callback when the current effect scope
 * is disposed (e.g., component unmount). Returns a cleanup function for
 * manual cancellation.
 */
export function useIdleCallback (fn: () => void, timeout = 200): () => void {
  function noop () {}

  if (!IN_BROWSER) return noop

  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(fn, { timeout })
    function cancel () {
      cancelIdleCallback(id)
    }
    onScopeDispose(cancel, true)
    return cancel
  }

  const id = setTimeout(fn, timeout)
  function clear () {
    clearTimeout(id)
  }
  onScopeDispose(clear, true)
  return clear
}

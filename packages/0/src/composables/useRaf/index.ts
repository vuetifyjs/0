/**
 * @module useRaf
 *
 * @see https://0.vuetifyjs.com/composables/system/use-raf
 *
 * @remarks
 * Scope-disposed safe requestAnimationFrame composable.
 *
 * Key features:
 * - Cancel-then-request pattern (deduplicates rapid calls)
 * - Automatic cleanup on scope disposal
 * - SSR-safe (no-op in non-browser environments)
 * - Callable function with cancel method
 *
 * Perfect for throttling updates to the next animation frame.
 *
 * @example
 * ```ts
 * import { useRaf } from '@vuetify/v0'
 *
 * const update = useRaf(timestamp => {
 *   // runs on next animation frame
 * })
 * update()
 * ```
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isUndefined } from '#v0/utilities'
import { onScopeDispose, shallowRef, toRef } from 'vue'

// Types
import type { Ref } from 'vue'

export interface UseRafReturn {
  /** Request animation frame (cancels pending) */
  (): void
  /** Cancel pending animation frame */
  cancel: () => void
  /** Whether an animation frame is pending */
  readonly isActive: Readonly<Ref<boolean>>
}

/**
 * Scope-disposed safe requestAnimationFrame.
 *
 * @param callback Function to call on animation frame.
 * @returns Callable that requests frame (canceling pending), with cancel method.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-raf
 *
 * @example
 * ```ts
 * // Basic usage
 * const update = useRaf((timestamp) => {
 *   // Runs on next animation frame
 * })
 *
 * update() // Request frame
 * update() // Cancels previous, requests new (deduplicated)
 *
 * // Manual cancel
 * update.cancel()
 *
 * // Check if pending
 * if (update.isActive.value) { ... }
 * ```
 */
export function useRaf (
  callback: (timestamp: DOMHighResTimeStamp) => void,
): UseRafReturn {
  const id = shallowRef<number>()

  const isActive = toRef(() => !isUndefined(id.value))

  function cancel (): void {
    if (!isUndefined(id.value)) {
      cancelAnimationFrame(id.value)
      id.value = undefined
    }
  }

  function request (): void {
    if (!IN_BROWSER) return

    cancel()
    id.value = requestAnimationFrame(timestamp => {
      id.value = undefined
      callback(timestamp)
    })
  }

  onScopeDispose(cancel, true)

  return Object.assign(request, {
    cancel,
    isActive,
  })
}

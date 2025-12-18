/**
 * @module useClickOutside
 *
 * @remarks
 * Detects clicks outside of specified element(s) with automatic cleanup.
 *
 * Key features:
 * - Single or multiple target elements
 * - Conditional activation via `enabled` option
 * - Shadow DOM support via composedPath()
 * - Touch event support for mobile
 * - SSR-safe (no-op when not in browser)
 *
 * Common use cases: closing popovers, dropdowns, modals, and menus.
 */

// Composables
import { useDocumentEventListener } from '#v0/composables/useEventListener'

// Utilities
import { toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { MaybeRefOrGetter } from 'vue'

export interface UseClickOutsideOptions {
  /**
   * Whether the listener is active.
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Events to listen for.
   * @default ['mousedown', 'touchstart']
   */
  events?: (keyof DocumentEventMap)[]
}

/**
 * Detects clicks outside of the specified element(s).
 *
 * @param target Element or elements to detect clicks outside of.
 * @param handler Callback invoked when a click outside is detected.
 * @param options Configuration options.
 * @returns A function to stop listening.
 *
 * @example
 * ```ts
 * const popoverRef = ref<HTMLElement>()
 * const anchorRef = ref<HTMLElement>()
 *
 * useClickOutside(
 *   () => [popoverRef.value, anchorRef.value],
 *   () => { isOpen.value = false },
 *   { enabled: () => isOpen.value }
 * )
 * ```
 *
 * @see https://0.vuetifyjs.com/composables/system/use-click-outside
 */
export function useClickOutside (
  target: MaybeRefOrGetter<HTMLElement | HTMLElement[] | null | undefined>,
  handler: (event: Event) => void,
  options: UseClickOutsideOptions = {},
) {
  const {
    enabled = true,
    events = ['mousedown', 'touchstart'],
  } = options

  function listener (event: Event) {
    if (!toValue(enabled)) return

    const targets = toArray(toValue(target)).filter(Boolean) as HTMLElement[]
    if (targets.length === 0) return

    // Use composedPath for shadow DOM support
    const path = event.composedPath()

    const isOutside = targets.every(el => {
      return el !== event.target && !path.includes(el) && !el.contains(event.target as Node)
    })

    if (isOutside) {
      handler(event)
    }
  }

  return useDocumentEventListener(events, listener)
}

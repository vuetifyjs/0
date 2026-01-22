/**
 * @module useAsk
 *
 * @remarks
 * Controls focus for the floating Ask AI input (DocsAskInput).
 */

// Utilities
import { readonly, shallowRef } from 'vue'

// Types
import type { Ref } from 'vue'

export interface UseAskReturn {
  /** Request focus on the floating ask input */
  focus: () => void
  /** Focus trigger counter (watch this to focus input) */
  focusTrigger: Readonly<Ref<number>>
}

// Module-level singleton state
const focusTrigger = shallowRef(0)

/**
 * Controls the floating Ask AI input.
 *
 * @returns Focus controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *  import { useAsk } from '@/composables/useAsk'
 *
 *  const { focus, focusTrigger } = useAsk()
 * </script>
 * ```
 */
export function useAsk (): UseAskReturn {
  function focus () {
    focusTrigger.value++
  }

  return {
    focusTrigger: readonly(focusTrigger),
    focus,
  }
}

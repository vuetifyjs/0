/**
 * @module useNavigation
 *
 * @remarks
 * Controls the main navigation drawer open/close state.
 * Module-level singleton state shared across all useNavigation calls.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { readonly, shallowRef } from 'vue'

// Types
import type { ShallowRef } from 'vue'

export interface NavigationContext {
  /** Whether the drawer is open */
  isOpen: Readonly<ShallowRef<boolean>>
  /** Open the drawer */
  open: () => void
  /** Close the drawer */
  close: () => void
  /** Toggle the drawer */
  toggle: () => void
}

let context: NavigationContext | null = null

/**
 * Controls the navigation drawer state.
 *
 * @returns Navigation state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useNavigation } from '@/composables/useNavigation'
 *
 *   const navigation = useNavigation()
 *
 *   // Open the drawer
 *   navigation.open()
 * </script>
 * ```
 */
export function useNavigation (): NavigationContext {
  // SSR: return fresh noop context for each server render
  if (!IN_BROWSER) {
    return {
      isOpen: readonly(shallowRef(false)),
      open: () => {},
      close: () => {},
      toggle: () => {},
    }
  }

  if (context) return context

  const isOpen = shallowRef(false)

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    isOpen.value = !isOpen.value
  }

  context = {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle,
  }

  return context
}

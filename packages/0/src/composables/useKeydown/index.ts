/**
 * @module useKeydown
 *
 * @remarks
 * Keydown event listener composable with key filtering.
 *
 * Key features:
 * - Key-specific event handling
 * - preventDefault and stopPropagation options
 * - Automatic cleanup on scope disposal
 * - Built on useEventListener for consistent event handling
 *
 * Simplified wrapper around useEventListener for keyboard interactions.
 */

// Composables
import { useDocumentEventListener } from '#v0/composables/useEventListener'

// Utilities
import { onScopeDispose, toRef, toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface UseKeydownReturn {
  /**
   * Whether the listener is currently active
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Start listening for keydown events
   */
  start: () => void
  /**
   * Stop listening for keydown events
   */
  stop: () => void
}

/**
 * A composable that adds a keydown event listener to the document.
 *
 * @param handlers The key handlers to add.
 * @returns An object with methods to start and stop listening.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-keydown
 *
 * @example
 * ```ts
 * import { useKeydown } from '@vuetify/v0'
 *
 * // Single handler
 * useKeydown({ key: 'Escape', handler: () => console.log('Escape pressed') })
 *
 * // Multiple handlers
 * const { isActive, start, stop } = useKeydown([
 *   { key: 'Enter', handler: () => console.log('Enter pressed') },
 *   { key: 'Escape', handler: () => console.log('Escape pressed'), preventDefault: true },
 * ])
 *
 * // Listener is automatically active when called in component setup
 * // Manually control if needed:
 * stop()
 * start()
 * ```
 */
export function useKeydown (handlers: MaybeRefOrGetter<KeyHandler[] | KeyHandler>): UseKeydownReturn {
  let cleanup: (() => void) | null = null
  const isActive = toRef(() => !!cleanup)

  function onKeydown (event: KeyboardEvent) {
    const handlerList = toValue(handlers)
    const keyHandlers = toArray(handlerList)

    const handler = keyHandlers.find(h => h.key === event.key)
    if (handler) {
      if (handler.preventDefault) event.preventDefault()
      if (handler.stopPropagation) event.stopPropagation()
      handler.handler(event)
    }
  }

  function start () {
    if (cleanup) return
    cleanup = useDocumentEventListener('keydown', onKeydown)
  }

  function stop () {
    if (!cleanup) return
    cleanup()
    cleanup = null
  }

  cleanup = useDocumentEventListener('keydown', onKeydown)

  onScopeDispose(stop)

  return {
    isActive,
    start,
    stop,
  }
}

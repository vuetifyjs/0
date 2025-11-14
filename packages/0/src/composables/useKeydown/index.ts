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
 * - Auto-starts when in component scope
 *
 * @example
 * ```vue
 * <script setup lang="ts">
  * import { useKeydown } from '@vuetify/v0'
  *
  * useKeydown({
  *   key: 'Enter',
  *   handler: (event) => {
  *     console.log('Enter key pressed!', event)
  *   },
  *   preventDefault: true,
  * })
 * </script>
 * ```
 */

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { onMounted, getCurrentScope, onScopeDispose, ref, shallowReadonly, shallowRef } from 'vue'
import { isArray } from '#v0/utilities'

// Globals
import { IN_DOCUMENT } from '#v0/constants'

// Types
import type { ID } from '#v0/types'
import type { RegistryTicket } from '#v0/composables/useRegistry'

export interface KeyHandler {
  /**
   * The key to listen for. This can be a single character, a modifier key (e.g., `Control`, `Shift`),
   * or a special key (e.g., `ArrowUp`).
   */
  key: string
  /**
   * The handler function to call when the specified key is pressed.
   *
   * @param event The KeyboardEvent object containing details about the keydown event.
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-handler
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Escape',
   *   handler: (event) => {
   *     console.log('Escape key pressed!', event)
   *   },
   * })
   * ```
   */
  handler: (event: KeyboardEvent) => void
  /**
   * Whether to call event.preventDefault() when the handler is invoked.
   *
   * @default false
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-preventdefault
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Tab',
   *   handler: (event) => {
   *     console.log('Tab key pressed!', event)
   *   },
   *   preventDefault: true,
   * })
   * ```
   */
  preventDefault?: boolean
  /**
   * Whether to call event.stopPropagation() when the handler is invoked.
   *
   * @default false
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-stoppropagation
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Escape',
   *   handler: (event) => {
   *     console.log('Escape key pressed!', event)
   *   },
   *   stopPropagation: true,
   * })
   * ```
   */
  stopPropagation?: boolean
}

export interface KeyHandlerTicket extends RegistryTicket, KeyHandler {}

/**
 * Options for the `useKeydown` composable.
 *
 * @property immediate - Whether to start listening for keydown events immediately upon composable initialization.
 *   If set to `true`, the composable will automatically start listening when in a component scope.
 *   Defaults to `true`.
 *
 * @example
 * ```ts
 * import { useKeydown } from '@vuetify/v0'
 *
 * useKeydown({
 *   key: 'Enter',
 *   handler: (event) => {
 *     console.log('Enter key pressed!', event)
 *   },
 * }, { immediate: false })
 * ```
 */
export interface UseKeydownOptions {
  immediate?: boolean
}

let globalListener: ((event: KeyboardEvent) => void) | null = null
const handlerRegistry = useRegistry<KeyHandlerTicket>()

function startGlobalListener () {
  if (globalListener || !IN_DOCUMENT) return

  globalListener = (event: KeyboardEvent) => {
    for (const h of handlerRegistry.values()) {
      if (h.key === event.key) {
        if (h.preventDefault) event.preventDefault()
        if (h.stopPropagation) event.stopPropagation()
        h.handler(event)
      }
    }
  }
  document.addEventListener('keydown', globalListener)
}

function stopGlobalListener () {
  if (!IN_DOCUMENT) return

  if (globalListener && handlerRegistry.size === 0) {
    document.removeEventListener('keydown', globalListener)
    globalListener = null
  }
}

/**
 * Sets up global keyboard event listeners for specified key handlers with automatic cleanup.
 * This composable automatically starts listening when mounted and cleans up when the scope
 * is disposed, providing a clean way to handle global keyboard interactions.
 *
 * @param handlers A single handler or array of handlers to register for keydown events.
 * @returns Object with methods to manually start and stop listening for keydown events.
 *
 * @see https://0.vuetify.dev/api/composables/use-keydown
 *
 * @example
 * ```ts
 *   import { useKeydown } from '@vuetify/v0'
 *
 *   useKeydown([
 *    {
 *      key: 'Escape',
 *      handler: (event) => {
 *        console.log('Escape key pressed!', event)
 *       },
 *       preventDefault: true,
 *    },
 *    {
 *      key: 'Enter',
 *      handler: (event) => {
 *        console.log('Enter key pressed!', event)
 *      },
  *   },
  * ])
 * ```
 */
export function useKeydown (
  handlers: KeyHandler[] | KeyHandler,
  options: UseKeydownOptions = {},
) {
  const { immediate = true } = options
  const keyHandlers = isArray(handlers) ? handlers : [handlers]
  const handlerIds = ref<ID[]>([])
  const isListening = shallowRef(false)

  function startListening () {
    if (isListening.value) return

    const ids: ID[] = []

    for (const handler of keyHandlers) {
      const ticket = handlerRegistry.register(handler)
      ids.push(ticket.id)
    }

    handlerIds.value = ids

    if (handlerRegistry.size > 0) {
      startGlobalListener()
    }

    isListening.value = true
  }

  function stopListening () {
    if (!isListening.value) return

    for (const id of handlerIds.value) {
      handlerRegistry.unregister(id)
    }
    handlerIds.value = []
    isListening.value = false

    if (handlerRegistry.size === 0) {
      stopGlobalListener()
    }
  }

  if (getCurrentScope() && immediate) {
    onMounted(startListening)
  }

  onScopeDispose(stopListening, true)

  return {
    startListening,
    stopListening,
    isListening: shallowReadonly(isListening),
  }
}

export { handlerRegistry }

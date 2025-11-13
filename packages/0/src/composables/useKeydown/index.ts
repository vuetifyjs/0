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
 * Simplified wrapper around useEventListener for keyboard interactions.
 */

// Utilities
import { onMounted, getCurrentScope, onScopeDispose, ref, shallowReadonly, shallowRef } from 'vue'
import { genId, isArray } from '#v0/utilities'

// Globals
import { IN_DOCUMENT } from '#v0/constants'

// Types
import type { ID } from '#v0/types'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface UseKeydownOptions {
  immediate?: boolean
}

let globalListener: ((event: KeyboardEvent) => void) | null = null
const handlerMap: Map<ID, KeyHandler> = new Map()

function startGlobalListener () {
  if (globalListener || IN_DOCUMENT) return

  globalListener = (event: KeyboardEvent) => {
    for (const h of handlerMap.values()) {
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
  if (IN_DOCUMENT) return

  if (globalListener && handlerMap.size === 0) {
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

    const ids = Array.from({ length: keyHandlers.length }, genId)

    for (const [index, id] of ids.entries()) {
      handlerMap.set(id, keyHandlers[index]!)
    }

    handlerIds.value = ids

    if (handlerMap.size > 0) {
      startGlobalListener()
    }

    isListening.value = true
  }

  function stopListening () {
    if (!isListening.value) return

    for (const id of handlerIds.value) {
      handlerMap.delete(id)
    }
    handlerIds.value = []
    isListening.value = false

    if (handlerMap.size === 0) {
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

export { handlerMap }

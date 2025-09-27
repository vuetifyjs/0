// Utilities
import { onMounted, getCurrentScope, onScopeDispose } from 'vue'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

/**
 * A composable that adds a keydown event listener to the document.
 *
 * @param handlers The key handlers to add.
 * @returns An object with methods to start and stop listening.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-keydown
 */
export function useKeydown (handlers: KeyHandler[] | KeyHandler) {
  const keyHandlers = Array.isArray(handlers) ? handlers : [handlers]

  function onKeydown (event: KeyboardEvent) {
    const handler = keyHandlers.find(h => h.key === event.key)
    if (handler) {
      if (handler.preventDefault) event.preventDefault()
      if (handler.stopPropagation) event.stopPropagation()
      handler.handler(event)
    }
  }

  function startListening () {
    document.addEventListener('keydown', onKeydown)
  }

  function stopListening () {
    document.removeEventListener('keydown', onKeydown)
  }

  if (getCurrentScope()) {
    onMounted(startListening)
  }

  onScopeDispose(stopListening, true)

  return {
    startListening,
    stopListening,
  }
}

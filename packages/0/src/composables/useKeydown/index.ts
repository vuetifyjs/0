// Utilities
import { onMounted, getCurrentScope, onScopeDispose } from 'vue'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

/**
 * Sets up global keyboard event listeners for specified key handlers with automatic cleanup.
 * This composable automatically starts listening when mounted and cleans up when the scope
 * is disposed, providing a clean way to handle global keyboard interactions.
 *
 * @param handlers A single handler or array of handlers to register for keydown events.
 * @returns Object with methods to manually start and stop listening for keydown events.
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

import { onMounted, getCurrentScope, onScopeDispose } from 'vue'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export function useKeydown (handlers: KeyHandler[] | KeyHandler) {
  const keyHandlers = Array.isArray(handlers) ? handlers : [handlers]

  const onKeydown = (event: KeyboardEvent) => {
    const handler = keyHandlers.find(h => h.key === event.key)
    if (handler) {
      if (handler.preventDefault) event.preventDefault()
      if (handler.stopPropagation) event.stopPropagation()
      handler.handler(event)
    }
  }

  const startListening = () => {
    document.addEventListener('keydown', onKeydown)
  }

  const stopListening = () => {
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

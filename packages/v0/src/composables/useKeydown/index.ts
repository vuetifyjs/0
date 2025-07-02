import { onMounted, getCurrentScope, onScopeDispose, ref, readonly } from 'vue'
import type { ID } from '#v0/types'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface UseKeydownOptions {
  autoStart?: boolean
}

let globalListener: ((event: KeyboardEvent) => void) | null = null
const handlerMap: Map<ID, KeyHandler> = new Map()

function startGlobalListener () {
  if (typeof document === 'undefined') return

  if (!globalListener) {
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
}

function stopGlobalListener () {
  if (typeof document === 'undefined') return

  if (globalListener && handlerMap.size === 0) {
    document.removeEventListener('keydown', globalListener)
    globalListener = null
  }
}

export function useKeydown (handlers: KeyHandler[] | KeyHandler, options: UseKeydownOptions = {}) {
  const { autoStart = true } = options
  const keyHandlers = Array.isArray(handlers) ? handlers : [handlers]
  const handlerIds = ref<ID[]>([])
  const isListening = ref(false)

  const startListening = () => {
    if (!isListening.value) {
      const ids = Array.from({ length: keyHandlers.length }, () => crypto.randomUUID())

      for (const [index, id] of ids.entries()) {
        handlerMap.set(id, keyHandlers[index])
      }

      handlerIds.value = ids

      if (handlerMap.size > 0) {
        startGlobalListener()
      }

      isListening.value = true
    }
  }

  const stopListening = () => {
    if (isListening.value) {
      for (const id of handlerIds.value) {
        handlerMap.delete(id)
      }
      handlerIds.value = []
      isListening.value = false

      if (handlerMap.size === 0) {
        stopGlobalListener()
      }
    }
  }

  if (getCurrentScope() && autoStart) {
    onMounted(startListening)
  }

  onScopeDispose(stopListening, true)

  return {
    startListening,
    stopListening,
    isListening: readonly(isListening),
  }
}

export { handlerMap }

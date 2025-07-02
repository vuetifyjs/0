import { onMounted, getCurrentScope, onScopeDispose, ref, readonly } from 'vue'
import { useRegistrar } from '../useRegistrar'
import type { ID } from '#v0/types'
import type { RegistrarItem, RegistrarTicket, RegistrarContext } from '../useRegistrar'

export interface KeyHandler {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface UseKeydownOptions {
  autoStart?: boolean
}

interface KeydownRegistrarItem extends RegistrarItem {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

interface KeydownRegistrarTicket extends RegistrarTicket {
  key: string
  handler: (event: KeyboardEvent) => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

interface KeydownRegistrarContext extends RegistrarContext<KeydownRegistrarItem, KeydownRegistrarTicket> {}

const [
  _,
  __,
  keydownRegistrar,
] = useRegistrar<KeydownRegistrarItem, KeydownRegistrarTicket, KeydownRegistrarContext>('keydown')

let globalListener: ((event: KeyboardEvent) => void) | null = null

function startGlobalListener () {
  if (typeof document === 'undefined') return

  if (!globalListener) {
    globalListener = (event: KeyboardEvent) => {
      for (const h of keydownRegistrar.registeredItems.values()) {
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

  if (globalListener && keydownRegistrar.registeredItems.size === 0) {
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
      handlerIds.value = keyHandlers.map(handler => {
        const ticket = keydownRegistrar.register(handler)
        Object.assign(ticket, handler)
        return ticket.id
      })

      if (keydownRegistrar.registeredItems.size > 0) {
        startGlobalListener()
      }

      isListening.value = true
    }
  }

  const stopListening = () => {
    if (isListening.value) {
      for (const id of handlerIds.value) keydownRegistrar.unregister(id)
      handlerIds.value = []
      isListening.value = false

      stopGlobalListener()
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

export { keydownRegistrar }

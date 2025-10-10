import { onMounted, getCurrentScope, onScopeDispose, ref, shallowReadonly } from 'vue'
import type { ID } from '#v0/types'
import { genId } from '#v0/utilities'

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
 * const { startListening, stopListening } = useKeydown([
 *   { key: 'Enter', handler: () => console.log('Enter pressed') },
 *   { key: 'Escape', handler: () => console.log('Escape pressed'), preventDefault: true },
 * ])
 *
 * startListening()
 * stopListening()
 * ```
 */

export function useKeydown (handlers: KeyHandler[] | KeyHandler, options: UseKeydownOptions = {}) {
  const { immediate = true } = options
  const keyHandlers = Array.isArray(handlers) ? handlers : [handlers]
  const handlerIds = ref<ID[]>([])
  const isListening = ref(false)

  function startListening () {
    if (!isListening.value) {
      const ids = Array.from({ length: keyHandlers.length }, genId)

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

  function stopListening () {
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

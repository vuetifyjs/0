import { createContext, createTrinity } from '@vuetify/v0'
import { shallowReactive } from 'vue'
import type { App } from 'vue'
import type { ContextTrinity } from '@vuetify/v0'

export interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface ToastContext {
  toasts: Toast[]
  push: (message: string, type?: Toast['type']) => void
  dismiss: (id: number) => void
  clear: () => void
}

function createToastContext (): ContextTrinity<ToastContext> {
  const [useContext, _provideContext] = createContext<ToastContext>('demo:toasts')

  let nextId = 0
  const toasts = shallowReactive<Toast[]>([])

  function push (message: string, type: Toast['type'] = 'info') {
    const id = nextId++
    toasts.push({ id, message, type })
    setTimeout(() => dismiss(id), 4000)
  }

  function dismiss (id: number) {
    const index = toasts.findIndex(t => t.id === id)
    if (index !== -1) toasts.splice(index, 1)
  }

  function clear () {
    toasts.splice(0)
  }

  const context: ToastContext = { toasts, push, dismiss, clear }

  function provideContext (_context = context, app?: App) {
    return _provideContext(_context, app)
  }

  return createTrinity<ToastContext>(useContext, provideContext, context)
}

export const [useToasts, provideToasts, toastsContext] = createToastContext()

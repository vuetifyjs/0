import { shallowRef } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
}

let nextId = 0

const toasts = shallowRef<Toast[]>([])

export function useToast () {
  function add (message: string, type: Toast['type'] = 'info', duration = 5000) {
    const toast: Toast = { id: nextId++, message, type, duration }
    toasts.value = [...toasts.value, toast]
  }

  function dismiss (id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, add, dismiss }
}

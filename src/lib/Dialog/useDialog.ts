import { shallowRef, watch, onBeforeUnmount, computed } from 'vue'
import type { ComponentPublicInstance, ShallowRef, InjectionKey } from 'vue'

export interface DialogContext {
  isOpen: ShallowRef<boolean>
  dataState: ShallowRef<'open' | 'closed'>
  open: () => void
  close: () => void
  triggerRef: ShallowRef<ComponentPublicInstance | null>
  dialogRef: ShallowRef<ComponentPublicInstance | null>
  getTriggerProps: () => {
    'ref': ShallowRef<ComponentPublicInstance | null>
    'onClick': () => void
    'aria-haspopup': string
    'aria-expanded': boolean
    'data-state': 'open' | 'closed'
  }
  getDialogProps: () => {
    'ref': ShallowRef<ComponentPublicInstance | null>
    'role': string
    'aria-modal': boolean
    'tabindex': number
    'data-state': 'open' | 'closed'
  }
  getCloseProps: () => {
    'onClick': () => void
    'data-state': 'open' | 'closed'
  }
}

export const DialogSymbol: InjectionKey<DialogContext> = Symbol('Dialog')

// TODO: persistence
export function useDialog ({ modelValue = false, onOpen, onClose }: {
  modelValue?: boolean
  onOpen?: () => void
  onClose?: () => void
} = {}): DialogContext {
  const isOpen = shallowRef(modelValue)
  const triggerRef = shallowRef<ComponentPublicInstance | null>(null)
  const dialogRef = shallowRef<ComponentPublicInstance | null>(null)
  const dataState = computed(() => isOpen.value ? 'open' : 'closed')

  const open = () => {
    isOpen.value = true
    onOpen?.()
  }

  const close = () => {
    isOpen.value = false
    onClose?.()
  }

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }

  const onClickOutside = (e: MouseEvent) => {
    if (dialogRef.value && !dialogRef.value.$el.contains(e.target as Node)) {
      close()
    }
  }

  watch(isOpen, v => {
    if (v) {
      document.addEventListener('keydown', onKeydown)
      document.addEventListener('mousedown', onClickOutside)
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('mousedown', onClickOutside)
  })

  return {
    isOpen,
    dataState,
    open,
    close,
    triggerRef,
    dialogRef,
    getTriggerProps: () => ({
      'ref': triggerRef,
      'onClick': open,
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen.value,
      'data-state': dataState.value,
    }),
    getDialogProps: () => ({
      'ref': dialogRef,
      'role': 'dialog',
      'aria-modal': true,
      'tabindex': -1,
      'data-state': dataState.value,
    }),
    getCloseProps: () => ({
      'onClick': close,
      'data-state': dataState.value,
    }),
  }
}

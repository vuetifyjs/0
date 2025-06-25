import { shallowRef, watch, onBeforeUnmount, computed } from 'vue'
import type { ComponentPublicInstance, ShallowRef, InjectionKey, Ref } from 'vue'
import { createFocusTrap, type FocusTrap } from 'focus-trap'
import { useKeydown } from '@/composables/useKeydown'

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
  const focusTrap = ref(null) as Ref<FocusTrap | null>

  const createOrActivateFocusTrap = () => {
    if (!dialogRef.value?.$el) {
      return
    }
    if (!focusTrap.value) {
      focusTrap.value = createFocusTrap(dialogRef.value?.$el, {
        allowOutsideClick: true,
      })
    }
    if (isOpen.value) {
      focusTrap.value?.activate()
    }
  }

  const deactivateFocusTrap = () => {
    if (isOpen.value) {
      focusTrap.value?.deactivate()
    }
  }

  const open = () => {
    isOpen.value = true
    onOpen?.()
    nextTick(() => {
      createOrActivateFocusTrap()
    })
  }

  const close = () => {
    deactivateFocusTrap()
    isOpen.value = false
    onClose?.()
  }

  const { startListening: startKeydownListening, stopListening: stopKeydownListening } = useKeydown({
    key: 'Escape',
    handler: close,
    preventDefault: true,
  })

  const onClickOutside = (e: MouseEvent) => {
    if (dialogRef.value && !dialogRef.value.$el.contains(e.target as Node)) {
      close()
    }
  }

  watch(isOpen, v => {
    if (v) {
      startKeydownListening()
      document.addEventListener('mousedown', onClickOutside)
      nextTick(() => {
        createOrActivateFocusTrap()
      })
    } else {
      deactivateFocusTrap()
      stopKeydownListening()
      document.removeEventListener('mousedown', onClickOutside)
    }
  })

  onMounted(() => {
    if (isOpen.value) {
      createOrActivateFocusTrap()
    }
  })

  onBeforeUnmount(() => {
    deactivateFocusTrap()
    stopKeydownListening()
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

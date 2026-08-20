/**
 * @module AlertDialogCancel
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Cancel button component for alert dialogs. Closes the dialog immediately
 * when clicked. This is the safest action and should receive focus on dialog open.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogCancelProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Whether the cancel button is disabled */
    disabled?: boolean
  }

  export interface AlertDialogCancelSlotProps {
    /** Whether the alert dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the cancel button element */
    attrs: {
      'type': 'button' | undefined
      'role': 'button' | undefined
      'tabindex': number
      'disabled': boolean | undefined
      'data-disabled': '' | undefined
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAlertDialogContext } from './AlertDialogRoot.vue'

  // Utilities
  import { onMounted, onUnmounted, toRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'AlertDialogCancel' })

  defineSlots<{
    default: (props: AlertDialogCancelSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
    disabled = false,
    renderless,
  } = defineProps<AlertDialogCancelProps>()

  const context = useAlertDialogContext(namespace)

  const cancelRef = useTemplateRef('cancel')

  onMounted(() => {
    context.cancelEl.value = (cancelRef.value?.element as HTMLElement | null) ?? null
  })

  onUnmounted(() => {
    context.cancelEl.value = null
  })

  function onClick () {
    if (disabled) return
    context.close()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const slotProps = toRef((): AlertDialogCancelSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': disabled ? -1 : 0,
      'disabled': as === 'button' ? (disabled || undefined) : undefined,
      'data-disabled': disabled ? '' : undefined,
      'onClick': onClick,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    ref="cancel"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

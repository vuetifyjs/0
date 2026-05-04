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
      'disabled': boolean | undefined
      'data-disabled': '' | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAlertDialogContext } from './AlertDialogRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'AlertDialogCancel' })

  defineSlots<{
    default: (props: AlertDialogCancelSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
    disabled = false,
  } = defineProps<AlertDialogCancelProps>()

  const context = useAlertDialogContext(namespace)

  function onClick () {
    if (disabled) return
    context.close()
  }

  const slotProps = toRef((): AlertDialogCancelSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'disabled': disabled || undefined,
      'data-disabled': disabled ? '' : undefined,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

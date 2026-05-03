/**
 * @module AlertDialogActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Trigger component for alert dialogs. Provides the element that opens
 * the alert dialog when clicked. Automatically handles click events
 * and accessibility attributes.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertDialogActivatorSlotProps {
    /** Whether the alert dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the trigger element */
    attrs: {
      'type': 'button' | undefined
      'aria-haspopup': 'dialog'
      'aria-expanded': boolean
      'data-open': true | undefined
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

  defineOptions({ name: 'AlertDialogActivator' })

  defineSlots<{
    default: (props: AlertDialogActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
  } = defineProps<AlertDialogActivatorProps>()

  const context = useAlertDialogContext(namespace)

  function onClick () {
    context.open()
  }

  const slotProps = toRef((): AlertDialogActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'dialog',
      'aria-expanded': context.isOpen.value,
      'data-open': context.isOpen.value || undefined,
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

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
      'role': 'button' | undefined
      'tabindex': number
      'aria-haspopup': 'dialog'
      'aria-expanded': boolean
      'data-open': true | undefined
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
  import { toRef } from 'vue'

  defineOptions({ name: 'AlertDialogActivator' })

  defineSlots<{
    default: (props: AlertDialogActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
    renderless,
  } = defineProps<AlertDialogActivatorProps>()

  const context = useAlertDialogContext(namespace)

  function onClick () {
    context.open()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const slotProps = toRef((): AlertDialogActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': 0,
      'aria-haspopup': 'dialog',
      'aria-expanded': context.isOpen.value,
      'data-open': context.isOpen.value || undefined,
      'onClick': onClick,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

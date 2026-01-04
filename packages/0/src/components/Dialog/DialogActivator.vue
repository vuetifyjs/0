/**
 * @module DialogActivator
 *
 * @remarks
 * Trigger component for dialogs. Provides the element that opens
 * the dialog when clicked. Automatically handles click events
 * and accessibility attributes.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DialogActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface DialogActivatorSlotProps {
    /** Whether the dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the trigger element */
    attrs: {
      'type': 'button' | undefined
      'aria-haspopup': 'dialog'
      'aria-expanded': boolean
      'data-dialog-open': '' | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useDialogContext } from './DialogRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DialogActivator' })

  defineSlots<{
    default: (props: DialogActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:dialog',
  } = defineProps<DialogActivatorProps>()

  const context = useDialogContext(namespace)

  function onClick () {
    context.open()
  }

  const slotProps = toRef((): DialogActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'dialog',
      'aria-expanded': context.isOpen.value,
      'data-dialog-open': context.isOpen.value ? '' : undefined,
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

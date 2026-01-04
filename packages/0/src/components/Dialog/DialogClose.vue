/**
 * @module DialogClose
 *
 * @remarks
 * Close button component for dialogs. Closes the dialog when clicked.
 * Should be used inside DialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DialogCloseProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface DialogCloseSlotProps {
    /** Whether the dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the close button element */
    attrs: {
      'type': 'button' | undefined
      'aria-label': 'Close'
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useDialogContext } from './DialogRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DialogClose' })

  defineSlots<{
    default: (props: DialogCloseSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:dialog',
  } = defineProps<DialogCloseProps>()

  const context = useDialogContext(namespace)

  function onClick () {
    context.close()
  }

  const slotProps = toRef((): DialogCloseSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': 'Close',
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

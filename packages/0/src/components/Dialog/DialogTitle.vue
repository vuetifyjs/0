/**
 * @module DialogTitle
 *
 * @remarks
 * Title component for dialogs. Provides the accessible name for the dialog
 * via aria-labelledby. Should be used inside DialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DialogTitleProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface DialogTitleSlotProps {
    /** Attributes to bind to the title element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useDialogContext } from './DialogRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DialogTitle' })

  defineSlots<{
    default: (props: DialogTitleSlotProps) => any
  }>()

  const {
    as = 'h2',
    namespace = 'v0:dialog',
  } = defineProps<DialogTitleProps>()

  const context = useDialogContext(namespace)

  const slotProps = toRef((): DialogTitleSlotProps => ({
    attrs: {
      id: context.titleId,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

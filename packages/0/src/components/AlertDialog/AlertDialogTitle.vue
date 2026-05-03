/**
 * @module AlertDialogTitle
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Title component for alert dialogs. Provides the accessible name for the
 * dialog via aria-labelledby. Should be used inside AlertDialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogTitleProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertDialogTitleSlotProps {
    /** Attributes to bind to the title element */
    attrs: {
      id: string
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

  defineOptions({ name: 'AlertDialogTitle' })

  defineSlots<{
    default: (props: AlertDialogTitleSlotProps) => any
  }>()

  const {
    as = 'h2',
    namespace = 'v0:alert-dialog',
  } = defineProps<AlertDialogTitleProps>()

  const context = useAlertDialogContext(namespace)

  const slotProps = toRef((): AlertDialogTitleSlotProps => ({
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

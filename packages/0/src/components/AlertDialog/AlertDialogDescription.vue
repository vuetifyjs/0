/**
 * @module AlertDialogDescription
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Description component for alert dialogs. Provides supplementary description
 * for the dialog via aria-describedby. Should be used inside AlertDialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogDescriptionProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertDialogDescriptionSlotProps {
    /** Attributes to bind to the description element */
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

  defineOptions({ name: 'AlertDialogDescription' })

  defineSlots<{
    default: (props: AlertDialogDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    namespace = 'v0:alert-dialog',
  } = defineProps<AlertDialogDescriptionProps>()

  const context = useAlertDialogContext(namespace)

  const slotProps = toRef((): AlertDialogDescriptionSlotProps => ({
    attrs: {
      id: context.descriptionId,
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

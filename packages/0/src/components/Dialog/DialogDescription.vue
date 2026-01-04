/**
 * @module DialogDescription
 *
 * @remarks
 * Description component for dialogs. Provides supplementary description
 * for the dialog via aria-describedby. Should be used inside DialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DialogDescriptionProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface DialogDescriptionSlotProps {
    /** Attributes to bind to the description element */
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

  defineOptions({ name: 'DialogDescription' })

  defineSlots<{
    default: (props: DialogDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    namespace = 'v0:dialog',
  } = defineProps<DialogDescriptionProps>()

  const context = useDialogContext(namespace)

  const slotProps = toRef((): DialogDescriptionSlotProps => ({
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

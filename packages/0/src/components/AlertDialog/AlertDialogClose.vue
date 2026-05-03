/**
 * @module AlertDialogClose
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Close button component for alert dialogs. Closes the dialog when clicked.
 * Should be used inside AlertDialogContent.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogCloseProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertDialogCloseSlotProps {
    /** Whether the alert dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the close button element */
    attrs: {
      'type': 'button' | undefined
      'aria-label': string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAlertDialogContext } from './AlertDialogRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'AlertDialogClose' })

  defineSlots<{
    default: (props: AlertDialogCloseSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
  } = defineProps<AlertDialogCloseProps>()

  const context = useAlertDialogContext(namespace)
  const locale = useLocale()

  function onClick () {
    context.close()
  }

  const slotProps = toRef((): AlertDialogCloseSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': locale.t('AlertDialog.close'),
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

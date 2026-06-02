/**
 * @module SnackbarClose
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Dismiss button for snackbar notifications.
 * Auto-wires to the nearest Snackbar.Root context — calls onDismiss() on click.
 * Must be used inside a Snackbar.Root.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSnackbarRootContext } from './SnackbarRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SnackbarCloseProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:notifications' */
    namespace?: string
  }

  export interface SnackbarCloseSlotProps {
    /** Attributes to bind to the close button element */
    attrs: {
      'type': 'button' | undefined
      'aria-label': string
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarClose' })

  defineSlots<{
    default: (props: SnackbarCloseSlotProps) => any
  }>()

  const { as = 'button', namespace = 'v0:notifications' } = defineProps<SnackbarCloseProps>()

  const context = useSnackbarRootContext(namespace)
  const locale = useLocale()

  function onClick () {
    context.onDismiss()
  }

  const slotProps = toRef((): SnackbarCloseSlotProps => ({
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': locale.t('Snackbar.close'),
      'onClick': onClick,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

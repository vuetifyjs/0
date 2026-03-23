/**
 * @module SnackbarClose
 *
 * @remarks
 * Dismiss button for snackbar notifications.
 * Auto-wires to the nearest Snackbar.Root context — calls onDismiss() on click.
 * No-op when used outside a Snackbar.Root.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useSnackbarRootContext } from './SnackbarRoot.vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SnackbarCloseProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:notifications' */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarClose' })

  defineSlots<{
    default: () => any
  }>()

  const { as = 'button', namespace = 'v0:notifications' } = defineProps<SnackbarCloseProps>()

  const context = useSnackbarRootContext(namespace, { id: '', onDismiss: () => {} })

  function onClick () {
    context.onDismiss()
  }
</script>

<template>
  <Atom
    aria-label="Close"
    :as
    :type="as === 'button' ? 'button' : undefined"
    @click="onClick"
  >
    <slot />
  </Atom>
</template>

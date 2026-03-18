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

  export type SnackbarCloseProps = AtomProps

  export interface SnackbarCloseSlotProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarClose' })

  defineSlots<{
    default: (props: SnackbarCloseSlotProps) => any
  }>()

  const { as = 'button' } = defineProps<SnackbarCloseProps>()

  const context = useSnackbarRootContext()

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

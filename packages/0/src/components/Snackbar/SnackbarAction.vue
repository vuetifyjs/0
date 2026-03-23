/**
 * @module SnackbarAction
 *
 * @remarks
 * Optional action button for snackbar notifications (undo, retry, view, etc.).
 * No built-in click handler — consumer wires @click.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SnackbarActionProps = AtomProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarAction' })

  const { as = 'button' } = defineProps<SnackbarActionProps>()
</script>

<template>
  <Atom :as :type="as === 'button' ? 'button' : undefined">
    <slot />
  </Atom>
</template>

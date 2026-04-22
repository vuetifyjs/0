/**
 * @module SnackbarContent
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Semantic wrapper for the notification message text.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SnackbarContentProps = AtomProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarContent' })

  defineSlots<{
    default: () => any
  }>()

  const { as = 'div' } = defineProps<SnackbarContentProps>()
</script>

<template>
  <Atom :as>
    <slot />
  </Atom>
</template>

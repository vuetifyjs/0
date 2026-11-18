<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDialogTitle' })

  defineSlots<{
    /** Title text. Supplies the dialog's accessible name. */
    default?: () => any
  }>()
</script>

<template>
  <Dialog.Title
    as="h1"
    class="dialog-title"
  >
    <slot />
  </Dialog.Title>
</template>

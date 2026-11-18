<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDrawerTitle' })

  defineSlots<{
    /** Title text. Supplies the drawer's accessible name. */
    default?: () => any
  }>()
</script>

<template>
  <Dialog.Title
    as="h5"
    class="drawer-title"
  >
    <slot />
  </Dialog.Title>
</template>

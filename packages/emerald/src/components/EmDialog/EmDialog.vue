<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialog' })

  const model = defineModel<boolean>()
</script>

<template>
  <Dialog.Root v-model="model" class="emerald-dialog-root">
    <slot />
  </Dialog.Root>
</template>

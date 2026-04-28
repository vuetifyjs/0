<script lang="ts">
  // Framework
  import { DialogDescription } from '@vuetify/v0'

  export interface EmDialogDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogDescription' })
</script>

<template>
  <DialogDescription class="emerald-dialog__description">
    <slot />
  </DialogDescription>
</template>

<style>
.emerald-dialog__description {
  margin: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgb(var(--emerald-neutral-700-channels, 30 28 40) / 0.6);
}
</style>

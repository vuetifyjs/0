<script lang="ts">
  // Framework
  import { DialogTitle } from '@vuetify/v0'

  export interface EmDialogTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogTitle' })
</script>

<template>
  <DialogTitle as="h2" class="emerald-dialog__title">
    <slot />
  </DialogTitle>
</template>

<style>
.emerald-dialog__title {
  margin: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: -0.2px;
  color: var(--emerald-neutral-700, #1e1c28);
}
</style>

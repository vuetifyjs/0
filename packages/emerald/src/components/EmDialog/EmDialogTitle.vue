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
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </DialogTitle>
</template>

<style>
.emerald-dialog__title {
  margin: 0;
  font-size: var(--emerald-text-h2-size, 28px);
  font-weight: var(--emerald-text-h2-weight, 700);
  line-height: var(--emerald-text-h2-height, 42px);
  letter-spacing: 0;
  overflow-wrap: break-word;
  color: var(--emerald-on-surface, #2b2d2e);
}
</style>

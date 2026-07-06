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
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </DialogDescription>
</template>

<style>
.emerald-dialog__description {
  margin: 0;
  font-size: var(--emerald-text-b1-size, 16px);
  font-weight: var(--emerald-text-b1-weight, 400);
  line-height: var(--emerald-text-b1-height, 24px);
  overflow-wrap: break-word;
  color: var(--emerald-neutral-700, #757e85);
}
</style>

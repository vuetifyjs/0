<script lang="ts">
  export interface EmDialogHeaderProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogHeader' })
</script>

<template>
  <div class="emerald-dialog__header">
    <slot />
  </div>
</template>

<style>
.emerald-dialog__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--emerald-spacing-xs, 8px);
}

.emerald-dialog__header > .emerald-dialog__title {
  flex: 1 1 0;
  min-width: 1px;
}

.emerald-dialog__header > .emerald-dialog__description {
  width: 100%;
}
</style>

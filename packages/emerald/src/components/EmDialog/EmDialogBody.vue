<script lang="ts">
  export interface EmDialogBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogBody' })
</script>

<template>
  <div class="emerald-dialog__body">
    <slot />
  </div>
</template>

<style>
.emerald-dialog__body {
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-m, 16px);
  font-size: var(--emerald-text-b1-size, 16px);
  line-height: var(--emerald-text-b1-height, 24px);
  color: var(--emerald-neutral-700, #757e85);
}
</style>

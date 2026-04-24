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
  flex-direction: column;
  gap: 4px;
  padding: 24px 24px 0;
}
</style>

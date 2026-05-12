<script lang="ts">
  export interface EmDialogFooterProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogFooter' })
</script>

<template>
  <div class="emerald-dialog__footer">
    <slot />
  </div>
</template>

<style>
.emerald-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
}
</style>

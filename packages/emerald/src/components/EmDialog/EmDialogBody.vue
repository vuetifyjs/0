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
  gap: 16px;
  padding: 16px 24px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: rgb(var(--emerald-neutral-700-channels, 30 28 40) / 0.6);
}
</style>

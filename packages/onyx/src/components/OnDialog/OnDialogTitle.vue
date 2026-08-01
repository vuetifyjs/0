<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogTitle' })
</script>

<template>
  <Dialog.Title class="onyx-dialog__title">
    <slot />
  </Dialog.Title>
</template>

<!-- Unscoped: Dialog.Title is a compound child from v0's own file scope; scoped
     data-v never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-dialog__title {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    line-height: var(--onyx-text-lg-height, 28px);
    margin: 0;
  }
</style>

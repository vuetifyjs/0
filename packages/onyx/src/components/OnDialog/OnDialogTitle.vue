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
    font-family: var(--onyx-font-serif, "Fraunces Variable", Fraunces, Georgia, serif);
    font-size: var(--onyx-text-2xl-size, 27px);
    font-variation-settings: 'opsz' 72, 'SOFT' 0, 'WONK' 1;
    font-weight: 300;
    letter-spacing: var(--onyx-text-2xl-tracking, -0.018em);
    line-height: var(--onyx-text-2xl-height, 34px);
    margin: 0;
  }
</style>

<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogDescription' })
</script>

<template>
  <Dialog.Description class="onyx-dialog__description">
    <slot />
  </Dialog.Description>
</template>

<!-- Unscoped: Dialog.Description is a compound child from v0's own file scope; scoped
     data-v never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-dialog__description {
    color: var(--onyx-muted-foreground, #a1a1aa);
    font-size: var(--onyx-text-sm-size, 13px);
    line-height: var(--onyx-text-sm-height, 18px);
    margin: 0;
  }
</style>

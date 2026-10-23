<script setup lang="ts">
  import { Md1Fab } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-fab-row">
    <Md1Fab aria-label="Send" icon="send" position="static" />

    <Md1Fab aria-label="Send" disabled icon="send" position="static" />
  </div>
</template>

<style>
  .md1-docs-fab-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
  }
</style>

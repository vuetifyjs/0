<script setup lang="ts">
  import { QuFab } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-fab-row">
    <QuFab aria-label="Send" icon="send" position="static" />

    <QuFab aria-label="Send" disabled icon="send" position="static" />
  </div>
</template>

<style>
  .quantum-docs-fab-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-3, 24px);
  }
</style>

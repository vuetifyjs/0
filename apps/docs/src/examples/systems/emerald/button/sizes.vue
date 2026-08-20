<script setup lang="ts">
  import { EmButton } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmButton size="sm">Small</EmButton>

    <EmButton size="md">Medium</EmButton>

    <EmButton size="lg">Large</EmButton>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>

<script setup lang="ts">
  import { EmSpinner } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmSpinner size="sm" />

    <EmSpinner size="md" />

    <EmSpinner size="lg" />
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
  }
</style>

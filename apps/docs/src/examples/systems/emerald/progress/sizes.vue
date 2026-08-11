<script setup lang="ts">
  import { EmProgress } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmProgress label="Small" :model-value="40" size="sm" />

    <EmProgress label="Medium" :model-value="60" size="md" />

    <EmProgress label="Large" :model-value="80" size="lg" />
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
    max-width: 360px;
  }
</style>

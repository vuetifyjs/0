<script setup lang="ts">
  import { EmProgress } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmProgress label="Downloading" :model-value="64" show-value />

    <EmProgress indeterminate label="Syncing…" />
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

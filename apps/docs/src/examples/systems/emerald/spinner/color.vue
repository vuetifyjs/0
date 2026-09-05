<script setup lang="ts">
  import { EmSpinner } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmSpinner />

    <EmSpinner class="emerald-docs-muted" />

    <EmSpinner class="emerald-docs-danger" />
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-muted {
    color: var(--emerald-on-surface-variant);
  }

  .emerald-docs-danger {
    color: var(--emerald-danger-600);
  }
</style>

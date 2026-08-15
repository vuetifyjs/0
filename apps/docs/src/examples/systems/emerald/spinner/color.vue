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
  .emerald-docs-muted {
    color: var(--emerald-on-surface-variant);
  }

  .emerald-docs-danger {
    color: var(--emerald-danger-600);
  }
</style>

<script setup lang="ts">
  import { EmIcon } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmIcon name="bell" size="s" />

    <EmIcon name="bell" size="m" />

    <EmIcon name="bell" size="l" />

    <EmIcon name="bell" size="xl" />
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface);
  }
</style>

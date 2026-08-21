<script setup lang="ts">
  import { EmIcon } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmIcon name="layout" />

    <EmIcon name="card" />

    <EmIcon name="envelope" />

    <EmIcon name="calendar" />

    <EmIcon name="search" />

    <EmIcon name="star" />
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

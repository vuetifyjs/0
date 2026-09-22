<script setup lang="ts">
  import { EmTag } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-tags">
    <EmTag>Draft</EmTag>

    <EmTag variant="success">Active</EmTag>

    <EmTag variant="danger">Failed</EmTag>

    <EmTag variant="info">Beta</EmTag>
  </div>
</template>

<style>
  .emerald-docs-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
  }
</style>

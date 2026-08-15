<script setup lang="ts">
  import { EmDivider } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <span>Draft</span>

    <EmDivider orientation="vertical" />

    <span>Edited 2 minutes ago</span>

    <EmDivider orientation="vertical" />

    <span>v1.4</span>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .emerald-docs-row span {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-on-surface-variant);
  }
</style>

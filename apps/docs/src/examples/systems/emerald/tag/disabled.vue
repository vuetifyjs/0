<script setup lang="ts">
  import { EmTag } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-tags">
    <EmTag variant="info">Available</EmTag>

    <EmTag disabled variant="info">Unavailable</EmTag>

    <EmTag interactive selected variant="success">Enabled filter</EmTag>

    <EmTag disabled interactive selected variant="success">Locked filter</EmTag>
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

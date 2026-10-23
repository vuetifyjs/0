<script setup lang="ts">
  import { Md1Chip } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Chip>Toronto</Md1Chip>

    <Md1Chip>Weekly</Md1Chip>

    <Md1Chip>Has attachment</Md1Chip>

    <Md1Chip>Larger than 10 MB</Md1Chip>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>

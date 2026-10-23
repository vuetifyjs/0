<script setup lang="ts">
  import { Md1ProgressCircular } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-progress-row">
    <Md1ProgressCircular aria-label="Loading, 40 dp" />

    <Md1ProgressCircular aria-label="Loading, 32 dp" :size="32" />

    <Md1ProgressCircular aria-label="Loading, 24 dp" :size="24" />

    <Md1ProgressCircular aria-label="Loading, 64 dp" :size="64" />
  </div>
</template>

<style>
  .md1-docs-progress-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }
</style>

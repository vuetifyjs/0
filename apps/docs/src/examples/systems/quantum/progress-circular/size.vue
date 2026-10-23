<script setup lang="ts">
  import { QuProgressCircular } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-progress-row">
    <QuProgressCircular aria-label="Loading, 40 dp" />

    <QuProgressCircular aria-label="Loading, 32 dp" :size="32" />

    <QuProgressCircular aria-label="Loading, 24 dp" :size="24" />

    <QuProgressCircular aria-label="Loading, 64 dp" :size="64" />
  </div>
</template>

<style>
  .quantum-docs-progress-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }
</style>

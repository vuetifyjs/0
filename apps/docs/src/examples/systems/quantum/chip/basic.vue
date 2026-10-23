<script setup lang="ts">
  import { QuChip } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuChip>Toronto</QuChip>

    <QuChip>Weekly</QuChip>

    <QuChip>Has attachment</QuChip>

    <QuChip>Larger than 10 MB</QuChip>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>

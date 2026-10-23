<script setup lang="ts">
  import { QuChip } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuChip deletable>Enabled</QuChip>

    <QuChip deletable disabled>Disabled</QuChip>

    <QuChip disabled icon="label">Disabled</QuChip>
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

<script setup lang="ts">
  import { QuChip } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuChip icon="place">Toronto</QuChip>

    <QuChip icon="event">This week</QuChip>

    <QuChip icon="label">Travel</QuChip>

    <QuChip icon="star">Starred</QuChip>
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

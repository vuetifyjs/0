<script setup lang="ts">
  import { Md1Chip } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Chip deletable>Enabled</Md1Chip>

    <Md1Chip deletable disabled>Disabled</Md1Chip>

    <Md1Chip disabled icon="label">Disabled</Md1Chip>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>

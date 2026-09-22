<script setup lang="ts">
  import { EmSwitch } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmSwitch size="sm">Small</EmSwitch>

    <EmSwitch size="md">Medium</EmSwitch>

    <EmSwitch size="lg">Large</EmSwitch>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>

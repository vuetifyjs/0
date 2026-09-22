<script setup lang="ts">
  import { EmCheckbox } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmCheckbox size="sm">Small</EmCheckbox>

    <EmCheckbox size="md">Medium</EmCheckbox>

    <EmCheckbox size="lg">Large</EmCheckbox>
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

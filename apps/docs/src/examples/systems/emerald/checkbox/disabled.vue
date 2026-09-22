<script setup lang="ts">
  import { EmCheckbox } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCheckbox disabled>Unchecked and disabled</EmCheckbox>

    <EmCheckbox disabled :model-value="true">Checked and disabled</EmCheckbox>

    <EmCheckbox disabled indeterminate>Mixed and disabled</EmCheckbox>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>

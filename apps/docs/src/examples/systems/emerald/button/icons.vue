<script setup lang="ts">
  import { EmButton, EmIcon } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmButton>
      <EmIcon name="plus" size="s" />
      New invoice
    </EmButton>

    <EmButton variant="secondary">
      <EmIcon name="search" size="s" />
      Search
    </EmButton>

    <EmButton aria-label="More options" variant="tertiary">
      <EmIcon name="kebab" size="s" />
    </EmButton>
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

<script setup lang="ts">
  import { EmButton } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmButton variant="primary">Save changes</EmButton>

    <EmButton variant="secondary">Preview</EmButton>

    <EmButton variant="tertiary">Cancel</EmButton>

    <EmButton variant="destructive">Delete</EmButton>
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

<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuButton>Default</QuButton>

    <QuButton dense>Dense</QuButton>

    <QuButton variant="raised">Default</QuButton>

    <QuButton dense variant="raised">Dense</QuButton>
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

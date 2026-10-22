<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuButton>Enabled</QuButton>

    <QuButton disabled>Disabled</QuButton>

    <QuButton variant="raised">Enabled</QuButton>

    <QuButton disabled variant="raised">Disabled</QuButton>
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

<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Button>Default</Md1Button>

    <Md1Button dense>Dense</Md1Button>

    <Md1Button variant="raised">Default</Md1Button>

    <Md1Button dense variant="raised">Dense</Md1Button>
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

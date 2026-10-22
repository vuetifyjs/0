<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuButton icon="add" variant="raised">Add item</QuButton>

    <QuButton icon="send">Send</QuButton>

    <QuButton aria-label="Favourite" icon="favorite" />

    <QuButton aria-label="More options" dense icon="more-vert" />
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

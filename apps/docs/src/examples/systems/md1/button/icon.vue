<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Button icon="add" variant="raised">Add item</Md1Button>

    <Md1Button icon="send">Send</Md1Button>

    <Md1Button aria-label="Favourite" icon="favorite" />

    <Md1Button aria-label="More options" dense icon="more-vert" />
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>

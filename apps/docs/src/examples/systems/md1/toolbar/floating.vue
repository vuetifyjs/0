<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-toolbar-canvas">
    <Md1Toolbar floating>
      <Md1Toolbar.Actions aria-label="Item actions">
        <Md1Button aria-label="Share" icon="share" />

        <Md1Button aria-label="Edit" icon="edit" />

        <Md1Button aria-label="Link" icon="link" />

        <Md1Button aria-label="Delete" icon="delete" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>
  </div>
</template>

<style>
  /* A detached palette keeps its own width, so the canvas centres it. */
  .md1-docs-toolbar-canvas {
    display: flex;
    justify-content: center;
    padding: var(--md1-spacing-3, 24px);
    background: var(--md1-background, #FAFAFA);
  }
</style>

<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-toolbar-canvas">
    <QuToolbar floating>
      <QuToolbar.Actions aria-label="Item actions">
        <QuButton aria-label="Share" icon="share" />

        <QuButton aria-label="Edit" icon="edit" />

        <QuButton aria-label="Link" icon="link" />

        <QuButton aria-label="Delete" icon="delete" />
      </QuToolbar.Actions>
    </QuToolbar>
  </div>
</template>

<style>
  .quantum-docs-toolbar-canvas {
    padding: var(--quantum-spacing-3, 24px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>

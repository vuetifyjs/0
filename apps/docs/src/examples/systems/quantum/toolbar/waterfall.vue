<script setup lang="ts">
  import { QuButton, QuToolbar } from '@paper/quantum'

  const notes = Array.from({ length: 24 }, (_, index) => `Note ${index + 1}: at the top the bar shares a seam with the page; scroll and it lifts into a step.`)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-toolbar-waterfall-screen">
    <QuToolbar app-bar scroll="waterfall" variant="surface">
      <QuToolbar.Title>Notes</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Add note" icon="add" />
      </QuToolbar.Actions>
    </QuToolbar>

    <div class="quantum-docs-toolbar-content">
      <p v-for="note in notes" :key="note" class="quantum-docs-toolbar-text">{{ note }}</p>
    </div>
  </div>
</template>

<style>
  /* The page shares the bar's fill, so the seam is invisible until the bar lifts. */
  .quantum-docs-toolbar-waterfall-screen {
    background: var(--quantum-app-bar, #F5F5F5);
  }

  .quantum-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--quantum-increment, 56px) + var(--quantum-spacing-2, 16px)) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    overflow-y: auto;
  }

  .quantum-docs-toolbar-text {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

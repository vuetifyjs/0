<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const notes = Array.from({ length: 24 }, (_, index) => `Note ${index + 1}: at the top the bar shares a seam with the page; scroll and it lifts into a step.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-waterfall-screen">
    <Md1Toolbar app-bar scroll="waterfall" variant="surface">
      <Md1Toolbar.Title>Notes</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Add note" icon="add" />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-content">
      <p v-for="note in notes" :key="note" class="md1-docs-toolbar-text">{{ note }}</p>
    </div>
  </div>
</template>

<style>
  /* The page shares the bar's fill, so the seam is invisible until the bar lifts. */
  .md1-docs-toolbar-waterfall-screen {
    background: var(--md1-app-bar, #F5F5F5);
  }

  .md1-docs-toolbar-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

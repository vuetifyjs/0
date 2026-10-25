<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const paragraphs = Array.from({ length: 12 }, (_, index) => `Paragraph ${index + 1}: scroll the sheet up. It rises over the toolbar and covers it; the toolbar never passes through it.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <div class="md1-docs-cover-scroll" tabindex="0">
      <!-- The toolbar stays put a step below the sheet that scrolls over it. -->
      <Md1Toolbar class="md1-docs-cover-toolbar" prominent variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Article</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Share" icon="share" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <article class="md1-docs-cover-sheet">
        <p v-for="paragraph in paragraphs" :key="paragraph" class="md1-docs-toolbar-text">{{ paragraph }}</p>
      </article>
    </div>
  </div>
</template>

<style>
  .md1-docs-cover-scroll {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-cover-scroll:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: -2px;
  }

  /* Pinned to the top of the scroller, under the sheet: z-index 0 against the sheet's 1. */
  .md1-docs-cover-toolbar {
    position: sticky;
    top: 0;
    z-index: 0;
  }

  /* The sheet starts under the prominent bar and rides over it as it scrolls, 2 dp above it. */
  .md1-docs-cover-sheet {
    position: relative;
    z-index: 1;
    margin: 0 var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }
</style>

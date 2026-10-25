<script setup lang="ts">
  import { Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-screen md1-docs-help-article">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav aria-label="Back to help" icon="up" />

      <Md1Toolbar.Title>Help</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-help-article-scroll">
      <article class="md1-docs-help-article-sheet md1-elevation-2">
        <h2 class="md1-type-display-1 md1-docs-help-article-flush">About Pesto</h2>

        <p class="md1-type-subheading md1-docs-help-article-lede">Get a unified view of your selections</p>

        <p class="md1-type-body-1 md1-docs-help-article-flush">Pesto keeps the restaurants you save, the dishes you rate and the tables you book in one list, on every device you sign in to.</p>

        <h3 class="md1-type-title md1-docs-help-article-heading">Why use data import?</h3>

        <p class="md1-type-body-1 md1-docs-help-article-flush">Import brings in the places you saved in other apps, so your list is complete from the first day.</p>

        <h4 class="md1-type-subheading md1-docs-help-article-heading">Types of restaurants to find</h4>

        <p class="md1-type-body-1 md1-docs-help-article-flush">Filter by cuisine, price and distance, or let Pesto suggest places like the ones you rated highly.</p>
      </article>
    </div>
  </div>
</template>

<style>
  /*
   * A help article: the sheet sits over a primary band one increment deep and
   * steps in to the content keyline on wider screens. Headings take the type
   * scale in order, Display 1 for the title, Title for a section, Subheading
   * for a subsection, so a reader can scan the outline.
   */
  .md1-docs-screen.md1-docs-help-article {
    display: flex;
    flex-direction: column;
    height: 440px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-help-article-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-inline: var(--md1-spacing-1, 8px);
    background: linear-gradient(var(--md1-primary, #3F51B5) var(--md1-increment, 56px), transparent var(--md1-increment, 56px));
  }

  .md1-docs-help-article-sheet {
    max-width: 560px;
    margin: var(--md1-spacing-2, 16px) auto var(--md1-spacing-3, 24px);
    padding: var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-help-article-flush {
    margin: 0;
  }

  .md1-docs-help-article-lede {
    margin: var(--md1-spacing-1, 8px) 0 var(--md1-spacing-3, 24px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-help-article-heading {
    margin: 32px 0 var(--md1-spacing-1, 8px);
  }
</style>

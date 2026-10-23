<script setup lang="ts">
  import { Md1Icon, Md1Subheader } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-subheader-list md1-docs-subheader-anchored md1-elevation-2">
    <span aria-hidden="true" class="md1-docs-subheader-fab md1-elevation-6">
      <Md1Icon name="add" />
    </span>

    <Md1Subheader inset>Recent</Md1Subheader>

    <div class="md1-docs-subheader-tile md1-docs-subheader-inset md1-type-subheading">Ali Connors</div>

    <div class="md1-docs-subheader-tile md1-docs-subheader-inset md1-type-subheading">Alex Nelson</div>

    <div class="md1-docs-subheader-tile md1-docs-subheader-inset md1-type-subheading">Trevor Hansen</div>
  </div>
</template>

<style>
  .md1-docs-subheader-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-subheader-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  /*
   * Tiles whose text sits at the content keyline, in line with the inset
   * subheader. Compound so the shared tile rule, restated later by the other
   * subheader examples on the page, cannot reset the inset.
   */
  .md1-docs-subheader-tile.md1-docs-subheader-inset {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  /* The list hosts a floating action button in its avatar column, so it is the positioning parent. */
  .md1-docs-subheader-anchored {
    position: relative;
  }

  /*
   * A stand-in for Md1Fab: a 56 dp accent disc centred in the 72 dp FAB column
   * (80 dp from 600 px), above the pinned subheader. The real component
   * replaces it on this page once it lands.
   */
  .md1-docs-subheader-fab {
    position: absolute;
    z-index: 2;
    inset-block-start: var(--md1-spacing-1, 8px);
    inset-inline-start: calc((var(--md1-keyline-content, 72px) - 56px) / 2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--md1-accent, #FF4081);
    color: var(--md1-on-accent, #FFFFFF);
  }
</style>

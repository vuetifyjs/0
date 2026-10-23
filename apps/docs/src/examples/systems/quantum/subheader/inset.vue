<script setup lang="ts">
  import { QuIcon, QuSubheader } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-subheader-list quantum-docs-subheader-anchored quantum-elevation-2">
    <span aria-hidden="true" class="quantum-docs-subheader-fab quantum-elevation-6">
      <QuIcon name="add" />
    </span>

    <QuSubheader inset>Recent</QuSubheader>

    <div class="quantum-docs-subheader-tile quantum-docs-subheader-inset quantum-type-subheading">Ali Connors</div>

    <div class="quantum-docs-subheader-tile quantum-docs-subheader-inset quantum-type-subheading">Alex Nelson</div>

    <div class="quantum-docs-subheader-tile quantum-docs-subheader-inset quantum-type-subheading">Trevor Hansen</div>
  </div>
</template>

<style>
  .quantum-docs-subheader-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-subheader-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  /* Tiles whose text sits at the content keyline, in line with the inset subheader. */
  .quantum-docs-subheader-inset {
    padding-inline-start: var(--quantum-keyline-content, 72px);
  }

  /* The list hosts a floating action button in its avatar column, so it is the positioning parent. */
  .quantum-docs-subheader-anchored {
    position: relative;
  }

  /*
   * A stand-in for QuFab: a 56 dp accent disc centred in the 72 dp FAB column
   * (80 dp from 600 px), above the pinned subheader. The real component
   * replaces it on this page once it lands.
   */
  .quantum-docs-subheader-fab {
    position: absolute;
    z-index: 2;
    inset-block-start: var(--quantum-spacing-1, 8px);
    inset-inline-start: calc((var(--quantum-keyline-content, 72px) - 56px) / 2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--quantum-accent, #FF4081);
    color: var(--quantum-on-accent, #FFFFFF);
  }
</style>

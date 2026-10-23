<script setup lang="ts">
  import { QuIcon, QuSubheader } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-subheader-list quantum-elevation-2">
    <QuSubheader>Folders</QuSubheader>

    <div class="quantum-docs-subheader-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-subheader-icon" name="folder" />

      Photos
    </div>

    <div class="quantum-docs-subheader-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-subheader-icon" name="folder" />

      Recipes
    </div>

    <div class="quantum-docs-subheader-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-subheader-icon" name="folder" />

      Work
    </div>

    <QuSubheader>Files</QuSubheader>

    <div class="quantum-docs-subheader-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-subheader-icon" name="photo" />

      Vacation itinerary
    </div>

    <div class="quantum-docs-subheader-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-subheader-icon" name="photo" />

      Kitchen remodel
    </div>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and 8 dp of list padding; its depth is the shipped quantum-elevation-2 utility. */
  .quantum-docs-subheader-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* A single-line list tile: 48 dp, content at the margin keyline (16 dp, 24 dp from 600 px). */
  .quantum-docs-subheader-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  /* A 24 dp list icon at the margin keyline, 32 dp to the text, which lands it on the content keyline. */
  .quantum-docs-subheader-icon {
    margin-inline-end: var(--quantum-spacing-4, 32px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import { QuDivider, QuIcon, QuSubheader } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-divider-list quantum-elevation-2">
    <QuSubheader>Folders</QuSubheader>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="folder" />

      Photos
    </div>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="folder" />

      Recipes
    </div>

    <QuDivider />

    <QuSubheader>Files</QuSubheader>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="photo" />

      Beach panorama
    </div>

    <div class="quantum-docs-divider-tile quantum-type-subheading">
      <QuIcon class="quantum-docs-divider-icon" name="photo" />

      Kitchen remodel
    </div>
  </div>
</template>

<style>
  .quantum-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }

  .quantum-docs-divider-icon {
    margin-inline-end: var(--quantum-spacing-4, 32px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>

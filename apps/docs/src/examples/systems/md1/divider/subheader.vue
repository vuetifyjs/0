<script setup lang="ts">
  import { Md1Divider, Md1Icon, Md1Subheader } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-divider-list md1-elevation-2">
    <Md1Subheader>Folders</Md1Subheader>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="folder" />

      Photos
    </div>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="folder" />

      Recipes
    </div>

    <Md1Divider />

    <Md1Subheader>Files</Md1Subheader>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="photo" />

      Beach panorama
    </div>

    <div class="md1-docs-divider-tile md1-type-subheading">
      <Md1Icon class="md1-docs-divider-icon" name="photo" />

      Kitchen remodel
    </div>
  </div>
</template>

<style>
  .md1-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  .md1-docs-divider-icon {
    margin-inline-end: var(--md1-spacing-4, 32px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>

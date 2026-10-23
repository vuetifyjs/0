<script setup lang="ts">
  import { Md1Fab } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-fab-sheet">
    <div class="md1-docs-fab-header" data-fab-host>
      <span class="md1-docs-fab-title">Lisbon, Portugal</span>

      <Md1Fab aria-label="Add to favourites" icon="favorite" position="seam" />
    </div>

    <p class="md1-docs-fab-body">
      Three nights from Friday. Two adults, one room.
    </p>
  </div>
</template>

<style>
  .md1-docs-fab-sheet {
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-fab-header {
    position: relative;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    height: 128px;
    padding: var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px) var(--md1-radius, 2px) 0 0;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-fab-title {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
  }

  .md1-docs-fab-body {
    margin: 0;
    padding: var(--md1-spacing-5, 40px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import { QuFab } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-fab-sheet">
    <div class="quantum-docs-fab-header" data-fab-host>
      <span class="quantum-docs-fab-title">Lisbon, Portugal</span>

      <QuFab aria-label="Add to favourites" icon="favorite" position="seam" />
    </div>

    <p class="quantum-docs-fab-body">
      Three nights from Friday. Two adults, one room.
    </p>
  </div>
</template>

<style>
  .quantum-docs-fab-sheet {
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-fab-header {
    position: relative;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    height: 128px;
    padding: var(--quantum-spacing-2, 16px);
    border-radius: var(--quantum-radius, 2px) var(--quantum-radius, 2px) 0 0;
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-docs-fab-title {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
  }

  .quantum-docs-fab-body {
    margin: 0;
    padding: var(--quantum-spacing-5, 40px) var(--quantum-spacing-2, 16px) var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import { QuDivider } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-divider-list quantum-elevation-2">
    <div class="quantum-docs-divider-tile quantum-type-subheading">Brunch this weekend?</div>

    <QuDivider />

    <div class="quantum-docs-divider-tile quantum-type-subheading">Summer barbecue</div>

    <QuDivider />

    <div class="quantum-docs-divider-tile quantum-type-subheading">Oui oui</div>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and 8 dp of list padding; its depth is the shipped quantum-elevation-2 utility. */
  .quantum-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--quantum-spacing-1, 8px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* A single-line list tile: 48 dp, text at the margin keyline (16 dp, 24 dp from 600 px). */
  .quantum-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }
</style>

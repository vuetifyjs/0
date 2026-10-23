<script setup lang="ts">
  import { Md1Divider } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-divider-list md1-elevation-2">
    <div class="md1-docs-divider-tile md1-type-subheading">Brunch this weekend?</div>

    <Md1Divider />

    <div class="md1-docs-divider-tile md1-type-subheading">Summer barbecue</div>

    <Md1Divider />

    <div class="md1-docs-divider-tile md1-type-subheading">Oui oui</div>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and 8 dp of list padding; its depth is the shipped md1-elevation-2 utility. */
  .md1-docs-divider-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    padding-block: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* A single-line list tile: 48 dp, text at the margin keyline (16 dp, 24 dp from 600 px). */
  .md1-docs-divider-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }
</style>

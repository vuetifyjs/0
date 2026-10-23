<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-grid-list-pair">
    <div class="quantum-docs-grid-list">
      <p class="quantum-docs-grid-list-caption">4 dp</p>

      <QuGridList :columns="3">
        <QuGridList.Tile
          v-for="index in 6"
          :key="index"
          :src="`https://picsum.photos/seed/quantum-gutter-${index}/300/300`"
        />
      </QuGridList>
    </div>

    <div class="quantum-docs-grid-list">
      <p class="quantum-docs-grid-list-caption">1 dp</p>

      <QuGridList :columns="3" :gutter="1">
        <QuGridList.Tile
          v-for="index in 6"
          :key="index"
          :src="`https://picsum.photos/seed/quantum-gutter-${index}/300/300`"
        />
      </QuGridList>
    </div>
  </div>
</template>

<style>
  .quantum-docs-grid-list-pair {
    display: flex;
    flex-wrap: wrap;
    gap: var(--quantum-spacing-3, 24px);
    width: 100%;
  }

  .quantum-docs-grid-list-pair > .quantum-docs-grid-list {
    flex: 1 1 200px;
    max-width: 320px;
  }

  .quantum-docs-grid-list-caption {
    margin: var(--quantum-spacing-2, 16px) 0 var(--quantum-spacing-1, 8px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-grid-list-caption:first-child {
    margin-top: 0;
  }
</style>

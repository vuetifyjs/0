<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-grid-list-pair">
    <div class="md1-docs-grid-list">
      <p class="md1-docs-grid-list-caption">4 dp</p>

      <Md1GridList :columns="3">
        <Md1GridList.Tile
          v-for="index in 6"
          :key="index"
          :src="`https://picsum.photos/seed/md1-gutter-${index}/300/300`"
        />
      </Md1GridList>
    </div>

    <div class="md1-docs-grid-list">
      <p class="md1-docs-grid-list-caption">1 dp</p>

      <Md1GridList :columns="3" :gutter="1">
        <Md1GridList.Tile
          v-for="index in 6"
          :key="index"
          :src="`https://picsum.photos/seed/md1-gutter-${index}/300/300`"
        />
      </Md1GridList>
    </div>
  </div>
</template>

<style>
  .md1-docs-grid-list-pair {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-grid-list-pair > .md1-docs-grid-list {
    flex: 1 1 200px;
    max-width: 320px;
  }

  .md1-docs-grid-list-caption {
    margin: var(--md1-spacing-2, 16px) 0 var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-grid-list-caption:first-child {
    margin-top: 0;
  }
</style>

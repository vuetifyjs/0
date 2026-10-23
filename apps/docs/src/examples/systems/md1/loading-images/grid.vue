<script setup lang="ts">
  import { Md1Button, Md1GridList } from '@paper/md1'

  import { shallowRef } from 'vue'

  const photos = [
    { id: 1, title: 'Harbour' },
    { id: 2, title: 'Ridge' },
    { id: 3, title: 'Salt flats' },
    { id: 4, title: 'Old town' },
    { id: 5, title: 'Market' },
    { id: 6, title: 'Glacier' },
  ]

  // Re-keying the grid remounts every tile: the staggered entrance plays again and each image loads from a new URL.
  const load = shallowRef(1)
</script>

<template>
  <div class="md1-docs-loading-stack">
    <div class="md1-docs-loading-grid">
      <Md1GridList :key="load" :columns="3">
        <Md1GridList.Tile
          v-for="photo in photos"
          :key="photo.id"
          :src="`https://picsum.photos/seed/md1-loading-grid-${load}-${photo.id}/400/400`"
        >
          <Md1GridList.Bar :title="photo.title" />
        </Md1GridList.Tile>
      </Md1GridList>
    </div>

    <Md1Button @click="load++">Load new images</Md1Button>
  </div>
</template>

<style>
  .md1-docs-loading-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-loading-grid {
    width: 100%;
    max-width: 480px;
  }
</style>

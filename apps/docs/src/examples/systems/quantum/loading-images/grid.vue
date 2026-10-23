<script setup lang="ts">
  import { QuButton, QuGridList } from '@paper/quantum'

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
  <div class="quantum-docs-loading-stack">
    <div class="quantum-docs-loading-grid">
      <QuGridList :key="load" :columns="3">
        <QuGridList.Tile
          v-for="photo in photos"
          :key="photo.id"
          :src="`https://picsum.photos/seed/quantum-loading-grid-${load}-${photo.id}/400/400`"
        >
          <QuGridList.Bar :title="photo.title" />
        </QuGridList.Tile>
      </QuGridList>
    </div>

    <QuButton @click="load++">Load new images</QuButton>
  </div>
</template>

<style>
  .quantum-docs-loading-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-loading-grid {
    width: 100%;
    max-width: 480px;
  }
</style>

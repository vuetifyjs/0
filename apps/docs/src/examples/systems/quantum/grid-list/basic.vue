<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const photos = [
    { id: 1, title: 'Morning harbour' },
    { id: 2, title: 'Pine ridge' },
    { id: 3, title: 'Salt flats' },
    { id: 4, title: 'Old town' },
    { id: 5, title: 'Night market' },
    { id: 6, title: 'Glacier lake' },
  ]

  const opened = shallowRef('')
</script>

<template>
  <div class="quantum-docs-grid-list">
    <QuGridList :columns="3">
      <QuGridList.Tile
        v-for="photo in photos"
        :key="photo.id"
        :src="`https://picsum.photos/seed/quantum-grid-${photo.id}/400/400`"
        @click="opened = photo.title"
      >
        <QuGridList.Bar :title="photo.title" />
      </QuGridList.Tile>
    </QuGridList>

    <p v-if="opened" class="quantum-docs-grid-list-note" role="status">Opened {{ opened }}</p>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  .quantum-docs-grid-list-note {
    margin: var(--quantum-spacing-2, 16px) 0 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'

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
  <div class="md1-docs-grid-list">
    <Md1GridList>
      <Md1GridList.Tile
        v-for="photo in photos"
        :key="photo.id"
        :src="`https://picsum.photos/seed/md1-grid-${photo.id}/400/400`"
        @click="opened = photo.title"
      >
        <Md1GridList.Bar :title="photo.title" />
      </Md1GridList.Tile>
    </Md1GridList>

    <p class="md1-docs-readout md1-docs-grid-list-note" role="status">{{ opened ? `Opened ${opened}` : 'No photo opened' }}</p>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  /* Start-aligned like the other grid list notes on the page. */
  .md1-docs-grid-list > .md1-docs-readout {
    text-align: start;
  }

  .md1-docs-grid-list-note {
    margin: var(--md1-spacing-2, 16px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

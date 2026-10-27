<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'

  const photos = [
    { id: 1, title: 'Morning harbour' },
    { id: 2, title: 'Pine ridge' },
    { id: 3, title: 'Salt flats' },
    { id: 4, title: 'Old town' },
    { id: 5, title: 'Night market' },
    { id: 6, title: 'Glacier lake' },
    { id: 7, title: 'Bakery window' },
    { id: 8, title: 'Tram depot' },
  ]
</script>

<template>
  <div class="md1-docs-grid-list-centred">
    <Md1GridList>
      <Md1GridList.Tile
        v-for="photo in photos"
        :key="photo.id"
        :src="`https://picsum.photos/seed/md1-grid-${photo.id}/400/400`"
      >
        <Md1GridList.Bar :title="photo.title" />
      </Md1GridList.Tile>
    </Md1GridList>
  </div>
</template>

<style>
  /*
   * A centred grid list: tiles keep a fixed 168 dp width (three increments),
   * at most four columns, and the margins take whatever width is left, never
   * less than 16 dp. When the columns plus that margin no longer fit, a
   * column drops and the rest reflow; the tiles never stretch.
   */
  .md1-docs-grid-list-centred {
    --md1-docs-tile: calc(3 * var(--md1-increment, 56px));
    --md1-docs-margin: var(--md1-spacing-2, 16px);

    inline-size: 100%;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-grid-list-centred > .md1-grid-list {
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fill, var(--md1-docs-tile));
    justify-content: center;
    max-inline-size: calc(4 * var(--md1-docs-tile) + 3 * 4px + 2 * var(--md1-docs-margin));
    margin-inline: auto;
    padding: var(--md1-docs-margin);
  }
</style>

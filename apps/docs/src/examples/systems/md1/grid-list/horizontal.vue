<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'

  const albums = ['Tidal', 'Lowlands', 'Signal', 'Copper', 'Northbound', 'Embers', 'Driftwood']
</script>

<template>
  <div class="md1-docs-grid-list">
    <Md1GridList horizontal>
      <Md1GridList.Tile
        v-for="(album, index) in albums"
        :key="album"
        :src="`https://picsum.photos/seed/md1-album-${index}/336/336`"
      >
        <Md1GridList.Bar :title="album" />
      </Md1GridList.Tile>
    </Md1GridList>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'

  const albums = ['Tidal', 'Lowlands', 'Signal', 'Copper', 'Northbound', 'Embers', 'Driftwood']
</script>

<template>
  <div class="quantum-docs-grid-list">
    <QuGridList horizontal>
      <QuGridList.Tile
        v-for="(album, index) in albums"
        :key="album"
        :src="`https://picsum.photos/seed/quantum-album-${index}/336/336`"
      >
        <QuGridList.Bar :title="album" />
      </QuGridList.Tile>
    </QuGridList>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

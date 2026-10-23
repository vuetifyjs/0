<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-grid-list">
    <Md1GridList :columns="3" ratio="3:2">
      <Md1GridList.Tile :row-span="2" :span="2" src="https://picsum.photos/seed/md1-span-1/800/533">
        <Md1GridList.Bar subtitle="Featured this week" title="Coastal road" />
      </Md1GridList.Tile>

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-span-2/400/267" />

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-span-3/400/267" />

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-span-4/400/267" />

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-span-5/400/267" />

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-span-6/400/267" />
    </Md1GridList>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

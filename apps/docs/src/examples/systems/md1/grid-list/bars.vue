<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-grid-list">
    <Md1GridList :columns="2" ratio="4:3">
      <Md1GridList.Tile src="https://picsum.photos/seed/md1-bar-1/480/360">
        <Md1GridList.Bar title="Footer, one line" />
      </Md1GridList.Tile>

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-bar-2/480/360">
        <Md1GridList.Bar subtitle="by Ana Ruiz" title="Footer, two lines" />
      </Md1GridList.Tile>

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-bar-3/480/360">
        <Md1GridList.Bar position="header" title="Header, one line" />
      </Md1GridList.Tile>

      <Md1GridList.Tile src="https://picsum.photos/seed/md1-bar-4/480/360">
        <Md1GridList.Bar position="header" subtitle="by Sam Okafor" title="Header, two lines" />
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

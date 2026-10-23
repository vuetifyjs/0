<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-grid-list">
    <QuGridList :columns="2" ratio="4:3">
      <QuGridList.Tile src="https://picsum.photos/seed/quantum-bar-1/480/360">
        <QuGridList.Bar title="Footer, one line" />
      </QuGridList.Tile>

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-bar-2/480/360">
        <QuGridList.Bar subtitle="by Ana Ruiz" title="Footer, two lines" />
      </QuGridList.Tile>

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-bar-3/480/360">
        <QuGridList.Bar position="header" title="Header, one line" />
      </QuGridList.Tile>

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-bar-4/480/360">
        <QuGridList.Bar position="header" subtitle="by Sam Okafor" title="Header, two lines" />
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

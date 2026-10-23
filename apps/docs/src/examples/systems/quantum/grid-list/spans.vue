<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-grid-list">
    <QuGridList :columns="3" ratio="3:2">
      <QuGridList.Tile :row-span="2" :span="2" src="https://picsum.photos/seed/quantum-span-1/800/533">
        <QuGridList.Bar subtitle="Featured this week" title="Coastal road" />
      </QuGridList.Tile>

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-span-2/400/267" />

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-span-3/400/267" />

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-span-4/400/267" />

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-span-5/400/267" />

      <QuGridList.Tile src="https://picsum.photos/seed/quantum-span-6/400/267" />
    </QuGridList>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

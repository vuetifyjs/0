<script setup lang="ts">
  import { QuGridList, QuSubheader } from '@paper/quantum'

  const sections = [
    { title: 'This week', seeds: [1, 2, 3, 4, 5] },
    { title: 'Last month', seeds: [6, 7, 8] },
  ]
</script>

<template>
  <div class="quantum-docs-grid-list">
    <template v-for="section in sections" :key="section.title">
      <QuSubheader :sticky="false">{{ section.title }}</QuSubheader>

      <QuGridList :columns="4">
        <QuGridList.Tile
          v-for="seed in section.seeds"
          :key="seed"
          :src="`https://picsum.photos/seed/quantum-section-${seed}/300/300`"
        />
      </QuGridList>
    </template>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

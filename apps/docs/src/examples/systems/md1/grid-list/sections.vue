<script setup lang="ts">
  import { Md1GridList, Md1Subheader } from '@paper/md1'

  const sections = [
    { title: 'This week', seeds: [1, 2, 3, 4, 5] },
    { title: 'Last month', seeds: [6, 7, 8] },
  ]
</script>

<template>
  <div class="md1-docs-grid-list">
    <template v-for="section in sections" :key="section.title">
      <Md1Subheader :sticky="false">{{ section.title }}</Md1Subheader>

      <Md1GridList :columns="4">
        <Md1GridList.Tile
          v-for="seed in section.seeds"
          :key="seed"
          :src="`https://picsum.photos/seed/md1-section-${seed}/300/300`"
        />
      </Md1GridList>
    </template>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }
</style>

<script setup lang="ts">
  import { Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const songs = shallowRef(['Clair de lune', 'Gymnopédie No. 1', 'Arabesque No. 1', 'Rêverie', 'Pavane'])
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List v-model:order="songs">
      <Md1List.Item v-for="song in songs" :key="song" :value="song">
        <Md1List.Icon name="play-arrow" />

        <Md1List.Content>
          <Md1List.Primary>{{ song }}</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Reorder />
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped md1-elevation-2 utility. */
  .md1-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>

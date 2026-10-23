<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'

  import { ref } from 'vue'

  const sides = [
    {
      side: 'end' as const,
      caption: 'End',
      photos: [
        { id: 1, title: 'Morning harbour', author: 'Ana Ruiz' },
        { id: 2, title: 'Pine ridge', author: 'Sam Okafor' },
      ],
    },
    {
      side: 'start' as const,
      caption: 'Start',
      photos: [
        { id: 3, title: 'Salt flats', author: 'Lea Martin' },
        { id: 4, title: 'Old town', author: 'Kai Tanaka' },
      ],
    },
  ]

  const starred = ref<number[]>([2])

  function onStar (id: number) {
    starred.value = starred.value.includes(id)
      ? starred.value.filter(value => value !== id)
      : [...starred.value, id]
  }
</script>

<template>
  <div class="quantum-docs-grid-list">
    <template v-for="group in sides" :key="group.side">
      <p class="quantum-docs-grid-list-caption">{{ group.caption }}</p>

      <QuGridList :columns="2">
        <QuGridList.Tile
          v-for="photo in group.photos"
          :key="photo.id"
          :src="`https://picsum.photos/seed/quantum-icon-${photo.id}/400/400`"
        >
          <QuGridList.Bar
            :icon="starred.includes(photo.id) ? 'star' : 'star-border'"
            :icon-label="`Star ${photo.title}`"
            :icon-side="group.side"
            :subtitle="photo.author"
            :title="photo.title"
            @action="onStar(photo.id)"
          />
        </QuGridList.Tile>
      </QuGridList>
    </template>

    <p class="quantum-docs-grid-list-note" role="status">{{ starred.length }} starred</p>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  .quantum-docs-grid-list-caption {
    margin: var(--quantum-spacing-2, 16px) 0 var(--quantum-spacing-1, 8px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-grid-list-caption:first-child {
    margin-top: 0;
  }

  .quantum-docs-grid-list-note {
    margin: var(--quantum-spacing-2, 16px) 0 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

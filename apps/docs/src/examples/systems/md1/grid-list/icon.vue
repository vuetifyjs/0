<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'

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
  <div class="md1-docs-grid-list">
    <template v-for="group in sides" :key="group.side">
      <p class="md1-docs-grid-list-caption">{{ group.caption }}</p>

      <Md1GridList :columns="2">
        <Md1GridList.Tile
          v-for="photo in group.photos"
          :key="photo.id"
          :src="`https://picsum.photos/seed/md1-icon-${photo.id}/400/400`"
        >
          <Md1GridList.Bar
            :icon="starred.includes(photo.id) ? 'star' : 'star-border'"
            :icon-label="`Star ${photo.title}`"
            :icon-side="group.side"
            :subtitle="photo.author"
            :title="photo.title"
            @action="onStar(photo.id)"
          />
        </Md1GridList.Tile>
      </Md1GridList>
    </template>

    <p class="md1-docs-grid-list-note" role="status">{{ starred.length }} starred</p>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  .md1-docs-grid-list-caption {
    margin: var(--md1-spacing-2, 16px) 0 var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-grid-list-caption:first-child {
    margin-top: 0;
  }

  .md1-docs-grid-list-note {
    margin: var(--md1-spacing-2, 16px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

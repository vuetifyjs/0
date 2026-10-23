<script setup lang="ts">
  import { Md1GridList } from '@paper/md1'
  import { ref } from 'vue'

  const photos = [
    { id: 1, alt: 'Bare trees in a misty marsh' },
    { id: 2, alt: 'A coyote in a winter forest' },
    { id: 3, alt: 'Sneakers resting on a grassy field' },
    { id: 4, alt: 'A crate of strawberries' },
    { id: 5, alt: 'A wooden railway trestle' },
    { id: 6, alt: 'A frog in green duckweed' },
  ]

  const selected = ref<number[]>([2, 5])

  function onToggle (id: number) {
    selected.value = selected.value.includes(id)
      ? selected.value.filter(value => value !== id)
      : [...selected.value, id]
  }
</script>

<template>
  <div class="md1-docs-selection-stack md1-docs-selection-grid">
    <Md1GridList :columns="3">
      <Md1GridList.Tile
        v-for="photo in photos"
        :key="photo.id"
        :alt="photo.alt"
        :selected="selected.includes(photo.id)"
        :src="`https://picsum.photos/seed/md1-grid-${photo.id}/400/400`"
        @click="onToggle(photo.id)"
      />
    </Md1GridList>

    <span class="md1-docs-selection-note" role="status">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  .md1-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-selection-grid {
    max-width: 480px;
  }

  .md1-docs-selection-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

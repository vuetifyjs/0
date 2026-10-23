<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'

  import { ref } from 'vue'

  const photos = [
    { id: 1, alt: 'A harbour at dawn' },
    { id: 2, alt: 'A pine forest on a ridge' },
    { id: 3, alt: 'White salt flats' },
    { id: 4, alt: 'Narrow streets of an old town' },
    { id: 5, alt: 'Lanterns over a night market' },
    { id: 6, alt: 'A lake under a glacier' },
  ]

  const selected = ref<number[]>([3])

  function onToggle (id: number) {
    selected.value = selected.value.includes(id)
      ? selected.value.filter(value => value !== id)
      : [...selected.value, id]
  }
</script>

<template>
  <div class="quantum-docs-grid-list">
    <QuGridList :columns="3">
      <QuGridList.Tile
        v-for="photo in photos"
        :key="photo.id"
        :alt="photo.alt"
        :selected="selected.includes(photo.id)"
        :src="`https://picsum.photos/seed/quantum-grid-${photo.id}/400/400`"
        @click="onToggle(photo.id)"
      />
    </QuGridList>

    <p class="quantum-docs-grid-list-note" role="status">{{ selected.length }} selected</p>
  </div>
</template>

<style>
  .quantum-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  .quantum-docs-grid-list-note {
    margin: var(--quantum-spacing-2, 16px) 0 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import { QuGridList } from '@paper/quantum'
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
  <div class="quantum-docs-selection-stack quantum-docs-selection-grid">
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

    <span class="quantum-docs-selection-note" role="status">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  .quantum-docs-selection-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-selection-grid {
    max-width: 480px;
  }

  .quantum-docs-selection-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>

<script setup lang="ts">
  import ImageCard from './ImageCard.vue'

  const cards = [
    {
      id: 'valid',
      label: 'Loads directly',
      alt: 'A landscape photograph',
      src: 'https://picsum.photos/seed/v0-card/400/300',
    },
    {
      id: 'fallback',
      label: 'Fallback recovers',
      alt: 'A backup photograph',
      src: 'https://invalid.example/missing.jpg',
      fallback: 'https://picsum.photos/seed/v0-fallback/400/300',
    },
    {
      id: 'broken',
      label: 'Nothing recovers',
      alt: 'An unavailable image',
      src: 'https://invalid.example/primary.jpg',
      fallback: 'https://invalid.example/fallback.jpg',
    },
  ]
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <ImageCard
      v-for="card in cards"
      :key="card.id"
      :alt="card.alt"
      :fallback="card.fallback"
      :label="card.label"
      :src="card.src"
    />
  </div>
</template>

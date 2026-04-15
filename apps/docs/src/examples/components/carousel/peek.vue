<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'

  const slides = [
    { id: 1, label: 'Mountains', color: 'bg-sky-800 text-white' },
    { id: 2, label: 'Desert', color: 'bg-amber-700 text-white' },
    { id: 3, label: 'Forest', color: 'bg-emerald-800 text-white' },
    { id: 4, label: 'Ocean', color: 'bg-blue-900 text-white' },
  ]
</script>

<template>
  <Carousel.Root :gap="16" :peek="48">
    <Carousel.Viewport class="rounded-lg scrollbar-hide cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none">
      <Carousel.Item
        v-for="slide in slides"
        :key="slide.id"
        class="flex items-center justify-center h-40 rounded-lg text-lg font-medium"
        :class="slide.color"
        :value="slide.id"
      >
        {{ slide.label }}
      </Carousel.Item>
    </Carousel.Viewport>
  </Carousel.Root>
</template>

<script setup lang="ts">
  import { Carousel } from '@vuetify/v0'
</script>

<template>
  <Carousel.Root :gap="16" :peek="48" :per-view="1">
    <Carousel.Viewport class="rounded-lg">
      <Carousel.Slide
        v-for="i in 4"
        :key="i"
        v-slot="{ isSelected }"
        class="flex items-center justify-center h-40 rounded-lg text-lg font-medium transition-opacity"
        :class="isSelected ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant opacity-60'"
        :value="i"
      >
        Slide {{ i }}
      </Carousel.Slide>
    </Carousel.Viewport>
  </Carousel.Root>
</template>

<script lang="ts">
  // Framework
  import { Carousel } from '@vuetify/v0/components'

  // Context
  import { useBCarousel } from '../BCarousel/BCarousel.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCarouselItem' })

  defineSlots<{
    default?: () => any
  }>()

  const { claim } = useBCarousel()
  const index = claim()
</script>

<template>
  <Carousel.Item v-slot="{ isSelected }" renderless :value="index">
    <div class="carousel-item" :class="{ active: isSelected }">
      <slot />
    </div>
  </Carousel.Item>
</template>

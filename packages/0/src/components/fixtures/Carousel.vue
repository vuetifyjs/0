<script setup lang="ts">
  import { Carousel } from '../Carousel/index'
</script>

<template>
  <Carousel.Root circular>
    <Carousel.Viewport>
      <Carousel.Item v-for="i in 5" :key="i" :value="i">Slide {{ i }}</Carousel.Item>
    </Carousel.Viewport>

    <Carousel.Previous>Previous</Carousel.Previous>
    <Carousel.Next>Next</Carousel.Next>
  </Carousel.Root>
</template>

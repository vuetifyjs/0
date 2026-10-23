<script setup lang="ts">
  import { BCarousel, BCarouselItem } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const index = shallowRef(0)
</script>

<template>
  <BCarousel v-model="index" fade>
    <BCarouselItem>
      <div class="d-block w-100 bg-body p-5">First slide</div>
    </BCarouselItem>

    <BCarouselItem>
      <div class="d-block w-100 bg-body p-5">Second slide</div>
    </BCarouselItem>
  </BCarousel>
</template>

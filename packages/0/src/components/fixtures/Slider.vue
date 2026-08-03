<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Slider } from '../Slider/index'

  const value = ref([50])
</script>

<template>
  <Slider.Root v-model="value" :max="100" :min="0">
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>

    <Slider.Thumb />
  </Slider.Root>
</template>

<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { ref } from 'vue'

  const single = ref([50])
  const range = ref([25, 75])
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Single -->
    <div class="flex flex-col gap-2">
      <Slider.Root v-model="single" class="relative flex items-center w-full h-5">
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
      </Slider.Root>

      <p class="text-sm text-on-surface-variant">Value: {{ single[0] }}</p>
    </div>

    <!-- Range -->
    <div class="flex flex-col gap-2">
      <Slider.Root v-model="range" class="relative flex items-center w-full h-5" :min-steps-between-thumbs="5">
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
      </Slider.Root>

      <p class="text-sm text-on-surface-variant">Range: {{ range[0] }} – {{ range[1] }}</p>
    </div>
  </div>
</template>

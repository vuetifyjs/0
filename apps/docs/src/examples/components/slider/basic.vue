<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { ref } from 'vue'

  const value = ref([50])
</script>

<template>
  <div class="flex flex-col gap-4">
    <Slider.Root v-model="value" class="relative flex items-center w-full h-5">
      <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
        <Slider.Range class="absolute h-full rounded-full bg-primary" />
      </Slider.Track>

      <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
    </Slider.Root>

    <p class="text-sm text-on-surface-variant">Value: {{ value[0] }}</p>
  </div>
</template>

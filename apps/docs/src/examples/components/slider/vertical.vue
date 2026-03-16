<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { ref } from 'vue'

  const value = ref([50])
</script>

<template>
  <div class="flex items-end justify-center gap-8 h-48">
    <Slider.Root
      v-model="value"
      class="relative flex flex-col items-center h-full w-5"
      orientation="vertical"
    >
      <Slider.Track class="relative w-1 h-full rounded-full bg-surface-variant">
        <Slider.Range class="absolute w-full rounded-full bg-primary" />
      </Slider.Track>

      <Slider.Thumb class="absolute size-5 rounded-full bg-primary translate-y-1/2 focus:outline-2 focus:outline-primary" />
    </Slider.Root>

    <p class="text-sm text-on-surface-variant font-mono tabular-nums w-20">Value: {{ value[0] }}</p>
  </div>
</template>

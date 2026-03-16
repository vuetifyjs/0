<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { ref } from 'vue'
  const value = ref([40])
  const min = 0
  const max = 100
  const step = 20
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => i * step)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Slider.Root
      v-model="value"
      class="relative flex items-center w-full h-5"
      :max
      :min
      :step
    >
      <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
        <Slider.Range class="absolute h-full rounded-full bg-primary" />

        <span
          v-for="tick in ticks"
          :key="tick"
          class="absolute top-1/2 size-2 rounded-full bg-on-surface-variant -translate-x-1/2 -translate-y-1/2"
          :style="{ left: `${((tick - min) / (max - min)) * 100}%` }"
        />
      </Slider.Track>

      <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary z-1" />
    </Slider.Root>

    <div class="flex justify-between text-xs text-on-surface-variant">
      <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
    </div>

    <p class="text-sm text-on-surface-variant">Value: {{ value[0] }}</p>
  </div>
</template>

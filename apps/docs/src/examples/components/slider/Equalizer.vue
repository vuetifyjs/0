<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import type { Band } from './useEqualizer'

  const { bands, min = -12, max = 12 } = defineProps<{
    bands: Band[]
    min?: number
    max?: number
  }>()

  const gains = defineModel<number[]>({ required: true })

  function update (index: number, value: number[]) {
    const next = [...gains.value]
    next[index] = value[0]!
    gains.value = next
  }
</script>

<template>
  <div class="flex gap-2 justify-center">
    <!-- dB scale -->
    <div class="flex flex-col justify-between items-end h-48 py-1 text-xs text-on-surface-variant shrink-0">
      <span>+{{ max }}</span>
      <span>0</span>
      <span>{{ min }}</span>
    </div>

    <!-- Bands -->
    <div
      v-for="(band, index) in bands"
      :key="band.label"
      class="flex flex-col items-center gap-2"
    >
      <Slider.Root
        class="relative flex flex-col items-center h-48 w-8"
        :max
        :min
        :model-value="[gains[index]!]"
        orientation="vertical"
        @update:model-value="update(index, $event)"
      >
        <Slider.Track class="relative w-1 h-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute w-full rounded-full bg-primary/60" />
        </Slider.Track>

        <Slider.Thumb
          v-slot="{ value, isDragging }"
          class="absolute size-4 rounded-full bg-primary shadow-sm translate-y-1/2 focus:outline-2 focus:outline-primary transition-transform data-[state=dragging]:scale-125"
        >
          <span
            class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap transition-opacity"
            :class="isDragging ? 'opacity-100' : 'opacity-0'"
          >
            {{ value > 0 ? `+${value}` : value }}
          </span>
        </Slider.Thumb>
      </Slider.Root>

      <!-- Frequency label -->
      <span class="text-xs text-on-surface-variant">{{ band.label }}</span>
    </div>
  </div>
</template>

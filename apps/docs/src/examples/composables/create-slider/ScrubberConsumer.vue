<script setup lang="ts">
  import { toRef } from 'vue'
  import { DURATION, formatTime, useScrubber } from './context'

  const { slider, scrubbing } = useScrubber()

  const position = toRef(() => slider.values.value[0] ?? 0)
  const progress = toRef(() => slider.fromValue(position.value))
  const elapsed = toRef(() => formatTime(position.value))
  const remaining = toRef(() => formatTime(DURATION - position.value))

  // Generate static waveform bars
  const bars = Array.from({ length: 80 }, () => 20 + Math.random() * 80)
</script>

<template>
  <div class="flex flex-col gap-3 select-none">
    <!-- Time display -->
    <div class="flex justify-between text-xs font-mono text-on-surface-variant">
      <span>{{ elapsed }}</span>
      <span>-{{ remaining }}</span>
    </div>

    <!-- Waveform track -->
    <div
      class="relative h-12 flex items-end gap-px cursor-pointer"
      :class="scrubbing && 'cursor-grabbing'"
    >
      <div
        v-for="(height, index) in bars"
        :key="index"
        class="flex-1 rounded-full transition-colors duration-75"
        :class="(index / bars.length) * 100 <= progress ? 'bg-primary' : 'bg-on-surface op-20'"
        :style="{ height: `${height}%` }"
      />

      <!-- Playhead -->
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-primary transition-[left]"
        :class="scrubbing ? 'duration-0' : 'duration-150'"
        :style="{ left: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { createSlider } from '@vuetify/v0'

  const slider = createSlider({ min: 0, max: 100, step: 5 })
  slider.values.value = [50]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 items-center">
      <button class="px-2 py-1 border rounded border-divider" @click="slider.stepDown(0)">-</button>
      <span class="min-w-16 text-center font-mono">{{ slider.values.value[0] }}</span>
      <button class="px-2 py-1 border rounded border-divider" @click="slider.stepUp(0)">+</button>
    </div>

    <div class="text-sm text-on-surface-variant">
      <p>Percent: {{ slider.percent(slider.values.value[0]!) }}%</p>
      <p>Snapped: {{ slider.snap(47) }} (47 snaps to nearest step of 5)</p>
    </div>
  </div>
</template>

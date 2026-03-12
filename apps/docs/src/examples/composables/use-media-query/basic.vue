<script setup lang="ts">
  import { Slider, useMediaQuery } from '@vuetify/v0'
  import { ref, toRef } from 'vue'

  const { matches: isLandscape } = useMediaQuery('(orientation: landscape)')

  const width = ref([768])
  const minWidth = toRef(() => width.value[0])
  const { matches: isWide } = useMediaQuery(() => `(min-width: ${minWidth.value}px)`)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="isLandscape ? 'bg-success' : 'bg-error'"
      />
      <span>Landscape orientation: <strong>{{ isLandscape }}</strong></span>
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="isWide ? 'bg-success' : 'bg-error'"
      />
      <span>Width >= {{ minWidth }}px: <strong>{{ isWide }}</strong></span>
    </div>

    <div class="flex items-center gap-4 pt-4 border-t border-divider">
      <label class="text-sm">Min width threshold:</label>

      <Slider.Root v-model="width" :min="320" :max="1920" :step="10" class="relative flex flex-1 items-center h-5">
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
      </Slider.Root>

      <span class="w-16 text-right font-mono text-sm">{{ minWidth }}px</span>
    </div>
  </div>
</template>

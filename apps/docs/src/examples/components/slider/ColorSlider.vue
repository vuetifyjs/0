<script setup lang="ts">
  import { Slider } from '@vuetify/v0'
  import { toRef } from 'vue'

  const {
    min = 0,
    max = 100,
    gradient = 'linear-gradient(to right, #000, #fff)',
    label = '',
    thumbColor = '#fff',
  } = defineProps<{
    min?: number
    max?: number
    gradient?: string
    label?: string
    thumbColor?: string
  }>()

  const model = defineModel<number[]>({ required: true })

  const display = toRef(() => model.value[0] ?? min)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-if="label" class="flex items-center justify-between text-sm text-on-surface-variant">
      <span>{{ label }}</span>
      <span class="font-mono tabular-nums">{{ display }}</span>
    </div>

    <Slider.Root
      v-model="model"
      class="relative flex items-center w-full h-6"
      :max
      :min
    >
      <Slider.Track
        class="relative h-3 w-full rounded-full overflow-hidden"
        :style="{ background: gradient }"
      >
        <!-- Range hidden — the gradient track IS the visualization -->
      </Slider.Track>

      <Slider.Thumb
        class="absolute top-1/2 size-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 transition-transform data-[state=dragging]:scale-125"
        :style="{ backgroundColor: thumbColor }"
      />
    </Slider.Root>
  </div>
</template>

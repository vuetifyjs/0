<script setup lang="ts">
  import { ref } from 'vue'
  import ColorPicker from './ColorPicker.vue'

  const presets = [
    { name: 'Ocean', hue: 200, saturation: 80, lightness: 50 },
    { name: 'Sunset', hue: 15, saturation: 90, lightness: 55 },
    { name: 'Forest', hue: 140, saturation: 60, lightness: 40 },
    { name: 'Lavender', hue: 270, saturation: 60, lightness: 70 },
    { name: 'Gold', hue: 45, saturation: 95, lightness: 55 },
  ]

  const hue = ref([220])
  const saturation = ref([80])
  const lightness = ref([55])

  function onPreset (preset: typeof presets[number]) {
    hue.value = [preset.hue]
    saturation.value = [preset.saturation]
    lightness.value = [preset.lightness]
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <ColorPicker
      v-model:hue="hue"
      v-model:lightness="lightness"
      v-model:saturation="saturation"
    />

    <!-- Presets -->
    <div class="flex flex-col gap-2">
      <span class="text-sm text-on-surface-variant">Presets</span>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="preset in presets"
          :key="preset.name"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-divider hover:border-primary transition-colors cursor-pointer bg-surface"
          @click="onPreset(preset)"
        >
          <span
            class="size-3 rounded-full"
            :style="{ backgroundColor: `hsl(${preset.hue}, ${preset.saturation}%, ${preset.lightness}%)` }"
          />
          {{ preset.name }}
        </button>
      </div>
    </div>
  </div>
</template>

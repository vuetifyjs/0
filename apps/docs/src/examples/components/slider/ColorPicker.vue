<script setup lang="ts">
  import { toRef } from 'vue'
  import ColorSlider from './ColorSlider.vue'

  const hue = defineModel<number[]>('hue', { default: () => [220] })
  const saturation = defineModel<number[]>('saturation', { default: () => [80] })
  const lightness = defineModel<number[]>('lightness', { default: () => [55] })

  const h = toRef(() => hue.value[0]!)
  const s = toRef(() => saturation.value[0]!)
  const l = toRef(() => lightness.value[0]!)

  const color = toRef(() => `hsl(${h.value}, ${s.value}%, ${l.value}%)`)

  const hueGradient = 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'

  const saturationGradient = toRef(() =>
    `linear-gradient(to right, hsl(${h.value},0%,${l.value}%), hsl(${h.value},100%,${l.value}%))`,
  )

  const lightnessGradient = toRef(() =>
    `linear-gradient(to right, hsl(${h.value},${s.value}%,0%), hsl(${h.value},${s.value}%,50%), hsl(${h.value},${s.value}%,100%))`,
  )

  const hueThumb = toRef(() => `hsl(${h.value}, 100%, 50%)`)
  const saturationThumb = toRef(() => `hsl(${h.value}, ${s.value}%, ${l.value}%)`)
  const hex = toRef(() => hslToHex(h.value, s.value, l.value))

  function hslToHex (h: number, s: number, l: number): string {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)

    function f (n: number): string {
      const k = (n + h / 30) % 12
      const value = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * value).toString(16).padStart(2, '0')
    }

    return `#${f(0)}${f(8)}${f(4)}`
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex gap-6 items-start">
      <!-- Color preview -->
      <div
        class="size-24 rounded-xl shadow-lg shrink-0 border border-white/20"
        :style="{ backgroundColor: color }"
      />

      <!-- Values -->
      <div class="flex flex-col gap-1 text-sm font-mono">
        <span class="text-on-surface-variant">HSL</span>
        <span class="text-on-surface">{{ h }}°, {{ s }}%, {{ l }}%</span>
        <span class="text-on-surface-variant mt-2">HEX</span>
        <span class="text-on-surface uppercase">{{ hex }}</span>
      </div>
    </div>

    <!-- Sliders -->
    <div class="flex flex-col gap-4">
      <ColorSlider
        v-model="hue"
        :gradient="hueGradient"
        label="Hue"
        :max="360"
        :min="0"
        :thumb-color="hueThumb"
      />

      <ColorSlider
        v-model="saturation"
        :gradient="saturationGradient"
        label="Saturation"
        :max="100"
        :min="0"
        :thumb-color="saturationThumb"
      />

      <ColorSlider
        v-model="lightness"
        :gradient="lightnessGradient"
        label="Lightness"
        :max="100"
        :min="0"
        :thumb-color="color"
      />
    </div>
  </div>
</template>

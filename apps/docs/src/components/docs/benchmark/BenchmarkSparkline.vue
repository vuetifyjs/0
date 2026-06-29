<script setup lang="ts">
  // Composables
  import { TIER_CONFIG } from '@/composables/useBenchmarkData'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Tier } from '@/composables/useBenchmarkData'

  interface Point {
    label: string
    value: number
    isCurrent?: boolean
  }

  const {
    points,
    tier,
    width = 120,
    height = 28,
  } = defineProps<{
    points: Point[]
    tier?: Tier
    width?: number
    height?: number
  }>()

  const padding = 3

  const tierClass = toRef(() => tier ? TIER_CONFIG[tier].color : 'text-on-surface-variant')

  const coords = toRef(() => {
    const values = points.map(p => p.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2
    const stepX = points.length > 1 ? usableWidth / (points.length - 1) : 0

    return points.map((point, i) => {
      const x = padding + stepX * i
      const normalized = (point.value - min) / span
      const y = padding + (1 - normalized) * usableHeight
      return { x, y, point }
    })
  })

  const polylinePoints = toRef(() => coords.value.map(c => `${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(' '))
</script>

<template>
  <svg
    aria-hidden="true"
    :class="tierClass"
    fill="none"
    :height
    :viewBox="`0 0 ${width} ${height}`"
    :width
  >
    <polyline
      fill="none"
      :points="polylinePoints"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />

    <circle
      v-for="(c, i) in coords"
      :key="i"
      :cx="c.x"
      :cy="c.y"
      :fill="c.point.isCurrent ? 'none' : 'currentColor'"
      r="2"
      stroke="currentColor"
      stroke-width="1.5"
    />
  </svg>
</template>

<script setup lang="ts">
  // Framework
  import { useEventListener } from '@vuetify/v0'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { toRef, useTemplateRef, shallowRef } from 'vue'

  const DAY_MS = 24 * 60 * 60 * 1000
  const WIDTH = 800
  const HEIGHT = 120
  const PADDING = 16

  const svgRef = useTemplateRef<SVGSVGElement>('svg')

  const checkpoints = toRef(() => {
    const now = new Date()
    return [0, 7, 14, 21, 28].map(offset => ({
      offset,
      asOf: new Date(now.getTime() - offset * DAY_MS),
    }))
  })

  const series = toRef(() =>
    checkpoints.value.map(({ offset, asOf }) => ({
      offset,
      date: asOf,
      score: useFreshness(() => asOf).overall.value,
    })).toReversed(),
  )

  const path = toRef(() => {
    const pts = series.value.map((p, i) => {
      const x = PADDING + (i / (series.value.length - 1)) * (WIDTH - PADDING * 2)
      const y = HEIGHT - PADDING - (p.score / 100) * (HEIGHT - PADDING * 2)
      return [x, y] as const
    })
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[Math.max(0, i - 1)]
      const [x2, y2] = pts[i]
      const [x3, y3] = pts[i + 1]
      const [x4, y4] = pts[Math.min(pts.length - 1, i + 2)]
      const cp1x = x2 + (x3 - x1) / 6
      const cp1y = y2 + (y3 - y1) / 6
      const cp2x = x3 - (x4 - x2) / 6
      const cp2y = y3 - (y4 - y2) / 6
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x3} ${y3}`
    }
    return d
  })

  const strokeColor = toRef(() => scoreToColor(series.value.at(-1).score))

  const hover = shallowRef<{ score: number, date: Date, x: number, y: number } | null>(null)

  useEventListener(svgRef, 'pointermove', (event: PointerEvent) => {
    const svg = svgRef.value
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const relX = ((event.clientX - rect.left) / rect.width) * WIDTH
    const i = Math.max(0, Math.min(series.value.length - 1,
                                   Math.round(((relX - PADDING) / (WIDTH - PADDING * 2)) * (series.value.length - 1))))
    const point = series.value[i]
    if (!point) return
    const x = PADDING + (i / (series.value.length - 1)) * (WIDTH - PADDING * 2)
    const y = HEIGHT - PADDING - (point.score / 100) * (HEIGHT - PADDING * 2)
    hover.value = { score: point.score, date: point.date, x, y }
  })

  useEventListener(svgRef, 'pointerleave', () => {
    hover.value = null
  })
</script>

<template>
  <figure class="w-full max-w-3xl mx-auto">
    <figcaption class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">
      30-day trend
    </figcaption>

    <svg
      ref="svg"
      aria-label="Docs freshness over the last 30 days"
      class="w-full h-auto"
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
    >
      <line
        stroke="currentColor"
        stroke-opacity="0.1"
        :x1="PADDING"
        :x2="WIDTH - PADDING"
        :y1="HEIGHT - PADDING"
        :y2="HEIGHT - PADDING"
      />

      <line
        stroke="currentColor"
        stroke-opacity="0.1"
        :x1="PADDING"
        :x2="WIDTH - PADDING"
        :y1="HEIGHT / 2"
        :y2="HEIGHT / 2"
      />

      <line
        stroke="currentColor"
        stroke-opacity="0.1"
        :x1="PADDING"
        :x2="WIDTH - PADDING"
        :y1="PADDING"
        :y2="PADDING"
      />

      <path
        :d="path"
        fill="none"
        :stroke="strokeColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />

      <g v-if="hover">
        <circle :cx="hover.x" :cy="hover.y" :fill="scoreToColor(hover.score)" r="4" />

        <rect
          fill="currentColor"
          fill-opacity="0.9"
          height="24"
          rx="4"
          width="80"
          :x="hover.x - 40"
          :y="hover.y - 32"
        />

        <text class="text-[10px] fill-on-surface" text-anchor="middle" :x="hover.x" :y="hover.y - 16">
          {{ hover.score }} · {{ new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(hover.date) }}
        </text>
      </g>
    </svg>
  </figure>
</template>

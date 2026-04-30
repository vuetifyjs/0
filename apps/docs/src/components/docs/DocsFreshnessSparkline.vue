<script setup lang="ts">
  // Framework
  import { useEventListener } from '@vuetify/v0'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { toRef, useTemplateRef, shallowRef } from 'vue'

  const DAY_MS = 24 * 60 * 60 * 1000
  const WIDTH = 800
  const HEIGHT = 140
  const PADDING = 16
  const AXIS_HEIGHT = 18
  const CHART_BOTTOM = HEIGHT - PADDING - AXIS_HEIGHT
  const CHART_TOP = PADDING
  const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP

  const tickFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

  function formatTick (date: Date): string {
    return tickFormatter.format(date)
  }

  function pointX (i: number, length: number): number {
    return PADDING + (i / (length - 1)) * (WIDTH - PADDING * 2)
  }

  function pointY (score: number): number {
    return CHART_BOTTOM - (score / 100) * CHART_HEIGHT
  }

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
    const pts = series.value.map((p, i) => [pointX(i, series.value.length), pointY(p.score)] as const)
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
    hover.value = {
      score: point.score,
      date: point.date,
      x: pointX(i, series.value.length),
      y: pointY(point.score),
    }
  })

  useEventListener(svgRef, 'pointerleave', () => {
    hover.value = null
  })

  const TOOLTIP_W = 100
  const TOOLTIP_H = 24
  const TOOLTIP_GAP = 8

  const tooltip = toRef(() => {
    if (!hover.value) return null
    const { x, y } = hover.value
    const clampedX = Math.max(0, Math.min(WIDTH - TOOLTIP_W, x - TOOLTIP_W / 2))
    const above = y - TOOLTIP_GAP - TOOLTIP_H
    const flipBelow = above < 0
    const ty = flipBelow ? y + TOOLTIP_GAP : above
    return {
      x: clampedX,
      y: ty,
      w: TOOLTIP_W,
      h: TOOLTIP_H,
      cx: clampedX + TOOLTIP_W / 2,
      cy: ty + TOOLTIP_H / 2 + 3,
    }
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
        :y1="CHART_BOTTOM"
        :y2="CHART_BOTTOM"
      />

      <line
        stroke="currentColor"
        stroke-opacity="0.1"
        :x1="PADDING"
        :x2="WIDTH - PADDING"
        :y1="(CHART_TOP + CHART_BOTTOM) / 2"
        :y2="(CHART_TOP + CHART_BOTTOM) / 2"
      />

      <line
        stroke="currentColor"
        stroke-opacity="0.1"
        :x1="PADDING"
        :x2="WIDTH - PADDING"
        :y1="CHART_TOP"
        :y2="CHART_TOP"
      />

      <path
        :d="path"
        fill="none"
        :stroke="strokeColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />

      <g class="text-[10px] fill-on-surface-variant">
        <text
          v-for="(p, i) in series"
          :key="i"
          text-anchor="middle"
          :x="PADDING + (i / (series.length - 1)) * (WIDTH - PADDING * 2)"
          :y="HEIGHT - 2"
        >
          {{ formatTick(p.date) }}
        </text>
      </g>

      <g v-if="hover && tooltip">
        <circle :cx="hover.x" :cy="hover.y" :fill="scoreToColor(hover.score)" r="4" />

        <rect
          class="fill-on-surface"
          :height="tooltip.h"
          rx="4"
          :width="tooltip.w"
          :x="tooltip.x"
          :y="tooltip.y"
        />

        <text class="text-[10px] fill-surface" text-anchor="middle" :x="tooltip.cx" :y="tooltip.cy">
          {{ hover.score }} · {{ tickFormatter.format(hover.date) }}
        </text>
      </g>
    </svg>
  </figure>
</template>

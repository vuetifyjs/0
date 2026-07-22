<script lang="ts">
  // Utilities
  import { computed } from 'vue'

  export interface GnDotGridProps {
    /** Base color for the dots and lines; any CSS color. Defaults to the theme foreground. */
    color?: string
    /** Percentage of the radial fade kept fully transparent before it ramps to opaque. */
    coverage?: number
    /** Grid cell size, in pixels. */
    density?: number
    /** Connecting-line intensity as an alpha percentage; `0` disables the lines (dots only). */
    lines?: number
    /** Origin of the radial fade mask, e.g. `'bottom left'`. */
    origin?: string
    /**
     * Perspective tilt of the grid, `-100`–`100`. Bends the flat plane into a
     * receding surface so the dots bunch toward the far edge; the sign picks
     * which edge tips away. `0` keeps the grid flat.
     */
    skew?: number
  }
</script>

<script setup lang="ts">
  const {
    color = 'var(--v0-on-background)',
    coverage = 15,
    density = 20,
    lines = 0,
    origin = 'bottom left',
    skew = 0,
  } = defineProps<GnDotGridProps>()

  const maskStyle = computed(() => {
    const fadeEnd = coverage + 20
    const mask = `radial-gradient(ellipse at ${origin}, transparent 0%, transparent ${coverage}%, black ${fadeEnd}%)`

    const dot = `radial-gradient(circle, color-mix(in srgb, ${color} 12%, transparent) 1px, transparent 1px)`

    const layers = [dot]
    // Dots are centered in each cell; offset the lines by half a cell so they
    // cross through the dot centers, seating each dot on a grid intersection.
    const positions = ['0 0']

    if (lines > 0) {
      const line = `color-mix(in srgb, ${color} ${lines}%, transparent)`
      const half = density / 2
      layers.push(
        `linear-gradient(to right, ${line} 1px, transparent 1px)`,
        `linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
      )
      positions.push(`${half}px ${half}px`, `${half}px ${half}px`)
    }

    const style: Record<string, string> = {
      maskImage: mask,
      WebkitMaskImage: mask,
      backgroundImage: layers.join(', '),
      backgroundPosition: positions.join(', '),
      backgroundSize: `${density}px ${density}px`,
    }

    // Perspective tilt: bend the flat plane into a receding surface so dots
    // bunch toward the far edge (a sheet tipping away), rather than scaling
    // every cell the same. `skew` (-100..100) maps to an X-axis rotation; the
    // fixed perspective supplies the foreshortening and the scale keeps the
    // tilted plane covering its box. 0 stays flat.
    const tilt = Math.max(-100, Math.min(100, skew)) / 100
    if (tilt !== 0) {
      style.transform = `perspective(600px) rotateX(${tilt * 45}deg) scale(${1 + Math.abs(tilt) * 0.3})`
      style.transformOrigin = 'center'
    }

    return style
  })
</script>

<template>
  <div
    aria-hidden="true"
    class="genesis-dot-grid"
    :style="maskStyle"
  />
</template>

<style scoped>
  .genesis-dot-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
</style>

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
     * Directional stretch of the grid, `-100`–`100`. Positive stretches the
     * cells horizontally and pinches them vertically; negative does the
     * reverse. `0` keeps the cells square.
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

    // Stretch one axis and pinch the other by an equal, opposite amount so the
    // grid appears pulled in a direction while the mean cell size holds. `skew`
    // is clamped to -100..100, mapped to a ±0.5 cell-size delta per axis.
    const ratio = Math.max(-100, Math.min(100, skew)) / 200
    const cellX = density * (1 + ratio)
    const cellY = density * (1 - ratio)

    const layers = [dot]
    // Dots are centered in each cell; offset the lines by half a cell so they
    // cross through the dot centers, seating each dot on a grid intersection.
    const positions = ['0 0']

    if (lines > 0) {
      const line = `color-mix(in srgb, ${color} ${lines}%, transparent)`
      const halfX = cellX / 2
      const halfY = cellY / 2
      layers.push(
        `linear-gradient(to right, ${line} 1px, transparent 1px)`,
        `linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
      )
      positions.push(`${halfX}px ${halfY}px`, `${halfX}px ${halfY}px`)
    }

    return {
      maskImage: mask,
      WebkitMaskImage: mask,
      backgroundImage: layers.join(', '),
      backgroundPosition: positions.join(', '),
      backgroundSize: `${cellX}px ${cellY}px`,
    }
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

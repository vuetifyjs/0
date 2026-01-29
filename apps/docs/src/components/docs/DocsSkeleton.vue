<script setup lang="ts">
  /**
   * Reusable loading skeleton component.
   * Renders animated placeholder bars for loading states.
   */
  withDefaults(defineProps<{
    /** Number of skeleton lines to render */
    lines?: number
    /** Height class (e.g., 'h-4', 'h-6') */
    height?: string
    /** Width pattern for lines (cycles through if fewer than lines) */
    widths?: string[]
    /** Gap between lines */
    gap?: string
    /** Disable animation */
    static?: boolean
    /** Layout direction */
    direction?: 'row' | 'col'
  }>(), {
    lines: 3,
    height: 'h-4',
    widths: () => ['w-full'],
    gap: 'gap-2',
    static: false,
    direction: 'col',
  })
</script>

<template>
  <div class="flex" :class="[direction === 'row' ? 'flex-row' : 'flex-col', gap]" role="status">
    <span class="sr-only">Loading...</span>
    <div
      v-for="i in lines"
      :key="i"
      aria-hidden="true"
      class="bg-surface-tint rounded"
      :class="[
        height,
        widths[(i - 1) % widths.length],
        !static && 'animate-pulse',
      ]"
    />
  </div>
</template>

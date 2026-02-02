<script setup lang="ts">
  /**
   * Simple progress bar component with percentage label.
   */
  withDefaults(defineProps<{
    /** Progress value (0-100) */
    value: number
    /** Color variant */
    color?: 'primary' | 'success' | 'warning' | 'error'
    /** Show percentage label */
    showLabel?: boolean
    /** Size variant */
    size?: 'sm' | 'md'
  }>(), {
    color: 'primary',
    showLabel: true,
    size: 'sm',
  })
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      aria-valuemax="100"
      aria-valuemin="0"
      :aria-valuenow="Math.round(value)"
      class="flex-1 bg-surface-tint rounded-full overflow-hidden"
      :class="size === 'sm' ? 'h-2' : 'h-3'"
      role="progressbar"
    >
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="`bg-${color}`"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
    <span
      v-if="showLabel"
      class="text-xs font-medium tabular-nums w-12 text-right"
    >
      {{ Math.round(value) }}%
    </span>
  </div>
</template>

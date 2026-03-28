<script setup lang="ts">
  /**
   * Thin wrapper around HxProgressBar that adds a percentage label.
   */
  const {
    value,
    color = 'primary',
    showLabel = true,
    size = 'sm',
  } = defineProps<{
    /** Progress value (0-100) */
    value: number
    /** Color variant */
    color?: 'primary' | 'success' | 'warning' | 'error'
    /** Show percentage label */
    showLabel?: boolean
    /** Size variant */
    size?: 'sm' | 'md'
  }>()
</script>

<template>
  <HxProgressBar :color :size :value>
    <span
      v-if="showLabel"
      class="text-xs font-medium tabular-nums w-12 text-right"
    >
      {{ Math.round(value) }}%
    </span>
  </HxProgressBar>
</template>

<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmProgressSize = 'sm' | 'md'

  export interface EmProgressProps extends V0PaperProps {
    value?: number
    min?: number
    max?: number
    size?: EmProgressSize
    indeterminate?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmProgress' })

  const {
    value = 0,
    min = 0,
    max = 100,
    size = 'sm',
    indeterminate = false,
    ...paperProps
  } = defineProps<EmProgressProps>()

  const percent = toRef(() => {
    const span = max - min
    if (span <= 0) return 0
    return Math.min(100, Math.max(0, ((value - min) / span) * 100))
  })

  const style = toRef(() => ({
    '--emerald-progress-percent': `${percent.value}%`,
  } as Record<string, string>))
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-valuemax="max"
    :aria-valuemin="min"
    :aria-valuenow="indeterminate ? undefined : value"
    as="div"
    class="emerald-progress"
    :data-indeterminate="indeterminate || undefined"
    :data-size="size"
    role="progressbar"
    :style
  >
    <slot :percent :value />
  </V0Paper>
</template>

<style>
.emerald-progress {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 205px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  flex-wrap: nowrap;
}
</style>

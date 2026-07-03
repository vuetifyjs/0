<script setup lang="ts">
  import { toRef } from 'vue'
  import type { Widget } from './useDashboard'

  const { widgets, columns } = defineProps<{
    widgets: Widget[]
    columns: number
  }>()

  // Translate the derived column count into a static UnoCSS grid class
  const grid = toRef(() => ({
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] ?? 'grid-cols-1'))
</script>

<template>
  <div class="grid gap-3 transition-all" :class="grid">
    <div
      v-for="widget in widgets"
      :key="widget.id"
      class="flex flex-col gap-1 p-4 rounded-lg border border-divider bg-surface"
    >
      <span class="text-xs font-medium text-on-surface-variant">{{ widget.title }}</span>
      <span class="text-2xl font-semibold text-on-surface tabular-nums">{{ widget.metric }}</span>
      <span class="text-xs text-on-surface-variant">{{ widget.detail }}</span>
    </div>
  </div>
</template>

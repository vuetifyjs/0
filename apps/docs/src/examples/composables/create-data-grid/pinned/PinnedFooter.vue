<script setup lang="ts">
  import { mdiPin } from '@mdi/js'

  const { visibleCount, total, summary } = defineProps<{
    visibleCount: number
    total: number
    summary: { left: number, scrollable: number, right: number }
  }>()
</script>

<template>
  <div class="flex items-center gap-3 text-xs text-on-surface-variant">
    <span class="tabular-nums">{{ visibleCount }} of {{ total }} stocks</span>

    <span class="text-divider">·</span>

    <span class="flex items-center gap-1">
      <svg class="w-3 h-3" viewBox="0 0 24 24">
        <path :d="mdiPin" fill="currentColor" />
      </svg>

      <span class="tabular-nums">{{ summary.left }} left</span>
      <span>·</span>
      <span class="tabular-nums">{{ summary.scrollable }} scrollable</span>
      <span>·</span>
      <span class="tabular-nums">{{ summary.right }} right</span>
    </span>

    <span class="text-divider">·</span>

    <span>Hover headers to pin, drag handles to resize</span>
  </div>
</template>

<script setup lang="ts">
  const {
    lines = 3,
    height = 'h-4',
    widths = ['w-full'],
    gap = 'gap-2',
    static: isStatic = false,
    direction = 'col',
  } = defineProps<{
    lines?: number
    height?: string
    widths?: string[]
    gap?: string
    static?: boolean
    direction?: 'row' | 'col'
  }>()
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
        !isStatic && 'animate-pulse',
      ]"
    />
  </div>
</template>

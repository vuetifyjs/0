<script setup lang="ts">
  // Types
  import type { Level } from '@/composables/useLevelFilter'

  defineProps<{
    level: Level
    active: boolean
  }>()

  const labels: Record<Level, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
  const colors: Record<Level, string> = {
    1: 'bg-success/20 text-success',
    2: 'bg-info/20 text-info',
    3: 'bg-warning/20 text-warning',
  }
</script>

<template>
  <button
    class="px-2 py-0.5 rounded-full text-xs font-medium transition-opacity cursor-pointer"
    :class="[
      colors[level],
      active ? 'opacity-100 ring-1 ring-current' : 'opacity-50 hover:opacity-75',
    ]"
    type="button"
  >
    {{ labels[level] }}
  </button>
</template>

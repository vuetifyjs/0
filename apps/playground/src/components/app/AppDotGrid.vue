<script setup lang="ts">
  // Framework
  import { GnDotGrid, type GnDotGridProps } from '@paper/genesis'

  // Thin playground adapter for GnDotGrid (same name as docs so auto-import matches).
  const {
    color = 'var(--v0-on-surface, currentColor)',
    coverage = 15,
    density = 20,
    lines = 0,
    origin = 'bottom left',
  } = defineProps<GnDotGridProps>()
</script>

<template>
  <GnDotGrid
    :color
    :coverage
    :density
    :lines
    :origin
  />
</template>

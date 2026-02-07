<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  const {
    coverage = 15,
    density = 24,
    origin = 'bottom left',
  } = defineProps<{
    coverage?: number
    density?: number
    origin?: string
  }>()

  const maskStyle = computed(() => {
    const fadeEnd = coverage + 20
    const gradient = `radial-gradient(ellipse at ${origin}, transparent 0%, transparent ${coverage}%, black ${fadeEnd}%)`
    return {
      maskImage: gradient,
      WebkitMaskImage: gradient,
      backgroundSize: `${density}px ${density}px`,
    }
  })
</script>

<template>
  <div
    aria-hidden="true"
    class="app-dot-grid absolute inset-0 pointer-events-none z-0"
    :style="maskStyle"
  />
</template>

<style scoped>
  .app-dot-grid {
    background:
      radial-gradient(circle, color-mix(in srgb, var(--v0-on-background) 10%, transparent) 1px, transparent 1px);
  }
</style>

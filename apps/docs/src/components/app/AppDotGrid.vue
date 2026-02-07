<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    /** Where the visible region ends and fade begins (%). Default: 15 */
    coverage?: number
    /** Gap between dots in pixels. Default: 24 */
    density?: number
  }>(), {
    coverage: 15,
    density: 24,
  })

  const maskStyle = computed(() => {
    const fadeEnd = props.coverage + 20
    const gradient = `radial-gradient(ellipse at bottom left, transparent 0%, transparent ${props.coverage}%, black ${fadeEnd}%)`
    return {
      maskImage: gradient,
      WebkitMaskImage: gradient,
      backgroundSize: `${props.density}px ${props.density}px`,
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

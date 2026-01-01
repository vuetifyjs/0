<script setup lang="ts">
  // Framework
  import { useMediaQuery, usePrefersDark, usePrefersReducedMotion } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  // Static query
  const { matches: isLandscape } = useMediaQuery('(orientation: landscape)')

  // Dynamic query with reactive threshold
  const minWidth = shallowRef(768)
  const { matches: isWide } = useMediaQuery(() => `(min-width: ${minWidth.value}px)`)

  // Convenience composables
  const { matches: prefersDark } = usePrefersDark()
  const { matches: prefersReducedMotion } = usePrefersReducedMotion()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="isLandscape ? 'bg-success' : 'bg-error'"
      />
      <span>Landscape orientation: <strong>{{ isLandscape }}</strong></span>
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="isWide ? 'bg-success' : 'bg-error'"
      />
      <span>Width >= {{ minWidth }}px: <strong>{{ isWide }}</strong></span>
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="prefersDark ? 'bg-success' : 'bg-error'"
      />
      <span>Prefers dark mode: <strong>{{ prefersDark }}</strong></span>
    </div>

    <div class="flex items-center gap-3">
      <span
        class="w-3 h-3 rounded-full"
        :class="prefersReducedMotion ? 'bg-success' : 'bg-error'"
      />
      <span>Prefers reduced motion: <strong>{{ prefersReducedMotion }}</strong></span>
    </div>

    <div class="flex items-center gap-4 mt-4 pt-4 border-t border-divider">
      <label class="text-sm">Min width threshold:</label>
      <input
        v-model.number="minWidth"
        class="flex-1"
        max="1920"
        min="320"
        step="10"
        type="range"
      >
      <span class="w-16 text-right font-mono text-sm">{{ minWidth }}px</span>
    </div>
  </div>
</template>

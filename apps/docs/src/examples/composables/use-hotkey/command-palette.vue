<script setup lang="ts">
  import { provide } from 'vue'

  import CommandPalette from './CommandPalette.vue'
  import { PALETTE_KEY, useCommandPalette } from './useCommandPalette'

  const palette = useCommandPalette()

  provide(PALETTE_KEY, palette)
</script>

<template>
  <div class="space-y-4 text-center">
    <CommandPalette />

    <p class="h-5 text-sm text-on-surface-variant">
      <template v-if="palette.lastAction.value">
        Last action: <span class="text-primary font-medium">{{ palette.lastAction.value }}</span>
      </template>
    </p>

    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
      <span class="flex items-center gap-1">
        Open
        <kbd class="px-1.5 py-0.5 font-mono bg-surface-variant rounded">{{ palette.modKey }}+J</kbd>
      </span>

      <span class="flex items-center gap-1">
        Home
        <kbd class="px-1.5 py-0.5 font-mono bg-surface-variant rounded">G</kbd>
        then
        <kbd class="px-1.5 py-0.5 font-mono bg-surface-variant rounded">H</kbd>
      </span>

      <span class="flex items-center gap-1">
        Search
        <kbd class="px-1.5 py-0.5 font-mono bg-surface-variant rounded">G</kbd>
        then
        <kbd class="px-1.5 py-0.5 font-mono bg-surface-variant rounded">S</kbd>
      </span>
    </div>
  </div>
</template>

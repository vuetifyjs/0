<script setup lang="ts">
  // Composables
  import { useSearch } from '@/composables/useSearch'

  const { open } = useSearch()
</script>

<template>
  <button
    aria-label="Search (Ctrl+K)"
    class="inline-flex items-center gap-1.5 bg-glass-surface rounded-full border border-divider pl-1.5 pr-1.5 py-1.5 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none transition-colors"
    title="Search (Ctrl+K)"
    type="button"
    @click="open"
  >
    <span class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
      <AppIcon icon="search" size="12" />
    </span>
    <span class="text-sm text-on-surface-variant">Search the docs...</span>
    <kbd class="shrink-0 px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-[10px] font-mono inline-flex items-center rounded-r-lg">Ctrl+K</kbd>
  </button>
</template>

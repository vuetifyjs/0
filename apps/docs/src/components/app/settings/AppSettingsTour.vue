<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  const discovery = useDiscovery()

  function startTour () {
    discovery.start('docs-intro')
  }
</script>

<template>
  <div class="border-b border-divider pb-4">
    <button
      class="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-variant/30 hover:bg-surface-variant transition-colors text-on-surface"
      type="button"
      @click="startTour"
    >
      <AppIcon class="text-primary" icon="compass" size="20" />

      <div class="flex-1 text-left">
        <div class="text-sm font-medium">Take the tour</div>

        <div class="text-xs text-on-surface-variant">Learn how to use the docs</div>
      </div>

      <AppIcon class="text-on-surface-variant" icon="arrow-right" size="16" />
    </button>
  </div>
</template>

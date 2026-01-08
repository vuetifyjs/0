<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { toggle } = useSettings()
</script>

<template>
  <button
    aria-label="Open settings"
    class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
    title="Settings"
    type="button"
    @click="toggle"
  >
    <AppIcon icon="cog" />
  </button>
</template>

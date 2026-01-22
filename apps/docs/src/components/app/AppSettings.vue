<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { toggle } = useSettings()

  let preloaded = false
  function preload () {
    if (preloaded) return
    preloaded = true
    import('@/components/app/AppSettingsSheet.vue')
  }
</script>

<template>
  <Discovery.Activator class="rounded-lg" step="open-settings">
    <button
      aria-label="Open settings"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      title="Settings"
      type="button"
      @click="toggle"
      @focus="preload"
      @mouseenter="preload"
    >
      <AppIcon icon="cog" />
    </button>
  </Discovery.Activator>
</template>

<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  const settings = useSettings()

  let preloaded = false
  function preload () {
    if (preloaded) return
    preloaded = true
    import('@/components/app/AppSettingsSheet.vue')
  }
</script>

<template>
  <Tooltip.Root :close-delay="100" :open-delay="500">
    <Tooltip.Activator
      aria-label="Open settings"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      type="button"
      @click="settings.toggle"
      @focus="preload"
      @mouseenter="preload"
    >
      <AppIcon icon="cog" />
    </Tooltip.Activator>

    <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
      Settings
    </Tooltip.Content>
  </Tooltip.Root>
</template>

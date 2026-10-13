<script setup lang="ts">
  // Stores
  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()

  function onSave () {
    store.savePluginConfig('useHydration', {})
  }
</script>

<template>
  <PluginConfigShell plugin-id="useHydration" @save="onSave">
    <template #description>
      <div class="space-y-4 mb-8">
        <p class="text-on-surface-variant">
          Hydration tracks whether the app is running on the server or in the browser.
          It enables SSR/SSG by deferring browser-only APIs until after mount.
        </p>

        <p class="text-on-surface-variant text-sm">
          No configuration needed — installing the plugin is the whole feature.
        </p>
      </div>
    </template>
  </PluginConfigShell>
</template>

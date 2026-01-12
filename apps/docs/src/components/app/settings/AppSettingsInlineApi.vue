<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { showInlineApi } = useSettings()
</script>

<template>
  <section>
    <AppSettingsHeader icon="beaker" title="API Reference" />
    <AppSettingsToggle
      v-model="showInlineApi"
      description="Display API details inline instead of links"
      label="Show inline"
    />
  </section>
</template>

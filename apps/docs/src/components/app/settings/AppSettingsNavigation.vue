<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { collapsibleNav } = useSettings()
</script>

<template>
  <section>
    <AppSettingsHeader icon="menu" title="Navigation" />
    <AppSettingsToggle
      v-model="collapsibleNav"
      label="Collapsible sections"
    />
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Group navigation items into expandable sections
    </p>
  </section>
</template>

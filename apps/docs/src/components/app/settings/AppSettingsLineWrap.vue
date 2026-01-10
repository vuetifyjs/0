<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { lineWrap } = useSettings()
</script>

<template>
  <section>
    <AppSettingsHeader icon="markdown" title="Code Examples" />
    <AppSettingsToggle
      v-model="lineWrap"
      description="Wrap long lines in code blocks"
      label="Line wrapping"
    />
  </section>
</template>

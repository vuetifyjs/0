<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'vuetify0',
  )
</script>

<template>
  <AppThemeButton
    icon="vuetify-0"
    label="Vuetify0"
    :pressed
    @click="toggle.setPalette('vuetify0')"
  />
</template>

<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() => toggle.preference.value === 'high-contrast')
</script>

<template>
  <AppThemeButton
    icon="theme-high-contrast"
    label="High Contrast"
    :pressed
    @click="toggle.setPreference('high-contrast')"
  />
</template>

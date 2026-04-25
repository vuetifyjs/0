<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() => toggle.preference.value === 'high-contrast')
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-high-contrast"
    label="High Contrast"
    @click="toggle.setPreference('high-contrast')"
  />
</template>

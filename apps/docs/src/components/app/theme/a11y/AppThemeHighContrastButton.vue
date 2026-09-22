<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
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

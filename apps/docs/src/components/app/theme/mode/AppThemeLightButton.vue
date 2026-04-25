<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'light',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-light"
    label="Light"
    @click="toggle.setMode('light')"
  />
</template>

<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'light',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-light"
    label="Light"
    :pressed
    @click="toggle.setMode('light')"
  />
</template>

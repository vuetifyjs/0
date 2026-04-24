<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'dark',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-dark"
    label="Dark"
    :pressed
    @click="toggle.setMode('dark')"
  />
</template>

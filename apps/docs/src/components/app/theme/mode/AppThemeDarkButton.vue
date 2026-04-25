<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'dark',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-dark"
    label="Dark"
    @click="toggle.setMode('dark')"
  />
</template>

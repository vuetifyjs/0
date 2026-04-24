<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'system',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-system"
    label="System"
    :pressed
    @click="toggle.setMode('system')"
  />
</template>

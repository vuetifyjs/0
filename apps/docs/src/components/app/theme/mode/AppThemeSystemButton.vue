<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.mode.value === 'system',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-system"
    label="System"
    @click="toggle.setMode('system')"
  />
</template>

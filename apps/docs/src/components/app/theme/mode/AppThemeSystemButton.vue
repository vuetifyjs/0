<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
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

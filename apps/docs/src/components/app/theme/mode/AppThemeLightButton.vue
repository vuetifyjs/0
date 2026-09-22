<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.mode.value === 'light',
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

<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.mode.value === 'dark',
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

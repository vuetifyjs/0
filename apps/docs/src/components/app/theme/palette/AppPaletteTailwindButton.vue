<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'tailwind',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-tailwind"
    justify="start"
    label="Tailwind"
    @click="toggle.setPalette('tailwind')"
  />
</template>

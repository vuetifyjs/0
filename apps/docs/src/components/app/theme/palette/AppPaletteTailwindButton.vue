<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'tailwind',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-tailwind"
    label="Tailwind"
    :pressed
    @click="toggle.setPalette('tailwind')"
  />
</template>

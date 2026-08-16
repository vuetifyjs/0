<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'tailwind',
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

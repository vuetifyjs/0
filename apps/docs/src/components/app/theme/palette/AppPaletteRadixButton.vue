<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'radix',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-radix"
    justify="start"
    label="Radix"
    :pressed
    @click="toggle.setPalette('radix')"
  />
</template>

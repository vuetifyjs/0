<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'radix',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-radix"
    justify="start"
    label="Radix"
    @click="toggle.setPalette('radix')"
  />
</template>

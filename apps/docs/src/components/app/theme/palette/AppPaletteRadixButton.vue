<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
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

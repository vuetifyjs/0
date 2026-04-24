<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'material-3',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-material-3"
    label="Material"
    :pressed
    @click="toggle.setPalette('material-3')"
  />
</template>

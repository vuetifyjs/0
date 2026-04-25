<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'material-3',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-material-3"
    justify="start"
    label="Material"
    @click="toggle.setPalette('material-3')"
  />
</template>

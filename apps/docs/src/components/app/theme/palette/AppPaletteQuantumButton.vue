<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'quantum',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-quantum"
    justify="start"
    label="Quantum"
    @click="toggle.setPalette('quantum')"
  />
</template>

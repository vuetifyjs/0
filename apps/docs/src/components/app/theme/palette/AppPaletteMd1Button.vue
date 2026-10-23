<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'md1',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-md1"
    justify="start"
    label="MD1"
    @click="toggle.setPalette('md1')"
  />
</template>

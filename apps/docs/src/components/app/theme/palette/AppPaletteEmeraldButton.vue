<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'emerald',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-emerald"
    justify="start"
    label="Emerald"
    @click="toggle.setPalette('emerald')"
  />
</template>

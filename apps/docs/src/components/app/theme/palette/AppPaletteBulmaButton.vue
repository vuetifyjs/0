<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'bulma',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-bulma"
    justify="start"
    label="Bulma"
    @click="toggle.setPalette('bulma')"
  />
</template>

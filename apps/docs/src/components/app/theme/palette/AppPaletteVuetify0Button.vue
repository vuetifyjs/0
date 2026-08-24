<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'vuetify0',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="vuetify-0"
    justify="start"
    label="Vuetify0"
    @click="toggle.setPalette('vuetify0')"
  />
</template>

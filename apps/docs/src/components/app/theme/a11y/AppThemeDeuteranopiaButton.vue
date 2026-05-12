<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Themes
  import { themes } from '@/themes'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() => toggle.preference.value === 'deuteranopia')
</script>

<template>
  <AppThemeSwatchButton
    :active
    :color="themes.deuteranopia.colors.primary"
    icon="theme-deuteranopia"
    label="Deuteranopia"
    :on-color="themes.deuteranopia.colors['on-primary']"
    @click="toggle.setPreference('deuteranopia')"
  />
</template>

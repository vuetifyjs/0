<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  // Themes
  import { themes } from '@/themes'

  const toggle = useThemeToggle()
  const pressed = toRef(() => toggle.preference.value === 'deuteranopia')
</script>

<template>
  <AppThemeSwatchButton
    :color="themes.deuteranopia.colors.primary"
    icon="theme-deuteranopia"
    label="Deuteranopia"
    :on-color="themes.deuteranopia.colors['on-primary']"
    :pressed
    @click="toggle.setPreference('deuteranopia')"
  />
</template>

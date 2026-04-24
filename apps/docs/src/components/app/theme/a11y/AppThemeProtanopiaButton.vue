<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  // Themes
  import { themes } from '@/themes'

  const toggle = useThemeToggle()
  const pressed = toRef(() => toggle.preference.value === 'protanopia')
</script>

<template>
  <AppThemeSwatchButton
    :color="themes.protanopia.colors.primary"
    icon="theme-protanopia"
    label="Protanopia"
    :on-color="themes.protanopia.colors['on-primary']"
    :pressed
    @click="toggle.setPreference('protanopia')"
  />
</template>

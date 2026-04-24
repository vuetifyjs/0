<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  // Themes
  import { themes } from '@/themes'

  const toggle = useThemeToggle()
  const pressed = toRef(() => toggle.preference.value === 'tritanopia')
</script>

<template>
  <AppThemeSwatchButton
    :color="themes.tritanopia.colors.primary"
    icon="theme-tritanopia"
    label="Tritanopia"
    :on-color="themes.tritanopia.colors['on-primary']"
    :pressed
    @click="toggle.setPreference('tritanopia')"
  />
</template>

<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Themes
  import { themes } from '@/themes'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() => toggle.preference.value === 'tritanopia')
</script>

<template>
  <AppThemeSwatchButton
    :active
    :color="themes.tritanopia.colors.primary"
    icon="theme-tritanopia"
    label="Tritanopia"
    :on-color="themes.tritanopia.colors['on-primary']"
    @click="toggle.setPreference('tritanopia')"
  />
</template>

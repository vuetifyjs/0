<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Themes
  import { themes } from '@/themes'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() => toggle.preference.value === 'protanopia')
</script>

<template>
  <AppThemeSwatchButton
    :active
    :color="themes.protanopia.colors.primary"
    icon="theme-protanopia"
    label="Protanopia"
    :on-color="themes.protanopia.colors['on-primary']"
    @click="toggle.setPreference('protanopia')"
  />
</template>

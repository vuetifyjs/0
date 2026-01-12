<script setup lang="ts">
  // Composables
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Types
  import type { SingleSelectOption } from './AppSettingsSingleSelect.vue'

  const { preference: themePreference } = useThemeToggle()

  const themeOptions: SingleSelectOption<ThemePreference>[] = [
    { id: 'system', value: 'system', label: 'System', icon: 'theme-system' },
    { id: 'light', value: 'light', label: 'Light', icon: 'theme-light' },
    { id: 'dark', value: 'dark', label: 'Dark', icon: 'theme-dark' },
    { id: 'high-contrast', value: 'high-contrast', label: 'High Contrast', icon: 'theme-high-contrast' },
  ]
</script>

<template>
  <section>
    <AppSettingsHeader icon="theme-settings" title="Theme" />
    <AppSettingsSingleSelect
      v-model="themePreference"
      aria-label="Theme"
      :columns="2"
      :options="themeOptions"
    />
  </section>
</template>

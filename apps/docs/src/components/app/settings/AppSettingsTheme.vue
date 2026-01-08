<script setup lang="ts">
  // Framework
  import { createSingle } from '@vuetify/v0'

  // Composables
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { watch } from 'vue'

  const { preference: themePreference } = useThemeToggle()

  const themeOptions = [
    { id: 'system', value: 'system' as ThemePreference, label: 'System', icon: 'theme-system' },
    { id: 'light', value: 'light' as ThemePreference, label: 'Light', icon: 'theme-light' },
    { id: 'dark', value: 'dark' as ThemePreference, label: 'Dark', icon: 'theme-dark' },
    { id: 'high-contrast', value: 'high-contrast' as ThemePreference, label: 'High Contrast', icon: 'theme-high-contrast' },
  ]

  const themeSingle = createSingle({ mandatory: true })
  themeSingle.onboard(themeOptions)
  themeSingle.select(themePreference.value)

  watch(() => themeSingle.selectedValue.value, val => {
    if (val) themePreference.value = val as ThemePreference
  })
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="theme-system" size="16" />
      <span>Theme</span>
    </h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="option in themeOptions"
        :key="option.id"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm',
          themeSingle.selectedId.value === option.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-divider hover:border-primary/50 text-on-surface',
        ]"
        type="button"
        @click="themeSingle.select(option.id)"
      >
        <AppIcon :icon="option.icon" size="16" />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </section>
</template>

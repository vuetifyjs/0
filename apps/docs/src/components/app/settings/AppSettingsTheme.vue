<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { computed } from 'vue'

  // Themes
  import { exportThemeAsVuetifyConfig, type ThemeId } from '@/themes'

  const { preference, setPreference, theme } = useThemeToggle()
  const { copied, copy } = useClipboard()

  // Current active theme (resolves 'system' to actual theme)
  const currentThemeId = computed<ThemeId>(() => theme.selectedId.value as ThemeId)

  function exportTheme () {
    const config = exportThemeAsVuetifyConfig(currentThemeId.value)
    copy(config)
  }

  interface ThemeOption {
    id: ThemePreference
    label: string
    icon: string
    theme?: ThemeId
  }

  const modeOptions: ThemeOption[] = [
    { id: 'system', label: 'System', icon: 'theme-system' },
    { id: 'light', label: 'Light', icon: 'theme-light', theme: 'light' },
    { id: 'dark', label: 'Dark', icon: 'theme-dark', theme: 'dark' },
  ]

  const accessibilityOptions: ThemeOption[] = [
    { id: 'high-contrast', label: 'High Contrast', icon: 'theme-high-contrast', theme: 'high-contrast' },
  ]

  const vuetifyOptions: ThemeOption[] = [
    { id: 'blackguard', label: 'Blackguard', icon: 'theme-blackguard', theme: 'blackguard' },
    { id: 'polaris', label: 'Polaris', icon: 'theme-polaris', theme: 'polaris' },
    { id: 'nebula', label: 'Nebula', icon: 'theme-nebula', theme: 'nebula' },
    { id: 'odyssey', label: 'Odyssey', icon: 'theme-odyssey', theme: 'odyssey' },
  ]
</script>

<template>
  <section class="space-y-4">
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="theme-settings" size="16" />
      <span>Theme</span>
      <button
        class="ml-auto p-1 rounded hover:bg-surface-tint transition-colors inline-flex items-center justify-center shrink-0"
        title="Copy current theme as Vuetify config"
        type="button"
        @click="exportTheme"
      >
        <AppIcon :icon="copied ? 'check-circle' : 'copy'" size="14" />
      </button>
    </h3>

    <!-- Mode -->
    <div>
      <div class="text-xs font-medium text-on-surface-variant mb-2">Mode</div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="option in modeOptions"
          :key="option.id"
          :aria-pressed="preference === option.id"
          :class="[
            'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
            preference === option.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-divider hover:border-primary/50 text-on-surface',
          ]"
          type="button"
          @click="setPreference(option.id)"
        >
          <AppIcon :icon="option.icon" size="16" />
          <span>{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Accessibility -->
    <div>
      <div class="text-xs font-medium text-on-surface-variant mb-2">Accessibility</div>
      <button
        v-for="option in accessibilityOptions"
        :key="option.id"
        :aria-pressed="preference === option.id"
        :class="[
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
          preference === option.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-divider hover:border-primary/50 text-on-surface',
        ]"
        type="button"
        @click="setPreference(option.id)"
      >
        <AppIcon :icon="option.icon" size="16" />
        <span>{{ option.label }}</span>
      </button>
    </div>

    <!-- Vuetify Themes -->
    <div>
      <div class="text-xs font-medium text-on-surface-variant mb-2">Vuetify Themes</div>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="option in vuetifyOptions"
          :key="option.id"
          :aria-pressed="preference === option.id"
          :class="[
            'flex flex-col items-start gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors',
            preference === option.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-divider hover:border-primary/50 text-on-surface',
          ]"
          type="button"
          @click="setPreference(option.id)"
        >
          <div class="flex items-center gap-2">
            <AppIcon :icon="option.icon" size="16" />
            <span class="font-medium">{{ option.label }}</span>
          </div>
          <AppThemePreview v-if="option.theme" :theme="option.theme" />
        </button>
      </div>
    </div>

  </section>
</template>

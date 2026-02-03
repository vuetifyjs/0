<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Composables
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { ref } from 'vue'

  // Types
  // Themes
  import type { ThemeId } from '@/themes'

  const toggle = useThemeToggle()

  const isOpen = ref(false)

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
    { id: 'protanopia', label: 'Protanopia', icon: 'theme-protanopia', theme: 'protanopia' },
    { id: 'deuteranopia', label: 'Deuteranopia', icon: 'theme-deuteranopia', theme: 'deuteranopia' },
    { id: 'tritanopia', label: 'Tritanopia', icon: 'theme-tritanopia', theme: 'tritanopia' },
  ]

  const vuetifyOptions: ThemeOption[] = [
    { id: 'blackguard', label: 'Blackguard', icon: 'theme-blackguard', theme: 'blackguard' },
    { id: 'polaris', label: 'Polaris', icon: 'theme-polaris', theme: 'polaris' },
    { id: 'nebula', label: 'Nebula', icon: 'theme-nebula', theme: 'nebula' },
    { id: 'odyssey', label: 'Odyssey', icon: 'theme-odyssey', theme: 'odyssey' },
  ]

  function selectTheme (id: ThemePreference) {
    toggle.setPreference(id)
  }
</script>

<template>
  <Popover.Root v-model="isOpen">
    <Popover.Activator
      aria-label="Select theme"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer"
      :title="toggle.title.value"
    >
      <AppIcon :icon="toggle.icon.value" />
    </Popover.Activator>

    <Popover.Content
      class="p-3 rounded-lg bg-surface border border-divider shadow-xl min-w-56 !mt-1"
      position-area="bottom span-left"
      position-try="bottom span-left, bottom span-right, top span-left, top span-right"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3 ps-1">
        <span class="text-xs font-semibold text-on-surface">Theme</span>
        <AppCloseButton size="sm" @click="isOpen = false" />
      </div>

      <!-- Mode -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Mode</div>
        <div class="flex gap-1">
          <button
            v-for="option in modeOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              toggle.preference.value === option.id
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="selectTheme(option.id)"
          >
            <AppIcon :icon="option.icon" size="14" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Accessibility -->
      <div class="mb-3">
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Accessibility</div>
        <div class="grid grid-cols-2 gap-1">
          <button
            v-for="option in accessibilityOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex flex-col items-start gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              toggle.preference.value === option.id
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="selectTheme(option.id)"
          >
            <div class="flex items-center gap-1.5">
              <AppIcon :icon="option.icon" size="14" />
              <span>{{ option.label }}</span>
            </div>
            <AppThemePreview v-if="option.theme" :theme="option.theme" />
          </button>
        </div>
      </div>

      <!-- Vuetify Themes -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2 px-1">Vuetify</div>
        <div class="grid grid-cols-2 gap-1">
          <button
            v-for="option in vuetifyOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex flex-col items-start gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-colors',
              toggle.preference.value === option.id
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-tint text-on-surface',
            ]"
            type="button"
            @click="selectTheme(option.id)"
          >
            <div class="flex items-center gap-1.5">
              <AppIcon :icon="option.icon" size="14" />
              <span>{{ option.label }}</span>
            </div>
            <AppThemePreview v-if="option.theme" :theme="option.theme" />
          </button>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>

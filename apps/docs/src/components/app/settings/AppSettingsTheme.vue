<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useCustomThemes, type CustomTheme } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { computed, shallowRef } from 'vue'

  // Themes
  import { exportThemeAsVuetifyConfig, themes, type ThemeDefinition, type ThemeId } from '@/themes'

  const toggle = useThemeToggle()
  const themes_ = useCustomThemes()
  const clipboard = useClipboard()
  const settings = useSettings()

  // Editor state
  const editingTheme = shallowRef<ThemeDefinition | null>(null)
  const previousPreference = shallowRef<ThemePreference>('system')

  // Current active theme (resolves 'system' to actual theme)
  const currentThemeId = computed<ThemeId>(() => toggle.theme.selectedId.value as ThemeId)

  function exportTheme () {
    const config = exportThemeAsVuetifyConfig(currentThemeId.value)
    clipboard.copy(config)
  }

  interface ThemeOption {
    id: ThemePreference
    label: string
    icon: string
    theme?: ThemeId
    custom?: boolean
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

  // Custom themes as options
  const customOptions = computed<ThemeOption[]>(() =>
    themes_.customThemes.value.map(t => ({
      id: t.id as ThemePreference,
      label: t.label,
      icon: t.icon,
      theme: t.id as ThemeId,
      custom: true,
    })),
  )

  // Editor actions
  function startCreate () {
    const current = themes_.current()
    previousPreference.value = toggle.preference.value
    themes_.editing.value = true
    editingTheme.value = {
      id: '',
      label: 'My Theme',
      icon: 'theme-custom',
      dark: current?.dark ?? false,
      colors: { ...(current?.colors ?? themes.light.colors) },
    }
  }

  function startEdit (themeId: string) {
    const custom = themes_.customThemes.value.find(t => t.id === themeId)
    if (custom) {
      previousPreference.value = toggle.preference.value
      themes_.editing.value = true
      editingTheme.value = { ...custom }
    }
  }

  function handleSave (themeData: CustomTheme) {
    // Clear inline preview styles before applying saved theme
    themes_.clearPreview()

    if (themeData.id && themes_.customThemes.value.some(t => t.id === themeData.id)) {
      // Update existing
      themes_.update(themeData.id, {
        label: themeData.label,
        dark: themeData.dark,
        colors: themeData.colors,
      })
      // Select the updated theme
      toggle.setPreference(themeData.id as ThemePreference)
    } else {
      // Create new
      const newTheme = themes_.create({
        id: '',
        label: themeData.label,
        icon: 'theme-custom',
        dark: themeData.dark,
        colors: themeData.colors,
      })
      // Select the new theme
      toggle.setPreference(newTheme.id as ThemePreference)
    }
    themes_.editing.value = false
    editingTheme.value = null
  }

  function handleCancel () {
    // Clear inline preview styles and restore previous theme
    themes_.clearPreview()
    toggle.setPreference(previousPreference.value)
    themes_.editing.value = false
    editingTheme.value = null
  }

  function handleDelete (id: string) {
    // Clear inline preview styles
    themes_.clearPreview()
    themes_.remove(id)
    // Switch to previous theme or system
    toggle.setPreference(previousPreference.value === id ? 'system' : previousPreference.value)
    themes_.editing.value = false
    editingTheme.value = null
  }
</script>

<template>
  <section class="space-y-4">
    <!-- Editor Mode -->
    <AppSettingsThemeEditor
      v-if="editingTheme"
      :theme="editingTheme"
      @cancel="handleCancel"
      @delete="handleDelete"
      @save="handleSave"
    />

    <!-- Selector Mode -->
    <template v-else>
      <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
        <AppIcon icon="paint" size="16" />
        <span>Theme</span>
        <button
          class="ml-auto p-1 rounded hover:bg-surface-tint transition-colors inline-flex items-center justify-center shrink-0"
          title="Copy theme as Vuetify0 config"
          type="button"
          @click="exportTheme"
        >
          <AppIcon :icon="clipboard.copied.value ? 'check-circle' : 'copy'" size="14" />
        </button>
      </h3>

      <!-- Mode -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2">Mode</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in modeOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
              toggle.preference.value === option.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-divider hover:border-primary/50 text-on-surface',
            ]"
            type="button"
            @click="toggle.setPreference(option.id)"
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
          :aria-pressed="toggle.preference.value === option.id"
          :class="[
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
            toggle.preference.value === option.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-divider hover:border-primary/50 text-on-surface',
          ]"
          type="button"
          @click="toggle.setPreference(option.id)"
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
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex flex-col items-start gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors',
              toggle.preference.value === option.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-divider hover:border-primary/50 text-on-surface',
            ]"
            type="button"
            @click="toggle.setPreference(option.id)"
          >
            <div class="flex items-center gap-2">
              <AppIcon :icon="option.icon" size="16" />
              <span class="font-medium">{{ option.label }}</span>
            </div>
            <AppThemePreview v-if="option.theme" :theme="option.theme" />
          </button>
        </div>
      </div>

      <!-- Custom Themes -->
      <div v-if="customOptions.length > 0">
        <div class="text-xs font-medium text-on-surface-variant mb-2">Custom Themes</div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="option in customOptions"
            :key="option.id"
            :aria-pressed="toggle.preference.value === option.id"
            :class="[
              'flex flex-col items-start gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors group relative',
              toggle.preference.value === option.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-divider hover:border-primary/50 text-on-surface',
            ]"
            type="button"
            @click="toggle.setPreference(option.id)"
          >
            <div class="flex items-center gap-2 w-full">
              <AppIcon :icon="option.icon" size="16" />
              <span class="font-medium truncate">{{ option.label }}</span>
              <button
                class="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-tint transition-all"
                title="Edit theme"
                type="button"
                @click.stop="startEdit(option.id)"
              >
                <AppIcon icon="edit" size="12" />
              </button>
            </div>
            <AppThemePreview v-if="option.theme" :theme="option.theme" />
          </button>
        </div>
      </div>

      <!-- Background Effects -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2">Background Effects</div>
        <div class="space-y-1">
          <AppSettingsToggle
            v-model="settings.showDotGrid.value"
            description="Decorative dots in the corner"
            label="Dot grid pattern"
          />
          <AppSettingsToggle
            v-model="settings.showMeshTransition.value"
            description="Animate background on scroll"
            label="Mesh transition"
          />
          <AppSettingsToggle
            v-model="settings.showBgGlass.value"
            description="Frosted glass effect on UI surfaces"
            label="Glass surface effect"
          />
        </div>
      </div>

      <!-- Create Theme Button -->
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-divider text-sm text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors"
        type="button"
        @click="startCreate"
      >
        <AppIcon icon="plus" size="16" />
        <span>Create Theme</span>
      </button>
    </template>
  </section>
</template>

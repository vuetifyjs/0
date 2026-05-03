<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Themes
  import { exportThemeAsVuetifyConfig, type ThemeId } from '@/themes'

  // Utilities
  import { computed } from 'vue'

  const toggle = useThemeToggle()
  const customThemes = useCustomThemes()
  const clipboard = useClipboard()
  const settings = useSettings()

  // Current active theme (resolves 'system' to actual theme)
  const currentThemeId = computed<ThemeId>(() => toggle.theme.selectedId.value as ThemeId)

  function exportTheme () {
    const config = exportThemeAsVuetifyConfig(currentThemeId.value)
    clipboard.copy(config)
  }

  const customOptions = computed(() => customThemes.customThemes.value)
</script>

<template>
  <section class="space-y-4">
    <!-- Editor Mode -->
    <AppSettingsThemeEditor
      v-if="customThemes.editor.active.value"
      :theme="customThemes.editor.theme.value"
      @cancel="customThemes.editor.cancel"
      @delete="customThemes.editor.destroy"
      @save="customThemes.editor.save"
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
          <AppThemeSystemButton />
          <AppThemeLightButton />
          <AppThemeDarkButton />
        </div>
      </div>

      <!-- Palettes -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2">Palettes</div>

        <div class="grid grid-cols-2 gap-2">
          <AppPaletteVuetify0Button />
          <AppPaletteTailwindButton />
          <AppPaletteMaterial3Button />
          <AppPaletteRadixButton />
          <AppPaletteAntDesignButton />
        </div>
      </div>

      <!-- Accessibility -->
      <div>
        <div class="text-xs font-medium text-on-surface-variant mb-2">Accessibility</div>

        <div class="flex gap-2">
          <AppThemeHighContrastButton class="flex-1" />
          <AppThemeProtanopiaButton />
          <AppThemeDeuteranopiaButton />
          <AppThemeTritanopiaButton />
        </div>
      </div>

      <!-- Create Theme Button -->
      <button
        class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-divider text-sm text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors"
        type="button"
        @click="customThemes.editor.open"
      >
        <AppIcon icon="plus" size="16" />
        <span>Create Theme</span>
      </button>

      <!-- Custom Themes -->
      <div v-if="customOptions.length > 0">
        <div class="text-xs font-medium text-on-surface-variant mb-2">Custom Themes</div>

        <div class="grid grid-cols-2 gap-2">
          <AppThemeCustomButton
            v-for="option in customOptions"
            :key="option.id"
            editable
            :theme-id="option.id"
            @edit="customThemes.editor.edit"
          />
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
            v-model="settings.showMeshGrid.value"
            description="Colorful gradient background"
            label="Mesh gradient"
          />

          <AppSettingsToggle
            v-if="settings.showMeshGrid.value"
            v-model="settings.showMeshTransition.value"
            class="ml-4"
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

    </template>
  </section>
</template>

<script setup lang="ts">
  // Framework
  import { useFeatures, useStorage } from '@vuetify/v0'

  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useLevelFilterContext } from '@/composables/useLevelFilter'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onUnmounted, useTemplateRef, watch } from 'vue'

  const features = useFeatures()
  const storage = useStorage()
  const { close, reset: resetSettings, hasChanges: settingsHasChanges, lineWrap, showInlineApi, collapsibleNav, showBgGlass } = useSettings()
  const { hasChanges: levelHasChanges, clear: clearLevels } = useLevelFilterContext()

  const hasChanges = computed(() => settingsHasChanges.value || levelHasChanges.value)

  function reset () {
    resetSettings()
    clearLevels()
  }

  const devmode = features.get('devmode')!

  const { isEditing: isEditingTheme, clearPreview } = useCustomThemes()

  onUnmounted(() => {
    if (isEditingTheme.value) {
      clearPreview()
      isEditingTheme.value = false
    }
  })

  const sheetRef = useTemplateRef<HTMLElement | null>('sheet')

  // Close on Escape
  watch(sheetRef, el => {
    if (!el) return
    el.focus()
  })

  watch(() => devmode.isSelected.value, isSelected => {
    storage.set('devmode', isSelected)
  })

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close()
    }
  }
</script>

<template>
  <aside
    ref="sheet"
    aria-labelledby="settings-title"
    aria-modal="true"
    :class="['fixed inset-y-0 right-0 flex flex-col z-50 w-[320px] max-w-full shadow-xl outline-none', showBgGlass ? 'bg-glass-surface' : 'bg-surface']"
    role="dialog"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <!-- Header -->
    <header class="shrink-0 px-4 py-3 border-b border-divider flex items-center justify-between bg-surface">
      <div class="flex items-center gap-2">
        <AppIcon class="text-primary" icon="cog" />
        <span id="settings-title" class="font-medium">Settings</span>
      </div>

      <button
        aria-label="Close settings"
        class="inline-flex p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
        title="Close"
        type="button"
        @click="close"
      >
        <AppIcon icon="close" size="18" />
      </button>
    </header>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <AppSettingsTour v-if="devmode.isSelected.value" />

      <!-- Theme -->
      <AppSettingsTheme />

      <!-- Other settings (hidden when editing theme) -->
      <template v-if="!isEditingTheme">
        <!-- Skill Level -->
        <AppSettingsSkillLevel />

        <!-- Code Examples -->
        <AppSettingsToggleSection
          v-model="lineWrap"
          description="Wrap long lines in code blocks"
          icon="markdown"
          label="Line wrapping"
          title="Code Examples"
        />

        <!-- Motion -->
        <AppSettingsMotion />

        <!-- Package Manager -->
        <AppSettingsPackageManager />

        <!-- API Reference -->
        <AppSettingsToggleSection
          v-model="showInlineApi"
          description="Display API details inline instead of links"
          icon="beaker"
          label="Show inline"
          title="API Reference"
        />

        <!-- Navigation -->
        <AppSettingsToggleSection
          v-model="collapsibleNav"
          description="Group navigation items into expandable sections"
          icon="menu"
          label="Collapsible sections"
          title="Navigation"
        />

        <!-- Header -->
        <AppSettingsHeaderButtons />

        <!-- Reset -->
        <div class="pt-4 pb-2 border-t border-divider flex justify-between">
          <button
            aria-label="Enter Developer Mode"
            class="inline-flex items-center gap-1 text-xs focus-visible:text-error focus-visible:underline focus-visible:outline-none transition-colors"
            :class="[devmode.isSelected.value ? 'text-error hover:text-error' : 'text-on-surface/40 hover:text-primary' ]"
            type="button"
            @click="devmode.toggle()"
          >
            Devmode

            <AppIcon v-if="devmode.isSelected.value" icon="vuetify-0" size="12" />
          </button>

          <button
            v-if="hasChanges"
            aria-label="Reset all settings to defaults"
            class="text-xs text-on-surface/40 hover:text-error hover:underline focus-visible:text-error focus-visible:underline focus-visible:outline-none transition-colors"
            type="button"
            @click="reset"
          >
            Reset to defaults
          </button>
        </div>
      </template>
    </div>
  </aside>
</template>

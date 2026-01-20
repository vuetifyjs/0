<script setup lang="ts">
  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { onUnmounted, useTemplateRef, watch } from 'vue'

  // Stores

  const discovery = useDiscovery()
  const { close, reset, hasChanges, lineWrap, showInlineApi, collapsibleNav } = useSettings()

  function startTour () {
    close()
    discovery.start('docs-intro')
  }

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

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close()
    }
  }

  startTour()
</script>

<template>
  <aside
    ref="sheet"
    aria-labelledby="settings-title"
    aria-modal="true"
    class="fixed inset-y-0 right-0 flex flex-col z-50 bg-glass-surface w-[320px] max-w-full shadow-xl outline-none"
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
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Tour -->
      <div class="pb-2 border-b border-divider">
        <button
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface"
          type="button"
          @click="startTour"
        >
          <AppIcon class="text-primary" icon="school" size="20" />
          <div class="flex-1 text-left">
            <div class="text-sm font-medium">Take the tour</div>
            <div class="text-xs text-on-surface-variant">Learn how to use the docs</div>
          </div>
          <AppIcon class="text-on-surface-variant" icon="arrow-right" size="16" />
        </button>
      </div>

      <!-- Theme -->
      <AppSettingsTheme />

      <!-- Other settings (hidden when editing theme) -->
      <template v-if="!isEditingTheme">
        <!-- Skill Level -->
        <AppSettingsSkillLevel />

        <!-- Navigation -->
        <AppSettingsToggleSection
          v-model="collapsibleNav"
          hint="Group navigation items into expandable sections"
          icon="menu"
          label="Collapsible sections"
          title="Navigation"
        />

        <!-- Code Examples -->
        <AppSettingsToggleSection
          v-model="lineWrap"
          description="Wrap long lines in code blocks"
          icon="markdown"
          label="Line wrapping"
          title="Code Examples"
        />

        <!-- API Reference -->
        <AppSettingsToggleSection
          v-model="showInlineApi"
          description="Display API details inline instead of links"
          icon="beaker"
          label="Show inline"
          title="API Reference"
        />

        <!-- Motion -->
        <AppSettingsMotion />

        <!-- Package Manager -->
        <AppSettingsPackageManager />

        <!-- Header Buttons -->
        <AppSettingsHeaderButtons />

        <!-- Reset -->
        <div v-if="hasChanges" class="pt-2 border-t border-divider text-end">
          <button
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

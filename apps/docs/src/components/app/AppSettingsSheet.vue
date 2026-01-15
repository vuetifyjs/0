<script setup lang="ts">
  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { onUnmounted, useTemplateRef, watch } from 'vue'

  const { close, lineWrap, showInlineApi, collapsibleNav } = useSettings()
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
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { onUnmounted } from 'vue'

  const { isOpen, reset, hasChanges, lineWrap, showInlineApi, collapsibleNav } = useSettings()
  const { isEditing: isEditingTheme, clearPreview } = useCustomThemes()

  onUnmounted(() => {
    if (isEditingTheme.value) {
      clearPreview()
      isEditingTheme.value = false
    }
  })
</script>

<template>
  <Dialog.Root v-model="isOpen">
    <Dialog.Content class="fixed inset-y-0 right-0 left-auto m-0 max-h-full w-[320px] max-w-full outline-none border-0 p-0 bg-transparent">
      <div class="flex flex-col h-full bg-glass-surface shadow-xl">
        <!-- Header -->
        <header class="shrink-0 px-4 py-3 border-b border-divider flex items-center justify-between bg-surface">
          <div class="flex items-center gap-2">
            <AppIcon class="text-primary" icon="cog" />
            <Dialog.Title class="font-medium">Settings</Dialog.Title>
          </div>

          <Dialog.Close
            aria-label="Close settings"
            class="inline-flex p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
            title="Close"
          >
            <AppIcon icon="close" size="18" />
          </Dialog.Close>
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
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
  dialog::backdrop {
    background: rgb(0 0 0 / 30%);
  }
</style>

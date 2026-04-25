<script setup lang="ts">
  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'
  import { useThemeToggle, type ThemePreference } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const { themeId, editable = false } = defineProps<{
    themeId: string
    editable?: boolean
  }>()

  const emit = defineEmits<{
    edit: [id: string]
  }>()

  const toggle = useThemeToggle()
  const themes = useCustomThemes()
  const theme = toRef(() => themes.customThemes.value.find(t => t.id === themeId))
  const active = toRef(() => toggle.preference.value === themeId)

  function onClick () {
    toggle.setPreference(themeId as ThemePreference)
  }

  function onEdit (event: Event) {
    event.stopPropagation()
    emit('edit', themeId)
  }
</script>

<template>
  <button
    v-if="theme"
    :aria-pressed="active"
    class="flex flex-col items-start gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors group relative border-divider text-on-surface hover:border-primary/50 data-[active]:border-primary data-[active]:bg-primary/10 data-[active]:text-primary"
    :data-active="active || undefined"
    type="button"
    @click="onClick"
  >
    <div class="flex items-center gap-2 w-full">
      <AppIcon :icon="theme.icon" size="16" />
      <span class="font-medium truncate">{{ theme.label }}</span>

      <button
        v-if="editable"
        class="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-tint transition-all"
        title="Edit theme"
        type="button"
        @click="onEdit"
      >
        <AppIcon icon="edit" size="12" />
      </button>
    </div>

    <AppThemePreview :theme="themeId" />
  </button>
</template>

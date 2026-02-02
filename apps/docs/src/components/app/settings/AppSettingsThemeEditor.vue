<script setup lang="ts">
  // Framework
  import { debounce, useTheme } from '@vuetify/v0'

  // Composables
  import { useCustomThemes, type CustomTheme } from '@/composables/useCustomThemes'

  // Utilities
  import { reactive, computed, watch } from 'vue'

  import { themes, type ThemeDefinition } from '@/themes'

  const props = defineProps<{
    theme?: ThemeDefinition | null
  }>()

  const emit = defineEmits<{
    save: [theme: CustomTheme]
    cancel: []
    delete: [id: string]
  }>()

  const customThemes = useCustomThemes()
  const themeSystem = useTheme()

  // Debounce preview updates to avoid lag during color picker drag
  const debouncedPreview = debounce((colors: Record<string, string>, dark: boolean) => {
    customThemes.preview(colors, dark)
  }, 16) // ~60fps

  // Color groups for organized editing
  const COLOR_GROUPS = {
    semantic: {
      label: 'Semantic',
      colors: ['primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
    },
    surfaces: {
      label: 'Surfaces',
      colors: ['background', 'surface', 'surface-tint', 'surface-variant', 'divider', 'pre'],
    },
    text: {
      label: 'Text / Contrast',
      colors: [
        'on-primary', 'on-secondary', 'on-accent', 'on-error',
        'on-info', 'on-success', 'on-warning', 'on-background',
        'on-surface', 'on-surface-variant',
      ],
    },
  }

  // Color labels for display
  const COLOR_LABELS: Record<string, string> = {
    'primary': 'Primary',
    'secondary': 'Secondary',
    'accent': 'Accent',
    'error': 'Error',
    'info': 'Info',
    'success': 'Success',
    'warning': 'Warning',
    'background': 'Background',
    'surface': 'Surface',
    'surface-tint': 'Surface Tint',
    'surface-variant': 'Surface Variant',
    'divider': 'Divider',
    'pre': 'Code Block',
    'on-primary': 'On Primary',
    'on-secondary': 'On Secondary',
    'on-accent': 'On Accent',
    'on-error': 'On Error',
    'on-info': 'On Info',
    'on-success': 'On Success',
    'on-warning': 'On Warning',
    'on-background': 'On Background',
    'on-surface': 'On Surface',
    'on-surface-variant': 'On Surface Variant',
  }

  // Initialize draft state from props or defaults
  const isEditingExisting = computed(() => props.theme && 'custom' in props.theme)

  const draft = reactive({
    label: props.theme?.label ?? 'My Theme',
    dark: props.theme?.dark ?? false,
    colors: { ...(props.theme?.colors ?? themes.light.colors) } as Record<string, string>,
  })

  // Real-time preview - watch draft changes and apply them
  watch(
    () => ({ colors: { ...draft.colors }, dark: draft.dark }),
    ({ colors, dark }) => {
      debouncedPreview(colors, dark)
    },
    { immediate: true, deep: true },
  )

  // Apply immediately on mount (debounce skips first call otherwise)
  customThemes.preview(draft.colors, draft.dark)

  function handleSave () {
    const theme: CustomTheme = {
      id: props.theme?.id ?? '',
      label: draft.label,
      icon: 'theme-custom',
      dark: draft.dark,
      colors: { ...draft.colors },
      custom: true,
    }
    emit('save', theme)
  }

  function handleCancel () {
    emit('cancel')
  }

  function handleDelete () {
    if (props.theme?.id) {
      emit('delete', props.theme.id)
    }
  }

  function toggleDarkMode () {
    draft.dark = !draft.dark
    // Reset colors to match new mode's defaults (use resolved colors from theme system)
    const baseId = draft.dark ? 'dark' : 'light'
    const resolvedColors = themeSystem.colors.value[baseId]
    draft.colors = { ...(resolvedColors ?? themes[baseId].colors) }
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button
        class="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        type="button"
        @click="handleCancel"
      >
        <AppIcon icon="arrow-left" size="16" />
        <span>Back</span>
      </button>

      <button
        v-if="isEditingExisting"
        class="flex items-center gap-1 text-sm text-error hover:text-error/80 transition-colors"
        type="button"
        @click="handleDelete"
      >
        <AppIcon icon="delete" size="16" />
        <span>Delete</span>
      </button>
    </div>

    <!-- Theme Name -->
    <div>
      <label class="text-xs font-medium text-on-surface-variant mb-1 block">Theme Name</label>
      <input
        v-model="draft.label"
        class="w-full px-3 py-2 text-sm rounded-lg border border-divider bg-surface text-on-surface"
        placeholder="My Theme"
        type="text"
      >
    </div>

    <!-- Dark Mode Toggle -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-on-surface-variant">Dark Mode</span>
      <button
        :class="[
          'relative w-10 h-5 rounded-full transition-colors',
          draft.dark ? 'bg-primary' : 'bg-divider',
        ]"
        type="button"
        @click="toggleDarkMode"
      >
        <span
          :class="[
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
            draft.dark ? 'translate-x-5' : 'translate-x-0',
          ]"
        />
      </button>
    </div>

    <!-- Color Groups -->
    <div
      v-for="(group, key) in COLOR_GROUPS"
      :key="key"
      class="space-y-2"
    >
      <div class="text-xs font-medium text-on-surface-variant">{{ group.label }}</div>
      <div class="space-y-1.5">
        <AppSettingsColorInput
          v-for="colorKey in group.colors"
          :key="colorKey"
          v-model="draft.colors[colorKey]"
          :label="COLOR_LABELS[colorKey]"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-2">
      <button
        class="flex-1 px-4 py-2 text-sm rounded-lg bg-secondary text-on-secondary hover:opacity-90 transition-opacity"
        type="button"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button
        class="flex-1 px-4 py-2 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors"
        type="button"
        @click="handleSave"
      >
        Save Theme
      </button>
    </div>
  </div>
</template>

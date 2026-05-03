// Framework
import { IN_BROWSER, useStorage, useTheme } from '@vuetify/v0'

// Composables
import { type ThemePreference, useThemeToggle } from '@/composables/useThemeToggle'

// Themes
import { themes, type ThemeDefinition, type ThemeId } from '@/themes'

// Utilities
import { computed, shallowRef, watch } from 'vue'

// Types
import type { ComputedRef } from 'vue'

export interface CustomTheme extends ThemeDefinition {
  custom: true
  baseTheme?: ThemeId
}

export interface UseCustomThemesReturn {
  customThemes: typeof customThemes
  allThemes: ComputedRef<Record<string, ThemeDefinition>>
  create: (theme: Omit<CustomTheme, 'custom'>) => CustomTheme
  update: (id: string, theme: Partial<Omit<CustomTheme, 'id' | 'custom'>>) => void
  remove: (id: string) => void
  current: () => ThemeDefinition | undefined
  preview: (colors: Record<string, string>, dark: boolean) => void
  clearPreview: () => void
  editor: {
    active: typeof isEditing
    theme: typeof editingTheme
    open: () => void
    edit: (id: string) => void
    save: (data: CustomTheme) => void
    cancel: () => void
    destroy: (id: string) => void
  }
}

const STORAGE_KEY = 'v0:custom-themes'

// Shared singleton state
const customThemes = shallowRef<CustomTheme[]>([])
const isEditing = shallowRef(false)
const editingTheme = shallowRef<ThemeDefinition | null>(null)
const previousPreference = shallowRef<ThemePreference>('system')
let initialized = false

/**
 * Generate a unique theme ID
 */
function generateId (): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Manage custom user-created themes.
 * Themes are stored in localStorage and merged with preset themes.
 */
export function useCustomThemes (): UseCustomThemesReturn {
  const storage = useStorage()
  const theme = useTheme()
  const toggle = useThemeToggle()

  // Initialize once on first use
  if (!initialized) {
    initialized = true

    // Load stored custom themes
    const stored = storage.get<CustomTheme[]>(STORAGE_KEY)
    if (Array.isArray(stored.value)) {
      customThemes.value = stored.value
    }

    // Persist changes to storage
    watch(customThemes, value => storage.set(STORAGE_KEY, value))

    // Register existing custom themes on init
    for (const custom of customThemes.value) {
      theme.upsert(custom.id, {
        value: custom.colors,
        dark: custom.dark,
      })
    }
  }

  // Merge preset themes with custom themes
  const allThemes = computed(() => {
    const result: Record<string, ThemeDefinition> = { ...themes }
    for (const custom of customThemes.value) {
      result[custom.id] = custom
    }
    return result
  })

  /**
   * Create a new custom theme
   */
  function create (themeData: Omit<CustomTheme, 'custom'>): CustomTheme {
    const newTheme: CustomTheme = {
      ...themeData,
      id: themeData.id || generateId(),
      custom: true,
    }

    theme.upsert(newTheme.id, {
      value: newTheme.colors,
      dark: newTheme.dark,
    })

    customThemes.value = [...customThemes.value, newTheme]

    return newTheme
  }

  /**
   * Update an existing custom theme
   */
  function update (id: string, updates: Partial<Omit<CustomTheme, 'id' | 'custom'>>): void {
    const index = customThemes.value.findIndex(t => t.id === id)
    if (index === -1) return

    const updated = { ...customThemes.value[index], ...updates }
    const newThemes = [...customThemes.value]
    newThemes[index] = updated

    theme.upsert(id, {
      value: updated.colors,
      dark: updated.dark,
    })

    customThemes.value = newThemes
  }

  /**
   * Remove a custom theme
   */
  function remove (id: string): void {
    theme.unregister(id)
    customThemes.value = customThemes.value.filter(t => t.id !== id)
  }

  /**
   * Get the currently selected theme definition with resolved colors
   */
  function current (): ThemeDefinition | undefined {
    const selectedId = theme.selectedId.value
    if (!selectedId) {
      // Return light theme with resolved colors
      return {
        ...themes.light,
        colors: theme.colors.value.light ?? themes.light.colors,
      }
    }

    // Get resolved colors from the theme system (handles token aliases)
    const resolvedColors = theme.colors.value[selectedId]

    // Check custom themes first
    const custom = customThemes.value.find(t => t.id === selectedId)
    if (custom) {
      return {
        ...custom,
        colors: resolvedColors ?? custom.colors,
      }
    }

    // Fall back to preset themes
    const preset = themes[selectedId as ThemeId]
    if (preset) {
      return {
        ...preset,
        colors: resolvedColors ?? preset.colors,
      }
    }

    // Final fallback with resolved colors
    return {
      ...themes.light,
      colors: theme.colors.value.light ?? themes.light.colors,
    }
  }

  /**
   * Preview theme colors in real-time by setting CSS variables directly
   */
  function preview (colors: Record<string, string>, dark: boolean): void {
    if (!IN_BROWSER) return
    const root = document.documentElement
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(`--v0-${key}`, value)
    }
    // Update color-scheme for proper browser behavior
    root.style.colorScheme = dark ? 'dark' : 'light'
  }

  /**
   * Clear the preview and restore previous theme
   */
  function clearPreview (): void {
    if (!IN_BROWSER) return
    const root = document.documentElement
    // Remove all inline v0 CSS variables
    const style = root.style
    for (let i = style.length - 1; i >= 0; i--) {
      const prop = style[i]
      if (prop?.startsWith('--v0-') || prop === 'color-scheme') {
        root.style.removeProperty(prop)
      }
    }
  }

  function open () {
    const currentTheme = current()
    previousPreference.value = toggle.preference.value
    isEditing.value = true
    editingTheme.value = {
      id: '',
      label: 'My Theme',
      icon: 'theme-custom',
      dark: currentTheme?.dark ?? false,
      colors: { ...(currentTheme?.colors ?? themes.light.colors) },
    }
  }

  function edit (id: string) {
    const custom = customThemes.value.find(t => t.id === id)
    if (!custom) return
    previousPreference.value = toggle.preference.value
    isEditing.value = true
    editingTheme.value = { ...custom }
  }

  function save (data: CustomTheme) {
    clearPreview()
    if (data.id && customThemes.value.some(t => t.id === data.id)) {
      update(data.id, { label: data.label, dark: data.dark, colors: data.colors })
      toggle.setPreference(data.id as ThemePreference)
    } else {
      const newTheme = create({
        id: '',
        label: data.label,
        icon: 'theme-custom',
        dark: data.dark,
        colors: data.colors,
      })
      toggle.setPreference(newTheme.id as ThemePreference)
    }
    isEditing.value = false
    editingTheme.value = null
  }

  function cancel () {
    clearPreview()
    toggle.setPreference(previousPreference.value)
    isEditing.value = false
    editingTheme.value = null
  }

  function destroy (id: string) {
    clearPreview()
    remove(id)
    toggle.setPreference(previousPreference.value === id ? 'system' : previousPreference.value)
    isEditing.value = false
    editingTheme.value = null
  }

  return {
    customThemes,
    allThemes,
    create,
    update,
    remove,
    current,
    preview,
    clearPreview,
    editor: {
      active: isEditing,
      theme: editingTheme,
      open,
      edit,
      save,
      cancel,
      destroy,
    },
  }
}

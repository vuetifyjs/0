// Framework
import { IN_BROWSER, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { computed, shallowRef, watch } from 'vue'

// Themes
import { themes, type ThemeDefinition, type ThemeId } from '@/themes'

// Types
export interface CustomTheme extends ThemeDefinition {
  custom: true
  baseTheme?: ThemeId
}

export interface UseCustomThemesReturn {
  customThemes: typeof customThemes
  allThemes: ReturnType<typeof computed<Record<string, ThemeDefinition>>>
  editing: typeof isEditing
  create: (theme: Omit<CustomTheme, 'custom'>) => CustomTheme
  update: (id: string, theme: Partial<Omit<CustomTheme, 'id' | 'custom'>>) => void
  remove: (id: string) => void
  current: () => ThemeDefinition | undefined
  preview: (colors: Record<string, string>, dark: boolean) => void
  clearPreview: () => void
}

const STORAGE_KEY = 'v0:custom-themes'
const STYLESHEET_ID = 'v0-theme-stylesheet'

// Shared singleton state
const customThemes = shallowRef<CustomTheme[]>([])
const isEditing = shallowRef(false)
let initialized = false

/**
 * Generate a unique theme ID
 */
function generateId (): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Generate CSS for a theme
 */
function generateThemeCSS (id: string, colors: Record<string, string>): string {
  const vars = Object.entries(colors)
    .map(([key, val]) => `  --v0-${key}: ${val};`)
    .join('\n')
  return `[data-theme="${id}"] {\n${vars}\n}`
}

/**
 * Inject or update a custom theme's CSS in the stylesheet
 */
function injectThemeCSS (id: string, colors: Record<string, string>): void {
  if (!IN_BROWSER) return
  const styleEl = document.querySelector(`#${STYLESHEET_ID}`) as HTMLStyleElement | null
  if (!styleEl) return

  const css = generateThemeCSS(id, colors)
  const marker = `/* custom:${id} */`
  const endMarker = `/* /custom:${id} */`

  // Check if this theme's CSS already exists
  const content = styleEl.textContent || ''
  const startIdx = content.indexOf(marker)

  if (startIdx === -1) {
    // Append new (before the :root rule if it exists)
    const rootIdx = content.indexOf(':root {')
    styleEl.textContent = rootIdx === -1 ? content + '\n' + marker + '\n' + css + '\n' + endMarker : content.slice(0, rootIdx) + marker + '\n' + css + '\n' + endMarker + '\n' + content.slice(rootIdx)
  } else {
    // Update existing
    const endIdx = content.indexOf(endMarker)
    if (endIdx !== -1) {
      styleEl.textContent = content.slice(0, startIdx) + marker + '\n' + css + '\n' + endMarker + content.slice(endIdx + endMarker.length)
    }
  }
}

/**
 * Remove a custom theme's CSS from the stylesheet
 */
function removeThemeCSS (id: string): void {
  if (!IN_BROWSER) return
  const styleEl = document.querySelector(`#${STYLESHEET_ID}`) as HTMLStyleElement | null
  if (!styleEl) return

  const marker = `/* custom:${id} */`
  const endMarker = `/* /custom:${id} */`
  const content = styleEl.textContent || ''
  const startIdx = content.indexOf(marker)

  if (startIdx !== -1) {
    const endIdx = content.indexOf(endMarker)
    if (endIdx !== -1) {
      styleEl.textContent = content.slice(0, startIdx) + content.slice(endIdx + endMarker.length)
    }
  }
}

/**
 * Manage custom user-created themes.
 * Themes are stored in localStorage and merged with preset themes.
 */
export function useCustomThemes (): UseCustomThemesReturn {
  const storage = useStorage()
  const theme = useTheme()

  // Initialize once on first use
  if (!initialized) {
    initialized = true

    // Load stored custom themes
    const stored = storage.get<CustomTheme[]>(STORAGE_KEY)
    if (Array.isArray(stored.value)) {
      customThemes.value = stored.value
    }

    // Persist changes to storage
    watch(
      customThemes,
      value => {
        storage.set(STORAGE_KEY, value)
        // Sync custom themes with the theme system
        for (const custom of value) {
          theme.upsert(custom.id, {
            value: custom.colors,
            dark: custom.dark,
          })
        }
      },
      { deep: true },
    )

    // Register existing custom themes on init and inject their CSS
    for (const custom of customThemes.value) {
      theme.upsert(custom.id, {
        value: custom.colors,
        dark: custom.dark,
      })
      injectThemeCSS(custom.id, custom.colors)
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

    // Register with theme system
    theme.upsert(newTheme.id, {
      value: newTheme.colors,
      dark: newTheme.dark,
    })

    // Inject CSS immediately (workaround for theme system reactivity)
    injectThemeCSS(newTheme.id, newTheme.colors)

    // Update state and persist immediately
    const updated = [...customThemes.value, newTheme]
    customThemes.value = updated
    storage.set(STORAGE_KEY, updated)

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

    // Re-register with theme system
    theme.upsert(id, {
      value: updated.colors,
      dark: updated.dark,
    })

    // Update CSS immediately (workaround for theme system reactivity)
    injectThemeCSS(id, updated.colors)

    // Update state and persist immediately
    customThemes.value = newThemes
    storage.set(STORAGE_KEY, newThemes)
  }

  /**
   * Remove a custom theme
   */
  function remove (id: string): void {
    // Remove CSS from stylesheet
    removeThemeCSS(id)

    const updated = customThemes.value.filter(t => t.id !== id)
    customThemes.value = updated
    storage.set(STORAGE_KEY, updated)
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

  return {
    customThemes,
    allThemes,
    editing: isEditing,
    create,
    update,
    remove,
    current,
    preview,
    clearPreview,
  }
}

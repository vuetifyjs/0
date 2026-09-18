// apps/builder/src/plugins/theme/defaults.ts

// ThemeRecord in packages/0/src/composables/useTheme is { dark?, lazy?, colors } — the
// APCA `foreground` switch lives on ThemeOptions, one level up, so it applies to every
// theme at once rather than per theme.
export interface ThemeEntry {
  dark: boolean
  colors: Record<string, string>
}

export interface ThemeConfig {
  default: string
  target: string
  foreground: boolean
  themes: Record<string, ThemeEntry>
}

/**
 * Which theme a config that the user has not saved yet should open on.
 *
 * The builder's own light/dark toggle is the most recent answer they have given to that
 * question, so a fresh config starts there rather than on a fixed 'light'. Saved configs
 * never come through here — stored values are user data and always win.
 *
 * Falls back to the config's own default when the current mode has no matching theme,
 * since either key can be renamed or removed.
 */
export function preferred (config: ThemeConfig, dark: boolean): string {
  const key = dark ? 'dark' : 'light'

  return key in config.themes ? key : config.default
}

// Stays a plain static value: the engine's codegen and its tests import it outside any
// component, where there is no app theme to read.
export const defaultConfig: ThemeConfig = {
  default: 'light',
  target: 'html',
  foreground: true,
  themes: {
    light: {
      dark: false,
      colors: {
        'primary': '#3b82f6',
        'secondary': '#64748b',
        'accent': '#6366f1',
        'error': '#ef4444',
        'background': '#f5f5f5',
        'surface': '#ffffff',
        'surface-variant': '#f5f5f5',
        'divider': '#e0e0e0',
        'on-primary': '#ffffff',
        'on-surface': '#212121',
        'on-surface-variant': '#666666',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#c4b5fd',
        'secondary': '#94a3b8',
        'accent': '#c084fc',
        'error': '#f87171',
        'background': '#121212',
        'surface': '#1a1a1a',
        'surface-variant': '#1e1e1e',
        'divider': '#404040',
        'on-primary': '#1a1a1a',
        'on-surface': '#e0e0e0',
        'on-surface-variant': '#a0a0a0',
      },
    },
  },
}

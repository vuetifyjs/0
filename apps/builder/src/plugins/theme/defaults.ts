// apps/builder/src/plugins/theme/defaults.ts

export interface ThemeEntry {
  dark: boolean
  foreground: boolean
  colors: Record<string, string>
}

export interface ThemeConfig {
  default: string
  target: string
  themes: Record<string, ThemeEntry>
}

export const defaultConfig: ThemeConfig = {
  default: 'light',
  target: 'html',
  themes: {
    light: {
      dark: false,
      foreground: false,
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
      foreground: false,
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

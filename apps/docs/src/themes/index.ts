// Types
export interface ThemeDefinition {
  id: string
  label: string
  icon: string
  dark: boolean
  colors: Record<string, string>
}

export type ThemeId = keyof typeof themes

/**
 * All available themes for the docs site.
 * Colors follow the v0 theme token format.
 */
export const themes = {
  'light': {
    id: 'light',
    label: 'Light',
    icon: 'theme-light',
    dark: false,
    colors: {
      'primary': '#3b82f6',
      'secondary': '#64748b',
      'accent': '#6366f1',
      'error': '#ef4444',
      'info': '#1867c0',
      'success': '#22c55e',
      'warning': '#f59e0b',
      'background': '#ffffff',
      'surface': '#ffffff',
      'surface-tint': '#f5f5f5',
      'surface-variant': '#e8e8e8',
      'divider': '#d0d0d0',
      'pre': '{light.colors.surface-tint}',
      'on-primary': '#ffffff',
      'on-secondary': '#ffffff',
      'on-accent': '#1a1a1a',
      'on-error': '#ffffff',
      'on-info': '#ffffff',
      'on-success': '#1a1a1a',
      'on-warning': '#1a1a1a',
      'on-background': '#212121',
      'on-surface': '#212121',
      'on-surface-variant': '#666666',
      'glass-surface': 'rgba(255, 255, 255, 0.85)',
      'scrollbar-thumb': '#b0b0b0',
    },
  },
  'dark': {
    id: 'dark',
    label: 'Dark',
    icon: 'theme-dark',
    dark: true,
    colors: {
      'primary': '#c4b5fd',
      'secondary': '#94a3b8',
      'accent': '#c084fc',
      'error': '#f87171',
      'info': '#38bdf8',
      'success': '#4ade80',
      'warning': '#fb923c',
      'background': '#121212',
      'surface': '#1a1a1a',
      'surface-tint': '#2a2a2a',
      'surface-variant': '#1e1e1e',
      'divider': '#404040',
      'pre': '{dark.colors.surface-tint}',
      'on-primary': '#1a1a1a',
      'on-secondary': '#ffffff',
      'on-accent': '#ffffff',
      'on-error': '#1a1a1a',
      'on-info': '#1a1a1a',
      'on-success': '#1a1a1a',
      'on-warning': '#1a1a1a',
      'on-background': '#e0e0e0',
      'on-surface': '#e0e0e0',
      'on-surface-variant': '#a0a0a0',
      'glass-surface': 'rgba(26, 26, 26, 0.7)',
      'scrollbar-thumb': '#505050',
    },
  },
  'high-contrast': {
    id: 'high-contrast',
    label: 'High Contrast',
    icon: 'theme-high-contrast',
    dark: true,
    colors: {
      'primary': '#ffff00',
      'secondary': '#00ffff',
      'accent': '#ff00ff',
      'error': '#ff0000',
      'info': '#00ffff',
      'success': '#00ff00',
      'warning': '#ffff00',
      'background': '#000000',
      'surface': '#000000',
      'surface-tint': '#1a1a1a',
      'surface-variant': '#000000',
      'divider': '#ffffff',
      'pre': '#0a0a0a',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-accent': '#000000',
      'on-error': '#000000',
      'on-info': '#000000',
      'on-success': '#000000',
      'on-warning': '#000000',
      'on-background': '#ffffff',
      'on-surface': '#ffffff',
      'on-surface-variant': '#ffffff',
      'glass-surface': 'rgba(0, 0, 0, 0.85)',
      'scrollbar-thumb': '#ffffff',
    },
  },
  'blackguard': {
    id: 'blackguard',
    label: 'Blackguard',
    icon: 'theme-blackguard',
    dark: true,
    colors: {
      'primary': '#f59e0b',
      'secondary': '#a78bfa',
      'accent': '#f472b6',
      'error': '#f87171',
      'info': '#c084fc',
      'success': '#86efac',
      'warning': '#fbbf24',
      'background': '#0f0c24',
      'surface': '#1a1640',
      'surface-tint': '#252050',
      'surface-variant': '#1e1845',
      'divider': 'rgba(167, 139, 250, 0.2)',
      'pre': '#151230',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-accent': '#000000',
      'on-error': '#000000',
      'on-info': '#000000',
      'on-success': '#000000',
      'on-warning': '#000000',
      'on-background': '#e8e0f0',
      'on-surface': '#e8e0f0',
      'on-surface-variant': '#a0a0b0',
      'glass-surface': 'rgba(26, 22, 64, 0.7)',
      'scrollbar-thumb': 'rgba(167, 139, 250, 0.4)',
    },
  },
  'polaris': {
    id: 'polaris',
    label: 'Polaris',
    icon: 'theme-polaris',
    dark: true,
    colors: {
      'primary': '#f97316',
      'secondary': '#14b8a6',
      'accent': '#8b5cf6',
      'error': '#ef4444',
      'info': '#0ea5e9',
      'success': '#22c55e',
      'warning': '#eab308',
      'background': '#0c0a09',
      'surface': '#1c1917',
      'surface-tint': '#292524',
      'surface-variant': '#292524',
      'divider': '#3d3835',
      'pre': '#1c1917',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-accent': '#ffffff',
      'on-error': '#000000',
      'on-info': '#000000',
      'on-success': '#000000',
      'on-warning': '#000000',
      'on-background': '#fafaf9',
      'on-surface': '#fafaf9',
      'on-surface-variant': '#a8a29e',
      'glass-surface': 'rgba(28, 25, 23, 0.7)',
      'scrollbar-thumb': 'rgba(249, 115, 22, 0.4)',
    },
  },
  'nebula': {
    id: 'nebula',
    label: 'Nebula',
    icon: 'theme-nebula',
    dark: true,
    colors: {
      'primary': '#60a5fa',
      'secondary': '#38bdf8',
      'accent': '#22d3ee',
      'error': '#f87171',
      'info': '#94a3b8',
      'success': '#34d399',
      'warning': '#fbbf24',
      'background': '#0f172a',
      'surface': '#1e293b',
      'surface-tint': '#273548',
      'surface-variant': '#1e293b',
      'divider': 'rgba(96, 165, 250, 0.2)',
      'pre': '#0f172a',
      'on-primary': '#000000',
      'on-secondary': '#000000',
      'on-accent': '#000000',
      'on-error': '#000000',
      'on-info': '#000000',
      'on-success': '#000000',
      'on-warning': '#000000',
      'on-background': '#e2e8f0',
      'on-surface': '#e2e8f0',
      'on-surface-variant': '#94a3b8',
      'glass-surface': 'rgba(30, 41, 59, 0.7)',
      'scrollbar-thumb': 'rgba(96, 165, 250, 0.4)',
    },
  },
  'odyssey': {
    id: 'odyssey',
    label: 'Odyssey',
    icon: 'theme-odyssey',
    dark: false,
    colors: {
      'primary': '#3E805B',
      'secondary': '#0d9488',
      'accent': '#d4af37',
      'error': '#e11d48',
      'info': '#0d9488',
      'success': '#10b981',
      'warning': '#d97706',
      'background': '#FAF9F6',
      'surface': '#ffffff',
      'surface-tint': '#F0EDE8',
      'surface-variant': '#E8E5DF',
      'divider': '#D4D1C7',
      'pre': '#F0EDE8',
      'on-primary': '#ffffff',
      'on-secondary': '#ffffff',
      'on-accent': '#000000',
      'on-error': '#ffffff',
      'on-info': '#ffffff',
      'on-success': '#000000',
      'on-warning': '#000000',
      'on-background': '#1C1B1A',
      'on-surface': '#1C1B1A',
      'on-surface-variant': '#57534e',
      'glass-surface': 'rgba(250, 249, 246, 0.85)',
      'scrollbar-thumb': '#a8a29e',
    },
  },
} as const satisfies Record<string, ThemeDefinition>

/**
 * Get all theme configs for createThemePlugin.
 */
export function getAllThemeConfigs (): Record<ThemeId, { dark: boolean, colors: Record<string, string> }> {
  const result = {} as Record<ThemeId, { dark: boolean, colors: Record<string, string> }>
  for (const id of Object.keys(themes) as ThemeId[]) {
    const theme = themes[id]
    result[id] = { dark: theme.dark, colors: { ...theme.colors } }
  }
  return result
}

/**
 * Export theme as Vuetify config format.
 * Ready to paste into createVuetify() themes option.
 */
export function exportThemeAsVuetifyConfig (id: ThemeId): string {
  const theme = themes[id]
  const config = {
    dark: theme.dark,
    colors: { ...theme.colors },
  }

  // Format as JS object (not JSON) for better DX
  const colorsStr = Object.entries(config.colors)
    .map(([key, value]) => `      '${key}': '${value}',`)
    .join('\n')

  return `{
  dark: ${config.dark},
  colors: {
${colorsStr}
  },
}`
}

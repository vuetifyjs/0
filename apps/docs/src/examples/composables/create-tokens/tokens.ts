import { createTokens } from '@vuetify/v0'

export const tokens = createTokens({
  color: {
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      900: '#1e3a5f',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      900: '#14532d',
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      900: '#78350f',
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  semantic: {
    'primary': '{color.blue.500}',
    'primary-dark': '{color.blue.600}',
    'success': '{color.green.500}',
    'warning': '{color.amber.500}',
    'surface': '{color.slate.50}',
    'surface-dark': '{color.slate.900}',
    'text': '{color.slate.900}',
    'text-dark': '{color.slate.50}',
    'muted': '{color.slate.200}',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
})

export type Category = 'color' | 'semantic' | 'spacing' | 'radius'

export const CATEGORIES: readonly Category[] = ['color', 'semantic', 'spacing', 'radius'] as const

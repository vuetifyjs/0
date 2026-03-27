import { createTheme } from '@vuetify/v0'

export const palette = {
  blue: { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
  emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
  rose: { 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48' },
  amber: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
  violet: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
}

export const theme = createTheme({
  default: 'ocean',
  palette,
  themes: {
    ocean: {
      colors: {
        primary: '{palette.blue.500}',
        accent: '{palette.violet.400}',
        surface: '#f8fafc',
        card: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
      },
    },
    forest: {
      colors: {
        primary: '{palette.emerald.500}',
        accent: '{palette.amber.400}',
        surface: '#f0fdf4',
        card: '#ffffff',
        text: '#052e16',
        muted: '#6b7280',
      },
    },
    sunset: {
      dark: true,
      colors: {
        primary: '{palette.rose.500}',
        accent: '{palette.amber.400}',
        surface: '#1c1017',
        card: '#2a1a20',
        text: '#fef2f2',
        muted: '#a8a29e',
      },
    },
    midnight: {
      dark: true,
      colors: {
        primary: '{palette.violet.500}',
        accent: '{palette.blue.400}',
        surface: '#0f0b1e',
        card: '#1a1530',
        text: '#f5f3ff',
        muted: '#9ca3af',
      },
    },
  },
})

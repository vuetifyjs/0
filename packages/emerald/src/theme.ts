/**
 * Emerald Design System — Token Definitions
 *
 * Extracted from Juan's Figma spec (March 2026).
 * These tokens feed into UnoCSS theme config so that
 * utility classes like `bg-primary`, `text-error-600`, `rounded-lg`
 * resolve to Emerald's design language.
 */

// ──────────────────────────────────────────────
// Brand
// ──────────────────────────────────────────────

export const primary = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  200: '#DED6FE',
  300: '#C4B5FD',
  400: '#A28BFA',
  500: '#7C5CF6',
  600: '#5F3AED',
  700: '#4D28D9',
  800: '#4021B6',
  900: '#361D95',
  950: '#221065',
  DEFAULT: '#7C5CF6',
} as const

export const secondary = {
  50: '#F4F7F9',
  100: '#ECF0F3',
  200: '#DCE4E9',
  300: '#C6D2DB',
  400: '#AEBCCB',
  500: '#94A3B8',
  600: '#828FA9',
  700: '#6F7A93',
  800: '#5C6677',
  900: '#4D5462',
  950: '#2D3139',
  DEFAULT: '#94A3B8',
} as const

// ──────────────────────────────────────────────
// Surfaces
// ──────────────────────────────────────────────

export const background = {
  DEFAULT: '#FAF9FF',
  dark: '#1A1C1E',
} as const

export const surface = {
  DEFAULT: '#F5F4FF',
  dark: '#1E1C28',
} as const

// ──────────────────────────────────────────────
// Semantics
// ──────────────────────────────────────────────

export const success = {
  50: '#F1FCF5',
  100: '#DFF9EB',
  200: '#C0F2D6',
  300: '#8EE7B7',
  400: '#56D290',
  500: '#2FB86F',
  600: '#219859',
  700: '#1E7A4A',
  800: '#1C5F3C',
  900: '#194E34',
  950: '#082B1B',
  DEFAULT: '#1E7A4A',
} as const

export const warning = {
  50: '#FBFAEB',
  100: '#F7F2CA',
  200: '#F1E497',
  300: '#E8D05C',
  400: '#E0B92F',
  500: '#D0A322',
  600: '#B07D1A',
  700: '#8F5D19',
  800: '#774A1C',
  900: '#663F1D',
  950: '#3B200D',
  DEFAULT: '#B07D1A',
} as const

export const error = {
  50: '#FDF4F3',
  100: '#FCE6E4',
  200: '#FAD2CE',
  300: '#F6B2AB',
  400: '#EF857A',
  500: '#E35E50',
  600: '#CF4233',
  700: '#C0392B',
  800: '#902E24',
  900: '#782C24',
  950: '#41130E',
  DEFAULT: '#C0392B',
} as const

export const info = {
  50: '#F3F6FC',
  100: '#E6EDF8',
  200: '#C7D9F0',
  300: '#96B8E3',
  400: '#5E93D2',
  500: '#3977BE',
  600: '#2A5FA5',
  700: '#224A82',
  800: '#20416C',
  900: '#1F375B',
  950: '#000000',
  DEFAULT: '#2A5FA5',
} as const

// ──────────────────────────────────────────────
// Border
// ──────────────────────────────────────────────

export const border = {
  DEFAULT: '#94A3B8',
} as const

export const borderRadius = {
  'none': '0',
  'xs': '2px',
  'sm': '4px',
  'DEFAULT': '6px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '24px',
  'full': '9999px',
} as const

export const borderWidth = {
  DEFAULT: '1px',
  0: '0',
  1: '1px',
  2: '2px',
  3: '3px',
  4: '4px',
  6: '6px',
} as const

// ──────────────────────────────────────────────
// Shadows
// ──────────────────────────────────────────────

export const shadow = {
  xs: '0px 1px 2px 0px rgba(30, 28, 40, 0.05)',
  sm: '0px 1px 3px 0px rgba(30, 28, 40, 0.10), 0px 1px 2px -1px rgba(30, 28, 40, 0.10)',
  DEFAULT: '0px 4px 6px -1px rgba(30, 28, 40, 0.10), 0px 2px 4px -2px rgba(30, 28, 40, 0.10)',
  md: '0px 4px 6px -1px rgba(30, 28, 40, 0.10), 0px 2px 4px -2px rgba(30, 28, 40, 0.10)',
  lg: '0px 10px 15px -3px rgba(30, 28, 40, 0.10), 0px 4px 6px -4px rgba(30, 28, 40, 0.10)',
  xl: '0px 20px 25px -5px rgba(30, 28, 40, 0.10), 0px 8px 10px -6px rgba(30, 28, 40, 0.10)',
} as const

// ──────────────────────────────────────────────
// Typography
// ──────────────────────────────────────────────

export const fontFamily = {
  sans: 'Manrope, system-ui, -apple-system, sans-serif',
} as const

export const fontSize = {
  'xs': ['12px', { lineHeight: '1.55', letterSpacing: '0.009em', fontWeight: '400' }],
  'sm': ['14px', { lineHeight: '1.55', fontWeight: '400' }],
  'md': ['16px', { lineHeight: '1.60', fontWeight: '400' }],
  'lg': ['20px', { lineHeight: '1.30', letterSpacing: '-0.01em', fontWeight: '600' }],
  'xl': ['28px', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
  '2xl': ['40px', { lineHeight: '1.05', letterSpacing: '-0.05em', fontWeight: '700' }],
} as const

// ──────────────────────────────────────────────
// Neutral (dark text/foreground)
// ──────────────────────────────────────────────

export const neutral = {
  DEFAULT: '#1A1C1E',
  50: '#FAF9FF',
  100: '#F5F4FF',
  200: '#ECF0F3',
  300: '#DEE2E6',
  400: '#94A3B8',
  500: '#4D5462',
  600: '#2D3139',
  700: '#1E1C28',
  800: '#1A1C1E',
  900: '#000000',
} as const

// ──────────────────────────────────────────────
// Full theme export
// ──────────────────────────────────────────────

export const emeraldTheme = {
  colors: {
    primary,
    secondary,
    success,
    warning,
    error,
    info,
    neutral,
    background,
    surface,
    border,
    black: '#000000',
    white: '#FFFFFF',
  },
  borderRadius,
  borderWidth,
  boxShadow: shadow,
  fontFamily,
  fontSize,
} as const

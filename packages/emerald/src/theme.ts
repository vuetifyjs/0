/**
 * Emerald Design System — Token Definitions
 *
 * Brand palette: hex values supplied by the design owner, scale generated
 * by interpolating each 500-mid against white/near-black anchors. UnoCSS
 * picks these up so `bg-primary`, `text-error-600`, etc. resolve to
 * Emerald's design language.
 */

// ──────────────────────────────────────────────
// Brand
// ──────────────────────────────────────────────

export const primary = {
  50: '#ECF7F0',
  100: '#D1ECDB',
  200: '#A4D8B6',
  300: '#76C390',
  400: '#48AD6B',
  500: '#22724A',
  600: '#1E633F',
  700: '#1A5435',
  800: '#14442A',
  900: '#103620',
  950: '#0A1F13',
  DEFAULT: '#22724A',
} as const

export const secondary = {
  50: '#EBF3FC',
  100: '#D2E4F7',
  200: '#A5CAEE',
  300: '#78B0E5',
  400: '#5599E1',
  500: '#3B84DE',
  600: '#2F6CBE',
  700: '#275798',
  800: '#1F4378',
  900: '#163058',
  950: '#0C1B33',
  DEFAULT: '#3B84DE',
} as const

export const tertiary = {
  50: '#F1F0FB',
  100: '#E2E0F5',
  200: '#C5C2EB',
  300: '#A8A4E1',
  400: '#918DDB',
  500: '#7B79D6',
  600: '#6361BD',
  700: '#4F4D9D',
  800: '#3D3C7B',
  900: '#2D2B5A',
  950: '#181734',
  DEFAULT: '#7B79D6',
} as const

// ──────────────────────────────────────────────
// Surfaces
// ──────────────────────────────────────────────

export const background = {
  DEFAULT: '#F2F7FA',
  dark: '#1A1C1E',
} as const

export const surface = {
  DEFAULT: '#FCFEFF',
  dark: '#1E1C28',
} as const

// ──────────────────────────────────────────────
// Semantics
// ──────────────────────────────────────────────

export const success = {
  50: '#E8FBF1',
  100: '#C5F4D9',
  200: '#92E8B6',
  300: '#5FDC93',
  400: '#2DD17A',
  500: '#14B86A',
  600: '#119955',
  700: '#0D7B45',
  800: '#0A5F35',
  900: '#084A28',
  950: '#052918',
  DEFAULT: '#14B86A',
} as const

export const warning = {
  50: '#FBF4E5',
  100: '#F6E5BB',
  200: '#EFCD78',
  300: '#E6B539',
  400: '#DC9F18',
  500: '#C98A00',
  600: '#A57100',
  700: '#855B00',
  800: '#6A4800',
  900: '#523800',
  950: '#2D1F00',
  DEFAULT: '#C98A00',
} as const

export const error = {
  50: '#FBECEC',
  100: '#F4C9C9',
  200: '#E89B9B',
  300: '#DC6E6E',
  400: '#D04848',
  500: '#B83030',
  600: '#962727',
  700: '#7A1F1F',
  800: '#5E1818',
  900: '#461212',
  950: '#260909',
  DEFAULT: '#B83030',
} as const

export const info = {
  50: '#E8F2FB',
  100: '#C8E0F7',
  200: '#9BC8EF',
  300: '#6DAEE6',
  400: '#4090DE',
  500: '#1B72D9',
  600: '#155EB3',
  700: '#114B8E',
  800: '#0E3D74',
  900: '#0B2E58',
  950: '#061730',
  DEFAULT: '#1B72D9',
} as const

// ──────────────────────────────────────────────
// Border
// ──────────────────────────────────────────────

export const border = {
  DEFAULT: '#DEE2E6',
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
  50: '#F8FAFB',
  100: '#F2F7FA',
  200: '#E5EAEE',
  300: '#CFD6DC',
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
    tertiary,
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

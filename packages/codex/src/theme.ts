/**
 * Codex Design System — Token Definitions
 *
 * Extracted from the v0 docs site.
 * These tokens feed into UnoCSS theme config so that
 * utility classes like `bg-primary`, `text-error`, `rounded-lg`
 * resolve to Codex's design language.
 */

// ──────────────────────────────────────────────
// Colors (light theme defaults)
// ──────────────────────────────────────────────

export const primary = '#7c5cf6' as const

export const secondary = '#64748b' as const

export const accent = '#6366f1' as const

export const error = '#ef4444' as const

export const info = '#1867c0' as const

export const success = '#22c55e' as const

export const warning = '#f59e0b' as const

export const background = '#ffffff' as const

export const surface = '#ffffff' as const

export const surfaceTint = '#f5f5f5' as const

export const surfaceVariant = '#e8e8e8' as const

export const divider = '#e0e0e0' as const

export const onPrimary = '#ffffff' as const

export const onSecondary = '#ffffff' as const

export const onAccent = '#1a1a1a' as const

export const onError = '#ffffff' as const

export const onInfo = '#ffffff' as const

export const onSuccess = '#1a1a1a' as const

export const onWarning = '#1a1a1a' as const

export const onBackground = '#212121' as const

export const onSurface = '#212121' as const

export const onSurfaceVariant = '#666666' as const

export const colors = {
  primary,
  secondary,
  accent,
  error,
  info,
  success,
  warning,
  background,
  surface,
  'surface-tint': surfaceTint,
  'surface-variant': surfaceVariant,
  divider,
  'on-primary': onPrimary,
  'on-secondary': onSecondary,
  'on-accent': onAccent,
  'on-error': onError,
  'on-info': onInfo,
  'on-success': onSuccess,
  'on-warning': onWarning,
  'on-background': onBackground,
  'on-surface': onSurface,
  'on-surface-variant': onSurfaceVariant,
} as const

// ──────────────────────────────────────────────
// Z-Index Layers
// ──────────────────────────────────────────────

export const zIndex = {
  content: 1,
  chrome: 100,
  dropdown: 200,
  modal: 500,
  overlay: 1000,
} as const

// ──────────────────────────────────────────────
// Easing
// ──────────────────────────────────────────────

export const easing = {
  snappyIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  snappyOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

// ──────────────────────────────────────────────
// Durations
// ──────────────────────────────────────────────

export const duration = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  reveal: '600ms',
} as const

// ──────────────────────────────────────────────
// Shadows
// ──────────────────────────────────────────────

export const shadow = {
  xs: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  sm: '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)',
  DEFAULT: '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10)',
  md: '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10)',
  lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -4px rgba(0, 0, 0, 0.10)',
  xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)',
} as const

// ──────────────────────────────────────────────
// Typography
// ──────────────────────────────────────────────

export const fontFamily = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '\'Courier New\', Courier, monospace',
} as const

// ──────────────────────────────────────────────
// Border Radius
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// Full theme export
// ──────────────────────────────────────────────

export const codexTheme = {
  colors,
  zIndex,
  easing,
  duration,
  boxShadow: shadow,
  fontFamily,
  borderRadius,
} as const

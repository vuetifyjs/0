/**
 * Genesis Design System — Token Definitions
 *
 * Docs-tuned palette shipping `genesis` (light) and `genesis-dark`.
 * Consumers select via `createGenesisPlugin({ theme: { default: 'genesis-dark' } })`
 * or extend `themes` with their own variants.
 */

export const genesisColors = {
  'surface': '#FFFFFF',
  'surface-tint': '#F5F5F8',
  'on-surface': '#1A1C1E',
  'on-surface-variant': '#5F6266',
  'divider': '#E0E2E6',
  'accent': '#5F3AED',
  'on-accent': '#FFFFFF',
  'code-bg': '#F8F8FA',
  'code-fg': '#1A1C1E',
} as const

export const genesisDarkColors = {
  'surface': '#171717',
  'surface-tint': '#262626',
  'on-surface': '#F5F5F5',
  'on-surface-variant': '#A3A3A3',
  'divider': '#404040',
  'accent': '#A78BFA',
  'on-accent': '#1A1C1E',
  'code-bg': '#0A0A0A',
  'code-fg': '#F5F5F5',
} as const

export type GenesisColors = typeof genesisColors

/**
 * Genesis Design System — Token Definitions
 *
 * Docs-tuned palette. Single light theme. Consumers extend `themes` on
 * plugin install to add dark or alternate variants.
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

export type GenesisColors = typeof genesisColors

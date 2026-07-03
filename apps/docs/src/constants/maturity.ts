import maturityData from '#v0/maturity.json'

/** Maturity ladder shared by DocsMaturity (roadmap matrix) and DocsPageFeatures (stability chip). */
export type Level = 'draft' | 'preview' | 'stable' | 'mature' | 'deprecated'

export interface LevelDisplay {
  icon: string
  label: string
  order: number
  /** Raw hex — consumed via inline `:style` and `blend()` RGB math in DocsMaturity. */
  color: string
  /** UnoCSS token — consumed via `:class` on AppIcon in DocsMetaItem. */
  class: string
}

/** Shape of a single entry in `packages/0/src/maturity.json`. `since` is omitted on draft entries. */
export interface MaturityEntry {
  level: Level
  category: string
  since?: string | null
  notes?: string
  description?: string
}

/** Typed view of the `maturity.json` import (which otherwise infers `level: string`). */
export interface MaturityData {
  composables: Record<string, MaturityEntry>
  components: Record<string, MaturityEntry>
  utilities: Record<string, MaturityEntry>
}

/**
 * Single source of truth for level display. Two color fields on purpose: the
 * roadmap matrix styles inline (and parses the hex for its blended group dot),
 * while the page chip applies a utility class through DocsMetaItem. Keep both in
 * step — they drift the moment they live in two files.
 */
export const MATURITY_LEVELS: Record<Level, LevelDisplay> = {
  draft: { icon: 'circle-outline', label: 'Draft', order: 0, color: '#9ca3af', class: 'text-on-surface-variant' },
  preview: { icon: 'beaker', label: 'Preview', order: 1, color: '#f59e0b', class: 'text-warning' },
  stable: { icon: 'shield', label: 'Stable', order: 2, color: '#3b82f6', class: 'text-info' },
  mature: { icon: 'check-decagram', label: 'Mature', order: 3, color: '#22c55e', class: 'text-success' },
  deprecated: { icon: 'alert-circle', label: 'Deprecated', order: 4, color: '#ef4444', class: 'text-error' },
}

export const LEVEL_KEYS = Object.keys(MATURITY_LEVELS) as Level[]

export type MaturityCountKey = 'composable' | 'component' | 'utility' | 'total'

function countShipped (bucket: Record<string, MaturityEntry>): number {
  return Object.values(bucket).filter(entry => entry.level !== 'draft').length
}

const data = maturityData as MaturityData
const composable = countShipped(data.composables)
const component = countShipped(data.components)
const utility = countShipped(data.utilities)

/** Counts of shipped (non-draft) features by type, derived from `maturity.json` — the single inventory source. */
export const MATURITY_COUNTS: Record<MaturityCountKey, number> = {
  composable,
  component,
  utility,
  total: composable + component + utility,
}

// apps/builder/src/data/components.ts

// The component catalogue, read from v0's own maturity.json so the builder can never
// drift from the framework.
//
// `draft` entries are on the roadmap but are NOT exported from @vuetify/v0 yet, so a
// generated starter that imports one fails to build. They stay visible in the picker for
// roadmap value but are not selectable, and the store purges any that a previous session
// managed to persist.

import maturity from '#v0/maturity.json'

export type ComponentLevel = 'stable' | 'preview' | 'draft'

export interface ComponentEntry {
  id: string
  category: string
  level: ComponentLevel
  /** False when the component is not yet exported from @vuetify/v0. */
  selectable: boolean
}

const raw = maturity.components as unknown as Record<string, { category: string, level: string }>

export const COMPONENTS: ComponentEntry[] = Object.entries(raw)
  .map(([id, entry]) => ({
    id,
    category: entry.category,
    level: entry.level as ComponentLevel,
    selectable: entry.level !== 'draft',
  }))
  .toSorted((a, b) => a.id.localeCompare(b.id))

const SELECTABLE = new Set(COMPONENTS.filter(c => c.selectable).map(c => c.id))

export function isSelectable (id: string): boolean {
  return SELECTABLE.has(id)
}

/** Drop ids that are unknown or not yet shippable. Used to sanitize restored state. */
export function keepSelectable (ids: Iterable<string>): string[] {
  const out: string[] = []
  for (const id of ids) {
    if (SELECTABLE.has(id)) out.push(id)
  }
  return out
}

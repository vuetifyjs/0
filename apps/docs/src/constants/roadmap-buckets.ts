// Vuetify0
import maturityData from '#v0/maturity.json'

// Types
import type { Level, MaturityData } from '@/constants/maturity'

export type FeatureType = 'composable' | 'component' | 'utility'

export interface ResolvedFeature {
  id: string
  name: string
  type: FeatureType
  category: string
  level: Level
  path: string
}

/**
 * Roadmap bucket membership, keyed by GitHub milestone title. Values are
 * `maturity.json` keys. This overlay is the single place to move a feature
 * between milestones — `maturity.json` stays the stability source of truth and
 * is never edited for planning. Unknown ids are surfaced by `auditBuckets()`.
 */
export const ROADMAP_BUCKETS: Record<string, string[]> = {
  'v1.1.0': ['DataTable', 'DataGrid', 'Alert'],
  'v1.2.0': ['Tour'],
  'v1.3.0': ['Virtualizer', 'Kanban', 'Otp'],
  'v1.4.0': ['TimePicker'],
  'v1.5.0': ['DatePicker', 'DateRangePicker'],
}

function kebab (name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const data = maturityData as MaturityData

// Flatten maturity.json into a name -> feature lookup once at module load.
const index = new Map<string, ResolvedFeature>()

for (const [name, entry] of Object.entries(data.composables)) {
  index.set(name, {
    id: `composable-${name}`,
    name,
    type: 'composable',
    category: entry.category,
    level: entry.level,
    path: `/composables/${entry.category}/${kebab(name)}`,
  })
}

for (const [name, entry] of Object.entries(data.components)) {
  index.set(name, {
    id: `component-${name}`,
    name,
    type: 'component',
    category: entry.category,
    level: entry.level,
    path: `/components/${entry.category}/${kebab(name)}`,
  })
}

for (const [name, entry] of Object.entries(data.utilities)) {
  index.set(name, {
    id: `utility-${name}`,
    name,
    type: 'utility',
    category: entry.category,
    level: entry.level,
    path: '/guide/features/utilities',
  })
}

/** Resolve a milestone title's bucket into its maturity-backed features. */
export function featuresFor (title: string): ResolvedFeature[] {
  const ids = ROADMAP_BUCKETS[title]
  if (!ids) return []

  const result: ResolvedFeature[] = []
  for (const id of ids) {
    const feature = index.get(id)
    if (feature) result.push(feature)
  }
  return result
}

/** Bucket ids that no longer resolve against maturity.json (typos, renames). */
export function auditBuckets (): string[] {
  const unknown: string[] = []
  for (const [title, ids] of Object.entries(ROADMAP_BUCKETS)) {
    for (const id of ids) {
      if (!index.has(id)) unknown.push(`${title}:${id}`)
    }
  }
  return unknown
}

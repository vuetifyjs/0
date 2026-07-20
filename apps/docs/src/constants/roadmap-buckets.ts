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
 * A planned release: the date we expect to ship it, the net-new features
 * arriving in it (draft → preview), and the existing preview features we
 * expect to graduate to stable as of that release.
 */
export interface ReleaseBucket {
  /** Expected release date, ISO `YYYY-MM-DD` (parsed locally for the calendar grid). */
  date: string
  /** Net-new features landing in this release (draft → preview). */
  features: string[]
  /** Existing preview features graduating to stable in this release. */
  stabilizing?: string[]
}

/**
 * Roadmap bucket membership, keyed by GitHub milestone title. `features` and
 * `stabilizing` values are `maturity.json` keys. This overlay is the single
 * place to move a feature between milestones — `maturity.json` stays the
 * stability source of truth and is never edited for planning. Unknown ids are
 * surfaced by `auditBuckets()`.
 *
 * Dates are the published expected minor-release targets; the date a feature is
 * expected to reach stable falls out of the release it is listed under. Both
 * are strategic targets, not hard commitments — see the disclaimer rendered
 * under the calendar.
 */
export const ROADMAP_BUCKETS: Record<string, ReleaseBucket> = {
  'v1.0.0': {
    date: '2026-07-22',
    features: [],
    // The v1 stable set locked at launch — the 16 composables promoted to stable.
    // (The 17 stable utilities are also locked here; omitted from the calendar as
    // low-signal chips that all resolve to the same utilities page.)
    stabilizing: [
      'createContext', 'createPlugin', 'createTrinity', 'createRegistry', 'createModel',
      'createSelection', 'createSingle', 'createStep', 'createGroup', 'createNested',
      'useBreakpoints', 'useStorage', 'useTheme', 'useIntersectionObserver',
      'useMutationObserver', 'useResizeObserver',
    ],
  },
  'v1.1.0': {
    date: '2026-08-25',
    features: ['DataTable', 'DataGrid', 'Alert'],
    stabilizing: [],
  },
  'v1.2.0': {
    date: '2026-09-22',
    features: ['Tour'],
    stabilizing: [
      'createValidation', 'createForm', 'createInput', 'usePopover', 'usePresence',
      'useRovingFocus', 'useVirtualFocus', 'createFilter', 'createPagination', 'useRtl',
      'useLocale', 'useStack',
      'Single', 'Step', 'Selection', 'Group', 'Theme', 'Locale', 'Scrim',
    ],
  },
  'v1.3.0': {
    date: '2026-10-20',
    features: ['Virtualizer', 'Kanban', 'Otp'],
    stabilizing: [
      'useClickOutside', 'useEventListener', 'useHotkey', 'useMediaQuery', 'useToggleScope',
      'useRaf', 'useTimer', 'useProxyModel', 'useProxyRegistry', 'toArray', 'toElement',
      'toReactive', 'useDelay', 'useHydration',
    ],
  },
  'v1.4.0': {
    date: '2026-11-17',
    features: ['TimePicker'],
    stabilizing: [
      'createSlider', 'createNumeric', 'createNumberField', 'createProgress', 'createRating',
      'createBreadcrumbs', 'createOverflow',
      'Slider', 'NumberField', 'Radio', 'Checkbox', 'Switch', 'Rating', 'Progress',
      'Form', 'Input',
    ],
  },
  'v1.5.0': {
    date: '2026-12-15',
    features: ['DatePicker', 'DateRangePicker'],
    stabilizing: [
      'Dialog', 'Popover', 'Tabs', 'AlertDialog', 'Collapsible', 'ExpansionPanel',
      'Treeview', 'Avatar', 'Pagination', 'Splitter', 'Select',
    ],
  },
}

/** A release with its bucket ids resolved to maturity-backed features. */
export interface ResolvedRelease {
  title: string
  date: string
  features: ResolvedFeature[]
  stabilizing: ResolvedFeature[]
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

/** Resolve a list of bucket ids into their maturity-backed features. */
function resolve (ids: string[] | undefined): ResolvedFeature[] {
  if (!ids) return []

  const result: ResolvedFeature[] = []
  for (const id of ids) {
    const feature = index.get(id)
    if (feature) result.push(feature)
  }
  return result
}

/** Resolve a milestone title's net-new features. */
export function featuresFor (title: string): ResolvedFeature[] {
  return resolve(ROADMAP_BUCKETS[title]?.features)
}

/** Resolve a milestone title's stabilizing (preview → stable) features. */
export function stabilizingFor (title: string): ResolvedFeature[] {
  return resolve(ROADMAP_BUCKETS[title]?.stabilizing)
}

/** Ordered, fully resolved releases for the release-calendar view. */
export function releases (): ResolvedRelease[] {
  return Object.entries(ROADMAP_BUCKETS).map(([title, bucket]) => ({
    title,
    date: bucket.date,
    features: resolve(bucket.features),
    stabilizing: resolve(bucket.stabilizing),
  }))
}

/** Bucket ids that no longer resolve against maturity.json (typos, renames). */
export function auditBuckets (): string[] {
  const unknown: string[] = []
  for (const [title, bucket] of Object.entries(ROADMAP_BUCKETS)) {
    for (const id of [...bucket.features, ...(bucket.stabilizing ?? [])]) {
      if (!index.has(id)) unknown.push(`${title}:${id}`)
    }
  }
  return unknown
}

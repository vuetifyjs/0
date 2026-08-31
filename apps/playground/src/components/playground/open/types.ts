// Framework
import { isArray, isObject, isString } from '@vuetify/v0'

// Types
import type { RegistryIndexEntry } from '@/data/registry'

/** Top-level Open dialog rails — product stacks + Vuetify One. */
export type OpenRail = 'v0' | 'vuetify' | 'saved'

/** Vuetify0 gallery kind chips (replaces the old per-kind rails). */
export type OpenKind = 'components' | 'composables' | 'plugins'

/** Vuetify One list chips. */
export type OpenSavedChip = 'all' | 'favorite'

/** Vuetify One list sort. */
export type OpenSavedSort = 'name' | 'created' | 'updated'

export interface OpenRailItem {
  id: OpenRail
  label: string
}

/** Product stack inferred from saved One content. */
export type PlaygroundStack = 'v0' | 'vuetify'

export interface VuetifyPlayground {
  id: string
  title: string
  content?: string
  favorite?: boolean
  pinned?: boolean
  locked?: boolean
  visibility?: 'private' | 'public'
  createdAt: string
  updatedAt: string
  /** Owner from API response (publicUserResponse shape). */
  owner?: { id: string }
  /** v0 vs Vuetify 4 — filled after content hydrate. */
  stack?: PlaygroundStack
}

const STACK_CACHE = new Map<string, PlaygroundStack>()

export function rememberedStack (id: string) {
  return STACK_CACHE.get(id)
}

export function rememberStack (id: string, stack: PlaygroundStack) {
  STACK_CACHE.set(id, stack)
}

/**
 * Classify a One `content` blob as Vuetify0 or Vuetify 4.
 * Play tuples are always Vuetify 4. Do not sniff file source for `vuetify`
 * imports — that mis-detected play single-file playgrounds as v0 (#666).
 */
export function playgroundStack (content: string | undefined): PlaygroundStack | undefined {
  if (!content) return undefined

  try {
    const parsed: unknown = JSON.parse(content)
    if (isArray(parsed)) return 'vuetify'
    if (!isObject(parsed) || !('files' in parsed) || !isObject(parsed.files)) return undefined

    const settings = 'settings' in parsed && isObject(parsed.settings)
      ? parsed.settings
      : undefined
    if (settings && isString(settings.preset) && settings.preset === 'vuetify') {
      return 'vuetify'
    }

    return 'v0'
  } catch {
    return undefined
  }
}

export function playgroundStackIcon (stack: PlaygroundStack | undefined) {
  if (stack === 'vuetify') return 'vuetify'
  if (stack === 'v0') return 'vuetify-0'
  return undefined
}

export function playgroundStackLabel (stack: PlaygroundStack | undefined) {
  if (stack === 'vuetify') return 'Vuetify 4'
  if (stack === 'v0') return 'Vuetify0'
  return undefined
}

/** Map legacy session rails (components/composables/plugins) → `v0`. */
export function normalizeOpenRail (value: string | undefined): OpenRail {
  if (value === 'vuetify' || value === 'saved' || value === 'v0') return value
  // Pre–Vuetify0-tab session values
  if (value === 'components' || value === 'composables' || value === 'plugins') return 'v0'
  return 'v0'
}

/** Registry entry → kind chip id. */
export function featureBucket (entry: RegistryIndexEntry): OpenKind {
  if (entry.category === 'plugins') return 'plugins'
  if (entry.type === 'composables') return 'composables'
  return 'components'
}

export function featureKindLabel (kind: OpenKind) {
  if (kind === 'plugins') return 'Plugin'
  if (kind === 'composables') return 'Composable'
  return 'Component'
}

export function exampleLabel (count: number) {
  return count === 1 ? '1 example' : `${count} examples`
}

/**
 * Plain-text blurb for gallery cards.
 * Strips light markdown (backticks, emphasis, links) — not worth a parser.
 */
export function blurb (text: string, max = 96) {
  const cleaned = text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= max) return cleaned
  return `${cleaned.slice(0, max - 1).trimEnd()}…`
}

export function formatDate (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function sortPlaygrounds (
  items: VuetifyPlayground[],
  sort: OpenSavedSort,
  dir: 'asc' | 'desc' = sort === 'name' ? 'asc' : 'desc',
) {
  const sign = dir === 'asc' ? 1 : -1
  return items.toSorted((a, b) => {
    if (sort === 'name') {
      return sign * (a.title || 'Untitled').localeCompare(b.title || 'Untitled')
    }
    const left = sort === 'created' ? a.createdAt : a.updatedAt
    const right = sort === 'created' ? b.createdAt : b.updatedAt
    return sign * (Date.parse(left) - Date.parse(right))
  })
}

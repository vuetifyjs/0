// Types
import type { RegistryIndexEntry } from '@/data/registry'

/** Top-level Open dialog rails — product stacks + Vuetify One. */
export type OpenRail = 'v0' | 'vuetify' | 'saved'

/** Vuetify0 gallery kind chips (replaces the old per-kind rails). */
export type OpenKind = 'components' | 'composables' | 'plugins'

export interface OpenRailItem {
  id: OpenRail
  label: string
}

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

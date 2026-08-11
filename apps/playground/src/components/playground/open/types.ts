// Types
import type { RegistryIndexEntry } from '@/data/registry'

export type OpenRail = 'components' | 'composables' | 'plugins' | 'vuetify' | 'saved'

export type OpenRailDocs = Exclude<OpenRail, 'saved' | 'vuetify'>

export interface OpenRailItem {
  id: OpenRailDocs
  label: string
}

export interface VuetifyPlayground {
  id: string
  title: string
  content?: string
  createdAt: string
  updatedAt: string
}

export function bucketOf (entry: RegistryIndexEntry): OpenRailDocs {
  if (entry.category === 'plugins') return 'plugins'
  if (entry.type === 'composables') return 'composables'
  return 'components'
}

export function exampleLabel (count: number) {
  return count === 1 ? '1 example' : `${count} examples`
}

/**
 * Truncate a one-line description for gallery cards.
 * Avoids cutting mid-`` `code` `` so backticks stay balanced for markdown.
 */
export function blurb (text: string, max = 96) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned

  let cut = cleaned.slice(0, max - 1)
  // Odd backtick count → truncated inside a code span; back up to its open tick.
  const ticks = cut.match(/`/g)?.length ?? 0
  if (ticks % 2 === 1) {
    const open = cut.lastIndexOf('`')
    if (open > 0) cut = cut.slice(0, open)
  }

  return `${cut.trimEnd()}…`
}

export function formatDate (iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

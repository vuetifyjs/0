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

export function blurb (text: string, max = 96) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
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

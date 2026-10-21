// Data
import { fileType } from '@/data/file-types'

// Utilities
import { isString } from '#v0/utilities'

// Types
import type { RegistryIndexEntry } from '@/data/registry'

/** Top-level Open dialog rails — your One content, then example stacks. */
export type OpenRail = 'v0' | 'vuetify' | 'saved' | 'bins'

/** Default Open dialog rail. Persisted per-browser via `useStorage`. */
export const DEFAULT_OPEN_RAIL: OpenRail = 'saved'

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

/** Languages the REPL compiles. Other bins are still added as files. */
const REPL_BIN_EXT: Record<string, string> = {
  vue: 'vue',
  javascript: 'js',
  typescript: 'ts',
  css: 'css',
  json: 'json',
  html: 'html',
}

/** Bin language → filename extension. Unknown and empty languages become `.txt`. */
const BIN_FILE_EXT: Record<string, string> = {
  ...REPL_BIN_EXT,
  markdown: 'md',
  sass: 'sass',
  shell: 'sh',
  python: 'py',
  php: 'php',
  yaml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  go: 'go',
  rust: 'rs',
  java: 'java',
  cpp: 'cpp',
  text: 'txt',
}

/** File extension for a bin the REPL can compile, or undefined. */
export function binReplExt (language: string | null | undefined): string | undefined {
  if (!isString(language)) return undefined
  return REPL_BIN_EXT[language.toLowerCase()]
}

/** Filename extension for any bin, including ones the REPL does not compile. */
export function binFileExt (language: string | null | undefined): string {
  if (!isString(language)) return 'txt'
  return BIN_FILE_EXT[language.toLowerCase()] ?? 'txt'
}

/**
 * Path for a copied bin inside the current playground.
 * Uses the title as the file stem. A name already in the project gets `-2`, `-3`, …
 */
export function binCopyPath (
  title: string | null | undefined,
  ext: string,
  taken: (path: string) => boolean,
): string {
  const stem = (isString(title) ? title : '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'bin'
  let path = `src/${stem}.${ext}`
  let index = 2
  while (taken(path)) {
    path = `src/${stem}-${index}.${ext}`
    index++
  }
  return path
}

const BIN_LANGUAGE_LABEL: Record<string, string> = {
  vue: 'Vue',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  css: 'CSS',
  json: 'JSON',
  html: 'HTML',
  markdown: 'Markdown',
  python: 'Python',
  shell: 'Shell',
  yaml: 'YAML',
}

/** Short language name for a bin row. */
export function binLanguageLabel (language: string | null | undefined) {
  if (!isString(language) || language.length === 0) return 'Text'
  const key = language.toLowerCase()
  return BIN_LANGUAGE_LABEL[key] ?? language
}

/** Stable id for the bin file-type filter. Empty languages share `text`. */
export function binTypeKey (language: string | null | undefined) {
  if (!isString(language) || language.length === 0) return 'text'
  return language.toLowerCase()
}

export interface BinTypeOption {
  id: string
  label: string
  count: number
  icon: string
  color: string
}

/** File types present in a bin list, alphabetical, one row per language. */
export function binTypeOptions (bins: Array<{ language?: string | null }>): BinTypeOption[] {
  const counts = new Map<string, BinTypeOption>()
  for (const bin of bins) {
    const id = binTypeKey(bin.language)
    const existing = counts.get(id)
    if (existing) {
      existing.count += 1
      continue
    }
    const type = binFileType(bin.language)
    counts.set(id, {
      id,
      label: binLanguageLabel(bin.language),
      count: 1,
      icon: type?.icon ?? 'file',
      color: type?.color ?? '',
    })
  }
  return [...counts.values()].toSorted((a, b) => a.label.localeCompare(b.label))
}

/** Keep bins of one file type. `all` leaves the list alone. */
export function binsOfType<T extends { language?: string | null }> (items: T[], type: string) {
  if (type === 'all') return items
  return items.filter(item => binTypeKey(item.language) === type)
}

/** File-tree icon for a bin language. Unknown languages use the text-file mark. */
export function binFileType (language: string | null | undefined) {
  return fileType(`file.${binFileExt(language)}`)
}

/** Map legacy session rails (components/composables/plugins) → `v0`. */
export function normalizeOpenRail (value: string | undefined): OpenRail {
  if (value === 'vuetify' || value === 'saved' || value === 'v0' || value === 'bins') return value
  // Pre–Vuetify0-tab session values
  if (value === 'components' || value === 'composables' || value === 'plugins') return 'v0'
  return DEFAULT_OPEN_RAIL
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

export interface VuetifyBin {
  id: string
  title: string
  content: string
  language: string | null
  favorite?: boolean
  pinned?: boolean
  createdAt: string
  updatedAt: string
}

export function sortPlaygrounds<T extends {
  title: string
  createdAt: string
  updatedAt: string
}> (
  items: T[],
  sort: OpenSavedSort,
  dir: 'asc' | 'desc' = sort === 'name' ? 'asc' : 'desc',
): T[] {
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

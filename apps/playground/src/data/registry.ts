/**
 * Official docs seed registry (`/registry/*`) — same catalog the CLI uses for
 * `vuetify add`. Playground resolves short deep-links and the "Docs examples"
 * browser against this surface.
 */

// Composables
import { buildPlaygroundFiles } from '@/composables/usePlayground'

export const DEFAULT_REGISTRY
  = (import.meta.env.VITE_REGISTRY_URL as string | undefined)?.replace(/\/$/, '')
    || 'https://0.vuetifyjs.com'

export type RegistryItemType = 'components' | 'composables'

export interface RegistryIndexEntry {
  name: string
  type: RegistryItemType
  category: string
  level: string
  title: string
  description: string
  docs: string
  examples: string[]
}

export interface RegistryIndex {
  version: number
  v0Version: string
  tokens: string[]
  items: RegistryIndexEntry[]
}

export interface RegistryFile {
  path: string
  name: string
  entry: boolean
  content: string
}

export interface RegistryExample {
  id: string
  title: string
  description: string
  dir: string
  files: RegistryFile[]
  dependencies: string[]
  tokens: string[]
  icons?: { collections: string[], classes: string[] }
}

export interface RegistryItem {
  name: string
  type: RegistryItemType
  category: string
  level: string
  title: string
  description: string
  docs: string
  examples: RegistryExample[]
}

export interface RegistryExampleRef {
  /** Feature name, e.g. `dialog` or `use-theme`. */
  item: string
  /** Example id within the feature, e.g. `basic`. Defaults to basic/first. */
  example?: string
  /** Disambiguate when the same name exists in both trees. */
  type?: RegistryItemType
  /** Registry origin (docs site root). */
  registry?: string
}

export interface ResolvedPlaygroundExample {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  meta: {
    item: RegistryItem
    example: RegistryExample
    origin: string
  }
}

const RE_TRAILING_SLASH = /\/$/
const RE_SEPARATORS = /[\s_]+/g
const RE_FACTORY_PREFIX = /^(create|use)-/

function originOf (registry?: string) {
  return (registry ?? DEFAULT_REGISTRY).replace(RE_TRAILING_SLASH, '')
}

async function getJson<T> (origin: string, path: string): Promise<T> {
  const url = `${originOf(origin)}/registry/${path}`
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    .catch((error: Error) => {
      throw new Error(`Registry ${url} unreachable (${error.message})`)
    })
  if (!response.ok) {
    throw new Error(`Registry ${url} responded with ${response.status}`)
  }
  return await response.json() as T
}

export async function getRegistryIndex (registry?: string): Promise<RegistryIndex> {
  return getJson(originOf(registry), 'index.json')
}

export async function getRegistryItem (
  entry: Pick<RegistryIndexEntry, 'type' | 'name'>,
  registry?: string,
): Promise<RegistryItem> {
  return getJson(originOf(registry), `${entry.type}/${entry.name}.json`)
}

/**
 * Match a user/query name to a registry index entry.
 * Same loose matching as the CLI: exact → bare create/use strip → includes.
 */
function matchRegistryItem (
  index: RegistryIndex,
  query: string,
  type?: RegistryItemType,
): RegistryIndexEntry | undefined {
  const needle = query.trim().toLowerCase().replace(RE_SEPARATORS, '-')
  const pool = type ? index.items.filter(i => i.type === type) : index.items

  const exact = pool.filter(item => item.name === needle)
  if (exact.length === 1) return exact[0]
  if (exact.length > 1 && type) return exact[0]
  if (exact.length > 1) return exact[0]

  const bare = pool.filter(item => item.name.replace(RE_FACTORY_PREFIX, '') === needle)
  if (bare.length > 0) return bare[0]

  return pool.find(item => item.name.includes(needle) || needle.includes(item.name))
}

function pickExample (
  item: RegistryItem,
  exampleId?: string,
): RegistryExample | undefined {
  if (item.examples.length === 0) return undefined
  if (exampleId) {
    return item.examples.find(e => e.id === exampleId)
      ?? item.examples.find(e => e.id === exampleId.replace(/\.vue$/, ''))
  }
  return item.examples.find(e => e.id === 'basic') ?? item.examples[0]
}

/** Map registry example files into the shape `loadExample` expects. */
function exampleToPlayground (example: RegistryExample): {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
} {
  const input = example.files.map(file => ({ name: file.name, code: file.content }))
  const files = buildPlaygroundFiles(input)
  const entry = example.files.find(file => file.entry)
  const imports: Record<string, string> = {}

  for (const dep of example.dependencies) {
    if (dep === 'vue' || dep.startsWith('vue/') || dep === '@vuetify/v0') continue
    imports[dep] = `https://esm.sh/${dep}`
  }

  return {
    files,
    active: entry ? `src/${entry.name}` : undefined,
    imports: Object.keys(imports).length > 0 ? imports : undefined,
  }
}

/**
 * Parse playground search params into a registry ref.
 *
 * Supported:
 * - `?example=dialog`
 * - `?example=dialog/basic`
 * - `?example=components/dialog/basic`
 * - `?item=dialog&example=basic`
 * - `?registry=https://…` (any of the above)
 */
export function parseRegistryQuery (params: URLSearchParams): RegistryExampleRef | null {
  const registry = params.get('registry') ?? undefined
  const itemParam = params.get('item')
  const exampleParam = params.get('example')

  if (itemParam) {
    const parsed = splitItemRef(itemParam)
    return {
      ...parsed,
      example: exampleParam ?? undefined,
      registry,
    }
  }

  if (!exampleParam) return null

  const parts = exampleParam.split('/').filter(Boolean)
  if (parts.length === 0) return null

  if (parts.length === 1) {
    return { item: parts[0]!, registry }
  }

  if (parts[0] === 'components' || parts[0] === 'composables') {
    if (parts.length === 2) {
      return { type: parts[0], item: parts[1]!, registry }
    }
    return {
      type: parts[0],
      item: parts[1]!,
      example: parts.slice(2).join('/'),
      registry,
    }
  }

  return {
    item: parts[0]!,
    example: parts.slice(1).join('/'),
    registry,
  }
}

function splitItemRef (value: string): Pick<RegistryExampleRef, 'item' | 'type'> {
  const parts = value.split('/').filter(Boolean)
  if (
    parts.length >= 2
    && (parts[0] === 'components' || parts[0] === 'composables')
  ) {
    return { type: parts[0], item: parts[1]! }
  }
  return { item: value }
}

/** Fetch + resolve a registry example into playground files. */
export async function resolveRegistryExample (
  ref: RegistryExampleRef,
): Promise<ResolvedPlaygroundExample> {
  const origin = originOf(ref.registry)
  const index = await getRegistryIndex(origin)
  const entry = matchRegistryItem(index, ref.item, ref.type)
  if (!entry) {
    throw new Error(`Nothing in the registry matches "${ref.item}"`)
  }

  const item = await getRegistryItem(entry, origin)
  const example = pickExample(item, ref.example)
  if (!example) {
    throw new Error(
      ref.example
        ? `"${entry.name}" has no example "${ref.example}"`
        : `"${entry.name}" has no examples to open`,
    )
  }

  const payload = exampleToPlayground(example)
  return {
    ...payload,
    meta: { item, example, origin },
  }
}

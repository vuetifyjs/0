/**
 * Shared utility to discover API names from component and composable directories.
 * Used by both SSG route generation and nav generation.
 */

import { readFile, readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const COMPONENTS_DIR = resolve(ROOT, 'packages/0/src/components')
const COMPOSABLES_DIR = resolve(ROOT, 'packages/0/src/composables')
const COMPOSABLES_BARREL = resolve(COMPOSABLES_DIR, 'index.ts')

export interface ApiNameInfo {
  name: string
  slug: string
  kind: 'component' | 'composable'
  /** For components: which folder they're in (e.g., 'Avatar', 'Selection') */
  group?: string
}

/**
 * Convert PascalCase, camelCase, or dot notation to kebab-case
 */
export function toKebab (str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Convert kebab-case to PascalCase
 */
export function toPascal (str: string): string {
  return str.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
}

/**
 * Convert kebab-case to camelCase (for composables like use-registry -> useRegistry)
 */
export function toCamel (str: string): string {
  const parts = str.split('-')
  return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
}

/**
 * Discover all component names from the packages/0/src/components directory.
 * Returns one entry per component folder (e.g., Avatar, Popover) since
 * the API page displays all sub-components together.
 */
async function getComponentNames (): Promise<ApiNameInfo[]> {
  const names: ApiNameInfo[] = []
  const dirs = await readdir(COMPONENTS_DIR)

  for (const dir of dirs) {
    const dirPath = resolve(COMPONENTS_DIR, dir)
    const entries = await readdir(dirPath).catch(() => [])

    // Only include if the folder has .vue files
    const hasVueFiles = entries.some(entry => entry.endsWith('.vue'))
    if (hasVueFiles) {
      names.push({
        name: dir,
        slug: toKebab(dir),
        kind: 'component',
        group: dir,
      })
    }
  }

  return names
}

/**
 * Read the public composable surface from the barrel (index.ts).
 *
 * Discovery must mirror the public API, not the filesystem. Internal-only
 * composables (e.g., createFocusTraversal, createObserver) live in their own
 * directories but are never re-exported, so they must not leak into the SSG
 * routes or nav — otherwise they mint orphan /api/:name pages with no matching
 * docs page or API data. The barrel is the single source of truth: every line
 * is `export * from './<dirName>'`. This mirrors generate-api.ts and
 * generate-api-whitelist.ts, so a new internal composable is excluded
 * automatically with no blocklist to maintain.
 */
async function getPublicComposableDirs (): Promise<Set<string>> {
  const content = await readFile(COMPOSABLES_BARREL, 'utf8')
  const dirs = new Set<string>()

  for (const match of content.matchAll(/export\s+\*\s+from\s+'\.\/([^']+)'/g)) {
    dirs.add(match[1])
  }

  return dirs
}

/**
 * Discover all composable names from the packages/0/src/composables directory.
 * Only includes directories re-exported from the public barrel that have an
 * index.ts file.
 */
async function getComposableNames (): Promise<ApiNameInfo[]> {
  const names: ApiNameInfo[] = []
  const [dirs, publicDirs] = await Promise.all([
    readdir(COMPOSABLES_DIR),
    getPublicComposableDirs(),
  ])

  for (const dir of dirs) {
    // Only composables re-exported from the public barrel are part of the API.
    if (!publicDirs.has(dir)) continue

    // Only include if the directory has an index.ts file
    const dirPath = resolve(COMPOSABLES_DIR, dir)
    const entries = await readdir(dirPath).catch(() => [] as string[])
    const hasIndexTs = entries.includes('index.ts')
    if (!hasIndexTs) continue

    names.push({
      name: dir,
      slug: toKebab(dir),
      kind: 'composable',
    })
  }

  return names
}

/**
 * Get all API names (components and composables)
 */
export async function getApiNames (): Promise<ApiNameInfo[]> {
  const [components, composables] = await Promise.all([
    getComponentNames(),
    getComposableNames(),
  ])

  return [...components, ...composables]
}

/**
 * Get just the slugs for SSG route generation
 */
export async function getApiSlugs (): Promise<string[]> {
  const names = await getApiNames()
  return names.map(n => n.slug)
}

/**
 * Get names grouped by kind for nav generation
 */
export async function getApiNamesGrouped (): Promise<{
  components: ApiNameInfo[]
  composables: ApiNameInfo[]
}> {
  const names = await getApiNames()
  return {
    components: names.filter(n => n.kind === 'component'),
    composables: names.filter(n => n.kind === 'composable'),
  }
}

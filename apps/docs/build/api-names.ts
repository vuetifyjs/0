/**
 * Shared utility to discover API names from component and composable directories.
 * Used by both SSG route generation and nav generation.
 */

import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const COMPONENTS_DIR = resolve(ROOT, 'packages/0/src/components')
const COMPOSABLES_DIR = resolve(ROOT, 'packages/0/src/composables')

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
 * Discover all composable names from the packages/0/src/composables directory.
 * Only includes directories that have an index.ts file.
 */
async function getComposableNames (): Promise<ApiNameInfo[]> {
  const names: ApiNameInfo[] = []
  const dirs = await readdir(COMPOSABLES_DIR)

  for (const dir of dirs) {
    // Composable directories start with 'use' or 'create'
    if (!dir.startsWith('use') && !dir.startsWith('create')) continue

    // Only include if the directory has an index.ts file
    const dirPath = resolve(COMPOSABLES_DIR, dir)
    const entries = await readdir(dirPath).catch(() => [])
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

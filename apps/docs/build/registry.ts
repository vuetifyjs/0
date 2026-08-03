/**
 * Registry builder for `vuetify add <feature>`.
 *
 * Consumers of @vuetify/v0 can install the package, but a bare import renders
 * nothing — v0 is headless. What they cannot get today is a working, styled,
 * runnable file. This module turns the authored docs examples into a static
 * registry the CLI fetches to write those files into a user's project.
 *
 * The source of truth is the `::: gn-example` / `::: example` directive already
 * present in every feature page. Those blocks declare an ordered file manifest,
 * external dependencies (`@import`), a title, and prose — all hand-authored, so
 * the registry inherits curation instead of guessing from a directory listing.
 *
 * Emits three shapes:
 * - `registry/index.json`   slim catalog for listing, fuzzy match, completion
 * - `registry/{type}/{name}.json`  one item with full file contents
 * - `registry/tokens.json`  the semantic token contract + config snippets
 */

import { readFile, glob } from 'node:fs/promises'
import { basename, dirname, extname, posix, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseFrontmatter } from './frontmatter'

import pkg from '../../../packages/0/package.json' with { type: 'json' }
import maturity from '../../../packages/0/src/maturity.json' with { type: 'json' }
// Imported from the leaf module rather than the `@vuetify/v0/theme` barrel:
// this file is pulled into the Vite config, where the package's own aliases do
// not resolve and the barrel would drag the theme runtime in with it.
import { SEMANTIC_COLORS } from '../../../packages/0/src/theme/tokens'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const EXAMPLES_DIR = resolve(__dirname, '../src/examples')

/** Registry payload version. Bump on any breaking shape change. */
export const REGISTRY_VERSION = 1

export const DOCS_ORIGIN = 'https://0.vuetifyjs.com'

/**
 * The semantic colors a copied example may rely on.
 *
 * Owned by `packages/0/src/theme`, not by this build, because the guarantee is
 * the theme layer's: those are the names `createThemePlugin` emits and a
 * consumer maps. The docs theme additionally defines chrome-only colors (`accent`,
 * `discord`, `github`, `pre`, `vue`) that no consumer project has, so an
 * example reaching for one is a portability bug — `build()` reports it and the
 * production build fails rather than shipping a demo that renders unstyled.
 */
export const PORTABLE_TOKENS = SEMANTIC_COLORS

/** Utility prefixes that can take a semantic color token. */
const COLOR_PREFIXES = [
  'accent', 'bg', 'border', 'caret', 'decoration', 'divide', 'fill', 'from',
  'outline', 'placeholder', 'ring', 'shadow', 'stroke', 'text', 'to', 'via',
]

export type ItemType = 'components' | 'composables'

export interface RegistryFile {
  /** Path relative to the examples root, e.g. `components/combobox/user-picker.vue`. */
  path: string
  /** Basename written into the destination directory. */
  name: string
  /** True for the file that renders the demo — the last `.vue` in the manifest. */
  entry: boolean
  content: string
}

export interface RegistryExample {
  id: string
  title: string
  description: string
  /**
   * Destination subdirectory, mirroring the docs layout minus the type segment
   * (`combobox`, `create-data-table/basic`). Mirroring keeps multiple examples
   * of one feature collision-free by construction.
   */
  dir: string
  files: RegistryFile[]
  /** Bare package specifiers imported by the files, `@vuetify/v0` included. */
  dependencies: string[]
  /** Semantic tokens the files use — the CLI's styling preflight reads this. */
  tokens: string[]
  /**
   * UnoCSS icon utilities (`i-lucide-*`, `i-mdi-*`, …). create-vuetify0 does not
   * install an icon preset by default — the CLI surfaces these as soft deps.
   */
  icons: string[]
}

export interface RegistryItem {
  name: string
  type: ItemType
  category: string
  level: string
  title: string
  description: string
  docs: string
  examples: RegistryExample[]
}

export interface RegistryIndexEntry {
  name: string
  type: ItemType
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
  tokens: readonly string[]
  items: RegistryIndexEntry[]
}

export interface Registry {
  index: RegistryIndex
  items: RegistryItem[]
  warnings: string[]
}

function kebab (value: string): string {
  return value
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Maturity metadata keyed by kebab name, so a `create-data-table` example
 * folder can find the `createDataTable` entry.
 */
function index (source: Record<string, unknown>, type: ItemType) {
  const result = new Map<string, { type: ItemType, category: string, level: string, description: string }>()

  for (const [name, meta] of Object.entries(source)) {
    const entry = meta as { category?: string, level?: string, description?: string }
    result.set(kebab(name), {
      type,
      category: entry.category ?? 'uncategorized',
      level: entry.level ?? 'draft',
      description: entry.description ?? '',
    })
  }

  return result
}

const META = new Map([
  ...index(maturity.components as Record<string, unknown>, 'components'),
  ...index(maturity.composables as Record<string, unknown>, 'composables'),
])

interface Block {
  paths: string[]
  imports: string[]
  title: string
  description: string
}

/**
 * Extract example blocks from a markdown body.
 *
 * Mirrors the container parsing in `markdown.ts`: lines starting with `/` are
 * file paths (with an optional trailing display order), `@import pkg [url]`
 * declares an external dependency, the first `###` is the title, and the
 * remaining prose is the description.
 */
export function blocks (body: string): Block[] {
  const found: Block[] = []
  const lines = body.split('\n')

  let current: Block | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^:::\s*(gn-)?example\b/.test(trimmed)) {
      current = { paths: [], imports: [], title: '', description: '' }
      continue
    }

    if (!current) continue

    if (trimmed === ':::') {
      if (current.paths.length > 0) found.push(current)
      current = null
      continue
    }

    if (trimmed.startsWith('/') && trimmed.length > 1) {
      current.paths.push(trimmed.replace(/\s+\d+$/, '').slice(1))
    } else if (trimmed.startsWith('@import ')) {
      const rest = trimmed.slice(8).trim()
      const space = rest.indexOf(' ')
      const name = space > 0 ? rest.slice(0, space) : rest
      if (name) current.imports.push(name)
    } else if (trimmed.startsWith('###')) {
      current.title ||= trimmed.replace(/^#+\s*/, '')
    } else if (trimmed && !trimmed.startsWith('|') && !trimmed.startsWith('#')) {
      current.description ||= trimmed
    }
  }

  return found
}

/** Bare package specifiers imported by a source file. */
function specifiers (content: string): string[] {
  const found = new Set<string>()
  const pattern = /(?:from|import)\s+['"]([^'"]+)['"]/g

  for (const match of content.matchAll(pattern)) {
    const value = match[1]
    if (value.startsWith('.') || value.startsWith('/') || value.startsWith('@/')) continue
    // Keep the package name, drop deep subpaths: `@vuetify/v0/x` -> `@vuetify/v0`.
    const parts = value.split('/')
    found.add(value.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0])
  }

  return [...found].toSorted()
}

/**
 * UnoCSS icon utility classes (`i-lucide-mail`, `i-mdi-close`, …).
 * create-vuetify0 scaffolds do not install icon collections — the CLI reads
 * this list as soft deps rather than hard-failing the registry build.
 */
export function icons (content: string): string[] {
  const found = new Set<string>()
  for (const match of content.matchAll(/\bi-(?:lucide|mdi|carbon|ph|heroicons|tabler)-[\w-]+\b/g)) {
    found.add(match[0])
  }
  return [...found].toSorted()
}

/**
 * Semantic tokens used by a source file.
 *
 * Matches longest-first so `bg-surface-tint` is not read as `bg-surface`, and
 * tolerates an opacity modifier (`bg-accent/15`). Only the known token universe
 * is matched, so ordinary utilities (`text-sm`, `border-b`) never collide.
 */
export function tokens (content: string, universe: readonly string[]): string[] {
  const sorted = universe.toSorted((a, b) => b.length - a.length)
  const pattern = new RegExp(
    String.raw`\b(?:${COLOR_PREFIXES.join('|')})-(${sorted.join('|')})(?:/\d+)?\b`,
    'g',
  )

  const found = new Set<string>()
  for (const match of content.matchAll(pattern)) found.add(match[1])

  return [...found].toSorted()
}

/** Docs-site chrome colors — present in the docs theme, absent from templates. */
async function chrome (): Promise<string[]> {
  const config = await readFile(resolve(__dirname, '../uno.config.ts'), 'utf8')
  const names = [...config.matchAll(/'([a-z\d-]+)':\s*'var\(--v0-[a-z\d-]+\)'/g)].map(m => m[1])

  return names.filter(name => !(PORTABLE_TOKENS as readonly string[]).includes(name))
}

/** Resolve a directive path to a file on disk, appending `.vue` when bare. */
function resolveFile (path: string): string {
  return extname(path) ? path : `${path}.vue`
}

export async function build (): Promise<Registry> {
  const unportable = await chrome()
  const universe = [...PORTABLE_TOKENS, ...unportable]
  const warnings: string[] = []
  const items = new Map<string, RegistryItem>()

  for await (const file of glob('**/*.md', { cwd: PAGES_DIR })) {
    const path = resolve(PAGES_DIR, file)
    const { frontmatter, body } = parseFrontmatter(await readFile(path, 'utf8'))

    const category = frontmatter.features?.category
    if (category !== 'Component' && category !== 'Composable') continue

    const type: ItemType = category === 'Component' ? 'components' : 'composables'
    const name = basename(file, '.md')
    const meta = META.get(name)

    if (!meta) {
      warnings.push(`[registry] ${file}: no maturity.json entry for "${name}" — skipped`)
      continue
    }

    const docs = `${DOCS_ORIGIN}/${posix.join(...file.split(sep)).replace(/\.md$/, '')}`
    const examples: RegistryExample[] = []

    for (const block of blocks(body)) {
      const paths = block.paths.map(resolveFile)

      // Only blocks belonging to this feature's own example folder. Pages
      // occasionally embed a sibling's example; those belong to that item.
      if (!paths.every(p => p.startsWith(`${type}/${name}/`))) continue

      const files: RegistryFile[] = []
      const dependencies = new Set(block.imports)
      const used = new Set<string>()
      const usedIcons = new Set<string>()
      let incomplete = false

      // The last `.vue` in the manifest renders the demo — see .claude/rules/docs.md.
      const last = paths.findLastIndex(p => p.endsWith('.vue'))

      for (const [order, relativePath] of paths.entries()) {
        const absolute = resolve(EXAMPLES_DIR, relativePath)
        const content = await readFile(absolute, 'utf8').catch(() => null)

        if (content === null) {
          warnings.push(`[registry] ${file}: missing example file "${relativePath}"`)
          incomplete = true
          continue
        }

        for (const specifier of specifiers(content)) dependencies.add(specifier)
        for (const token of tokens(content, universe)) used.add(token)
        for (const icon of icons(content)) usedIcons.add(icon)

        files.push({
          path: relativePath,
          name: basename(relativePath),
          entry: order === last,
          content,
        })
      }

      // A missing path leaves a half-built payload (`entry` may never be true).
      // Skip the whole block rather than shipping an incomplete tree to the CLI.
      if (incomplete || files.length === 0) continue

      const lower = new Map<string, string>()
      for (const item of files) {
        const key = item.name.toLowerCase()
        const prev = lower.get(key)
        if (prev && prev !== item.name) {
          warnings.push(
            `[registry] ${file}: case-colliding basenames "${prev}" and "${item.name}" `
            + `— the CLI writes flat basenames and will overwrite or fail on `
            + `case-insensitive filesystems (macOS/Windows). Rename one of them.`,
          )
        }
        lower.set(key, item.name)
      }

      const leaked = [...used].filter(token => unportable.includes(token))
      if (leaked.length > 0) {
        warnings.push(
          `[registry] ${relative(EXAMPLES_DIR, resolve(EXAMPLES_DIR, files[0].path))}: `
          + `uses docs-only token(s) ${leaked.join(', ')} — these have no mapping in a `
          + `consumer project and will render unstyled. Use a portable token instead.`,
        )
      }

      // Mirror the docs layout below the type segment so two examples of the
      // same feature never collide on a shared filename.
      const dir = relative(`${type}/${name}`, dirname(files[0].path)) === ''
        ? name
        : posix.join(name, relative(`${type}/${name}`, dirname(files[0].path)).split(sep).join('/'))

      const id = dir === name
        ? basename(files.at(-1)!.name, extname(files.at(-1)!.name))
        : basename(dir)

      // Usage blocks render as a bare peek with no `###`, so fall back to the
      // id rather than leaving the CLI to display a blank label.
      const title = block.title || id.replace(/(^|-)([a-z])/g, (_, lead, char) => `${lead ? ' ' : ''}${char.toUpperCase()}`)

      examples.push({
        id,
        title,
        description: block.description,
        dir,
        files,
        dependencies: [...dependencies].toSorted(),
        tokens: [...used].toSorted(),
        icons: [...usedIcons].toSorted(),
      })
    }

    if (examples.length === 0) continue

    items.set(`${type}/${name}`, {
      name,
      type,
      category: meta.category,
      level: meta.level,
      title: frontmatter.title?.split(' - ')[0] ?? name,
      description: meta.description || frontmatter.description || '',
      docs,
      examples,
    })
  }

  const sorted = [...items.values()].toSorted((a, b) => a.name.localeCompare(b.name))

  return {
    index: {
      version: REGISTRY_VERSION,
      v0Version: pkg.version,
      tokens: PORTABLE_TOKENS,
      items: sorted.map(item => ({
        name: item.name,
        type: item.type,
        category: item.category,
        level: item.level,
        title: item.title,
        description: item.description,
        docs: item.docs,
        examples: item.examples.map(example => example.id),
      })),
    },
    items: sorted,
    warnings,
  }
}

/**
 * The styling contract, shipped so the CLI has one source of truth rather than
 * a copy that drifts. Both snippets are the ones the `create-vuetify0`
 * templates already write, so an `add` into a scaffolded project is a no-op.
 */
export function contract () {
  const colors = PORTABLE_TOKENS.map(token => `    '${token}': 'var(--v0-${token})',`).join('\n')
  const theme = PORTABLE_TOKENS.map(token => `  --color-${token}: var(--v0-${token});`).join('\n')

  return {
    version: REGISTRY_VERSION,
    tokens: PORTABLE_TOKENS,
    prefix: '--v0-',
    unocss: `theme: {\n  colors: {\n${colors}\n  },\n},`,
    tailwind: `@theme inline {\n${theme}\n}`,
  }
}

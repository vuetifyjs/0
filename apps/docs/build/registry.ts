/**
 * Official seed registry for `vuetify add <feature>`.
 *
 * v0 is headless: installing `@vuetify/v0` and importing a primitive does not
 * yield a rendered UI. This module turns curated docs examples into a static
 * catalog the CLI seeds into a user's project — the on-ramp for a local
 * component library they own (track via `vuetify.json`, later publish).
 *
 * Source of truth is the `::: gn-example` / `::: example` directive already on
 * every feature page: ordered file manifest, `@import` deps, title, and prose.
 * Joined with maturity.json for type/category/level and the page path for docs.
 *
 * Emits three shapes:
 * - `registry/index.json`   slim catalog for listing, fuzzy match, completion
 * - `registry/{type}/{name}.json`  one item with full file contents
 * - `registry/tokens.json`  the semantic token contract + config snippets
 *
 * Same item schema is intended for user-built registries later; keep fields
 * actionable for install (npm deps, token names, icon *collections*).
 */

import { readFile, realpath, glob } from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, posix, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseFrontmatter } from './frontmatter'

// Imported from the leaf module rather than the `@vuetify/v0/theme` barrel:
// this file is pulled into the Vite config, where the package's own aliases do
// not resolve and the barrel would drag the theme runtime in with it.
import { SEMANTIC_COLORS } from '../../../packages/0/src/theme/tokens'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const EXAMPLES_DIR = resolve(__dirname, '../src/examples')
const PKG_JSON = resolve(__dirname, '../../../packages/0/package.json')
const MATURITY_JSON = resolve(__dirname, '../../../packages/0/src/maturity.json')

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

/**
 * Docs frontmatter `features.category` → registry bucket.
 *
 * Plugins and transformers live under `composables/*` on disk and in maturity.json;
 * only Components use the `components/` examples tree. API/guide pages are skipped.
 */
export function itemType (category: string | undefined): ItemType | undefined {
  if (category === 'Component') return 'components'
  if (
    category === 'Composable'
    || category === 'Plugin'
    || category === 'Transformer'
  ) {
    return 'composables'
  }
  return undefined
}

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
   * Icon soft-deps. `collections` is what install tooling acts on (`lucide`,
   * `mdi`); `classes` is the full utility list for audit. create-vuetify0 does
   * not install an icon preset by default.
   */
  icons: RegistryIcons
}

/**
 * Icons referenced by an example. Collections are the install unit; classes are
 * optional detail (never substitute for collections in a soft-deps installer).
 */
export interface RegistryIcons {
  collections: string[]
  classes: string[]
}

/**
 * App-level install recipe for plugins. CLI wires `factory` into the consumer
 * app (`src/plugins/<file>`, `app.use(...)`). Derived from the registry item
 * name (`use-theme` → `createThemePlugin` / `theme.ts`); label is the docs surface.
 */
export interface RegistryInstall {
  factory: string
  label: string
  file: string
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
  /** Present when `category === 'plugins'`. */
  install?: RegistryInstall
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

/** Feature / page stem: kebab-case only (basename of the docs page). */
export const RE_SAFE_NAME = /^[a-z][a-z0-9-]*$/

/** Generated create*Plugin factory identifiers only. */
export const RE_SAFE_FACTORY = /^create[A-Z][A-Za-z0-9]*Plugin$/

/** Plugin module basenames written under src/plugins/. */
export const RE_SAFE_PLUGIN_FILE = /^[a-z][a-z0-9-]*\.ts$/

/**
 * `use-theme` → `{ factory: 'createThemePlugin', label: 'useTheme', file: 'theme.ts' }`.
 * Label prefers the page title (pre-emdash segment); falls back to camelCase of name.
 * Returns `null` when the name would not produce a safe factory/file (never emit).
 */
export function pluginInstall (name: string, title?: string): RegistryInstall | null {
  if (!RE_SAFE_NAME.test(name)) return null

  const bare = name.replace(/^use-/, '')
  // File stem must itself be a safe kebab name (blocks empty / odd stems).
  if (!RE_SAFE_NAME.test(bare)) return null

  const pascal = bare
    .split('-')
    .filter(Boolean)
    .map(part => part[0]!.toUpperCase() + part.slice(1))
    .join('')
  const label = title?.split(/\s*[-–—]\s*/)[0]?.trim() || `use${pascal}`
  const factory = `create${pascal}Plugin`
  const file = `${bare}.ts`

  if (!RE_SAFE_FACTORY.test(factory) || !RE_SAFE_PLUGIN_FILE.test(file)) return null

  return { factory, label, file }
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
 * remaining prose is the description (joined). Fenced code is ignored so a
 * `/path` shown inside a fence is not treated as a manifest entry.
 */
export function blocks (body: string, warnings?: string[]): Block[] {
  const found: Block[] = []
  const lines = body.split('\n')

  let current: Block | null = null
  let fence = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (/^:::\s*(gn-)?example\b/.test(trimmed)) {
      if (current?.paths.length) {
        warnings?.push('[registry] unclosed example block before a new one — previous block dropped')
      }
      current = { paths: [], imports: [], title: '', description: '' }
      fence = false
      continue
    }

    if (!current) continue

    if (trimmed === ':::' && !fence) {
      if (current.paths.length > 0) found.push(current)
      current = null
      continue
    }

    // Ignore fence bodies (and the fence markers themselves).
    if (trimmed.startsWith('```')) {
      fence = !fence
      continue
    }
    if (fence) continue

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
      current.description = current.description
        ? `${current.description} ${trimmed}`
        : trimmed
    }
  }

  if (current?.paths.length) {
    warnings?.push('[registry] unclosed example block at end of page — block dropped')
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

/** Collections we know how to map to Iconify / Uno presets. */
const ICON_COLLECTIONS = ['lucide', 'mdi', 'carbon', 'ph', 'heroicons', 'tabler'] as const

const ICON_CLASS_SOURCE = String.raw`\bi-(${ICON_COLLECTIONS.join('|')})-[\w-]+\b`

/**
 * Scan source for UnoCSS icon utilities and derive installable collections.
 *
 * `i-lucide-mail` → collection `lucide`, class `i-lucide-mail`. Collections are
 * the soft-dep surface; classes stay available for audit / tree-shake hints.
 */
export function scanIcons (content: string): RegistryIcons {
  const classes = new Set<string>()
  const collections = new Set<string>()
  // Fresh global regex per call — shared `g` patterns retain lastIndex across files.
  const pattern = new RegExp(ICON_CLASS_SOURCE, 'g')

  for (const match of content.matchAll(pattern)) {
    classes.add(match[0])
    collections.add(match[1])
  }

  return {
    collections: [...collections].toSorted(),
    classes: [...classes].toSorted(),
  }
}

/** @deprecated Prefer `scanIcons` — returns class list only. */
export function icons (content: string): string[] {
  return scanIcons(content).classes
}

function escapeRegExp (value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

/**
 * Build the token matcher once per `build()` so every file reuses the same
 * compiled pattern. Names are escaped so a future token with regex metachars
 * cannot corrupt the pattern.
 */
export function tokenPattern (universe: readonly string[]): RegExp {
  if (universe.length === 0) return /(?!)/g

  const sorted = universe
    .toSorted((a, b) => b.length - a.length)
    .map(escapeRegExp)

  return new RegExp(
    String.raw`\b(?:${COLOR_PREFIXES.join('|')})-(${sorted.join('|')})(?:/\d+)?\b`,
    'g',
  )
}

/**
 * Semantic tokens used by a source file.
 *
 * Matches longest-first so `bg-surface-tint` is not read as `bg-surface`, and
 * tolerates an opacity modifier (`bg-accent/15`). Only the known token universe
 * is matched, so ordinary utilities (`text-sm`, `border-b`) never collide.
 */
export function tokens (content: string, universe: readonly string[] | RegExp): string[] {
  const pattern = universe instanceof RegExp ? universe : tokenPattern(universe)
  // `matchAll` advances `lastIndex` on a sticky/global regex — clone via
  // `new RegExp(pattern)` when the caller reuses a shared compiled pattern.
  const source = universe instanceof RegExp ? new RegExp(pattern.source, pattern.flags) : pattern

  const found = new Set<string>()
  for (const match of content.matchAll(source)) found.add(match[1])

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

/**
 * True when a manifest relative path has `..`, empty, or `.` segments, or is
 * absolute / NUL-bearing. These never need to reach the filesystem.
 */
export function hasUnsafeSegments (relativePath: string): boolean {
  if (!relativePath || relativePath.includes('\0') || isAbsolute(relativePath)) {
    return true
  }
  // Both separators — markdown is POSIX, but a Windows-authored path should not slip through.
  return relativePath.split(/[/\\]/).some(part => part === '' || part === '.' || part === '..')
}

/** True when `absolute` is lexically inside `root` (no `..` escape). Does not follow symlinks. */
export function isInside (root: string, absolute: string): boolean {
  const rel = relative(root, absolute)
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel)
}

/**
 * Resolve a path under the examples root for reading.
 *
 * Layers: reject unsafe segments → lexical isInside → realpath both roots and
 * target so a git symlink under `examples/` cannot smuggle host files into the
 * registry payload.
 */
export async function resolveExamplePath (
  relativePath: string,
  examplesDir: string,
  examplesReal: string,
): Promise<string | null> {
  if (hasUnsafeSegments(relativePath)) return null

  const absolute = resolve(examplesDir, relativePath)
  if (!isInside(examplesDir, absolute)) return null

  try {
    const real = await realpath(absolute)
    if (!isInside(examplesReal, real)) return null
    return real
  } catch {
    // Missing file or broken symlink — caller treats as incomplete example.
    return null
  }
}

function titleCase (id: string): string {
  return id.replace(/(^|-)([a-z])/g, (_, lead, char) => `${lead ? ' ' : ''}${char.toUpperCase()}`)
}

function warnBasenames (file: string, files: RegistryFile[], warnings: string[]) {
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
    } else if (prev === item.name) {
      warnings.push(
        `[registry] ${file}: duplicate basename "${item.name}" in one example — `
        + `the CLI will overwrite on write.`,
      )
    }
    lower.set(key, item.name)
  }
}

function warnCrossExample (file: string, examples: RegistryExample[], warnings: string[]) {
  const seen = new Set<string>()
  for (const example of examples) {
    if (seen.has(example.id)) {
      warnings.push(`[registry] ${file}: duplicate example id "${example.id}"`)
    }
    seen.add(example.id)
  }

  // Two examples that share a destination dir cannot write the same basename
  // even if their source paths differ (CLI flattens to `dir/name`).
  const byDir = new Map<string, Map<string, string>>()
  for (const example of examples) {
    let names = byDir.get(example.dir)
    if (!names) {
      names = new Map()
      byDir.set(example.dir, names)
    }
    for (const item of example.files) {
      const key = item.name.toLowerCase()
      const prev = names.get(key)
      if (prev && prev !== `${example.id}:${item.name}`) {
        warnings.push(
          `[registry] ${file}: basename "${item.name}" written by examples `
          + `"${prev.split(':')[0]}" and "${example.id}" into dir "${example.dir}"`,
        )
      }
      names.set(key, `${example.id}:${item.name}`)
    }
  }
}

interface ExampleContext {
  file: string
  type: ItemType
  name: string
  unportable: string[]
  matchTokens: RegExp
  warnings: string[]
  /** realpath(EXAMPLES_DIR) — symlink-safe confinement. */
  examplesReal: string
}

async function exampleFrom (
  block: Block,
  ctx: ExampleContext,
): Promise<RegistryExample | undefined> {
  const { file, type, name, unportable, matchTokens, warnings } = ctx
  const paths = block.paths.map(resolveFile)

  // Only blocks belonging to this feature's own example folder. Pages
  // occasionally embed a sibling's example; those belong to that item.
  // Malformed paths (not under components/ or composables/) are almost
  // always typos — surface them so production fails loudly.
  if (!paths.every(p => p.startsWith(`${type}/${name}/`))) {
    const foreign = paths.filter(p => !p.startsWith(`${type}/${name}/`))
    const typo = foreign.some(p => !p.startsWith('components/') && !p.startsWith('composables/'))
    if (typo) {
      warnings.push(
        `[registry] ${file}: example path(s) outside ${type}/${name}/ — skipped: `
        + foreign.join(', '),
      )
    }
    return undefined
  }

  // The last `.vue` in the manifest renders the demo — see .claude/rules/docs.md.
  // Display-order numbers only reorder code tabs; entry follows source order
  // (same contract as `useExamples.resolveMultiple`).
  const last = paths.findLastIndex(p => p.endsWith('.vue'))
  if (last === -1) {
    warnings.push(`[registry] ${file}: example has no .vue entry file — skipped`)
    return undefined
  }

  const files: RegistryFile[] = []
  const dependencies = new Set(block.imports)
  const used = new Set<string>()
  const iconClasses = new Set<string>()
  const iconCollections = new Set<string>()
  let incomplete = false
  const { examplesReal } = ctx

  for (const [order, relativePath] of paths.entries()) {
    if (hasUnsafeSegments(relativePath)) {
      warnings.push(`[registry] ${file}: unsafe path segment in "${relativePath}" — skipped`)
      incomplete = true
      continue
    }

    const confined = await resolveExamplePath(relativePath, EXAMPLES_DIR, examplesReal)
    if (!confined) {
      // Distinguishes escape / symlink vs missing when the lexical path is under examples.
      const absolute = resolve(EXAMPLES_DIR, relativePath)
      if (isInside(EXAMPLES_DIR, absolute)) {
        warnings.push(`[registry] ${file}: missing or non-confined example file "${relativePath}"`)
      } else {
        warnings.push(`[registry] ${file}: path escapes examples root — "${relativePath}"`)
      }
      incomplete = true
      continue
    }

    const content = await readFile(confined, 'utf8').catch(() => null)

    if (content === null) {
      warnings.push(`[registry] ${file}: missing example file "${relativePath}"`)
      incomplete = true
      continue
    }

    for (const specifier of specifiers(content)) dependencies.add(specifier)
    for (const token of tokens(content, matchTokens)) used.add(token)

    const scanned = scanIcons(content)
    for (const iconName of scanned.classes) iconClasses.add(iconName)
    for (const collection of scanned.collections) iconCollections.add(collection)

    files.push({
      path: relativePath,
      name: basename(relativePath),
      entry: order === last,
      content,
    })
  }

  // A missing path leaves a half-built payload (`entry` may never be true).
  // Skip the whole block rather than shipping an incomplete tree to the CLI.
  if (incomplete || files.length === 0) return undefined

  const entryFile = files.find(f => f.entry)
  if (!entryFile) {
    warnings.push(`[registry] ${file}: entry .vue missing from resolved files — skipped`)
    return undefined
  }

  warnBasenames(file, files, warnings)

  const leaked = [...used].filter(token => unportable.includes(token))
  if (leaked.length > 0) {
    warnings.push(
      `[registry] ${relative(EXAMPLES_DIR, resolve(EXAMPLES_DIR, files[0].path))}: `
      + `uses docs-only token(s) ${leaked.join(', ')} — these have no mapping in a `
      + `consumer project and will render unstyled. Use a portable token instead.`,
    )
  }

  // Mirror the docs layout below the type segment so two examples of the
  // same feature never collide on a shared filename. Anchor on the entry
  // file so a trailing helper .ts in another folder cannot skew `dir`.
  const anchorDir = dirname(entryFile.path)
  const dir = relative(`${type}/${name}`, anchorDir) === ''
    ? name
    : posix.join(name, relative(`${type}/${name}`, anchorDir).split(sep).join('/'))

  const id = dir === name
    ? basename(entryFile.name, extname(entryFile.name))
    : basename(dir)

  // Usage blocks render as a bare peek with no `###`, so fall back to the
  // id rather than leaving the CLI to display a blank label.
  const title = block.title || titleCase(id)

  return {
    id,
    title,
    description: block.description,
    dir,
    files,
    dependencies: [...dependencies].toSorted(),
    tokens: [...used].toSorted(),
    icons: {
      collections: [...iconCollections].toSorted(),
      classes: [...iconClasses].toSorted(),
    },
  }
}

export async function build (): Promise<Registry> {
  // Read data files per build so a dev-server invalidate after editing
  // maturity.json / package.json is not stuck on the module-load snapshot.
  const pkg = JSON.parse(await readFile(PKG_JSON, 'utf8')) as { version: string }
  const maturity = JSON.parse(await readFile(MATURITY_JSON, 'utf8')) as {
    components: Record<string, unknown>
    composables: Record<string, unknown>
  }
  const metaIndex = new Map([
    ...index(maturity.components, 'components'),
    ...index(maturity.composables, 'composables'),
  ])

  const unportable = await chrome()
  const matchTokens = tokenPattern([...PORTABLE_TOKENS, ...unportable])
  const warnings: string[] = []
  const items = new Map<string, RegistryItem>()
  // Resolve once so every example path is checked against the same real root.
  const examplesReal = await realpath(EXAMPLES_DIR)

  for await (const file of glob('**/*.md', { cwd: PAGES_DIR })) {
    const path = resolve(PAGES_DIR, file)
    const { frontmatter, body } = parseFrontmatter(await readFile(path, 'utf8'))

    const type = itemType(frontmatter.features?.category)
    if (!type) continue

    const name = basename(file, '.md')
    if (!RE_SAFE_NAME.test(name)) {
      warnings.push(`[registry] ${file}: unsafe feature name "${name}" — skipped`)
      continue
    }

    const meta = metaIndex.get(name)

    if (!meta) {
      warnings.push(`[registry] ${file}: no maturity.json entry for "${name}" — skipped`)
      continue
    }

    const docs = `${DOCS_ORIGIN}/${posix.join(...file.split(sep)).replace(/\.md$/, '')}`
    const examples: RegistryExample[] = []
    const pageWarnings: string[] = []
    const ctx: ExampleContext = {
      file,
      type,
      name,
      unportable,
      matchTokens,
      warnings,
      examplesReal,
    }

    for (const block of blocks(body, pageWarnings)) {
      const example = await exampleFrom(block, ctx)
      if (example) examples.push(example)
    }

    for (const warning of pageWarnings) {
      warnings.push(`[registry] ${file}: ${warning.replace(/^\[registry\]\s*/, '')}`)
    }

    const title = frontmatter.title?.split(' - ')[0] ?? name
    let install: RegistryInstall | undefined
    if (meta.category === 'plugins') {
      const recipe = pluginInstall(name, title)
      if (recipe) {
        install = recipe
      } else {
        warnings.push(`[registry] ${file}: could not derive a safe install recipe for "${name}"`)
      }
    }

    // Plugins ship install-first even with zero docs examples; everything else
    // needs at least one portable example to be useful as a seed.
    if (examples.length === 0 && !install) continue

    if (examples.length > 0) {
      warnCrossExample(file, examples, warnings)
    }

    items.set(`${type}/${name}`, {
      name,
      type,
      category: meta.category,
      level: meta.level,
      title,
      description: meta.description || frontmatter.description || '',
      docs,
      examples,
      ...(install ? { install } : {}),
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

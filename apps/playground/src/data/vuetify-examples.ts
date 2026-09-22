/**
 * Vuetify 4 docs examples catalog for Open gallery.
 *
 * Manifest is a one-time scan of public examples under
 * `vuetifyjs/vuetify` (`packages/docs/src/examples`). Content is loaded at
 * open time from raw.githubusercontent.com; the app encodes the share hash
 * with the same zlib+btoa path as all other playground loads.
 */

import manifest from '@/data/vuetify-examples-manifest.json'

export interface VuetifyExampleRef {
  /** Path under packages/docs/src/examples, e.g. `v-btn/prop-density.vue`. */
  path: string
  /** Optional git ref (branch, tag, or sha). Defaults to manifest.ref. */
  ref?: string
}

export interface VuetifyExampleMeta {
  id: string
  path: string
  title: string
}

export interface VuetifyComponentEntry {
  name: string
  title: string
  examples: VuetifyExampleMeta[]
}

export interface VuetifyExamplesManifest {
  version: number
  repo: string
  ref: string
  basePath: string
  generatedAt: string
  skipped: number
  components: VuetifyComponentEntry[]
}

export interface ResolvedVuetifyExample {
  files: Record<string, string>
  active: string
  meta: {
    path: string
    ref: string
    repo: string
  }
}

// Single segment: alnum start, no `..` mid-path. Ref: branch/tag/sha only.
const RE_SAFE_PATH = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*\.vue$/i
const RE_SAFE_REF = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/

export const VUETIFY_EXAMPLES = manifest as VuetifyExamplesManifest

export function getVuetifyComponents (): VuetifyComponentEntry[] {
  return VUETIFY_EXAMPLES.components
}

/** Lookup by path or id (`v-btn/prop-density` / `v-btn/prop-density.vue`). */
function findManifestExample (raw: string): VuetifyExampleMeta | undefined {
  const path = raw.replace(/^\//, '')
  const withVue = path.endsWith('.vue') ? path : `${path}.vue`
  return VUETIFY_EXAMPLES.components
    .flatMap(c => c.examples)
    .find(e => e.path === withVue || e.path === path || e.path === raw)
}

/**
 * Stable docs URL for a catalog entry (API page — always present for v-* and
 * application/* features on vuetifyjs.com).
 */
export function vuetifyDocsUrl (name: string): string {
  return `https://vuetifyjs.com/en/api/${name}/`
}

function assertSafePath (path: string) {
  if (path.includes('..') || !RE_SAFE_PATH.test(path)) {
    throw new Error(`Unsafe example path: ${path}`)
  }
}

function assertSafeRef (ref: string) {
  if (ref.includes('..') || !RE_SAFE_REF.test(ref)) {
    throw new Error(`Unsafe git ref: ${ref}`)
  }
}

/** Build a raw.githubusercontent.com URL for a docs example SFC. */
function vuetifyExampleRawUrl (path: string, ref = VUETIFY_EXAMPLES.ref): string {
  assertSafePath(path)
  assertSafeRef(ref)
  const { repo, basePath } = VUETIFY_EXAMPLES
  return `https://raw.githubusercontent.com/${repo}/${ref}/${basePath}/${path}`
}

/**
 * Fetch a single-file Vuetify docs example and map it into playground files.
 * Callers must switch to the `vuetify` preset before/after load.
 * Paths must be catalog entries (manifest) — free-form deep-links are rejected.
 */
export async function resolveVuetifyExample (
  ref: VuetifyExampleRef,
): Promise<ResolvedVuetifyExample> {
  const hit = findManifestExample(ref.path)
  if (!hit) {
    throw new Error(`Unknown Vuetify example: ${ref.path}`)
  }
  const path = hit.path
  const gitRef = ref.ref ?? VUETIFY_EXAMPLES.ref
  const url = vuetifyExampleRawUrl(path, gitRef)

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    .catch((error: Error) => {
      throw new Error(`Example ${path} unreachable (${error.message})`)
    })

  if (!response.ok) {
    throw new Error(`Example ${path} responded with ${response.status}`)
  }

  const code = await response.text()
  if (!code.trim()) {
    throw new Error(`Example ${path} is empty`)
  }
  if (code.includes('ExamplesUsageExample') || code.includes('UsageExample')) {
    throw new Error(`Example ${path} depends on docs-only UsageExample helpers`)
  }

  return {
    files: { 'src/App.vue': code },
    active: 'src/App.vue',
    meta: {
      path,
      ref: gitRef,
      repo: VUETIFY_EXAMPLES.repo,
    },
  }
}

/**
 * Parse playground search params for a Vuetify example deep-link.
 *
 * Supported:
 * - `?vuetify=v-btn/prop-density`
 * - `?vuetify=v-btn/prop-density.vue`
 * - `?source=vuetify&example=v-btn/prop-density`
 */
export function parseVuetifyExampleQuery (params: URLSearchParams): VuetifyExampleRef | null {
  const source = params.get('source')
  const vuetify = params.get('vuetify')
  const example = params.get('example')
  const raw = vuetify
    ?? (source === 'vuetify' ? example : null)

  if (!raw) return null

  // Manifest-only: never free-form path → raw.githubusercontent (avoids `..` escapes).
  const hit = findManifestExample(raw)
  return hit ? { path: hit.path } : null
}

import {
  buildPlaygroundFiles,
  encodePlaygroundHash,
} from '@vuetify/play'

// Framework
import { isObject, isString } from '@vuetify/v0'

export {
  decodePlaygroundHash,
  encodePlaygroundHash,
  loadFflate,
  toPlaygroundThemes,
} from '@vuetify/play'

export type {
  PlaygroundFile,
  PlaygroundHashData,
  PlaygroundHashSettings,
  PlaygroundThemeDefinition,
  UsePlaygroundOptions,
} from '@vuetify/play'

// Types
import type {
  PlaygroundFile,
  PlaygroundHashData,
  UsePlaygroundOptions,
} from '@vuetify/play'

function playgroundBase () {
  return import.meta.env.VITE_PLAYGROUND_URL ?? 'https://v0play.vuetifyjs.com'
}

/**
 * Build a v0play URL for the given files.
 *
 * Pass `theme` + `themes` to install any theme in the sandbox — docs
 * palettes, a builder export, or a one-off custom record. `dir` still
 * accepted as a positional string for older callers.
 *
 * @example
 * ```ts
 * const url = await usePlayground(files, {
 *   ...toPlaygroundThemes('brand-light', {
 *     'brand-light': { dark: false, colors: { primary: '#7453ec', background: '#fff' } },
 *     'brand-dark': { dark: true, colors: { primary: '#c4b5fd', background: '#121212' } },
 *   }),
 * })
 * ```
 */
export async function usePlayground (
  inputFiles: PlaygroundFile[],
  dirOrOptions?: string | UsePlaygroundOptions,
  imports?: Record<string, string>,
): Promise<string> {
  let options: UsePlaygroundOptions
  if (isString(dirOrOptions)) {
    options = { dir: dirOrOptions, imports }
  } else if (isObject(dirOrOptions)) {
    options = dirOrOptions
  } else {
    options = { imports }
  }

  const files = buildPlaygroundFiles(inputFiles, options.dir)
  const data: PlaygroundHashData = { files }
  if (options.imports && Object.keys(options.imports).length > 0) data.imports = options.imports
  if (options.settings && Object.keys(options.settings).length > 0) data.settings = options.settings
  if (options.theme) data.theme = options.theme
  if (options.themes && Object.keys(options.themes).length > 0) data.themes = options.themes
  const hash = await encodePlaygroundHash(data)
  return `${playgroundBase()}/#${hash}`
}

export interface PlaygroundRegistryRef {
  /** Feature name, e.g. `dialog`. */
  item: string
  /** Example id, e.g. `basic`. */
  example?: string
  /** `components` | `composables` when known. */
  type?: 'components' | 'composables'
  /** Override docs registry origin. */
  registry?: string
  /** Sandbox default theme id (`light` / `dark` / palette id). */
  theme?: string
}

/**
 * Short playground URL that resolves against the docs registry catalog.
 * Smaller than a hash payload and always pulls current seed source — but
 * requires a live `/registry/*` (docs PR #721) **and** CORS on that origin.
 * Docs "Open in Playground" stays hash-based unless `VITE_PLAYGROUND_REGISTRY=1`.
 *
 * @example
 * ```ts
 * playgroundRegistryUrl({ item: 'dialog', example: 'basic' })
 * // → https://v0play.vuetifyjs.com/?example=dialog/basic
 * ```
 */
export function playgroundRegistryUrl (ref: PlaygroundRegistryRef): string {
  const params = new URLSearchParams()
  if (ref.type) {
    params.set(
      'example',
      ref.example
        ? `${ref.type}/${ref.item}/${ref.example}`
        : `${ref.type}/${ref.item}`,
    )
  } else if (ref.example) {
    params.set('example', `${ref.item}/${ref.example}`)
  } else {
    params.set('example', ref.item)
  }
  if (ref.registry) params.set('registry', ref.registry)
  if (ref.theme) params.set('theme', ref.theme)
  return `${playgroundBase()}/?${params}`
}

/**
 * Map a docs example path (`/components/dialog/basic`, `composables/use-theme/…`)
 * to a registry ref for short playground URLs.
 */
export function registryRefFromExamplePath (path: string): PlaygroundRegistryRef | null {
  const clean = path.replace(/^\//, '').replace(/\.\w+$/, '')
  const parts = clean.split('/').filter(Boolean)
  if (parts.length < 2) return null
  if (parts[0] !== 'components' && parts[0] !== 'composables') return null

  const type = parts[0] as 'components' | 'composables'
  const item = parts[1]!
  if (parts.length === 2) {
    return { type, item }
  }
  // Registry id: entry basename when files sit at `{type}/{name}/`, else the
  // first subdirectory name (`components/dialog/gallery/App.vue` → `gallery`).
  return {
    type,
    item,
    example: parts[2],
  }
}

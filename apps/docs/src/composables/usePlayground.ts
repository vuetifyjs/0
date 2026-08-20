// Framework
import { isBoolean, isObject, isString, isUndefined } from '@vuetify/v0'

// Utilities
import { toPascal } from '@/utilities/strings'

export interface PlaygroundFile {
  name: string
  code: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let _fflate: typeof import('fflate') | undefined

export async function loadFflate () {
  if (!_fflate) _fflate = await import('fflate')
  return _fflate
}

async function utoa (data: string): Promise<string> {
  const { strToU8, strFromU8, zlibSync } = await loadFflate()
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

async function atou (base64: string): Promise<string> {
  const { strToU8, strFromU8, unzlibSync } = await loadFflate()
  const binary = atob(base64)
  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}

/**
 * Detect which file is the entry point for a multi-file example.
 */
export function detectEntryFile (files: PlaygroundFile[]): PlaygroundFile | undefined {
  const vueFiles = files.filter(f => f.name.endsWith('.vue'))

  const entryNames = ['index.vue', 'App.vue', 'example.vue', 'main.vue']
  for (const name of entryNames) {
    const found = vueFiles.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (found) return found
  }

  for (const file of vueFiles) {
    const importsOthers = vueFiles.some(other =>
      other !== file && file.code.includes(`./${other.name.replace(/\.\w+$/, '')}`),
    )
    if (importsOthers) return file
  }

  return vueFiles.at(-1)
}

/**
 * Generate an App.vue wrapper that imports and renders the entry component.
 */
export function generateAppWrapper (entryPath: string): string {
  const baseName = entryPath.split('/').pop()!.replace(/\.vue$/, '')
  const pascalName = toPascal(baseName)
  return [
    '<' + `script setup lang="ts">`,
    `  import ${pascalName} from './${entryPath}'`,
    '</' + 'script>',
    '',
    '<template>',
    '  <div class="p-4">',
    `    <${pascalName} />`,
    '  </div>',
    '</template>',
    '',
  ].join('\n')
}

/**
 * Build the src/-prefixed file record that loadExample expects.
 * When dir is provided, files are nested: src/{dir}/{name}
 */
function buildPlaygroundFiles (inputFiles: PlaygroundFile[], dir?: string): Record<string, string> {
  const files: Record<string, string> = {}
  const prefix = dir ? `src/${dir}` : 'src'

  for (const file of inputFiles) {
    const path = file.name.startsWith('src/') ? file.name : `${prefix}/${file.name}`
    files[path] = file.code
  }

  const hasAppVue = inputFiles.some(f => f.name.toLowerCase() === 'app.vue')
  if (!hasAppVue) {
    const entryFile = detectEntryFile(inputFiles)
    if (entryFile) {
      const entryPath = dir ? `${dir}/${entryFile.name}` : entryFile.name
      files['src/App.vue'] = generateAppWrapper(entryPath)
    }
  }

  return files
}

function playgroundBase () {
  return import.meta.env.VITE_PLAYGROUND_URL ?? 'https://v0play.vuetifyjs.com'
}

export interface UsePlaygroundOptions {
  dir?: string
  imports?: Record<string, string>
  settings?: PlaygroundHashSettings
  /** Selected sandbox theme id. */
  theme?: string
  /** Theme records merged into the sandbox `createThemePlugin`. */
  themes?: Record<string, PlaygroundThemeDefinition>
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

function isFileRecord (v: unknown): v is Record<string, string> {
  return isObject(v) && Object.values(v).every(x => isString(x))
}

export interface PlaygroundThemeDefinition {
  dark: boolean
  colors: Record<string, string>
}

export interface PlaygroundHashSettings {
  vue?: string
  v0?: string
  vuetify?: string
  vuetifyNightly?: boolean
  preset?: string
  addons?: string
}

export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: PlaygroundHashSettings
  /** Selected sandbox theme id. */
  theme?: string
  /** Theme records merged into the sandbox `createThemePlugin`. */
  themes?: Record<string, PlaygroundThemeDefinition>
}

const SAFE_THEME_ID = /^[a-zA-Z][\w-]*$/

const SAFE_COLOR_KEY = /^[a-zA-Z0-9_-]+$/
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]/i

export function sanitizeThemeId (id: string): string | undefined {
  return SAFE_THEME_ID.test(id) ? id : undefined
}

function sanitizeColors (colors: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors)) {
    if (!SAFE_COLOR_KEY.test(key) || !isString(value) || UNSAFE_CSS.test(value)) continue
    out[key] = value
  }
  return out
}

/**
 * Pack any theme records for a v0play hash. Docs, the builder, or a host
 * app can call this — v0play merges `themes` into the sandbox plugin and
 * selects `theme`. Color aliases must already be resolved.
 *
 * @example
 * ```ts
 * toPlaygroundThemes('brand-light', {
 *   'brand-light': { dark: false, colors: { primary: '#7453ec', background: '#ffffff' } },
 *   'brand-dark': { dark: true, colors: { primary: '#c4b5fd', background: '#121212' } },
 * })
 * ```
 */
export function toPlaygroundThemes (
  selected: string,
  records: Record<string, { dark?: boolean, colors?: Record<string, unknown> }>,
): Pick<PlaygroundHashData, 'theme' | 'themes'> | undefined {
  const theme = sanitizeThemeId(selected)
  if (!theme) return undefined

  const themes: Record<string, PlaygroundThemeDefinition> = {}
  for (const [id, def] of Object.entries(records)) {
    const safeId = sanitizeThemeId(id)
    if (!safeId || !def.colors) continue
    const colors = sanitizeColors(def.colors)
    if (Object.keys(colors).length === 0) continue
    themes[safeId] = { dark: def.dark === true, colors }
  }

  if (Object.keys(themes).length === 0) return { theme }
  return { theme, themes }
}

/**
 * Encode editor state (files + active filename) to a URL hash string.
 */
export async function encodePlaygroundHash (data: PlaygroundHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

function isPlaygroundTheme (v: unknown): v is PlaygroundThemeDefinition {
  if (!isObject(v)) return false
  const theme = v as Record<string, unknown>
  if (!isBoolean(theme.dark) || !isObject(theme.colors)) return false
  const colors = theme.colors as Record<string, unknown>
  return Object.values(colors).every(x => isString(x))
}

function isThemeRecord (v: unknown): v is Record<string, PlaygroundThemeDefinition> {
  return isObject(v) && Object.values(v as Record<string, unknown>).every(isPlaygroundTheme)
}

function isValidSettings (v: unknown): v is PlaygroundHashSettings {
  if (!isObject(v)) return false
  const settings = v as Record<string, unknown>
  if (!(isUndefined(settings.vue) || isString(settings.vue))) return false
  if (!(isUndefined(settings.v0) || isString(settings.v0))) return false
  if (!(isUndefined(settings.vuetify) || isString(settings.vuetify))) return false
  if (!(isUndefined(settings.vuetifyNightly) || isBoolean(settings.vuetifyNightly))) return false
  if (!(isUndefined(settings.preset) || isString(settings.preset))) return false
  if (!(isUndefined(settings.addons) || isString(settings.addons))) return false
  return true
}

function readPlaygroundThemes (parsed: Record<string, unknown>): Pick<PlaygroundHashData, 'theme' | 'themes'> {
  const settings = isObject(parsed.settings) ? parsed.settings as Record<string, unknown> : undefined
  const theme = isString(parsed.theme)
    ? parsed.theme
    : (isString(settings?.theme) ? settings.theme : undefined)
  const themesRaw = parsed.themes ?? settings?.themes
  return {
    theme,
    themes: isThemeRecord(themesRaw) ? themesRaw : undefined,
  }
}

/**
 * Decode an editor hash back to editor state.
 * Handles both the current { files, active, settings? } format and the legacy plain Record<string, string> format.
 */
export async function decodePlaygroundHash (hash: string): Promise<PlaygroundHashData | null> {
  try {
    const parsed: unknown = JSON.parse(await atou(hash))
    if (isFileRecord(parsed)) {
      return { files: parsed }
    }
    if (
      typeof parsed === 'object'
      && parsed !== null
      && 'files' in parsed
      && isFileRecord((parsed as { files: unknown }).files)
    ) {
      const record = parsed as Record<string, unknown>
      const { files, active, imports, settings } = record
      const packed = readPlaygroundThemes(record)
      return {
        files: files as Record<string, string>,
        active: isString(active) ? active : undefined,
        imports: isFileRecord(imports) ? imports : undefined,
        settings: isValidSettings(settings) ? settings : undefined,
        theme: packed.theme,
        themes: packed.themes,
      }
    }
    return null
  } catch {
    return null
  }
}

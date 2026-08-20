// Framework
import { isArray, isBoolean, isObject, isString, isUndefined } from '@vuetify/v0'

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
export function buildPlaygroundFiles (inputFiles: PlaygroundFile[], dir?: string): Record<string, string> {
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
 * Build a same-origin v0play hash URL for the given files.
 *
 * Pass `theme` + `themes` to install any theme in the sandbox.
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
  return `/#${hash}`
}

export function isFileRecord (v: unknown): v is Record<string, string> {
  return isObject(v) && Object.values(v).every(x => isString(x))
}

/**
 * Parse a Vuetify Play tuple format: [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
 * Shared between decodePlaygroundHash and openPlayground.
 *
 * The tuple format is exclusive to Vuetify Play exports, so `preset` is always
 * 'vuetify'. This is the single source of that mapping — both callers consume it
 * rather than each deciding the preset themselves, which is how a v0/vuetify
 * feature-sniff once drifted into openPlayground and mis-detected single-file
 * Vuetify Play playgrounds as v0 (see #666).
 */
export function parseVuetifyPlayTuple (parsed: unknown[]): { files: Record<string, string>, imports: Record<string, string>, active?: string, vue?: string, preset: 'vuetify' } | null {
  const [rawFiles, vueVer, , , rawActive] = parsed as [
    unknown, unknown, unknown, unknown, unknown,
  ]
  if (!isFileRecord(rawFiles)) return null

  // Extract infrastructure files before building the src/-prefixed file map
  const linksJson = rawFiles['links.json']
  const importMapJson = rawFiles['import-map.json']
  const files: Record<string, string> = {}
  for (const [key, code] of Object.entries(rawFiles)) {
    if (key === 'import-map.json' || key === 'links.json') continue
    files[key.startsWith('src/') ? key : `src/${key}`] = code
  }

  // Parse custom imports from import-map.json
  let imports: Record<string, string> = {}
  if (importMapJson) {
    try {
      const map = JSON.parse(importMapJson)
      if (isObject(map) && isObject(map.imports)) {
        imports = map.imports as Record<string, string>
      }
    } catch { /* ignore malformed import-map.json */ }
  }

  // Auto-resolve bare import specifiers not covered by the stored import map.
  // Vuetify Play's dependency panel adds packages at runtime but the stored
  // content only captures the template's base import map.
  const knownSpecifiers = new Set([
    ...Object.keys(imports),
    'vue', 'vue/server-renderer', '@vue/devtools-api',
    '@vuetify/v0', 'vuetify',
  ])
  const bareImportRe = /\bfrom\s+['"]([^./][^'"]*)['"]/g
  for (const code of Object.values(files)) {
    for (const match of code.matchAll(bareImportRe)) {
      const specifier = match[1]!
      const pkg = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]!
      if (!knownSpecifiers.has(pkg)) {
        imports[pkg] = `https://esm.sh/${pkg}`
        knownSpecifiers.add(pkg)
      }
    }
  }

  // Inject CSS from links.json into setup.ts (which defines loadStylesheet)
  if (files['src/setup.ts'] && linksJson) {
    try {
      const links = JSON.parse(linksJson)
      const setup = files['src/setup.ts']!
      const urls = isArray(links.css) ? links.css.filter(isString) : []
      if (urls.length > 0) {
        files['src/setup.ts'] = setup + '\n' + urls.map((url: string) => `loadStylesheet('${url}')`).join('\n') + '\n'
      }
    } catch { /* ignore malformed links.json */ }
  }

  // Fallback: ensure vuetify-labs.css is loaded even without links.json
  if (files['src/setup.ts']) {
    const setup = files['src/setup.ts']!
    if (setup.includes('loadStylesheet') && !setup.includes('vuetify-labs.css')) {
      files['src/setup.ts'] = `${setup}\nloadStylesheet('https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify-labs.css')\n`
    }
  }

  const active = isString(rawActive)
    ? (rawActive.startsWith('src/') ? rawActive : `src/${rawActive}`)
    : undefined

  return {
    files,
    imports,
    active,
    vue: isString(vueVer) ? vueVer : undefined,
    preset: 'vuetify',
  }
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

/** Theme ids written into generated `main.ts` / hash JSON. */
export const SAFE_THEME_ID = /^[a-zA-Z][\w-]*$/

const SAFE_COLOR_KEY = /^[a-zA-Z0-9_-]+$/
const UNSAFE_CSS = /url\s*\(|src\s*\(|image\s*\(|image-set\s*\(|cross-fade\s*\(|@import|expression\s*\(|[;{}<>\\]|\/\*/i
const UNSAFE_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const MAX_THEME_ID = 64
const MAX_THEMES = 32
const MAX_COLORS = 64
const MAX_COLOR_VALUE = 128

function sanitizeThemeId (id: string): string | undefined {
  return id.length <= MAX_THEME_ID && SAFE_THEME_ID.test(id) && !UNSAFE_OBJECT_KEYS.has(id)
    ? id
    : undefined
}

function sanitizeColors (colors: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors)) {
    if (Object.keys(out).length >= MAX_COLORS) break
    if (
      key.length > MAX_THEME_ID
      || !SAFE_COLOR_KEY.test(key)
      || UNSAFE_OBJECT_KEYS.has(key)
      || !isString(value)
      || value.length === 0
      || value.length > MAX_COLOR_VALUE
      || UNSAFE_CSS.test(value)
    ) continue
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
    if (Object.keys(themes).length >= MAX_THEMES) break
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
 * Handles 4 formats:
 * 1. Legacy plain Record<string, string>
 * 2 & 3. Current object { files, active, imports, settings? }
 * 4. Vuetify play tuple [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
 */
export async function decodePlaygroundHash (hash: string): Promise<PlaygroundHashData | null> {
  try {
    const parsed: unknown = JSON.parse(await atou(hash))

    // Format 1: legacy plain Record<string, string>
    if (isFileRecord(parsed)) {
      return { files: parsed }
    }

    // Format 4: Vuetify play tuple [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
    if (isArray(parsed)) {
      const result = parseVuetifyPlayTuple(parsed)
      if (!result) return null

      const settings: PlaygroundHashData['settings'] = { preset: result.preset }
      if (result.vue) settings.vue = result.vue
      const imports = Object.keys(result.imports).length > 0 ? result.imports : undefined
      return { files: result.files, active: result.active, imports, settings }
    }

    // Formats 2 & 3: current object { files, active, imports, settings? }
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

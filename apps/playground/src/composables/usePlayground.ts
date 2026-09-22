import {
  buildPlaygroundFiles,
  encodePlaygroundHash,
  isFileRecord,
  parsePlaygroundPayload,
  unzipPlaygroundHash,
} from '@vuetify/play'

// Framework
import { isArray, isObject, isString } from '@vuetify/v0'

export {
  buildPlaygroundFiles,
  detectEntryFile,
  encodePlaygroundHash,
  generateAppWrapper,
  isFileRecord,
  loadFflate,
  parsePlaygroundPayload,
  sanitizePlaygroundThemes,
  toPlaygroundThemes,
  unzipPlaygroundHash,
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
    '@paper/emerald', '@paper/bulma',
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

/**
 * Decode an editor hash back to editor state.
 * Handles 4 formats:
 * 1. Legacy plain Record<string, string>
 * 2 & 3. Current object { files, active, imports, settings?, theme?, themes? }
 * 4. Vuetify play tuple [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
 */
export async function decodePlaygroundHash (hash: string): Promise<PlaygroundHashData | null> {
  try {
    const parsed: unknown = await unzipPlaygroundHash(hash)

    if (isArray(parsed)) {
      const result = parseVuetifyPlayTuple(parsed)
      if (!result) return null

      const settings: PlaygroundHashData['settings'] = { preset: result.preset }
      if (result.vue) settings.vue = result.vue
      const imports = Object.keys(result.imports).length > 0 ? result.imports : undefined
      return { files: result.files, active: result.active, imports, settings }
    }

    return parsePlaygroundPayload(parsed)
  } catch {
    return null
  }
}

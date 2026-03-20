// Framework
import { isArray, isObject, isString, isUndefined } from '@vuetify/v0'

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

/**
 * Get editor URL for multiple files.
 * When dir is provided, files are nested under src/{dir}/.
 */
export async function usePlayground (
  inputFiles: PlaygroundFile[],
  dir?: string,
  imports?: Record<string, string>,
): Promise<string> {
  const files = buildPlaygroundFiles(inputFiles, dir)
  const data: PlaygroundHashData = { files }
  if (imports && Object.keys(imports).length > 0) data.imports = imports
  const hash = await encodePlaygroundHash(data)
  return `/#${hash}`
}

export function isFileRecord (v: unknown): v is Record<string, string> {
  return isObject(v) && Object.values(v).every(x => isString(x))
}

/**
 * Parse a Vuetify Play tuple format: [files, vueVersion, vuetifyVersion, appendJson, activeFile, ...]
 * Shared between decodePlaygroundHash and openPlayground.
 */
export function parseVuetifyPlayTuple (parsed: unknown[]): { files: Record<string, string>, imports: Record<string, string>, active?: string, vue?: string } | null {
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
  }
}

export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string, v0?: string, preset?: string, addons?: string }
}

/**
 * Encode editor state (files + active filename) to a URL hash string.
 */
export async function encodePlaygroundHash (data: PlaygroundHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

function isValidSettings (v: unknown): v is { vue?: string, v0?: string, preset?: string, addons?: string } {
  if (!isObject(v)) return false
  const s = v as Record<string, unknown>
  return (isUndefined(s.vue) || isString(s.vue))
    && (isUndefined(s.v0) || isString(s.v0))
    && (isUndefined(s.preset) || isString(s.preset))
    && (isUndefined(s.addons) || isString(s.addons))
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

      const settings: PlaygroundHashData['settings'] = { preset: 'vuetify' }
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
      const { files, active, imports, settings } = parsed as {
        files: Record<string, string>
        active?: unknown
        imports?: unknown
        settings?: unknown
      }
      return {
        files,
        active: isString(active) ? active : undefined,
        imports: isFileRecord(imports) ? imports : undefined,
        settings: isValidSettings(settings) ? settings : undefined,
      }
    }

    return null
  } catch {
    return null
  }
}

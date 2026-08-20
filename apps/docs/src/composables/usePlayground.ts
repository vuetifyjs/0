// Framework
import { isObject, isString } from '@vuetify/v0'

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

export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
}

/**
 * Encode editor state (files + active filename) to a URL hash string.
 */
export async function encodePlaygroundHash (data: PlaygroundHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

/**
 * Decode an editor hash back to editor state.
 * Handles both the current { files, active } format and the legacy plain Record<string, string> format.
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
      const { files, active, imports } = parsed as { files: Record<string, string>, active?: unknown, imports?: unknown }
      return {
        files,
        active: isString(active) ? active : undefined,
        imports: isFileRecord(imports) ? imports : undefined,
      }
    }
    return null
  } catch {
    return null
  }
}

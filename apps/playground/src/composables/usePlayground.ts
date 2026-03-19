// Framework
import { isObject, isString, isUndefined } from '@vuetify/v0'

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

function isFileRecord (v: unknown): v is Record<string, string> {
  return isObject(v) && Object.values(v).every(x => isString(x))
}

export interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: { vue?: string, v0?: string, preset?: string }
}

/**
 * Encode editor state (files + active filename) to a URL hash string.
 */
export async function encodePlaygroundHash (data: PlaygroundHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

function isValidSettings (v: unknown): v is { vue?: string, v0?: string, preset?: string } {
  if (!isObject(v)) return false
  const s = v as Record<string, unknown>
  return (isUndefined(s.vue) || isString(s.vue))
    && (isUndefined(s.v0) || isString(s.v0))
    && (isUndefined(s.preset) || isString(s.preset))
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
    if (Array.isArray(parsed)) {
      const [rawFiles, vueVer, , , rawActive] = parsed as [
        Record<string, unknown>,
        unknown,
        unknown,
        unknown,
        unknown,
      ]
      if (!isFileRecord(rawFiles)) return null
      const files: Record<string, string> = {}
      for (const [key, code] of Object.entries(rawFiles)) {
        files[key.startsWith('src/') ? key : `src/${key}`] = code
      }
      const active = isString(rawActive)
        ? (rawActive.startsWith('src/') ? rawActive : `src/${rawActive}`)
        : undefined
      const settings: PlaygroundHashData['settings'] = {}
      if (isString(vueVer)) settings.vue = vueVer
      return { files, active, settings: Object.keys(settings).length > 0 ? settings : undefined }
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

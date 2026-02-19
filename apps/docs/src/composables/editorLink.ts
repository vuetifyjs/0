export interface EditorFile {
  name: string
  code: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let _fflate: typeof import('fflate') | undefined

async function loadFflate () {
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
function detectEntryFile (files: EditorFile[]): EditorFile | undefined {
  const vueFiles = files.filter(f => f.name.endsWith('.vue'))

  const entryNames = ['index.vue', 'App.vue', 'example.vue', 'main.vue']
  for (const name of entryNames) {
    const found = vueFiles.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (found) return found
  }

  for (const file of vueFiles) {
    const importsOthers = files.some(other =>
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
  const pascalName = baseName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
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
function buildEditorFiles (inputFiles: EditorFile[], dir?: string): Record<string, string> {
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
 * Get editor URL for a single file.
 */
export async function useEditorLink (code: string, fileName = 'Example.vue'): Promise<string> {
  return useEditorLinkMulti([{ name: fileName, code }])
}

/**
 * Get editor URL for multiple files.
 * When dir is provided, files are nested under src/{dir}/.
 */
export async function useEditorLinkMulti (inputFiles: EditorFile[], dir?: string): Promise<string> {
  const files = buildEditorFiles(inputFiles, dir)
  const hash = await utoa(JSON.stringify(files))
  return `/playground#${hash}`
}

function isFileRecord (v: unknown): v is Record<string, string> {
  return (
    typeof v === 'object'
    && v !== null
    && !Array.isArray(v)
    && Object.values(v as Record<string, unknown>).every(x => typeof x === 'string')
  )
}

export interface EditorHashData {
  files: Record<string, string>
  active?: string
}

/**
 * Encode editor state (files + active filename) to a URL hash string.
 */
export async function encodeEditorHash (data: EditorHashData): Promise<string> {
  return utoa(JSON.stringify(data))
}

/**
 * Decode an editor hash back to editor state.
 * Handles both the current { files, active } format and the legacy plain Record<string, string> format.
 */
export async function decodeEditorHash (hash: string): Promise<EditorHashData | null> {
  try {
    const parsed: unknown = JSON.parse(await atou(hash))
    if (isFileRecord(parsed)) {
      // Legacy format: plain file record with no active file
      return { files: parsed }
    }
    if (
      typeof parsed === 'object'
      && parsed !== null
      && 'files' in parsed
      && isFileRecord((parsed as { files: unknown }).files)
    ) {
      const { files, active } = parsed as { files: Record<string, string>, active?: unknown }
      return { files, active: typeof active === 'string' ? active : undefined }
    }
    return null
  } catch {
    return null
  }
}

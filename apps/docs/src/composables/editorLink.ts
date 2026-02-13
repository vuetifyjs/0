import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export interface EditorFile {
  name: string
  code: string
}

function utoa (data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

function atou (base64: string): string {
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
function generateAppWrapper (entryPath: string): string {
  const baseName = entryPath.split('/').pop()!.replace(/\.vue$/, '')
  const pascalName = baseName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')

  return `<script setup lang="ts">
  import ${pascalName} from './${entryPath}'
</script>

<template>
  <div class="p-4">
    <${pascalName} />
  </div>
</template>
`
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
export function useEditorLink (code: string, fileName = 'Example.vue'): string {
  return useEditorLinkMulti([{ name: fileName, code }])
}

/**
 * Get editor URL for multiple files.
 * When dir is provided, files are nested under src/{dir}/.
 */
export function useEditorLinkMulti (inputFiles: EditorFile[], dir?: string): string {
  const files = buildEditorFiles(inputFiles, dir)
  const hash = utoa(JSON.stringify(files))
  return `/editor#${hash}`
}

/**
 * Decode an editor hash back to a file record.
 */
export function decodeEditorHash (hash: string): Record<string, string> | null {
  try {
    return JSON.parse(atou(hash))
  } catch {
    return null
  }
}

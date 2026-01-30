/**
 * Creates a Vuetify Play link using the native v0 template.
 *
 * @remarks
 * Uses the 'vuetify0' template in Vuetify Play which provides:
 * - UnoCSS runtime with Wind4 preset
 * - Import map for @vuetify/v0
 * - Proper main.ts setup
 */

import { strFromU8, strToU8, zlibSync } from 'fflate'

// Utilities
import { version as vueVersion } from 'vue'

export interface PlaygroundFile {
  name: string
  code: string
}

function utoa (data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

/**
 * Get playground URL for a single file (convenience wrapper)
 */
export function usePlayground (code: string): string {
  return usePlaygroundMulti([{ name: 'App.vue', code }])
}

/**
 * Detect which file is the entry point for a multi-file example.
 * Priority: index.vue > App.vue > example.vue > main.vue > file that imports others
 */
function detectEntryFile (files: PlaygroundFile[]): PlaygroundFile | undefined {
  const vueFiles = files.filter(f => f.name.endsWith('.vue'))

  // Check for conventional entry point names
  const entryNames = ['index.vue', 'App.vue', 'example.vue', 'main.vue']
  for (const name of entryNames) {
    const found = vueFiles.find(f => f.name.toLowerCase() === name.toLowerCase())
    if (found) return found
  }

  // Find file that imports other example files (likely the entry point)
  for (const file of vueFiles) {
    const importsOthers = files.some(other =>
      other !== file && file.code.includes(`./${other.name.replace(/\.\w+$/, '')}`),
    )
    if (importsOthers) return file
  }

  // Fall back to last Vue file (often examples are ordered with entry last)
  return vueFiles.at(-1)
}

/**
 * Generate an App.vue wrapper that imports and renders the entry component
 */
function generateAppWrapper (entryFile: PlaygroundFile): string {
  const componentName = entryFile.name.replace(/\.vue$/, '')
  const pascalName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  return `<script setup lang="ts">
import ${pascalName} from './${entryFile.name}'
</script>

<template>
  <${pascalName} />
</template>
`
}

/**
 * Get playground URL for multiple files
 *
 * @param inputFiles - Array of files with name and code
 * @param activeFile - Which file to show as active (defaults to first file)
 */
export function usePlaygroundMulti (
  inputFiles: PlaygroundFile[],
  activeFile?: string,
): string {
  // Convert to playground format (prefixed with src/)
  const files: Record<string, string> = {}
  for (const file of inputFiles) {
    const path = file.name.startsWith('src/') ? file.name : `src/${file.name}`
    files[path] = file.code
  }

  // If no App.vue exists, generate one that wraps the entry file
  const hasAppVue = inputFiles.some(f => f.name.toLowerCase() === 'app.vue')
  if (!hasAppVue) {
    const entryFile = detectEntryFile(inputFiles)
    if (entryFile) {
      files['src/App.vue'] = generateAppWrapper(entryFile)
    }
  }

  // Determine active file (show the entry/App.vue)
  const active = activeFile
    ? (activeFile.startsWith('src/') ? activeFile : `src/${activeFile}`)
    : 'src/App.vue'

  // Hash format: [files, vueVersion, vuetifyVersion, appendJson, activeFile, routerEnabled, template, deps]
  const hash = utoa(JSON.stringify([
    files,
    vueVersion,
    null, // vuetifyVersion - not used for v0
    true, // appendJson - merge with template files
    active,
    false, // routerEnabled
    'vuetify0', // template ID
  ]))

  return `https://play.vuetifyjs.com#${hash}`
}

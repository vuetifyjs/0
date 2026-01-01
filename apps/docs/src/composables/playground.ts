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

function utoa (data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function usePlayground (code: string): string {
  const files: Record<string, string> = {
    'src/App.vue': code,
  }

  // Hash format: [files, vueVersion, vuetifyVersion, appendJson, activeFile, routerEnabled, template, deps]
  const hash = utoa(JSON.stringify([
    files,
    vueVersion,
    null, // vuetifyVersion - not used for v0
    true, // appendJson - merge with template files
    'src/App.vue', // activeFile
    false, // routerEnabled
    'vuetify0', // template ID
  ]))

  return `https://play.vuetifyjs.com#${hash}`
}

// Utilities
import { strFromU8, strToU8, zlibSync } from 'fflate'
import { version as v0Version } from '@vuetify/v0'
import { version as vueVersion } from 'vue'

function utoa (data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

const unocssSetup = `// @ts-nocheck
import initUnocssRuntime from 'https://esm.sh/@unocss/runtime'
import presetWind3 from 'https://esm.sh/@unocss/preset-wind3'

initUnocssRuntime({
  defaults: {
    presets: [presetWind3()],
  },
})
`

export function usePlayground (code: string) {
  // Inject unocss import at the top of the script section
  let modifiedCode = code.replace(
    /<script([^>]*)>/,
    `<script$1>\n  import './unocss'`,
  )

  // Wrap template content with padding
  modifiedCode = modifiedCode
    .replace(/^<template>$/m, '<template>\n  <div class="p-2">')
    .replace(/<\/template>\s*$/, '  </div>\n</template>')

  const importMap = {
    imports: {
      '@vuetify/v0': `https://cdn.jsdelivr.net/npm/@vuetify/v0@${v0Version}/dist/index.mjs`,
    },
  }

  const files: Record<string, string> = {
    'App.vue': modifiedCode,
    'unocss.ts': unocssSetup,
    'import-map.json': JSON.stringify(importMap, null, 2),
  }

  const hash = utoa(JSON.stringify([files, vueVersion, '3.11.3', true]))
  return `https://play.vuetifyjs.com#${hash}`
}

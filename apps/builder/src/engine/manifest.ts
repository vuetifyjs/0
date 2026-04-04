// Types
import type { FrameworkManifest } from '@/data/types'

interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: {
    preset?: string
  }
}

const PLUGIN_FEATURES = new Set([
  'useTheme',
  'useLocale',
  'useStorage',
  'useLogger',
  'useBreakpoints',
  'useFeatures',
  'usePermissions',
])

const PLUGIN_SETUP: Record<string, string> = {
  useTheme: `app.use(createThemePlugin({
  default: 'light',
  themes: {
    light: { dark: false, colors: { primary: '#3b82f6', background: '#ffffff', surface: '#ffffff' } },
    dark: { dark: true, colors: { primary: '#c4b5fd', background: '#121212', surface: '#1a1a1a' } },
  },
}))`,
  useLocale: 'app.use(createLocalePlugin())',
  useStorage: 'app.use(createStoragePlugin())',
  useLogger: 'app.use(createLoggerPlugin())',
  useBreakpoints: 'app.use(createBreakpointsPlugin({ mobileBreakpoint: 768 }))',
  useFeatures: 'app.use(createFeaturesPlugin())',
  usePermissions: 'app.use(createPermissionsPlugin())',
}

const PLUGIN_IMPORTS: Record<string, string> = {
  useTheme: 'createThemePlugin',
  useLocale: 'createLocalePlugin',
  useStorage: 'createStoragePlugin',
  useLogger: 'createLoggerPlugin',
  useBreakpoints: 'createBreakpointsPlugin',
  useFeatures: 'createFeaturesPlugin',
  usePermissions: 'createPermissionsPlugin',
}

export function generateImports (): Record<string, string> {
  return {
    '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
    '@vue/devtools-api': 'https://esm.sh/@vue/devtools-api@6',
  }
}

export function generateFiles (manifest: FrameworkManifest): Record<string, string> {
  const allFeatures = [...manifest.features, ...manifest.resolved]
  const plugins = allFeatures.filter(f => PLUGIN_FEATURES.has(f))
  const composable = allFeatures.find(f => !PLUGIN_FEATURES.has(f) && f.startsWith('create'))

  const pluginImports = plugins
    .map(p => PLUGIN_IMPORTS[p])
    .filter(Boolean)

  const pluginSetups = plugins
    .map(p => PLUGIN_SETUP[p])
    .filter(Boolean)

  const mainTs = [
    'import { createApp } from \'vue\'',
    'import App from \'./App.vue\'',
    pluginImports.length > 0
      ? `import { ${pluginImports.join(', ')} } from '@vuetify/v0'`
      : '',
    'import \'./uno.config.ts\'',
    '',
    'const app = createApp(App)',
    ...pluginSetups,
    'app.mount(\'#app\')',
  ].filter(Boolean).join('\n')

  const demo = composable
  const appVue = demo
    ? `<script lang="ts" setup>
import { ${demo} } from '@vuetify/v0'

const result = ${demo}()
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Your v0 Framework</h1>
    <p class="text-on-surface-variant">
      Loaded with ${allFeatures.length} features. Start building!
    </p>
  </div>
</template>`
    : `<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">Your v0 Framework</h1>
    <p class="text-on-surface-variant">
      Loaded with ${allFeatures.length} features. Start building!
    </p>
  </div>
</template>`

  return {
    'src/main.ts': mainTs,
    'src/App.vue': appVue,
  }
}

export function toHashData (manifest: FrameworkManifest): PlaygroundHashData {
  return {
    files: generateFiles(manifest),
    active: 'src/App.vue',
    imports: generateImports(),
    settings: {
      preset: 'default',
    },
  }
}

export async function encodeHash (data: PlaygroundHashData): Promise<string> {
  const { strToU8, strFromU8, zlibSync } = await import('fflate')
  const buffer = strToU8(JSON.stringify(data))
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export async function toPlaygroundUrl (manifest: FrameworkManifest, baseUrl: string): Promise<string> {
  const data = toHashData(manifest)
  const hash = await encodeHash(data)
  return `${baseUrl}#${hash}`
}

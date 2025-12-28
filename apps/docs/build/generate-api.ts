/**
 * Vite plugin to generate API documentation from TypeScript sources.
 *
 * - Components: Uses vue-component-meta to extract props, events, slots
 * - Composables: TODO - will use ts-morph for interface extraction
 */

import { readdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createChecker } from 'vue-component-meta'

// Types
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../..')
const COMPONENTS_DIR = resolve(ROOT, 'packages/0/src/components')
const TSCONFIG = resolve(ROOT, 'tsconfig.json')

// Vue internal props to filter out
const VUE_INTERNALS = new Set([
  'key',
  'ref',
  'ref_for',
  'ref_key',
  'class',
  'style',
  'onVue:beforeMount',
  'onVue:mounted',
  'onVue:beforeUpdate',
  'onVue:updated',
  'onVue:beforeUnmount',
  'onVue:unmounted',
])

export interface ApiProp {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface ApiEvent {
  name: string
  type: string
  description?: string
}

export interface ApiSlot {
  name: string
  type?: string
  description?: string
}

export interface ComponentApi {
  name: string
  description?: string
  props: ApiProp[]
  events: ApiEvent[]
  slots: ApiSlot[]
}

let checker: ReturnType<typeof createChecker> | null = null

function getChecker () {
  if (!checker) {
    checker = createChecker(TSCONFIG, {
      forceUseTs: true,
      printer: { newLine: 1 },
    })
  }
  return checker
}

function extractComponentApi (filePath: string): ComponentApi | null {
  try {
    const meta = getChecker().getComponentMeta(filePath)

    // Filter out Vue internals from props
    const props: ApiProp[] = meta.props
      .filter(p => !VUE_INTERNALS.has(p.name))
      .map(p => ({
        name: p.name,
        type: p.type,
        required: p.required,
        default: p.default,
        description: p.description,
      }))

    const events: ApiEvent[] = meta.events
      .filter(e => e.name !== 'update:modelValue') // Duplicate of update:model-value
      .map(e => ({
        name: e.name,
        type: e.type,
        description: e.description,
      }))

    const slots: ApiSlot[] = meta.slots.map(s => ({
      name: s.name,
      type: s.type,
      description: s.description,
    }))

    return {
      name: meta.name || filePath.split('/').pop()?.replace('.vue', '') || 'Unknown',
      props,
      events,
      slots,
    }
  } catch {
    return null
  }
}

async function findComponentFiles (): Promise<string[]> {
  const files: string[] = []

  const dirs = await readdir(COMPONENTS_DIR)
  for (const dir of dirs) {
    const dirPath = resolve(COMPONENTS_DIR, dir)
    const entries = await readdir(dirPath).catch(() => [])

    for (const entry of entries) {
      if (entry.endsWith('.vue')) {
        files.push(resolve(dirPath, entry))
      }
    }
  }

  return files
}

async function generateComponentApis (): Promise<Record<string, ComponentApi>> {
  const apis: Record<string, ComponentApi> = {}
  const files = await findComponentFiles()

  for (const file of files) {
    const api = extractComponentApi(file)
    if (api && api.props.length > 0) {
      // Use filename as key (e.g., "SelectionRoot")
      const name = file.split('/').pop()?.replace('.vue', '') || 'Unknown'
      apis[name] = { ...api, name }
    }
  }

  return apis
}

export default function generateApiPlugin (): Plugin {
  let isBuild = false
  let apiCache: Record<string, ComponentApi> | null = null

  return {
    name: 'generate-api',

    config (_, { command }) {
      isBuild = command === 'build'
    },

    configureServer (server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/components/')) return next()

        const componentName = req.url.replace('/api/components/', '').replace('.json', '')

        try {
          if (!apiCache) {
            apiCache = await generateComponentApis()
          }

          const api = apiCache[componentName]
          if (!api) {
            res.statusCode = 404
            res.end('Not found')
            return
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(api))
        } catch (error) {
          console.error('[generate-api] Error:', error)
          res.statusCode = 500
          res.end('Error generating API')
        }
      })

      // Also serve index of all components
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/components.json') return next()

        try {
          if (!apiCache) {
            apiCache = await generateComponentApis()
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(apiCache))
        } catch (error) {
          console.error('[generate-api] Error:', error)
          res.statusCode = 500
          res.end('Error generating API index')
        }
      })
    },

    async generateBundle (_, bundle) {
      if (!isBuild || Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const apis = await generateComponentApis()

      // Emit individual component API files
      for (const [name, api] of Object.entries(apis)) {
        this.emitFile({
          type: 'asset',
          fileName: `api/components/${name}.json`,
          source: JSON.stringify(api),
        })
      }

      // Emit index
      this.emitFile({
        type: 'asset',
        fileName: 'api/components.json',
        source: JSON.stringify(apis),
      })

      console.log(`[generate-api] Generated API for ${Object.keys(apis).length} components`)
    },

    buildEnd () {
      // Clean up checker on build end
      checker = null
    },
  }
}

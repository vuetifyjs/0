/**
 * Vite plugin to generate examples manifest for /docs/ask context.
 *
 * Maps page paths to their example .vue file contents.
 * Provides /examples.json endpoint in dev and emits asset in build.
 */

import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXAMPLES_DIR = resolve(__dirname, '../src/examples')

export type ExamplesData = Record<string, Record<string, string>>

async function generateExamplesData (): Promise<ExamplesData> {
  const data: ExamplesData = {}

  // Process components examples
  const componentsDir = resolve(EXAMPLES_DIR, 'components')
  const componentDirs = await readdir(componentsDir).catch(() => [])

  for (const componentDir of componentDirs) {
    const examplesPath = resolve(componentsDir, componentDir)
    const files = await readdir(examplesPath).catch(() => [])
    const vueFiles = files.filter(f => f.endsWith('.vue'))

    if (vueFiles.length > 0) {
      const examples: Record<string, string> = {}
      for (const file of vueFiles) {
        const content = await readFile(resolve(examplesPath, file), 'utf8')
        examples[file] = content
      }
      // Map to page path pattern: /components/*/step -> step examples
      data[componentDir] = examples
    }
  }

  // Process composables examples
  const composablesDir = resolve(EXAMPLES_DIR, 'composables')
  const composableDirs = await readdir(composablesDir).catch(() => [])

  for (const composableDir of composableDirs) {
    const examplesPath = resolve(composablesDir, composableDir)
    const files = await readdir(examplesPath).catch(() => [])
    const vueFiles = files.filter(f => f.endsWith('.vue'))

    if (vueFiles.length > 0) {
      const examples: Record<string, string> = {}
      for (const file of vueFiles) {
        const content = await readFile(resolve(examplesPath, file), 'utf8')
        examples[file] = content
      }
      // Map to page path pattern: /composables/*/use-selection -> use-selection examples
      data[composableDir] = examples
    }
  }

  return data
}

export default function generateExamplesPlugin (): Plugin {
  let examplesData: ExamplesData | null = null
  let examplesPromise: Promise<ExamplesData> | null = null

  async function getExamplesData () {
    if (examplesData) return examplesData
    if (!examplesPromise) {
      examplesPromise = (async () => {
        try {
          const data = await generateExamplesData()
          console.log(`[generate-examples] Found examples for ${Object.keys(data).length} pages`)
          return data
        } catch (error) {
          examplesPromise = null
          throw error
        }
      })()
    }
    examplesData = await examplesPromise
    return examplesData
  }

  return {
    name: 'generate-examples',

    configureServer (server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/examples.json') return next()

        try {
          const data = await getExamplesData()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (error) {
          console.error('[generate-examples] Error:', error)
          res.statusCode = 500
          res.end('Error generating examples data')
        }
      })
    },

    async generateBundle (_, bundle) {
      // Skip if this is the main entry (avoid duplicate emission)
      if (Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const data = await getExamplesData()
      this.emitFile({
        type: 'asset',
        fileName: 'examples.json',
        source: JSON.stringify(data),
      })
    },

    buildEnd () {
      examplesData = null
      examplesPromise = null
    },
  }
}

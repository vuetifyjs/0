import { readdir } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { collectTests, hasTests } from './feature-tests'

// Types
import type { FeatureTests } from './feature-tests'
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../../../packages/0/src')

const VIRTUAL_MODULE_ID = 'virtual:feature-tests'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

const ROOTS = ['components', 'composables'] as const

async function listFiles (dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await listFiles(path)
      files.push(...nested)
      continue
    }
    files.push(path)
  }
  return files
}

/**
 * Test files under each component and composable directory.
 * Keys match `features.github` (`/components/Dialog/`).
 */
export async function scanFeatureTests (src = SRC): Promise<Record<string, FeatureTests>> {
  const out: Record<string, FeatureTests> = {}

  for (const root of ROOTS) {
    let entries
    try {
      entries = await readdir(join(src, root), { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const abs = join(src, root, entry.name)
      const files = await listFiles(abs)
      const paths = files.map(file => relative(abs, file).split(sep).join('/'))
      const tests = collectTests(paths)
      if (!hasTests(tests)) continue
      out[`/${root}/${entry.name}/`] = tests
    }
  }

  return out
}

export default function generateFeatureTestsPlugin (): Plugin {
  let cache: Record<string, FeatureTests> | null = null
  let pending: Promise<Record<string, FeatureTests>> | null = null

  function getTests () {
    if (cache) return Promise.resolve(cache)
    if (!pending) {
      pending = scanFeatureTests().then(result => {
        cache = result
        pending = null
        return result
      })
    }
    return pending
  }

  function invalidate () {
    cache = null
    pending = null
  }

  return {
    name: 'generate-feature-tests',

    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    async load (id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return
      const data = await getTests()
      return `export const featureTests = ${JSON.stringify(data)}\n`
    },

    configureServer (server: ViteDevServer) {
      const marker = `${sep}packages${sep}0${sep}src${sep}`

      function onChange (file: string) {
        if (!file.includes(marker)) return
        if (!/\.(?:test|bench)\.ts$/.test(file)) return
        invalidate()
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }

      server.watcher.on('change', onChange)
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },

    buildEnd () {
      invalidate()
    },
  }
}

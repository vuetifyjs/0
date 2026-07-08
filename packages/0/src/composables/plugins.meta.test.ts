/**
 * Meta-test: every composable that uses createPluginContext must have a
 * corresponding index.ssr.test.ts file. This prevents new plugins from
 * shipping without an SSR contract test.
 *
 * If you add a new plugin composable (one whose index.ts imports
 * createPluginContext), add a sibling index.ssr.test.ts file before
 * this meta-test will pass.
 */
import * as fs from 'node:fs'
import * as path from 'node:path'

import { describe, expect, it } from 'vitest'

const COMPOSABLES_DIR = path.resolve(import.meta.dirname)

function readFileIfExists (filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

// createPlugin is the infrastructure that provides createPluginContext — it is not itself a plugin
const INFRASTRUCTURE = new Set(['createPlugin'])

function discoverPluginComposables (): string[] {
  const entries = fs.readdirSync(COMPOSABLES_DIR, { withFileTypes: true })
  const plugins: string[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (INFRASTRUCTURE.has(entry.name)) continue

    const indexPath = path.join(COMPOSABLES_DIR, entry.name, 'index.ts')
    const source = readFileIfExists(indexPath)

    if (source?.includes('createPluginContext')) {
      plugins.push(entry.name)
    }
  }

  return plugins.toSorted()
}

describe('plugin SSR coverage meta-test', () => {
  const plugins = discoverPluginComposables()

  it('discovers at least one plugin composable', () => {
    expect(plugins.length).toBeGreaterThan(0)
  })

  it.each(plugins)('%s has an index.ssr.test.ts file', plugin => {
    const ssrTestPath = path.join(COMPOSABLES_DIR, plugin, 'index.ssr.test.ts')

    if (!fs.existsSync(ssrTestPath)) {
      throw new Error(
        `Missing SSR test: packages/0/src/composables/${plugin}/index.ssr.test.ts\n` +
        `Every plugin composable must have a sibling index.ssr.test.ts covering its SSR contract.`,
      )
    }
  })
})

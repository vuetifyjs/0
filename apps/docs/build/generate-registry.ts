/**
 * Vite plugin to publish the `vuetify add` registry.
 *
 * Serves `/registry/*` in dev and emits the same files as build assets, so the
 * CLI reads a plain static origin with no server behind it.
 *
 * Endpoints:
 * - `/registry/index.json`         slim catalog (names, types, example ids)
 * - `/registry/tokens.json`        semantic token contract + config snippets
 * - `/registry/{type}/{name}.json` one item, file contents included
 *
 * The slim index exists so `vuetify add dialog` downloads a few KB to resolve a
 * name instead of the whole corpus.
 */

import { build, contract } from './registry'

// Types
import type { Registry } from './registry'
import type { Plugin } from 'vite'

/**
 * Docs-only tokens in an example render unstyled once copied into a consumer
 * project, so they fail the production build rather than shipping broken. Dev
 * only warns — an author mid-edit should not be blocked.
 */
function report (warnings: string[], fatal: boolean) {
  if (warnings.length === 0) return

  for (const warning of warnings) console.warn(warning)

  if (fatal) {
    throw new Error(
      `[generate-registry] ${warnings.length} registry problem(s). `
      + `Examples must be portable — see PORTABLE_TOKENS in build/registry.ts.`,
    )
  }
}

export default function generateRegistryPlugin (): Plugin {
  let registry: Registry | null = null
  let pending: Promise<Registry> | null = null
  let dev = false

  async function get () {
    if (registry) return registry
    pending ??= (async () => {
      try {
        const result = await build()
        console.log(`[generate-registry] ${result.items.length} items`)
        report(result.warnings, !dev)
        return result
      } catch (error) {
        pending = null
        throw error
      }
    })()

    registry = await pending
    return registry
  }

  return {
    name: 'generate-registry',

    configureServer (server) {
      dev = true

      // Mirror generate-nav / generate-llms-full: drop the memo when source
      // pages or examples change so a local CLI against the dev origin sees
      // fresh bodies without a server restart.
      server.watcher.on('change', file => {
        const touched = file.includes('/pages/') || file.includes('/examples/')
        if (!touched) return
        if (!file.endsWith('.md') && !file.endsWith('.vue') && !file.endsWith('.ts')) return
        registry = null
        pending = null
      })

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url?.startsWith('/registry/') || !url.endsWith('.json')) return next()

        try {
          const data = await get()
          const path = url.slice('/registry/'.length, -'.json'.length)

          const body = path === 'index'
            ? data.index
            : (path === 'tokens'
                ? contract()
                : data.items.find(item => `${item.type}/${item.name}` === path))

          if (!body) {
            res.statusCode = 404
            res.end(`Unknown registry item: ${path}`)
            return
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        } catch (error) {
          console.error('[generate-registry] Error:', error)
          res.statusCode = 500
          res.end('Error generating registry')
        }
      })
    },

    async generateBundle (_, bundle) {
      // Skip if this is the main entry (avoid duplicate emission)
      if (Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const data = await get()

      this.emitFile({
        type: 'asset',
        fileName: 'registry/index.json',
        source: JSON.stringify(data.index),
      })

      this.emitFile({
        type: 'asset',
        fileName: 'registry/tokens.json',
        source: JSON.stringify(contract()),
      })

      for (const item of data.items) {
        this.emitFile({
          type: 'asset',
          fileName: `registry/${item.type}/${item.name}.json`,
          source: JSON.stringify(item),
        })
      }
    },

    buildEnd () {
      registry = null
      pending = null
    },
  }
}

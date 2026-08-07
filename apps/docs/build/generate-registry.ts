/**
 * Vite plugin to publish the official seed registry for `vuetify add`.
 *
 * Serves `/registry/*` in dev and emits the same files as build assets so the
 * CLI can read a plain static origin. This is the first-party catalog of docs
 * examples — not a user's library (that is `vuetify.json` + optional self-hosted
 * registries later).
 *
 * Endpoints:
 * - `/registry/index.json`         slim catalog (names, types, example ids)
 * - `/registry/tokens.json`        semantic token contract + config snippets
 * - `/registry/{type}/{name}.json` one item, file contents included
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
      + `See warnings above (missing files, case collisions, docs-only tokens, …).`,
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
      // fresh bodies without a server restart. `add`/`unlink` matter when an
      // author creates or deletes an example file mid-session.
      function invalidate (file: string) {
        // Vite may report Windows paths with `\`; normalize before matching.
        const normalized = file.replaceAll('\\', '/')
        const data = normalized.endsWith('maturity.json')
          || normalized.endsWith('package.json')
          || normalized.endsWith('uno.config.ts')
        const docs = (normalized.includes('/pages/') || normalized.includes('/examples/'))
          && (normalized.endsWith('.md') || normalized.endsWith('.vue') || normalized.endsWith('.ts'))
        if (!data && !docs) return
        registry = null
        pending = null
      }

      for (const event of ['change', 'add', 'unlink'] as const) {
        server.watcher.on(event, invalidate)
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (!url?.startsWith('/registry/') || !url.endsWith('.json')) return next()

        // Playground (v0play / localhost) fetches this origin cross-site.
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.setHeader('Allow', 'GET, OPTIONS')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

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
            res.end('Unknown registry item')
            return
          }

          res.setHeader('Content-Type', 'application/json; charset=utf-8')
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

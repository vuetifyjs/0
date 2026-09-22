/**
 * Provide `virtual:md-routes` — a map of route path to markdown-twin URL.
 *
 * Every docs route that has a `.md` twin gets a `<link rel="alternate">` in
 * App.vue so agent fetchers and AI crawlers can discover the markdown without
 * guessing a URL. The twins already shipped; nothing advertised them.
 *
 * The mapping is not derivable from the route alone: `pages/composables/index.md`
 * serves route `/composables` but copies to `/composables/index.md`, while
 * `pages/composables/data/create-filter.md` serves `/composables/data/create-filter`
 * and copies to that path plus `.md`. Emitting a manifest keeps App.vue from
 * guessing and advertising links that 404.
 *
 * Twin producers: `copy-markdown` (authored pages) and `generate-api-markdown`
 * (the /api reference, which renders from `virtual:api` and has no source file).
 */

import { glob } from 'node:fs/promises'
import { relative } from 'node:path'

import { getApiNames } from './api-names'

// Types
import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:md-routes'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

async function getMarkdownRoutes (): Promise<Record<string, string>> {
  const routes: Record<string, string> = {}

  for await (const file of glob('src/pages/**/*.md')) {
    const rel = relative('src/pages', file).replaceAll('\\', '/')

    let route: string
    if (rel === 'index.md') route = '/'
    else if (rel.endsWith('/index.md')) route = `/${rel.slice(0, -'/index.md'.length)}`
    else route = `/${rel.slice(0, -'.md'.length)}`

    routes[route] = `/${rel}`
  }

  for (const { slug } of await getApiNames()) {
    routes[`/api/${slug}`] = `/api/${slug}.md`
  }

  return routes
}

export default function mdRoutesPlugin (): Plugin {
  return {
    name: 'md-routes',
    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },
    async load (id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return
      return `export default ${JSON.stringify(await getMarkdownRoutes())}`
    },
  }
}

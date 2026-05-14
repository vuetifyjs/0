import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { tsImport } from 'tsx/esm/api'

// Local
import { createMarkdownIt } from './markdown'

// Types
import type { Tip } from '../src/data/tips'
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TIPS_SOURCE = resolve(__dirname, '../src/data/tips.ts')

const VIRTUAL_MODULE_ID = 'virtual:tips'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export interface CompiledTip {
  id: string
  bodyHtml: string
  link?: Tip['link']
}

let compiledCache: CompiledTip[] | null = null
let compilePromise: Promise<CompiledTip[]> | null = null

async function getCompiled (): Promise<CompiledTip[]> {
  if (compiledCache) return compiledCache
  if (!compilePromise) {
    compilePromise = compile().catch(error => {
      compilePromise = null
      throw error
    })
  }
  compiledCache = await compilePromise
  return compiledCache
}

async function loadTips (): Promise<Tip[]> {
  const mod = await tsImport(pathToFileURL(TIPS_SOURCE).href, import.meta.url) as { tips: Tip[] }
  if (!Array.isArray(mod.tips)) {
    throw new TypeError('[generate-tips] tips.ts must export a `tips` array')
  }
  return mod.tips
}

function validate (source: Tip[]): void {
  const ids = new Set<string>()
  for (const tip of source) {
    if (!tip.id) {
      throw new Error(`[generate-tips] Tip is missing "id": ${JSON.stringify(tip)}`)
    }
    if (ids.has(tip.id)) {
      throw new Error(`[generate-tips] Duplicate tip id: "${tip.id}"`)
    }
    ids.add(tip.id)
    if (!tip.body?.trim()) {
      throw new Error(`[generate-tips] Tip "${tip.id}" has empty body`)
    }
  }
  if (source.length === 0) {
    console.warn('[generate-tips] Pool is empty — random tip callouts will hide themselves.')
  }
}

async function compile (): Promise<CompiledTip[]> {
  const source = await loadTips()
  validate(source)
  const md = await createMarkdownIt()
  return source.map(tip => ({
    id: tip.id,
    bodyHtml: md.renderInline(tip.body),
    link: tip.link,
  }))
}

export default function generateTipsPlugin (): Plugin {
  let server: ViteDevServer | null = null

  return {
    name: 'generate-tips',
    configureServer (s) {
      server = s
    },
    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },
    async load (id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return
      const compiled = await getCompiled()
      return `export default ${JSON.stringify(compiled)}\n`
    },
    async handleHotUpdate (ctx) {
      if (ctx.file !== TIPS_SOURCE) return
      if (!server) return
      compiledCache = null
      compilePromise = null
      const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
      if (mod) {
        server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}

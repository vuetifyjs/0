import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Plugin, ViteDevServer } from 'vite'

import { stripFrontmatter } from './frontmatter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const BASE_URL = 'https://0.vuetifyjs.com'

// Category order for sorting
const CATEGORY_ORDER: Record<string, number> = {
  introduction: 0,
  guide: 1,
  components: 10,
  composables: 20,
  utilities: 30,
}

function getUrlPath (filePath: string): string {
  return '/' + relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function getCategoryOrder (filePath: string): number {
  const rel = relative(PAGES_DIR, filePath)
  const topLevel = dirname(rel).split('/')[0]
  return CATEGORY_ORDER[topLevel] ?? 50
}

function getTitle (filePath: string): string {
  const name = basename(filePath, '.md')
  if (name === 'index') {
    return basename(dirname(filePath))
  }
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function stripVueComponents (content: string): string {
  // Remove Vue component tags like <DocsPageFeatures /> or <SomeComponent>...</SomeComponent>
  return content
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
}

async function generateLlmsContent (): Promise<string> {
  const files: Array<{ path: string, order: number, title: string, content: string }> = []

  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    try {
      const raw = readFileSync(file, 'utf8')
      const content = stripVueComponents(stripFrontmatter(raw))
      const urlPath = getUrlPath(file)

      files.push({
        path: urlPath,
        order: getCategoryOrder(file),
        title: getTitle(file),
        content,
      })
    } catch {
      // Skip files that can't be read
    }
  }

  // Sort by category order, then path
  files.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.path.localeCompare(b.path)
  })

  // Build llms-full.txt
  const sections = [
    '# @vuetify/v0 - Complete Documentation',
    '',
    '> Headless Vue 3 UI primitives and composables for building modern applications and design systems.',
    '',
    '---',
    '',
  ]

  for (const file of files) {
    sections.push(`# ${file.title}`, `URL: ${BASE_URL}${file.path}`, '', file.content, '', '---', '')
  }

  return sections.join('\n')
}

export default function generateLlmsFullPlugin (): Plugin {
  let llmsData: string | null = null
  let llmsPromise: Promise<string> | null = null

  async function getLlmsData () {
    if (llmsData) return llmsData
    if (!llmsPromise) {
      llmsPromise = (async () => {
        try {
          return await generateLlmsContent()
        } catch (error) {
          llmsPromise = null
          throw error
        }
      })()
    }
    llmsData = await llmsPromise
    return llmsData
  }

  return {
    name: 'generate-llms-full',

    configureServer (server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/llms-full.txt') return next()

        try {
          const content = await getLlmsData()
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(content)
        } catch (error) {
          console.error('[generate-llms-full] Error generating content:', error)
          res.statusCode = 500
          res.end('Error generating llms-full.txt')
        }
      })
    },

    apply: (config, { command }) => command === 'build' && !config.build?.ssr,

    async generateBundle () {
      const content = await getLlmsData()

      this.emitFile({
        type: 'asset',
        fileName: 'llms-full.txt',
        source: content,
      })

      console.log('[generate-llms-full] Generated llms-full.txt')
    },

    buildEnd () {
      llmsData = null
      llmsPromise = null
    },
  }
}

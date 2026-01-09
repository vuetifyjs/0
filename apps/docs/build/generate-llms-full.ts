import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Plugin, ViteDevServer } from 'vite'

import { parseFrontmatter } from './frontmatter'

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

// Composable subcategory display names and order
const COMPOSABLE_CATEGORIES: Record<string, { name: string, order: number }> = {
  foundation: { name: 'Foundation', order: 0 },
  registration: { name: 'Registration', order: 1 },
  selection: { name: 'Selection', order: 2 },
  forms: { name: 'Forms', order: 3 },
  reactivity: { name: 'Reactivity', order: 4 },
  plugins: { name: 'Plugins', order: 5 },
  system: { name: 'System', order: 6 },
  utilities: { name: 'Utilities', order: 7 },
  transformers: { name: 'Transformers', order: 8 },
}

interface PageInfo {
  path: string
  order: number
  title: string
  description: string
  content: string
  category: string
  subcategory: string
}

function getUrlPath (filePath: string): string {
  return '/' + relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function getCategoryInfo (filePath: string): { category: string, subcategory: string, order: number } {
  const rel = relative(PAGES_DIR, filePath)
  const parts = dirname(rel).split('/')
  const topLevel = parts[0]
  const subLevel = parts[1] || ''

  return {
    category: topLevel,
    subcategory: subLevel,
    order: CATEGORY_ORDER[topLevel] ?? 50,
  }
}

function getTitle (filePath: string, frontmatterTitle?: string): string {
  // Extract short title from frontmatter (e.g., "Dialog - Modal dialog..." -> "Dialog")
  if (frontmatterTitle) {
    const dash = frontmatterTitle.indexOf(' - ')
    if (dash > 0) return frontmatterTitle.slice(0, dash)
    return frontmatterTitle
  }

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
  return content
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
}

async function collectPages (): Promise<PageInfo[]> {
  const pages: PageInfo[] = []

  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    try {
      const raw = readFileSync(file, 'utf8')
      const { frontmatter, body } = parseFrontmatter(raw)
      const content = stripVueComponents(body)
      const urlPath = getUrlPath(file)
      const { category, subcategory, order } = getCategoryInfo(file)

      // Skip index pages for llms.txt (but include for llms-full.txt)
      pages.push({
        path: urlPath,
        order,
        title: getTitle(file, frontmatter.title),
        description: frontmatter.description || '',
        content,
        category,
        subcategory,
      })
    } catch {
      // Skip files that can't be read
    }
  }

  return pages
}

function generateLlmsTxt (pages: PageInfo[]): string {
  const lines = [
    '# Vuetify0',
    '',
    '> Lightweight, modular meta-framework for building headless UI systems with Vue.js. Provides unstyled, logic-focused components and composables as building blocks for design systems.',
    '',
  ]

  // Guide section
  const guidePages = pages
    .filter(p => p.category === 'guide' && p.path !== '/guide')
    .toSorted((a, b) => a.path.localeCompare(b.path))

  if (guidePages.length > 0) {
    lines.push('## Guide', '')
    for (const page of guidePages) {
      const desc = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${BASE_URL}${page.path})${desc}`)
    }
    lines.push('')
  }

  // Introduction section (Getting Started, Contributing, FAQ)
  const introPages = pages
    .filter(p => p.category === 'introduction' && p.path !== '/introduction')
    .toSorted((a, b) => a.path.localeCompare(b.path))

  if (introPages.length > 0) {
    lines.push('## Introduction', '')
    for (const page of introPages) {
      const desc = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${BASE_URL}${page.path})${desc}`)
    }
    lines.push('')
  }

  // Components section (flat, alphabetical)
  const componentPages = pages
    .filter(p => p.category === 'components' && p.path !== '/components')
    .toSorted((a, b) => a.title.localeCompare(b.title))

  if (componentPages.length > 0) {
    lines.push('## Components', '')
    for (const page of componentPages) {
      const desc = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${BASE_URL}${page.path})${desc}`)
    }
    lines.push('')
  }

  // Composables by subcategory
  const composablePages = pages.filter(p => p.category === 'composables' && p.path !== '/composables')
  const composablesBySubcat = new Map<string, PageInfo[]>()

  for (const page of composablePages) {
    const subcat = page.subcategory || 'other'
    if (!composablesBySubcat.has(subcat)) {
      composablesBySubcat.set(subcat, [])
    }
    composablesBySubcat.get(subcat)!.push(page)
  }

  // Sort subcategories by defined order
  const sortedSubcats = [...composablesBySubcat.keys()].toSorted((a, b) => {
    const orderA = COMPOSABLE_CATEGORIES[a]?.order ?? 99
    const orderB = COMPOSABLE_CATEGORIES[b]?.order ?? 99
    return orderA - orderB
  })

  for (const subcat of sortedSubcats) {
    const subcatPages = composablesBySubcat.get(subcat)!.toSorted((a, b) => a.title.localeCompare(b.title))
    const displayName = COMPOSABLE_CATEGORIES[subcat]?.name || subcat.charAt(0).toUpperCase() + subcat.slice(1)

    lines.push(`## Composables - ${displayName}`, '')
    for (const page of subcatPages) {
      const desc = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${BASE_URL}${page.path})${desc}`)
    }
    lines.push('')
  }

  // Utilities section
  const utilityPages = pages
    .filter(p => p.category === 'utilities' && p.path !== '/utilities')
    .toSorted((a, b) => a.title.localeCompare(b.title))

  if (utilityPages.length > 0) {
    lines.push('## Utilities', '')
    for (const page of utilityPages) {
      const desc = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${BASE_URL}${page.path})${desc}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function generateLlmsFullTxt (pages: PageInfo[]): string {
  // Sort by category order, then path
  const sorted = pages.toSorted((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.path.localeCompare(b.path)
  })

  const sections = [
    '# @vuetify/v0 - Complete Documentation',
    '',
    '> Headless Vue 3 UI primitives and composables for building modern applications and design systems.',
    '',
    '---',
    '',
  ]

  for (const page of sorted) {
    sections.push(`# ${page.title}`, `URL: ${BASE_URL}${page.path}`, '', page.content, '', '---', '')
  }

  return sections.join('\n')
}

export default function generateLlmsFullPlugin (): Plugin {
  let pagesCache: PageInfo[] | null = null
  let pagesPromise: Promise<PageInfo[]> | null = null

  async function getPages () {
    if (pagesCache) return pagesCache
    if (!pagesPromise) {
      pagesPromise = (async () => {
        try {
          return await collectPages()
        } catch (error) {
          pagesPromise = null
          throw error
        }
      })()
    }
    pagesCache = await pagesPromise
    return pagesCache
  }

  return {
    name: 'generate-llms',

    configureServer (server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/llms.txt' && req.url !== '/llms-full.txt') return next()

        try {
          const pages = await getPages()
          const content = req.url === '/llms.txt'
            ? generateLlmsTxt(pages)
            : generateLlmsFullTxt(pages)

          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(content)
        } catch (error) {
          console.error('[generate-llms] Error generating content:', error)
          res.statusCode = 500
          res.end(`Error generating ${req.url}`)
        }
      })
    },

    async generateBundle (_, bundle) {
      // Only emit during client build, not SSR
      if (this.meta.watchMode) return
      if (Object.keys(bundle).some(k => k.includes('entry-server'))) return

      const pages = await getPages()

      this.emitFile({
        type: 'asset',
        fileName: 'llms.txt',
        source: generateLlmsTxt(pages),
      })

      this.emitFile({
        type: 'asset',
        fileName: 'llms-full.txt',
        source: generateLlmsFullTxt(pages),
      })

      console.log('[generate-llms] Generated llms.txt and llms-full.txt')
    },

    buildEnd () {
      pagesCache = null
      pagesPromise = null
    },
  }
}

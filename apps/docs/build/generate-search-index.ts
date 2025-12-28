import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')

// Types
import type { Plugin, ViteDevServer } from 'vite'

export interface SearchDocument {
  id: string
  title: string
  category: string
  path: string
  headings: string[]
  content: string
}

interface Frontmatter {
  title?: string
  features?: {
    category?: string
    label?: string
  }
}

function parseFrontmatter (content: string): { frontmatter: Frontmatter, body: string } {
  if (!content.startsWith('---')) {
    return { frontmatter: {}, body: content }
  }

  const end = content.indexOf('---', 3)
  if (end === -1) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = content.slice(3, end).trim()
  const body = content.slice(end + 3).trim()

  // Simple YAML parser for our needs
  const frontmatter: Frontmatter = {}
  const lines = frontmatterStr.split('\n')
  let currentKey = ''
  const features: Frontmatter['features'] = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('-')) continue

    if (trimmed.startsWith('title:')) {
      frontmatter.title = trimmed.slice(6).trim().replace(/^['"]|['"]$/g, '')
    } else if (trimmed === 'features:') {
      currentKey = 'features'
    } else if (currentKey === 'features' && trimmed.startsWith('category:')) {
      features.category = trimmed.slice(9).trim().replace(/^['"]|['"]$/g, '')
    } else if (currentKey === 'features' && trimmed.startsWith('label:')) {
      features.label = trimmed.slice(6).trim().replace(/^['"]|['"]$/g, '')
    } else if (!line.startsWith(' ') && !line.startsWith('\t')) {
      currentKey = ''
    }
  }

  if (Object.keys(features).length > 0) {
    frontmatter.features = features
  }

  return { frontmatter, body }
}

function extractHeadings (content: string): string[] {
  const headings: string[] = []
  const headingRegex = /^#{2,3}\s+(.+?)(?:\s*\{[^}]*\})?$/gm
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    // Clean up the heading text
    const heading = match[1]
      .replace(/`([^`]+)`/g, '$1') // Remove inline code backticks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .trim()
    headings.push(heading)
  }

  return headings
}

function stripMarkdown (content: string): string {
  return content
    // Remove Vue component tags
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove emphasis markers
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove heading IDs
    .replace(/\{[^}]*\}/g, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function getUrlPath (filePath: string): string {
  return '/' + relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function getCategoryFromPath (filePath: string): string {
  const rel = relative(PAGES_DIR, filePath)
  const parts = dirname(rel).split('/')

  // Map directory to readable category
  const categoryMap: Record<string, string> = {
    introduction: 'Introduction',
    guide: 'Guide',
    components: 'Components',
    composables: 'Composables',
    utilities: 'Utilities',
    storybook: 'Storybook',
  }

  return categoryMap[parts[0]] ?? 'Other'
}

function getTitleFromPath (filePath: string): string {
  const name = basename(filePath, '.md')
  if (name === 'index') {
    return basename(dirname(filePath))
  }
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function generateSearchIndex (): Promise<SearchDocument[]> {
  const documents: SearchDocument[] = []
  let id = 0

  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    try {
      const raw = readFileSync(file, 'utf8')
      const { frontmatter, body } = parseFrontmatter(raw)

      const urlPath = getUrlPath(file)
      const headings = extractHeadings(body)
      const content = stripMarkdown(body)

      // Get title from frontmatter or derive from path
      let title = frontmatter.title ?? getTitleFromPath(file)
      // Clean title (remove " - Description" suffix)
      if (title.includes(' - ')) {
        title = title.split(' - ')[0]
      }

      // Get category from frontmatter or path
      const category = frontmatter.features?.category ?? getCategoryFromPath(file)

      documents.push({
        id: String(id++),
        title,
        category,
        path: urlPath,
        headings,
        content: content.slice(0, 5000), // Limit content size
      })
    } catch {
      // Skip files that can't be read
    }
  }

  // Sort by category then title
  documents.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.title.localeCompare(b.title)
  })

  return documents
}

export default function generateSearchIndexPlugin (): Plugin {
  let isBuild = false

  return {
    name: 'generate-search-index',

    config (_, { command }) {
      isBuild = command === 'build'
    },

    configureServer (server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/search-index.json') return next()

        try {
          const documents = await generateSearchIndex()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(documents))
        } catch (error) {
          console.error('[generate-search-index] Error:', error)
          res.statusCode = 500
          res.end('Error generating search index')
        }
      })
    },

    async generateBundle (_, bundle) {
      // Only emit during client build, not SSR
      if (!isBuild || Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const documents = await generateSearchIndex()

      this.emitFile({
        type: 'asset',
        fileName: 'search-index.json',
        source: JSON.stringify(documents),
      })

      console.log(`[generate-search-index] Generated index with ${documents.length} documents`)
    },
  }
}

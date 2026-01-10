import { execSync } from 'node:child_process'
import { glob } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Plugin, ViteDevServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const ROOT_DIR = resolve(__dirname, '../../..')

export interface PageDate {
  /** ISO 8601 timestamp of last commit */
  updated: string
  /** Short commit hash */
  hash: string
}

export type PageDates = Record<string, PageDate>

/**
 * Get git last modified date for a file.
 * Returns ISO timestamp and short hash.
 */
function getGitDate (filePath: string): PageDate | null {
  try {
    const result = execSync(
      `git log -1 --format="%aI|%h" -- "${filePath}"`,
      { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
    ).trim()

    if (!result) return null

    const [updated, hash] = result.split('|')
    return { updated, hash }
  } catch {
    return null
  }
}

/**
 * Convert file path to URL path (matching generate-nav logic).
 */
function getUrlPath (filePath: string): string {
  return '/' + relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

async function generatePageDates (): Promise<PageDates> {
  const dates: PageDates = {}

  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    const urlPath = getUrlPath(file)
    const gitDate = getGitDate(file)

    if (gitDate) {
      dates[urlPath] = gitDate
    }
  }

  return dates
}

const VIRTUAL_MODULE_ID = 'virtual:page-dates'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export default function generatePageDatesPlugin (): Plugin {
  let isBuild = false
  let datesData: PageDates | null = null
  let datesPromise: Promise<PageDates> | null = null

  async function getPageDates () {
    if (datesData) return datesData
    if (!datesPromise) {
      datesPromise = (async () => {
        try {
          return await generatePageDates()
        } catch (error) {
          datesPromise = null
          throw error
        }
      })()
    }
    datesData = await datesPromise
    return datesData
  }

  return {
    name: 'generate-page-dates',

    config (_, { command }) {
      isBuild = command === 'build'
    },

    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load (id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const dates = await getPageDates()
        return `export default ${JSON.stringify(dates)}`
      }
    },

    configureServer (server: ViteDevServer) {
      // Invalidate cache when markdown files change
      server.watcher.on('change', file => {
        if (file.endsWith('.md') && file.includes('/pages/')) {
          datesData = null
          datesPromise = null
        }
      })

      // Debug endpoint
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/page-dates.json') return next()

        try {
          const dates = await getPageDates()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(dates, null, 2))
        } catch (error) {
          console.error('[generate-page-dates] Error:', error)
          res.statusCode = 500
          res.end('Error generating page dates')
        }
      })
    },

    async generateBundle (_, bundle) {
      if (!isBuild || Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const dates = await getPageDates()
      const count = Object.keys(dates).length

      console.log(`[generate-page-dates] Extracted dates for ${count} pages`)
    },

    buildEnd () {
      datesData = null
      datesPromise = null
    },
  }
}

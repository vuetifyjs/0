import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { Frontmatter } from './frontmatter'
import type { Plugin, ViteDevServer } from 'vite'

import { getApiNamesGrouped } from './api-names'
import { parseFrontmatter } from './frontmatter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')

// Types matching stores/app.ts
export interface NavItemLink {
  name: string
  to: string
  level?: 1 | 2 | 3
  emphasized?: boolean
  children?: NavItem[]
}

export interface NavItemCategory {
  name: string
  children: NavItem[]
}

export interface NavItemDivider {
  divider: true
}

export type NavItem = NavItemLink | NavItemCategory | NavItemDivider

interface PageInfo {
  path: string
  urlPath: string
  name: string
  order: number
  hidden: boolean
  level?: 1 | 2 | 3
  emphasized?: boolean
}

// Section configuration - defines structure and ordering
const SECTIONS: Record<string, { order: number, hasSubcategories: boolean, rootPath?: string }> = {
  introduction: { order: 0, hasSubcategories: false, rootPath: '/' },
  guide: { order: 2, hasSubcategories: false },
  components: { order: 4, hasSubcategories: true },
  composables: { order: 6, hasSubcategories: true },
}

// Subcategory ordering within sections
const SUBCATEGORY_ORDER: Record<string, string[]> = {
  components: ['primitives', 'providers', 'semantic', 'disclosure'],
  composables: ['foundation', 'registration', 'selection', 'forms', 'reactivity', 'system', 'plugins', 'utilities', 'transformers'],
}

// Standalone pages that appear between sections
const STANDALONE: Record<string, { order: number, name: string }> = {
  'releases.md': { order: 1, name: 'Release Notes' },
  'roadmap.md': { order: 1.1, name: 'Roadmap' },
  'storybook/index.md': { order: 1.5, name: 'Storybook' },
}

function getNavName (frontmatter: Frontmatter, filename: string): string {
  // Use label from frontmatter, strip any single-letter prefix like "E: ", "P: ", "C: ", "U: "
  if (frontmatter.features?.label) {
    return frontmatter.features.label.replace(/^[A-Z]:\s*/, '')
  }

  // Derive from filename
  const name = basename(filename, '.md')
  if (name === 'index') return ''

  // Convert kebab-case to proper name
  // use-registry -> useRegistry
  // create-context -> createContext
  if (name.startsWith('use-') || name.startsWith('to-')) {
    const parts = name.split('-')
    return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  }
  if (name.startsWith('create-')) {
    const parts = name.split('-')
    return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  }

  // Title case for other names
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function getUrlPath (filePath: string): string {
  return '/' + relative(PAGES_DIR, filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function titleCase (str: string): string {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toNavLink (p: PageInfo): NavItemLink {
  const link: NavItemLink = { name: p.name, to: p.urlPath }
  if (p.level) link.level = p.level
  if (p.emphasized) link.emphasized = p.emphasized
  return link
}

function createSubcategoryComparator (order: string[]) {
  return (a: [string, PageInfo[]], b: [string, PageInfo[]]) => {
    const aIdx = order.indexOf(a[0])
    const bIdx = order.indexOf(b[0])
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    if (aIdx !== -1) return -1
    if (bIdx !== -1) return 1
    return a[0].localeCompare(b[0])
  }
}

function comparePages (a: PageInfo, b: PageInfo) {
  if (a.order !== b.order) return a.order - b.order
  return a.name.localeCompare(b.name)
}

function createPageInfo (relPath: string, file: string, name: string, frontmatter: Frontmatter): PageInfo {
  return {
    path: relPath,
    urlPath: getUrlPath(file),
    name,
    order: frontmatter.features?.order ?? 999,
    hidden: false,
    level: frontmatter.features?.level,
    emphasized: frontmatter.features?.emphasized,
  }
}

async function generateNav (): Promise<NavItem[]> {
  const pages = new Map<string, PageInfo[]>()
  const standalonePages: Array<{ item: NavItemLink, order: number }> = []

  // Collect all pages
  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    const relPath = relative(PAGES_DIR, file)
    const content = readFileSync(file, 'utf8')
    const { frontmatter } = parseFrontmatter(content)

    // Skip hidden pages
    if (frontmatter.features?.hidden) continue

    // Handle standalone pages
    if (STANDALONE[relPath]) {
      const { order, name } = STANDALONE[relPath]
      standalonePages.push({
        item: { name, to: getUrlPath(file) },
        order,
      })
      continue
    }

    const parts = relPath.split('/')
    const section = parts[0]

    // Skip non-configured sections
    if (!SECTIONS[section] && !relPath.endsWith('index.md')) continue

    // Root index.md
    if (relPath === 'index.md') continue

    const name = getNavName(frontmatter, file)
    if (!name && parts.length === 2) continue // Skip section index files for now

    const pageInfo = createPageInfo(relPath, file, name, frontmatter)

    const key = section
    if (!pages.has(key)) pages.set(key, [])
    pages.get(key)!.push(pageInfo)
  }

  const nav: NavItem[] = []
  const sectionEntries = Object.entries(SECTIONS).toSorted((a, b) => a[1].order - b[1].order)
  const standalonesSorted = standalonePages.toSorted((a, b) => a.order - b.order)
  let standaloneIdx = 0

  for (const [section, config] of sectionEntries) {
    const sectionPages = pages.get(section) ?? []
    if (sectionPages.length === 0 && section !== 'introduction') continue

    // Add standalone pages that come before this section (grouped without dividers between them)
    let addedStandalone = false
    while (standaloneIdx < standalonesSorted.length && standalonesSorted[standaloneIdx].order < config.order) {
      if (!addedStandalone && nav.length > 0) nav.push({ divider: true })
      nav.push(standalonesSorted[standaloneIdx].item)
      standaloneIdx++
      addedStandalone = true
    }

    // Add divider before major sections (except first)
    if (nav.length > 0) {
      nav.push({ divider: true })
    }

    const sectionName = titleCase(section)
    const sectionItem: NavItemLink = {
      name: sectionName,
      to: config.rootPath ?? `/${section}`,
      children: [],
    }

    if (config.hasSubcategories) {
      // Group by subcategory
      const subcategories = new Map<string, PageInfo[]>()

      for (const page of sectionPages) {
        const parts = page.path.split('/')
        if (parts.length < 3) continue // Skip index files

        const subcategory = parts[1]
        if (!subcategories.has(subcategory)) subcategories.set(subcategory, [])
        subcategories.get(subcategory)!.push(page)
      }

      // Sort subcategories by configured order, then alphabetically
      const order = SUBCATEGORY_ORDER[section] ?? []
      const sortedSubcategories = Array.from(subcategories.entries())
        .toSorted(createSubcategoryComparator(order))

      for (const [subcategory, subPages] of sortedSubcategories) {
        const sortedPages = subPages.toSorted(comparePages)

        sectionItem.children!.push({
          name: titleCase(subcategory),
          children: sortedPages.map(toNavLink),
        })
      }
    } else {
      // Flat list of children
      const sortedPages = sectionPages
        .filter(p => p.name)
        .toSorted(comparePages)

      sectionItem.children = sortedPages.map(toNavLink)
    }

    nav.push(sectionItem)
  }

  // Add API section
  const apiNames = await getApiNamesGrouped()

  // Group components by their folder (Avatar, Selection, etc.)
  const componentGroups = new Map<string, { name: string, slug: string }[]>()
  for (const comp of apiNames.components) {
    const group = comp.group || 'Other'
    if (!componentGroups.has(group)) componentGroups.set(group, [])
    componentGroups.get(group)!.push({ name: comp.name, slug: comp.slug })
  }

  const apiSection: NavItemLink = {
    name: 'API',
    to: '/api',
    children: [
      {
        name: 'Components',
        children: Array.from(componentGroups.entries())
          .toSorted((a, b) => a[0].localeCompare(b[0]))
          .flatMap(([, items]) =>
            items.toSorted((a, b) => a.name.localeCompare(b.name))
              .map(item => ({ name: item.name, to: `/api/${item.slug}` })),
          ),
      },
      {
        name: 'Composables',
        children: apiNames.composables
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map(item => ({ name: item.name, to: `/api/${item.slug}` })),
      },
    ],
  }

  nav.push({ divider: true }, apiSection)

  return nav
}

const VIRTUAL_MODULE_ID = 'virtual:nav'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export default function generateNavPlugin (): Plugin {
  let isBuild = false
  let navData: NavItem[] | null = null
  let navPromise: Promise<NavItem[]> | null = null

  async function getNavData () {
    if (navData) return navData
    if (!navPromise) {
      navPromise = (async () => {
        try {
          return await generateNav()
        } catch (error) {
          navPromise = null
          throw error
        }
      })()
    }
    navData = await navPromise
    return navData
  }

  return {
    name: 'generate-nav',

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
        const nav = await getNavData()
        return `export default ${JSON.stringify(nav)}`
      }
    },

    configureServer (server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/nav.json') return next()

        try {
          const nav = await getNavData()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(nav))
        } catch (error) {
          console.error('[generate-nav] Error:', error)
          res.statusCode = 500
          res.end('Error generating nav')
        }
      })
    },

    async generateBundle (_, bundle) {
      if (!isBuild || Object.keys(bundle).some(k => k.includes('main.mjs'))) return

      const nav = await getNavData()

      this.emitFile({
        type: 'asset',
        fileName: 'nav.json',
        source: JSON.stringify(nav),
      })

      console.log(`[generate-nav] Generated nav with ${nav.length} items`)
    },

    buildEnd () {
      navData = null
      navPromise = null
    },
  }
}

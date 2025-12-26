import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, relative } from 'node:path'

import type { Plugin } from 'vite'

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
  return '/' + relative('src/pages', filePath)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function getCategoryOrder (filePath: string): number {
  const rel = relative('src/pages', filePath)
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

function stripFrontmatter (content: string): string {
  if (!content.startsWith('---')) return content
  const end = content.indexOf('---', 3)
  if (end === -1) return content
  return content.slice(end + 3).trim()
}

function stripVueComponents (content: string): string {
  // Remove Vue component tags like <DocsPageFeatures /> or <SomeComponent>...</SomeComponent>
  return content
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
}

export default function generateLlmsFullPlugin (): Plugin {
  return {
    name: 'generate-llms-full',
    apply: (config, { command }) => command === 'build' && !config.build?.ssr,
    async generateBundle () {
      const files: Array<{ path: string, order: number, title: string, content: string }> = []

      for await (const file of glob('src/pages/**/*.md')) {
        try {
          const raw = readFileSync(file, 'utf-8')
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
        sections.push(`# ${file.title}`)
        sections.push(`URL: ${BASE_URL}${file.path}`)
        sections.push('')
        sections.push(file.content)
        sections.push('')
        sections.push('---')
        sections.push('')
      }

      this.emitFile({
        type: 'asset',
        fileName: 'llms-full.txt',
        source: sections.join('\n'),
      })

      console.log(`[generate-llms-full] Generated llms-full.txt from ${files.length} pages`)
    },
  }
}

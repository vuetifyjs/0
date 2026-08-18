/**
 * Emit a markdown twin for every /api/<slug> page.
 *
 * The authored docs pages under src/pages already ship `.md` twins verbatim via
 * copy-markdown, but the API reference is rendered from `virtual:api` by
 * `pages/api/[name].vue`, so there is no source markdown to copy. Agent
 * fetchers and AI crawlers that ask for `/api/create-form.md` would 404 on
 * exactly the pages carrying the type signatures they need most.
 *
 * This renders the same ApiData the page renders, in the same resolution order,
 * to `dist/api/<slug>.md`.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getApiNames, toCamel, toPascal } from './api-names'

// Types
import type { ApiData, ComponentApi, ComposableApi } from './generate-api'
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API_CACHE_FILE = resolve(__dirname, '../node_modules/.cache/api-cache.json')

const SITE = 'https://0.vuetifyjs.com'

function table (heading: string, headers: string[], rows: string[][]): string[] {
  if (rows.length === 0) return []

  return [
    heading,
    '',
    `| ${headers.join(' | ')} |`,
    `|${headers.map(() => '---').join('|')}|`,
    ...rows.map(cells => `| ${cells.join(' | ')} |`),
    '',
  ]
}

/** Pipes and newlines break table rows; backtick-wrapped code must stay inline. */
function cell (value?: string): string {
  if (!value) return '—'
  return value.replaceAll('|', String.raw`\|`).replaceAll('\n', ' ').trim() || '—'
}

function code (value?: string): string {
  if (!value) return '—'
  return `\`${cell(value)}\``
}

function renderComponent (api: ComponentApi): string[] {
  return [
    `## ${api.name}`,
    '',
    ...table(
      '### Props',
      ['Name', 'Type', 'Default', 'Required', 'Description'],
      api.props.map(p => [
        code(p.name),
        code(p.type),
        p.default ? code(p.default) : '—',
        p.required ? 'yes' : 'no',
        cell(p.description),
      ]),
    ),
    ...table(
      '### Events',
      ['Name', 'Type', 'Description'],
      api.events.map(e => [code(e.name), code(e.type), cell(e.description)]),
    ),
    ...table(
      '### Slots',
      ['Name', 'Type', 'Description'],
      api.slots.map(s => [code(s.name), code(s.type), cell(s.description)]),
    ),
  ]
}

function renderComposable (api: ComposableApi): string[] {
  const functions = api.functions.flatMap(fn => [
    `### ${fn.name}`,
    '',
    ...fn.description ? [fn.description, ''] : [],
    '```ts',
    fn.signature,
    '```',
    '',
  ])

  return [
    ...functions.length > 0 ? ['## Functions', '', ...functions] : [],
    ...table(
      '## Options',
      ['Name', 'Type', 'Default', 'Required', 'Description'],
      api.options.map(o => [
        code(o.name),
        code(o.type),
        o.default ? code(o.default) : '—',
        o.required ? 'yes' : 'no',
        cell(o.description),
      ]),
    ),
    ...table(
      '## Methods',
      ['Name', 'Type', 'Description'],
      api.methods.map(m => [code(m.name), code(m.type), cell(m.description)]),
    ),
    ...table(
      '## Properties',
      ['Name', 'Type', 'Description'],
      api.properties.map(p => [code(p.name), code(p.type), cell(p.description)]),
    ),
  ]
}

export default function generateApiMarkdownPlugin (): Plugin {
  return {
    name: 'generate-api-markdown',
    apply: (config, { command }) => command === 'build' && !config.build?.ssr,
    async writeBundle (options) {
      const outDir = options.dir || 'dist'

      if (!existsSync(API_CACHE_FILE)) {
        console.warn('[generate-api-markdown] No API cache; skipping markdown twins')
        return
      }

      const data = JSON.parse(readFileSync(API_CACHE_FILE, 'utf8')) as ApiData
      const names = await getApiNames()
      let written = 0

      for (const { slug } of names) {
        // Mirror the resolution order in pages/api/[name].vue exactly, or the
        // twin can describe a different API than the page it shadows.
        const pascal = toPascal(slug)
        const camel = toCamel(slug)

        const componentApis = Object.entries(data.components)
          .filter(([name]) => name === pascal || name.startsWith(`${pascal}.`))
          .map(([, api]) => api)
          .toSorted((a, b) => {
            if (a.name.endsWith('Root')) return -1
            if (b.name.endsWith('Root')) return 1
            return a.name.localeCompare(b.name)
          })

        const composableApi = data.composables[camel] ?? null

        if (componentApis.length === 0 && !composableApi) continue

        const title = componentApis.length > 0 ? pascal : camel
        const related = data.related[title] ?? []

        const lines: string[] = [
          `# ${title} API`,
          '',
          `> Auto-generated API reference for \`${title}\` from @vuetify/v0 (Vuetify0).`,
          `> Source of truth: ${SITE}/api/${slug}`,
          '',
          ...related.length > 0
            ? ['## Related', '', ...related.map(item => `- ${SITE}${item}`), '']
            : [],
          ...composableApi ? renderComposable(composableApi) : [],
          ...componentApis.flatMap(api => renderComponent(api)),
        ]

        const dest = join(outDir, 'api', `${slug}.md`)
        mkdirSync(dirname(dest), { recursive: true })
        writeFileSync(dest, `${lines.join('\n').trimEnd()}\n`)
        written++
      }

      console.log(`[generate-api-markdown] Wrote ${written} API markdown twins`)
    },
  }
}

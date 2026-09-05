/**
 * Provide `virtual:faqs` — extracted `::: faq` blocks keyed by route path.
 *
 * Feeds FAQPage JSON-LD in App.vue. Google requires FAQPage markup to mirror
 * content visible on the page, so this parses the same authored markdown the
 * page renders rather than maintaining a parallel list.
 *
 * Block shape:
 *
 *   ::: faq
 *   ??? Question text
 *
 *   Answer paragraphs, markdown, possibly inline components.
 *
 *   ??? Next question
 *   ...
 *   :::
 */

import { readFile, glob } from 'node:fs/promises'
import { relative } from 'node:path'

// Types
import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:faqs'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

export interface Faq {
  question: string
  answer: string
}

/**
 * Reduce authored markdown to the plain prose a reader sees.
 *
 * FAQPage answers are plain text; leaving markdown or component tags in place
 * puts syntax into the snippet a search engine quotes.
 */
function stripTags (value: string): string {
  let current = value
  let previous = ''
  while (current !== previous) {
    previous = current
    current = current.replace(/<[^>]*>/g, '')
  }
  return current
}

function plain (markdown: string): string {
  return stripTags(
    markdown
      // Fenced code blocks carry no answer prose and wreck the snippet.
      .replaceAll(/```[\s\S]*?```/g, ''),
  )
    // Links -> their text.
    .replaceAll(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replaceAll(/[*_`]/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .replaceAll(/\s+/g, ' ')
    .trim()
}

function extract (source: string): Faq[] {
  const faqs: Faq[] = []

  for (const block of source.matchAll(/^::: faq[ \t]*\n([\s\S]*?)^:::[ \t]*$/gm)) {
    const body = block[1]
    // Split on `???` markers; the first chunk is any preamble before question one.
    const chunks = body.split(/^\?\?\? +/m).slice(1)

    for (const chunk of chunks) {
      const newline = chunk.indexOf('\n')
      if (newline === -1) continue

      const question = plain(chunk.slice(0, newline))
      const answer = plain(chunk.slice(newline))

      // A question with no answer body is not a valid FAQPage entry.
      if (!question || !answer) continue

      faqs.push({ question, answer })
    }
  }

  return faqs
}

async function getFaqs (): Promise<Record<string, Faq[]>> {
  const result: Record<string, Faq[]> = {}

  for await (const file of glob('src/pages/**/*.md')) {
    const source = await readFile(file, 'utf8')
    if (!source.includes('::: faq')) continue

    const faqs = extract(source)
    if (faqs.length === 0) continue

    const rel = relative('src/pages', file).replaceAll('\\', '/')

    let route: string
    if (rel === 'index.md') route = '/'
    else if (rel.endsWith('/index.md')) route = `/${rel.slice(0, -'/index.md'.length)}`
    else route = `/${rel.slice(0, -'.md'.length)}`

    result[route] = faqs
  }

  return result
}

export default function generateFaqsPlugin (): Plugin {
  return {
    name: 'generate-faqs',
    resolveId (id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },
    async load (id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return
      return `export default ${JSON.stringify(await getFaqs())}`
    },
  }
}

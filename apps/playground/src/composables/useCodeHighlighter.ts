// Composables
import { useHighlighter } from './useHighlighter'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

// Types
import type { ShikiTransformer } from 'shiki'

export interface CodeHighlightOptions {
  code: string
  language?: string
  transformers?: ShikiTransformer[]
}

export interface CodeHighlightResult {
  html: string
  code: string
  language: string
}

// Language normalization map
const LANGUAGE_MAP: Record<string, { shikiLang: string, displayLang: string }> = {
  typescript: { shikiLang: 'typescript', displayLang: 'ts' },
  ts: { shikiLang: 'typescript', displayLang: 'ts' },
  javascript: { shikiLang: 'javascript', displayLang: 'js' },
  js: { shikiLang: 'javascript', displayLang: 'js' },
  vue: { shikiLang: 'vue', displayLang: 'vue' },
  html: { shikiLang: 'html', displayLang: 'html' },
  bash: { shikiLang: 'bash', displayLang: 'bash' },
  sh: { shikiLang: 'bash', displayLang: 'bash' },
  markdown: { shikiLang: 'markdown', displayLang: 'md' },
  md: { shikiLang: 'markdown', displayLang: 'md' },
}

function normalizeLanguage (lang?: string): { shikiLang: string, displayLang: string } {
  const lower = (lang ?? 'text').toLowerCase()
  return LANGUAGE_MAP[lower] ?? { shikiLang: lower, displayLang: lower }
}

const MAX_CACHE = 256

// Highlighted HTML keyed by language + code (default transformers only) so
// remounted panes resolve synchronously instead of flashing raw code.
const cache = new Map<string, string>()

function cacheKey (lang: string, code: string): string {
  return `${lang}\n${code}`
}

function remember (key: string, html: string) {
  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value
    if (typeof oldest === 'string') cache.delete(oldest)
  }
  cache.set(key, html)
}

/**
 * Creates a transformer that adds language-* class to the code element.
 */
export function createLanguageClassTransformer (lang: string): ShikiTransformer {
  return {
    name: 'language-class',
    code (node) {
      this.addClassToHast(node, `language-${lang}`)
    },
  }
}

/**
 * Unified code highlighting for playground host UI.
 *
 * Port of apps/docs `useCodeHighlighter` without the docs-only API link
 * transformer. Use `highlight` for fenced blocks, `inline` for chips/snippets.
 */
export function useCodeHighlighter () {
  const { highlighter, getHighlighter } = useHighlighter()

  async function highlight (options: CodeHighlightOptions): Promise<CodeHighlightResult> {
    const { shikiLang, displayLang } = normalizeLanguage(options.language)

    const cacheable = !options.transformers?.length
    const key = cacheKey(shikiLang, options.code)

    if (cacheable) {
      const hit = cache.get(key)
      if (typeof hit === 'string') {
        return {
          html: hit,
          code: options.code,
          language: displayLang,
        }
      }
    }

    const hl = highlighter.value ?? await getHighlighter()

    const html = hl.codeToHtml(options.code, {
      lang: shikiLang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      transformers: [
        createLanguageClassTransformer(displayLang),
        ...(options.transformers ?? []),
      ],
    })

    if (cacheable) remember(key, html)

    return {
      html,
      code: options.code,
      language: displayLang,
    }
  }

  async function inline (options: CodeHighlightOptions): Promise<CodeHighlightResult> {
    const hl = highlighter.value ?? await getHighlighter()
    const { shikiLang, displayLang } = normalizeLanguage(options.language)

    const html = hl.codeToHtml(options.code, {
      lang: shikiLang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      structure: 'inline',
    })

    return {
      html,
      code: options.code,
      language: displayLang,
    }
  }

  return {
    highlight,
    highlighter,
    getHighlighter,
    inline,
    normalizeLanguage,
  }
}

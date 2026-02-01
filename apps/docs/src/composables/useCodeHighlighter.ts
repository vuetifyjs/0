// Transformers
import { createApiTransformer } from '@build/shiki-api-transformer'

// Composables
import { useHighlighter } from './useHighlighter'

// Types
import type { ShikiTransformer } from 'shiki'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

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
 * Unified code highlighting composable.
 *
 * Wraps useHighlighter with consistent transformers and language normalization.
 * All code blocks should use this for consistent HTML output.
 */
export function useCodeHighlighter () {
  const { highlighter, getHighlighter } = useHighlighter()

  async function highlight (options: CodeHighlightOptions): Promise<CodeHighlightResult> {
    const hl = highlighter.value ?? await getHighlighter()
    const { shikiLang, displayLang } = normalizeLanguage(options.language)

    const html = hl.codeToHtml(options.code, {
      lang: shikiLang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      transformers: [
        createApiTransformer(),
        createLanguageClassTransformer(displayLang),
        ...(options.transformers ?? []),
      ],
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
    normalizeLanguage,
  }
}

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Composables
import { useIdleCallback } from './useIdleCallback'

// Utilities
import { readonly, shallowRef } from 'vue'

// Types
import type { Ref } from 'vue'

export interface UseCodeHighlighterOptions {
  theme?: string
  languages?: string[]
}

export interface UseCodeHighlighterReturn {
  highlight: (code: string, language?: string) => Promise<string>
  isReady: Readonly<Ref<boolean>>
}

/** Minimal subset of shiki's HighlighterGeneric used by this composable. */
interface ShikiHighlighter {
  codeToHtml: (code: string, options: { lang: string, theme: string }) => string
  getLoadedLanguages: () => string[]
  loadLanguage: (...languages: unknown[]) => Promise<void>
}

const DEFAULT_THEME = 'github-dark'
const DEFAULT_LANGUAGES = ['vue', 'ts', 'bash', 'json']

let instance: ShikiHighlighter | null = null
let loading: Promise<ShikiHighlighter | null> | null = null
let loadedTheme: string | null = null
const ready = shallowRef(false)

function escape (code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function fallback (code: string, language: string): string {
  return `<pre><code class="language-${language}">${escape(code)}</code></pre>`
}

async function load (
  theme: string,
  languages: string[],
): Promise<ShikiHighlighter | null> {
  if (instance) return instance
  if (loading) return loading

  loading = (async () => {
    try {
      // @ts-expect-error shiki is an optional peer dependency
      const { createHighlighter } = await import('shiki')

      instance = await createHighlighter({
        themes: [theme],
        langs: languages,
      }) as unknown as ShikiHighlighter

      loadedTheme = theme
      ready.value = true
      return instance
    } catch {
      loading = null
      return null
    }
  })()

  return loading
}

export function useCodeHighlighter (options?: UseCodeHighlighterOptions): UseCodeHighlighterReturn {
  const {
    theme = DEFAULT_THEME,
    languages = DEFAULT_LANGUAGES,
  } = options ?? {}

  if (instance && typeof __DEV__ !== 'undefined' && __DEV__ && theme !== loadedTheme) {
    console.warn(`[codex] useCodeHighlighter: theme "${theme}" requested but "${loadedTheme}" is already loaded. Only one theme is supported globally.`)
  }

  if (IN_BROWSER) {
    useIdleCallback(() => load(theme, languages))
  }

  async function highlight (code: string, language = 'text'): Promise<string> {
    if (!IN_BROWSER) return fallback(code, language)

    const highlighter = await load(theme, languages)
    if (!highlighter) return fallback(code, language)

    const loaded = highlighter.getLoadedLanguages()
    if (!loaded.includes(language)) {
      try {
        await highlighter.loadLanguage(language)
      } catch {
        return fallback(code, language)
      }
    }

    return highlighter.codeToHtml(code, {
      lang: language,
      theme,
    })
  }

  return {
    highlight,
    isReady: readonly(ready),
  }
}

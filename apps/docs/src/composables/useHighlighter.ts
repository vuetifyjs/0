// Framework
import { useLogger } from '@vuetify/v0'

// Utilities
import { shallowRef, type ShallowRef } from 'vue'

// Types
import type { HighlighterCore } from 'shiki/core'

// Constants
import { SHIKI_THEME_IMPORTS } from '@/constants/shiki'

export interface UseHighlighterReturn {
  highlighter: ShallowRef<HighlighterCore | null>
  getHighlighter: () => Promise<HighlighterCore>
}

let highlighterPromise: Promise<HighlighterCore> | null = null
const highlighter = shallowRef<HighlighterCore | null>(null)
const logger = useLogger()

/**
 * Detects if the current browser supports the RegExp `v` flag (unicodeSets).
 * Safari < 17 and Chrome on iOS (WebKit) don't support this flag.
 */
function supportsRegExpVFlag (): boolean {
  try {
    new RegExp('a', 'v')
    return true
  } catch {
    return false
  }
}

async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = (async () => {
    const { createHighlighterCore } = await import('shiki/core')

    // Use JS engine if browser supports RegExp `v` flag, otherwise fall back to WASM
    // Safari < 17 and Chrome on iOS don't support the `v` flag
    const useJsEngine = supportsRegExpVFlag()

    if (useJsEngine) {
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs: [import('@shikijs/langs/vue')],
        engine: createJavaScriptRegexEngine(),
      })
    }

    // Fall back to WASM engine for browsers without `v` flag support
    logger.info('Using Shiki WASM engine for syntax highlighting (browser lacks RegExp v flag support)')
    const { createOnigurumaEngine } = await import('shiki/engine/oniguruma')
    return createHighlighterCore({
      themes: SHIKI_THEME_IMPORTS,
      langs: [import('@shikijs/langs/vue')],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  })()

  highlighter.value = await highlighterPromise
  return highlighter.value
}

export function useHighlighter (): UseHighlighterReturn {
  return {
    highlighter,
    getHighlighter: createSharedHighlighter,
  }
}

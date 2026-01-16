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
 * Detects if the browser supports advanced RegExp features needed by Shiki's JS engine:
 * - `v` flag (unicodeSets) - Safari < 17 doesn't support
 * - Lookbehind assertions (?<=) - Safari < 16.4 doesn't support
 *
 * Safari/WebKit has incomplete regex support, so we check multiple features.
 */
function supportsAdvancedRegExp (): boolean {
  try {
    // Test `v` flag (unicodeSets)
    new RegExp('a', 'v')
    // Test lookbehind assertions
    new RegExp('(?<=a)b')
    // Test negative lookbehind
    new RegExp('(?<!a)b')
    return true
  } catch {
    return false
  }
}

async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = (async () => {
    const { createHighlighterCore } = await import('shiki/core')

    // Use JS engine if browser supports all advanced RegExp features, otherwise fall back to WASM
    // Safari/WebKit lacks support for various regex features that Shiki's JS engine needs
    const useJsEngine = supportsAdvancedRegExp()

    if (useJsEngine) {
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs: [import('@shikijs/langs/vue')],
        engine: createJavaScriptRegexEngine(),
      })
    }

    // Fall back to WASM engine for browsers without full RegExp support
    logger.info('Using Shiki WASM engine for syntax highlighting (browser lacks advanced RegExp support)')
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

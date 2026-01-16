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
 * Detects if the browser supports advanced RegExp features needed by Shiki's JS engine.
 *
 * iOS Safari (even iOS 18) has issues with complex lookbehind patterns used in Shiki grammars,
 * despite passing basic feature tests. We force WASM mode on all iOS devices.
 */
function supportsAdvancedRegExp (): boolean {
  // iOS Safari has incomplete regex support for complex patterns - always use WASM
  // This includes iPhone, iPad, and iPod touch
  if (/iP(hone|ad|od)/.test(navigator.userAgent)) {
    return false
  }

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
    try {
      const { createOnigurumaEngine } = await import('shiki/engine/oniguruma')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs: [import('@shikijs/langs/vue')],
        engine: createOnigurumaEngine(import('shiki/wasm')),
      })
    } catch (error) {
      // WASM loading failed - fall back to JS engine anyway (may have limited syntax support)
      logger.warn('WASM engine failed to load, falling back to JS engine', error)
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs: [import('@shikijs/langs/vue')],
        engine: createJavaScriptRegexEngine(),
      })
    }
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

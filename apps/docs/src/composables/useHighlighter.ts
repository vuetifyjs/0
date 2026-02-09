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
 * Safari/WebKit has issues with complex lookbehind patterns in Shiki grammars
 * despite passing basic feature tests. Force WASM on all Safari browsers.
 */
function supportsAdvancedRegExp (): boolean {
  const ua = navigator.userAgent
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium/.test(ua)
  if (isSafari) return false

  try {
    new RegExp('a', 'v')
    new RegExp('(?<=a)b')
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

    const useJsEngine = supportsAdvancedRegExp()

    if (useJsEngine) {
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs: [import('@shikijs/langs/vue')],
        engine: createJavaScriptRegexEngine(),
      })
    }

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

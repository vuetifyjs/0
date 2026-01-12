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

async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ])

    return createHighlighterCore({
      themes: SHIKI_THEME_IMPORTS,
      langs: [import('@shikijs/langs/vue')],
      engine: createJavaScriptRegexEngine(),
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

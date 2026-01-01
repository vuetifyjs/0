// Shiki
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Utilities
import { shallowRef, type ShallowRef } from 'vue'

// Types
import type { HighlighterCore } from 'shiki/core'

export interface UseHighlighterReturn {
  highlighter: ShallowRef<HighlighterCore | null>
  getHighlighter: () => Promise<HighlighterCore>
}

// Constants
import { SHIKI_THEME_IMPORTS } from '@/constants/shiki'

let highlighterPromise: Promise<HighlighterCore> | null = null
const highlighter = shallowRef<HighlighterCore | null>(null)

async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = createHighlighterCore({
    themes: SHIKI_THEME_IMPORTS,
    langs: [
      import('@shikijs/langs/vue'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  highlighter.value = await highlighterPromise
  return highlighter.value
}

export function useHighlighter (): UseHighlighterReturn {
  return {
    highlighter,
    getHighlighter: createSharedHighlighter,
  }
}

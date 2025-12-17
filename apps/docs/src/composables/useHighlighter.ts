// Composables
import { shallowRef } from 'vue'

// Shiki
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Types
import type { HighlighterCore } from 'shiki/core'

let highlighterPromise: Promise<HighlighterCore> | null = null
const highlighter = shallowRef<HighlighterCore | null>(null)

async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = createHighlighterCore({
    themes: [
      import('@shikijs/themes/github-light-default'),
      import('@shikijs/themes/github-dark-default'),
    ],
    langs: [
      import('@shikijs/langs/vue'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  highlighter.value = await highlighterPromise
  return highlighter.value
}

export function useHighlighter () {
  return {
    highlighter,
    getHighlighter: createSharedHighlighter,
  }
}

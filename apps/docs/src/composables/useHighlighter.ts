// Composables
import { shallowRef } from 'vue'

// Shiki
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

// Globals
import { IN_BROWSER } from '@vuetify/v0/constants'

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

/**
 * Pre-initialize the shared highlighter during idle time.
 * Call this early in app lifecycle to warm up the highlighter
 * before any code examples need it.
 */
export function initHighlighter (): void {
  if (!IN_BROWSER) return

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => createSharedHighlighter(), { timeout: 3000 })
  } else {
    setTimeout(() => createSharedHighlighter(), 100)
  }
}

export function useHighlighter () {
  return {
    highlighter,
    getHighlighter: createSharedHighlighter,
  }
}

// Constants
import { SHIKI_THEME_IMPORTS } from '@/constants/shiki'

// Utilities
import { shallowRef, type ShallowRef } from 'vue'

// Types
import type { HighlighterCore } from 'shiki/core'

export interface UseHighlighterReturn {
  highlighter: ShallowRef<HighlighterCore | null>
  getHighlighter: () => Promise<HighlighterCore>
}

let highlighterPromise: Promise<HighlighterCore> | null = null
let highlighterRef: ShallowRef<HighlighterCore | null> | null = null

function getRef (): ShallowRef<HighlighterCore | null> {
  return highlighterRef ??= shallowRef<HighlighterCore | null>(null)
}

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

/**
 * Shared highlighter for playground host UI (tooltips, future inline snippets).
 * Port of apps/docs `useHighlighter` — keep in sync when that API changes.
 * Langs match the markdown-it setup in vite.config.ts.
 */
async function createSharedHighlighter (): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = (async () => {
    const { createHighlighterCore } = await import('shiki/core')

    const langs = [
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/vue'),
      import('@shikijs/langs/bash'),
    ]

    if (supportsAdvancedRegExp()) {
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')
      return createHighlighterCore({
        themes: SHIKI_THEME_IMPORTS,
        langs,
        engine: createJavaScriptRegexEngine(),
      })
    }

    const { createOnigurumaEngine } = await import('shiki/engine/oniguruma')
    return createHighlighterCore({
      themes: SHIKI_THEME_IMPORTS,
      langs,
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  })()

  const ref = getRef()
  ref.value = await highlighterPromise
  return ref.value
}

export function useHighlighter (): UseHighlighterReturn {
  return {
    highlighter: getRef(),
    getHighlighter: createSharedHighlighter,
  }
}

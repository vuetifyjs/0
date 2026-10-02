// Framework
import { isUndefined } from '@vuetify/v0'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

// Utilities
import { type MaybeRefOrGetter, onMounted, onScopeDispose, shallowRef, toValue, watch } from 'vue'

export interface UseHighlightCodeOptions {
  /** Language for syntax highlighting. Defaults to 'ts' */
  lang?: string
  /** Whether to highlight immediately on mount. Defaults to true */
  immediate?: boolean
  /** Debounce delay in ms for code changes. Defaults to 50 */
  debounce?: number
}

/**
 * Provides reactive code highlighting using Shiki.
 * Handles highlighter initialization and automatic re-highlighting on code changes.
 */
async function loadHighlighter () {
  const { useHighlighter } = await import('./useHighlighter')
  return useHighlighter()
}

const MAX_CACHE = 256

// Highlighted HTML keyed by language + code so remounted panes (v-if toggles,
// tab switches) render highlighted output synchronously instead of flashing
// the raw fallback while Shiki re-runs.
const cache = new Map<string, string>()

function cacheKey (lang: string, code: string): string {
  return `${lang}\n${code}`
}

function remember (key: string, html: string) {
  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value
    if (!isUndefined(oldest)) cache.delete(oldest)
  }
  cache.set(key, html)
}

/**
 * Highlights code into the shared cache ahead of render. Not exported — apps/docs
 * uses this to prewarm multi-file examples before the pane opens; the builder has a
 * single code block driven straight off `useHighlightCode`, so nothing else calls it.
 */
async function prehighlight (code: string, lang = 'ts'): Promise<void> {
  if (!code || cache.has(cacheKey(lang, code))) return

  const { highlighter, getHighlighter } = await loadHighlighter()
  const hl = highlighter.value ?? await getHighlighter()

  remember(cacheKey(lang, code), hl.codeToHtml(code, {
    lang,
    themes: SHIKI_THEMES,
    defaultColor: false,
  }))
}

export function useHighlightCode (
  code: MaybeRefOrGetter<string | undefined>,
  options: UseHighlightCodeOptions = {},
) {
  const { lang = 'ts', immediate = true, debounce = 50 } = options
  const highlightedCode = shallowRef(cache.get(cacheKey(lang, toValue(code) ?? '')) ?? '')
  const isLoading = shallowRef(false)
  const showLoader = shallowRef(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let loadingTimer: ReturnType<typeof setTimeout> | null = null

  async function highlight (source?: string) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    const value = source ?? toValue(code)
    if (!value) return

    // Cache hit renders synchronously — no fallback flash on remount
    const hit = cache.get(cacheKey(lang, value))
    if (!isUndefined(hit)) {
      highlightedCode.value = hit
      return
    }

    isLoading.value = true

    // Delay showing loading indicator to avoid flicker for fast operations
    loadingTimer = setTimeout(() => {
      showLoader.value = true
    }, 100)

    await prehighlight(value, lang)
    highlightedCode.value = cache.get(cacheKey(lang, value)) ?? ''

    if (loadingTimer) clearTimeout(loadingTimer)
    isLoading.value = false
    showLoader.value = false
  }

  function debouncedHighlight (value: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => highlight(value), debounce)
  }

  if (immediate) {
    onMounted(() => {
      const value = toValue(code)
      if (value) highlight(value)
    })

    watch(
      () => toValue(code),
      value => {
        if (value) debouncedHighlight(value)
      },
    )
  }

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (loadingTimer) clearTimeout(loadingTimer)
    highlightedCode.value = ''
  })

  return {
    highlightedCode,
    highlight,
    isLoading,
    showLoader,
  }
}

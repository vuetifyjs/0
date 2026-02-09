// Transformers
import { createApiTransformer } from '@build/shiki-api-transformer'

// Composables
import { useIdleCallback } from './useIdleCallback'

// Utilities
import { type MaybeRefOrGetter, onMounted, onScopeDispose, shallowRef, toValue, watch } from 'vue'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

export interface UseHighlightCodeOptions {
  /** Language for syntax highlighting. Defaults to 'vue' */
  lang?: string
  /** Whether to highlight immediately on mount. Defaults to true */
  immediate?: boolean
  /** Defer initial highlighting to idle time. Defaults to false */
  idle?: boolean
  /** Timeout for idle callback in ms. Defaults to 2000 */
  idleTimeout?: number
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

export function useHighlightCode (
  code: MaybeRefOrGetter<string | undefined>,
  options: UseHighlightCodeOptions = {},
) {
  const { lang = 'vue', immediate = true, idle = false, idleTimeout = 2000, debounce = 50 } = options
  const highlightedCode = shallowRef('')
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

    isLoading.value = true

    // Delay showing loading indicator to avoid flicker for fast operations
    loadingTimer = setTimeout(() => {
      showLoader.value = true
    }, 100)

    const { highlighter, getHighlighter } = await loadHighlighter()
    const hl = highlighter.value ?? await getHighlighter()

    highlightedCode.value = hl.codeToHtml(value, {
      lang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      transformers: [createApiTransformer()],
    })

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
      if (!value) return

      if (idle) {
        useIdleCallback(() => highlight(value), idleTimeout)
      } else {
        highlight(value)
      }
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

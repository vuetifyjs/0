// Transformers
import { createApiTransformer } from '@build/shiki-api-transformer'

// Composables
import { useHighlighter } from './useHighlighter'

// Utilities
import { type MaybeRefOrGetter, onMounted, onScopeDispose, shallowRef, toValue, watch } from 'vue'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

export interface UseHighlightCodeOptions {
  /** Language for syntax highlighting. Defaults to 'vue' */
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
export function useHighlightCode (
  code: MaybeRefOrGetter<string | undefined>,
  options: UseHighlightCodeOptions = {},
) {
  const { lang = 'vue', immediate = true, debounce = 50 } = options
  const { highlighter, getHighlighter } = useHighlighter()
  const highlightedCode = shallowRef('')

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  async function highlight (source?: string) {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    const value = source ?? toValue(code)
    if (!value) return

    const hl = highlighter.value ?? await getHighlighter()

    highlightedCode.value = hl.codeToHtml(value, {
      lang,
      themes: SHIKI_THEMES,
      defaultColor: false,
      transformers: [createApiTransformer()],
    })
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
  })

  return {
    highlightedCode,
    highlight,
  }
}

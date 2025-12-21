// Composables
import { useHighlighter } from './useHighlighter'

// Utilities
import { onMounted, shallowRef, watch, type MaybeRefOrGetter, toValue } from 'vue'

export interface UseHighlightCodeOptions {
  /** Language for syntax highlighting. Defaults to 'vue' */
  lang?: string
  /** Whether to highlight immediately on mount. Defaults to true */
  immediate?: boolean
}

/**
 * Provides reactive code highlighting using Shiki.
 * Handles highlighter initialization and automatic re-highlighting on code changes.
 */
export function useHighlightCode (
  code: MaybeRefOrGetter<string | undefined>,
  options: UseHighlightCodeOptions = {},
) {
  const { lang = 'vue', immediate = true } = options
  const { highlighter, getHighlighter } = useHighlighter()
  const highlightedCode = shallowRef('')

  async function highlight (source?: string) {
    const value = source ?? toValue(code)
    if (!value) return

    const hl = highlighter.value ?? await getHighlighter()

    highlightedCode.value = hl.codeToHtml(value, {
      lang,
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
    })
  }

  if (immediate) {
    onMounted(() => {
      const value = toValue(code)
      if (value) highlight(value)
    })

    watch(
      () => toValue(code),
      value => {
        if (value) highlight(value)
      },
    )
  }

  return {
    highlightedCode,
    highlight,
  }
}

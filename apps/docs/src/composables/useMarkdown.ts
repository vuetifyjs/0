/**
 * @module useMarkdown
 *
 * @remarks
 * Renders markdown to HTML with syntax highlighting for code blocks.
 * Uses marked for parsing and Shiki for code highlighting.
 */

import { Marked } from 'marked'

// Composables
import { useHighlighter } from './useHighlighter'

// Utilities
import { type MaybeRefOrGetter, onMounted, shallowRef, toValue, watch } from 'vue'

/**
 * Provides reactive markdown rendering with syntax-highlighted code blocks.
 */
export function useMarkdown (content: MaybeRefOrGetter<string | undefined>) {
  const { highlighter, getHighlighter } = useHighlighter()
  const html = shallowRef('')

  async function render (source?: string) {
    const value = source ?? toValue(content)
    if (!value) {
      html.value = ''
      return
    }

    const hl = highlighter.value ?? await getHighlighter()

    const marked = new Marked({
      async: true,
      gfm: true,
      breaks: true,
    })

    marked.use({
      renderer: {
        code ({ text, lang }) {
          const language = lang || 'text'
          let highlighted: string
          try {
            highlighted = hl.codeToHtml(text, {
              lang: language,
              themes: {
                light: 'github-light-default',
                dark: 'github-dark-default',
              },
              defaultColor: false,
            })
          } catch {
            // Fallback for unsupported languages
            highlighted = `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`
          }

          // Encode code for DocsMarkup component mounting (browser-safe base64)
          const encodedCode = btoa(text)

          return `<div data-markup data-code="${encodedCode}" data-language="${escapeHtml(language)}">${highlighted}</div>`
        },
      },
    })

    html.value = await marked.parse(value)
  }

  onMounted(() => {
    const value = toValue(content)
    if (value) render(value)
  })

  watch(
    () => toValue(content),
    value => {
      render(value)
    },
  )

  return {
    html,
    render,
  }
}

function escapeHtml (text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

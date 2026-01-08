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
import { processLinks } from '@/utilities/processLinks'
import { type MaybeRefOrGetter, onMounted, shallowRef, type ShallowRef, toValue, watch } from 'vue'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

export interface UseMarkdownReturn {
  html: ShallowRef<string>
  render: (source?: string) => Promise<void>
}

/**
 * Provides reactive markdown rendering with syntax-highlighted code blocks.
 */
export function useMarkdown (content: MaybeRefOrGetter<string | undefined>): UseMarkdownReturn {
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
        table ({ header, rows }) {
          const thead = `<thead><tr>${header.map(cell => `<th${cell.align ? ` align="${cell.align}"` : ''}>${cell.text}</th>`).join('')}</tr></thead>`
          const tbody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td${cell.align ? ` align="${cell.align}"` : ''}>${cell.text}</td>`).join('')}</tr>`).join('')}</tbody>`
          return `<div class="overflow-x-auto mb-4"><table>${thead}${tbody}</table></div>`
        },
        code ({ text, lang }) {
          const language = lang || 'text'

          // Handle mermaid diagrams separately
          if (language === 'mermaid') {
            const encodedCode = btoa(unescape(encodeURIComponent(text)))
            return `<div data-mermaid data-code="${encodedCode}"></div>`
          }

          let highlighted: string
          try {
            highlighted = hl.codeToHtml(text, {
              lang: language,
              themes: SHIKI_THEMES,
              defaultColor: false,
            })
          } catch {
            // Fallback for unsupported languages
            highlighted = `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`
          }

          // Encode code for DocsMarkup component mounting (Unicode-safe base64)
          const encodedCode = btoa(unescape(encodeURIComponent(text)))

          return `<div data-markup data-code="${encodedCode}" data-language="${escapeHtml(language)}">${highlighted}</div>`
        },
      },
    })

    try {
      html.value = processLinks(await marked.parse(value))
    } catch {
      // Ignore parse errors during streaming (incomplete markdown)
      // Keep the previous valid HTML state
    }
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

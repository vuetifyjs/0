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

// Types
import type { Highlighter } from 'shiki'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

// Build
import { createApiTransformer, VUE_FUNCTIONS } from '../../build/shiki-api-transformer'

export interface UseMarkdownReturn {
  html: ShallowRef<string>
  render: (source?: string) => Promise<void>
}

// Shared Marked instance cache - avoids recreating per render
let cachedMarked: Marked | null = null
let cachedHighlighter: Highlighter | null = null

function getMarked (hl: Highlighter): Marked {
  // Return cached if highlighter is the same
  if (cachedMarked && cachedHighlighter === hl) return cachedMarked

  cachedHighlighter = hl
  cachedMarked = new Marked({
    async: true,
    gfm: true,
    breaks: true,
  })

  cachedMarked.use({
    renderer: {
      table ({ header, rows }) {
        const thead = `<thead><tr>${header.map(cell => `<th${cell.align ? ` align="${cell.align}"` : ''}>${cell.text}</th>`).join('')}</tr></thead>`
        const tbody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td${cell.align ? ` align="${cell.align}"` : ''}>${cell.text}</td>`).join('')}</tr>`).join('')}</tbody>`
        return `<div class="overflow-x-auto mb-4"><table>${thead}${tbody}</table></div>`
      },
      blockquote ({ raw }) {
        // GitHub-style callouts: > [!TIP], > [!INFO], > [!WARNING], > [!ERROR]
        const innerContent = raw
          .split('\n')
          .map(line => line.replace(/^>\s?/, ''))
          .join('\n')
          .trim()

        const match = innerContent.match(/^\[!(TIP|INFO|WARNING|ERROR)\]\s*([\s\S]*)/)
        if (match) {
          const type = match[1].toLowerCase()
          const content = match[2].trim()
          const encodedContent = btoa(unescape(encodeURIComponent(content)))
          return `<div data-alert data-type="${type}" data-content="${encodedContent}"></div>`
        }

        return `<blockquote>${innerContent}</blockquote>`
      },
      code ({ text, lang }) {
        const language = lang?.split(/\s+/)[0] || 'text'

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
            transformers: [createApiTransformer()],
          })
        } catch {
          // Fallback for unsupported languages
          highlighted = `<pre class="shiki"><code>${escapeHtml(text)}</code></pre>`
        }

        // Encode code for DocsMarkup component mounting (Unicode-safe base64)
        const encodedCode = btoa(unescape(encodeURIComponent(text)))

        return `<div data-markup data-code="${encodedCode}" data-language="${escapeHtml(language)}">${highlighted}</div>`
      },
      codespan ({ text }) {
        // Check if inline code is a Vue function
        const vueHref = VUE_FUNCTIONS[text]
        if (vueHref) {
          return `<code data-vue-href="${escapeHtml(vueHref)}" title="Open Vue documentation">${escapeHtml(text)}</code>`
        }
        return `<code>${escapeHtml(text)}</code>`
      },
    },
  })

  return cachedMarked
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
    const marked = getMarked(hl)

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

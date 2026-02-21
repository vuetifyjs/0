/**
 * @module useMarkdown
 *
 * @remarks
 * Renders markdown to HTML with syntax highlighting for code blocks.
 * Uses marked for parsing and Shiki for code highlighting.
 *
 * TODO: Dedupe with build/markdown.ts - shared logic includes:
 * - Table wrapping (overflow-x-auto)
 * - Callout detection ([!TIP], [!INFO], etc.)
 * - Mermaid code block handling
 * - VUE_API_NAMES inline code detection
 * - Shiki themes and createApiTransformer()
 */

// Build
import { createApiTransformer, renderVueApiInlineCode } from '@build/shiki-api-transformer'
import { Marked } from 'marked'

// Utilities
import { processLinks } from '@/utilities/processLinks'
import { type MaybeRefOrGetter, onMounted, shallowRef, type ShallowRef, toValue, watch } from 'vue'

// Types
import type { Highlighter } from 'shiki'

// Constants
import { SHIKI_THEMES } from '@/constants/shiki'

export interface UseMarkdownReturn {
  html: ShallowRef<string>
  render: (source?: string) => Promise<void>
}

// Shared Marked instance cache - avoids recreating per render
let cachedMarked: Marked | null = null
let cachedHighlighter: Highlighter | null = null

// Separate synchronous instance used only for parseInline inside the blockquote renderer.
// The main cachedMarked has async:true, which makes parseInline return a Promise — unusable
// in a synchronous renderer. This instance is sync-only and has no extensions.
let syncInlineMarked: Marked | null = null
function getInlineMarked (): Marked {
  return syncInlineMarked ??= new Marked({ async: false, gfm: true })
}

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
        function parse (text: string) {
          return getInlineMarked().parseInline(text)
        }
        const thead = `<thead><tr>${header.map(cell => `<th${cell.align ? ` align="${cell.align}"` : ''}>${parse(cell.text)}</th>`).join('')}</tr></thead>`
        const tbody = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td${cell.align ? ` align="${cell.align}"` : ''}>${parse(cell.text)}</td>`).join('')}</tr>`).join('')}</tbody>`
        return `<div class="overflow-x-auto mb-4"><table>${thead}${tbody}</table></div>`
      },
      blockquote ({ raw }) {
        // GitHub-style callouts: > [!TIP], > [!INFO], > [!WARNING], > [!ERROR], > [!TRY], > [!TOUR]
        const innerContent = raw
          .split('\n')
          .map(line => line.replace(/^>\s?/, ''))
          .join('\n')
          .trim()

        const match = innerContent.match(/^\[!(TIP|INFO|WARNING|ERROR|TRY|TOUR)\]\s*([\s\S]*)/)
        if (match) {
          const type = match[1].toLowerCase()
          const rest = match[2].trim()

          if (type === 'tour') {
            // rest is the tour ID — no slot content needed, DocsCallout renders from registry
            return `<div data-alert data-type="tour" data-tour-id="${rest}"></div>`
          }

          // Parse inline markdown so backticks, bold, links etc. render correctly in callouts.
          // Must use the sync instance — cachedMarked has async:true, making parseInline a Promise.
          const parsedContent = getInlineMarked().parseInline(rest)
          const encodedContent = btoa(unescape(encodeURIComponent(parsedContent)))
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
        // Check if inline code is a Vue API
        return renderVueApiInlineCode(text, escapeHtml) ?? `<code>${escapeHtml(text)}</code>`
      },
    },
  })

  return cachedMarked
}

/**
 * Provides reactive markdown rendering with syntax-highlighted code blocks.
 */
export function useMarkdown (content: MaybeRefOrGetter<string | undefined>): UseMarkdownReturn {
  const html = shallowRef('')

  async function render (source?: string) {
    const value = source ?? toValue(content)
    if (!value) {
      html.value = ''
      return
    }

    const { useHighlighter } = await import('./useHighlighter')
    const { highlighter, getHighlighter } = useHighlighter()
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

import { fromHighlighter } from '@shikijs/markdown-it/core'
import Anchor from 'markdown-it-anchor'
import Attrs from 'markdown-it-attrs'
import Container from 'markdown-it-container'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import Markdown from 'unplugin-vue-markdown/vite'

// Types
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

// Local
import { createApiTransformer, VUE_FUNCTIONS } from './shiki-api-transformer'

interface MarkdownToken { nesting: number }

// Constants
import { EXTERNAL_LINK_SUFFIX } from '../src/constants/links'
import { SHIKI_THEME_IMPORTS, SHIKI_THEMES } from '../src/constants/shiki'

export default async function MarkdownPlugin () {
  const highlighter = await createHighlighterCore({
    themes: SHIKI_THEME_IMPORTS,
    langs: [
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/vue'),
      import('@shikijs/langs/html'),
      import('@shikijs/langs/markdown'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  return Markdown({
    headEnabled: true,
    exposeFrontmatter: true,
    markdownItOptions: {
      html: true,
      linkify: true,
      typographer: true,
    },
    markdownItSetup (md) {
      md.use(Attrs)
      md.use(Anchor, {
        permalink: Anchor.permalink.headerLink({ symbol: '' }),
        slugify: (s: string) => s
          .toLowerCase()
          .trim()
          .replace(/[\s-]+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/^-+|-+$/g, ''),
      })
      md.use(Container, 'code-group', {
        render (tokens: MarkdownToken[], index: number) {
          return tokens[index].nesting === 1
            ? '<DocsCodeGroup>\n'
            : '</DocsCodeGroup>\n'
        },
      })

      // FAQ container: ::: faq ... ::: or ::: faq single ... :::
      // Questions marked with ??? Question text
      md.use(Container, 'faq', {
        render (tokens: MarkdownToken[], index: number, _options: unknown, env: Record<string, unknown>) {
          if (tokens[index].nesting === 1) {
            const info = (tokens[index] as MarkdownToken & { info?: string }).info?.trim() || ''
            const isSingle = info.includes('single')
            return `<DocsFaq :multiple="${!isSingle}">\n`
          }
          // Close final FAQ item when container closes
          const closeItem = env._inFaqItem ? '</DocsFaqItem>\n' : ''
          delete env._inFaqItem
          return `${closeItem}</DocsFaq>\n`
        },
      })

      // Transform ??? lines into DocsFaqItem components
      const defaultParagraphOpen = md.renderer.rules.paragraph_open
      const defaultParagraphClose = md.renderer.rules.paragraph_close

      md.renderer.rules.paragraph_open = (tokens, index, options, env, self) => {
        const inlineToken = tokens[index + 1]
        if (inlineToken?.type === 'inline' && inlineToken.content?.startsWith('??? ')) {
          const question = inlineToken.content.slice(4).trim()
          // Close previous FAQ item if one is open
          const closeTag = env._inFaqItem ? '</DocsFaqItem>\n' : ''
          env._inFaqItem = true
          env._faqQuestionPara = true
          inlineToken.content = ''
          inlineToken.children = []
          return `${closeTag}<DocsFaqItem question="${md.utils.escapeHtml(question)}">\n`
        }
        return defaultParagraphOpen
          ? defaultParagraphOpen(tokens, index, options, env, self)
          : '<p>'
      }

      md.renderer.rules.paragraph_close = (tokens, index, options, env, self) => {
        if (env._faqQuestionPara) {
          delete env._faqQuestionPara
          return ''
        }

        return defaultParagraphClose
          ? defaultParagraphClose(tokens, index, options, env, self)
          : '</p>'
      }

      // GitHub-style callouts: > [!TIP], > [!INFO], > [!WARNING], > [!ERROR], > [!SUGGESTION]
      const defaultBlockquoteOpen = md.renderer.rules.blockquote_open
      const defaultBlockquoteClose = md.renderer.rules.blockquote_close

      md.renderer.rules.blockquote_open = (tokens, index, options, env, self) => {
        // Look ahead: blockquote_open -> paragraph_open -> inline
        const inlineToken = tokens[index + 2]
        if (inlineToken?.type === 'inline' && inlineToken.content) {
          const match = inlineToken.content.match(/^\[!(TIP|INFO|WARNING|ERROR|SUGGESTION)\]\s*(.*)/)
          if (match) {
            const type = match[1].toLowerCase()
            env._calloutType = type

            if (type === 'suggestion') {
              // For suggestions, the rest of the line is the question
              const suggestion = match[2].trim()
              inlineToken.content = ''
              inlineToken.children = []
              return `<DocsAlert type="${type}" suggestion="${Buffer.from(suggestion).toString('base64')}">`
            }

            // For other types, strip the marker and keep content
            const remainder = match[2]
            inlineToken.content = remainder

            // Also update the children array - find and update the first text token
            if (inlineToken.children?.length) {
              const firstChild = inlineToken.children[0]
              if (firstChild?.type === 'text') {
                firstChild.content = firstChild.content.replace(/^\[!(TIP|INFO|WARNING|ERROR)\]\s*/, '')
              }
            }

            return `<DocsAlert type="${type}">`
          }
        }

        return defaultBlockquoteOpen
          ? defaultBlockquoteOpen(tokens, index, options, env, self)
          : '<blockquote>'
      }

      md.renderer.rules.blockquote_close = (tokens, index, options, env, self) => {
        if (env._calloutType) {
          delete env._calloutType
          return '</DocsAlert>'
        }

        return defaultBlockquoteClose
          ? defaultBlockquoteClose(tokens, index, options, env, self)
          : '</blockquote>'
      }

      // Inline code: link Vue built-in functions to Vue docs
      const defaultCodeInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const content = token.content

        // Check if content is a Vue function
        const vueHref = VUE_FUNCTIONS[content]
        if (vueHref) {
          const escaped = md.utils.escapeHtml(content)
          const escapedHref = md.utils.escapeHtml(vueHref)
          return `<code data-vue-href="${escapedHref}" title="Open Vue documentation">${escaped}</code>`
        }

        // Default rendering for non-Vue inline code
        return defaultCodeInline
          ? defaultCodeInline(tokens, index, options, env, self)
          : `<code>${md.utils.escapeHtml(content)}</code>`
      }

      md.use(
        fromHighlighter(highlighter as HighlighterGeneric<BundledLanguage, BundledTheme>, {
          themes: SHIKI_THEMES,
          defaultColor: false,
          transformers: [createApiTransformer()],
        }),
      )

      // Wrap code blocks with DocsMarkup component
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const code = token.content.trim()
        // Parse fence info - can be "lang", "lang playground", or "lang filename"
        const info = token.info?.trim() || ''
        const [lang, ...rest] = info.split(/\s+/)

        const encodedCode = Buffer.from(code).toString('base64')

        if (lang === 'mermaid') {
          // Parse quoted caption: ```mermaid "Caption text"
          const captionMatch = info.match(/^mermaid\s+"([^"]+)"/)
          const caption = captionMatch?.[1]
          const captionAttr = caption ? ` caption="${Buffer.from(caption).toString('base64')}"` : ''
          return `<DocsMermaid code="${encodedCode}"${captionAttr} />`
        }

        const playgroundIndex = rest.indexOf('playground')
        const playground = playgroundIndex !== -1
        if (playground) rest.splice(playgroundIndex, 1)

        // Parse collapse modifier: "collapse" or "collapse:15"
        const collapseIndex = rest.findIndex(r => r === 'collapse' || r.startsWith('collapse:'))
        let collapse = false
        let collapseLines: number | undefined
        if (collapseIndex !== -1) {
          const collapseToken = rest[collapseIndex]
          collapse = true
          if (collapseToken.includes(':')) {
            const parsed = Number.parseInt(collapseToken.split(':')[1])
            if (!Number.isNaN(parsed) && parsed > 0) {
              collapseLines = parsed
            }
          }
          rest.splice(collapseIndex, 1)
        }

        const title = rest.join(' ')
        const highlighted = defaultFence(tokens, index, options, env, self)
        // Base64 encode to avoid escaping issues
        const titleAttr = title ? ` title="${title}"` : ''
        const playgroundAttr = playground ? ' playground' : ''
        const collapseAttr = collapse ? ' collapse' : ''
        const collapseLinesAttr = collapseLines ? ` :collapse-lines="${collapseLines}"` : ''
        return `<DocsMarkup code="${encodedCode}" language="${lang || 'text'}"${titleAttr}${playgroundAttr}${collapseAttr}${collapseLinesAttr}>${highlighted}</DocsMarkup>`
      }
      // Wrap tables in scrollable container for mobile
      md.renderer.rules.table_open = () => '<div class="overflow-x-auto mb-4"><table>'
      md.renderer.rules.table_close = () => '</table></div>'

      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const t = tokens[index]
        const classes = t.attrGet('class') || ''
        const isHeaderAnchor = /\bheader-anchor\b/.test(classes)

        // Don't add v0-link class to header anchors
        if (!isHeaderAnchor) {
          const ci = t.attrIndex('class')
          if (ci < 0) t.attrPush(['class', 'v0-link'])
          else if (t.attrs && !/\bv0-link\b/.test(t.attrs[ci][1])) t.attrs[ci][1] += ' v0-link'
        }

        const href = t.attrGet('href') || ''
        if (/^https?:\/\//i.test(href)) {
          t.attrSet('target', '_blank')
          t.attrSet('rel', 'noopener noreferrer')
          t.attrSet('data-sfx', EXTERNAL_LINK_SUFFIX)
        }
        return self.renderToken(tokens, index, options)
      }
      md.renderer.rules.link_close = (tokens, index, options, env, self) => {
        for (let i = index - 1; i >= 0; i--) {
          const open = tokens[i]
          if (open.type === 'link_open') {
            const sfx = open.attrGet && open.attrGet('data-sfx')
            const close = self.renderToken(tokens, index, options)
            return (sfx || '') + close
          }
        }
        return self.renderToken(tokens, index, options)
      }
    },
  })
}

export type MarkdownPluginFactory = typeof MarkdownPlugin

import { fromHighlighter } from '@shikijs/markdown-it/core'
import Anchor from 'markdown-it-anchor'
import Attrs from 'markdown-it-attrs'
import Container from 'markdown-it-container'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import Markdown from 'unplugin-vue-markdown/vite'

// Types
import type { HighlighterGeneric } from 'shiki/types'

export default async function MarkdownPlugin () {
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/github-light-default'),
      import('@shikijs/themes/github-dark-default'),
    ],
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
        render (tokens: any[], index: number) {
          return tokens[index].nesting === 1
            ? '<DocsCodeGroup>\n'
            : '</DocsCodeGroup>\n'
        },
      })

      // GitHub-style callouts: > [!TIP], > [!WARNING], > [!ERROR], > [!SUGGESTION]
      const defaultBlockquoteOpen = md.renderer.rules.blockquote_open
      const defaultBlockquoteClose = md.renderer.rules.blockquote_close

      md.renderer.rules.blockquote_open = (tokens, index, options, env, self) => {
        // Look ahead: blockquote_open -> paragraph_open -> inline
        const inlineToken = tokens[index + 2]
        if (inlineToken?.type === 'inline' && inlineToken.content) {
          const match = inlineToken.content.match(/^\[!(TIP|WARNING|ERROR|SUGGESTION)\]\s*(.*)/)
          if (match) {
            const type = match[1].toLowerCase()
            env._calloutType = type

            if (type === 'suggestion') {
              // For suggestions, the rest of the line is the question
              const suggestion = match[2].trim()
              inlineToken.content = ''
              inlineToken.children = []
              return `<DocsAlert type="${type}" suggestion="${encodeURIComponent(suggestion)}">`
            }

            // For other types, strip the marker and keep content
            const remainder = match[2]
            inlineToken.content = remainder

            // Also update the children array - find and update the first text token
            if (inlineToken.children?.length) {
              const firstChild = inlineToken.children[0]
              if (firstChild?.type === 'text') {
                firstChild.content = firstChild.content.replace(/^\[!(TIP|WARNING|ERROR)\]\s*/, '')
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
      md.use(
        fromHighlighter(highlighter as HighlighterGeneric<any, any>, {
          themes: {
            light: 'github-light-default',
            dark: 'github-dark-default',
          },
          defaultColor: false,
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

        if (lang === 'mermaid') return `<DocsMermaid code="${encodedCode}" />`

        const playgroundIndex = rest.indexOf('playground')
        const playground = playgroundIndex !== -1
        if (playground) rest.splice(playgroundIndex, 1)
        const title = rest.join(' ')
        const highlighted = defaultFence(tokens, index, options, env, self)
        // Base64 encode to avoid escaping issues
        const titleAttr = title ? ` title="${title}"` : ''
        const playgroundAttr = playground ? ' playground' : ''
        return `<DocsMarkup code="${encodedCode}" language="${lang || 'text'}"${titleAttr}${playgroundAttr}>${highlighted}</DocsMarkup>`
      }
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
          t.attrSet('data-sfx', '↗')
        } else if (/#/.test(href) && !isHeaderAnchor) {
          t.attrSet('data-pfx', '#')
        } else if (!isHeaderAnchor) {
          t.attrSet('data-sfx', '→')
        }
        let html = self.renderToken(tokens, index, options)
        const pfx = t.attrGet('data-pfx')
        if (pfx) html += pfx
        return html
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

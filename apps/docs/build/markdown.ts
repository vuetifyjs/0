import Markdown from 'unplugin-vue-markdown/vite'
import Attrs from 'markdown-it-attrs'
import Anchor from 'markdown-it-anchor'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
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
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  })

  return Markdown({
    headEnabled: true,
    markdownItOptions: {
      html: true,
      linkify: true,
      typographer: true,
    },
    markdownItSetup (md) {
      md.use(Attrs)
      md.use(Anchor, {
        permalink: false,
        slugify: (s: string) => s
          .toLowerCase()
          .trim()
          .replace(/[\s-]+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/^-+|-+$/g, ''),
      })
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
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const code = token.content.trim()
        // Parse fence info - can be "lang" or "lang filename"
        const info = token.info?.trim() || ''
        const [lang, ...rest] = info.split(/\s+/)
        const title = rest.join(' ') // Only use title if explicitly provided
        const highlighted = defaultFence(tokens, idx, options, env, self)
        // Base64 encode to avoid escaping issues
        const encodedCode = Buffer.from(code).toString('base64')
        const titleAttr = title ? ` title="${title}"` : ''
        return `<DocsMarkup code="${encodedCode}" language="${lang || 'text'}"${titleAttr}>${highlighted}</DocsMarkup>`
      }
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const t = tokens[idx]
        const ci = t.attrIndex('class')
        if (ci < 0) t.attrPush(['class', 'v0-link'])
        else if (t.attrs && !/\bv0-link\b/.test(t.attrs[ci][1])) t.attrs[ci][1] += ' v0-link'
        const href = t.attrGet('href') || ''
        if (/^https?:\/\//i.test(href)) {
          t.attrSet('data-sfx', '↗')
        } else if (/#/.test(href)) {
          t.attrSet('data-pfx', '#')
        } else {
          t.attrSet('data-sfx', '→')
        }
        let html = self.renderToken(tokens, idx, options)
        const pfx = t.attrGet('data-pfx')
        if (pfx) html += pfx
        return html
      }
      md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
        for (let i = idx - 1; i >= 0; i--) {
          const open = tokens[i]
          if (open.type === 'link_open') {
            const sfx = open.attrGet && open.attrGet('data-sfx')
            const close = self.renderToken(tokens, idx, options)
            return (sfx || '') + close
          }
        }
        return self.renderToken(tokens, idx, options)
      }
    },
  })
}

export type MarkdownPluginFactory = typeof MarkdownPlugin

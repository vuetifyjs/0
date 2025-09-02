import Markdown from 'unplugin-vue-markdown/vite'
import Attrs from 'markdown-it-attrs'
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
    markdownItOptions: {
      html: true,
      linkify: true,
      typographer: true,
    },
    markdownItSetup (md) {
      md.use(Attrs)
      md.use(
        fromHighlighter(highlighter as HighlighterGeneric<any, any>, {
          themes: {
            light: 'github-light-default',
            dark: 'github-dark-default',
          },
        }),
      )
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

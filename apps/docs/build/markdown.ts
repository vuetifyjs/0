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
        }))
      md.renderer.rules.link_open = function (tokens, idx, options, _env, self) {
        const token = tokens[idx]
        const classIndex = token.attrIndex('class')
        if (classIndex < 0) token.attrPush(['class', 'v0-link'])
        else if (token.attrs && !/\bv0-link\b/.test(token.attrs[classIndex][1])) token.attrs[classIndex][1] += ' v0-link'
        return self.renderToken(tokens, idx, options)
      }
    },
  })
}

export type MarkdownPluginFactory = typeof MarkdownPlugin

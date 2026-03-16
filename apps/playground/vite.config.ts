import { fileURLToPath, URL } from 'node:url'

import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import UnocssVitePlugin from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import VueRouter from 'vue-router/vite'

// Types
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

const SHIKI_THEMES = {
  light: 'github-light-default',
  dark: 'github-dark-default',
} as const

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/github-light-default'),
    import('@shikijs/themes/github-dark-default'),
  ],
  langs: [
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/vue'),
    import('@shikijs/langs/bash'),
  ],
  engine: createJavaScriptRegexEngine(),
})

const markdownPlugin = Markdown({
  wrapperClasses: '',
  markdownItSetup (md) {
    md.use(
      fromHighlighter(highlighter as HighlighterGeneric<BundledLanguage, BundledTheme>, {
        themes: SHIKI_THEMES,
        defaultColor: false,
      }),
    )

    // Wrap tables in scrollable container
    md.renderer.rules.table_open = () => '<div class="overflow-x-auto mb-4"><table>'
    md.renderer.rules.table_close = () => '</table></div>'

    // Open external links in new window with ↗ suffix
    const defaultLinkClose = md.renderer.rules.link_close

    md.renderer.rules.link_open = (tokens, index, options, _env, self) => {
      const token = tokens[index]
      const href = token.attrGet('href') || ''
      if (/^https?:\/\//i.test(href)) {
        token.attrSet('target', '_blank')
        token.attrSet('rel', 'noopener noreferrer')
        token.attrSet('data-external', '')
      }
      return self.renderToken(tokens, index, options)
    }

    md.renderer.rules.link_close = (tokens, index, options, env, self) => {
      for (let i = index - 1; i >= 0; i--) {
        const open = tokens[i]
        if (open.type === 'link_open' && open.attrGet('data-external') !== null) {
          const close = defaultLinkClose
            ? defaultLinkClose(tokens, index, options, env, self)
            : self.renderToken(tokens, index, options)
          return '↗' + close
        }
        if (open.type === 'link_open') break
      }
      return defaultLinkClose
        ? defaultLinkClose(tokens, index, options, env, self)
        : self.renderToken(tokens, index, options)
    }
  },
})

export default defineConfig({
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
  ssr: {
    noExternal: ['@vue/repl'],
  },
  build: {
    sourcemap: true,
  },
  css: {
    transformer: 'postcss',
  },
  plugins: [
    VueRouter({
      dts: './src/typed-router.d.ts',
      extensions: ['.vue', '.md'],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    markdownPlugin,
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: './src/components.d.ts',
    }),
    UnocssVitePlugin(),
    Layouts(),
  ],
  define: {
    'process.env': {},
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../../packages/*', '../../node_modules', '.'],
    },
  },
})

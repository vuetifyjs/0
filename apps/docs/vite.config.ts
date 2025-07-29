import { fileURLToPath, URL } from 'node:url'
import Layouts from 'vite-plugin-vue-layouts-next'
import VueRouter from 'unplugin-vue-router/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Components from 'unplugin-vue-components/vite'
import Attrs from 'markdown-it-attrs'

import { defineConfig } from 'vite'
import Vue from 'unplugin-vue/rolldown'
import UnocssVitePlugin from 'unocss/vite'
import Prism from 'markdown-it-prism'

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    VueRouter({
      dts: './src/typed-router.d.ts',
      extensions: ['.vue', '.md'],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItSetup (md) {
        md.use(Attrs)
        md.use(Prism)
      },
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
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
      '@vuetify/0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../packages/*', '.'],
    },
  },
})

import { fileURLToPath, URL } from 'node:url'

import { Features } from 'lightningcss'
import UnocssVitePlugin from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts-next'
import generateSitemap from 'vite-ssg-sitemap'

// Types
import type { ViteSSGOptions } from 'vite-ssg'

import { getApiSlugs } from './build/api-names'
import copyMarkdownPlugin from './build/copy-markdown'
import generateApiPlugin from './build/generate-api'
import generateLlmsFullPlugin from './build/generate-llms-full'
import generateNavPlugin from './build/generate-nav'
import generateSearchIndexPlugin from './build/generate-search-index'
import Markdown from './build/markdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('mermaid')) return 'mermaid'
          if (id.includes('shiki') || id.includes('@shikijs')) return 'shiki'
          if (id.includes('katex')) return 'katex'
          if (id.includes('octokit')) return 'octokit'
          if (id.includes('marked')) return 'marked'
        },
      },
    },
  },
  css: {
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    async includedRoutes (paths) {
      const apiSlugs = await getApiSlugs()
      const apiRoutes = apiSlugs.map(slug => `/api/${slug}`)
      return [...paths, ...apiRoutes]
    },
    onFinished () {
      generateSitemap({
        hostname: 'https://0.vuetifyjs.com',
      })
    },
  } as ViteSSGOptions,
  plugins: [
    VueRouter({
      dts: './src/typed-router.d.ts',
      extensions: ['.vue', '.md'],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    process.env.NODE_ENV !== 'production' && VueDevTools(),
    await Markdown(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: './src/components.d.ts',
    }),
    UnocssVitePlugin(),
    Layouts(),
    copyMarkdownPlugin(),
    generateApiPlugin(),
    generateLlmsFullPlugin(),
    generateSearchIndexPlugin(),
    generateNavPlugin(),
    VitePWA({
      injectRegister: 'script-defer',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vuetify0',
        short_name: 'v0',
        description: 'Headless UI primitives and composables for Vue',
        theme_color: '#1867C0',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['**/mermaid-*.js'],
      },
    }),
  ],
  define: {
    'process.env': {},
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VERSION__': JSON.stringify(pkg.version),
    '__VITE_LOGGER_ENABLED__': process.env.VITE_LOGGER_ENABLED,
    '__VUE_OPTIONS_API__': 'false',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
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

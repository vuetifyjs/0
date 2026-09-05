import { readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import UnocssVitePlugin from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import Layouts from 'vite-plugin-vue-layouts-next'
import generateSitemap from 'vite-ssg-sitemap'
import VueRouter from 'vue-router/vite'

import { getApiSlugs } from './build/api-names'
import copyMarkdownPlugin from './build/copy-markdown'
import generateApiPlugin from './build/generate-api'
import generateApiMarkdownPlugin from './build/generate-api-markdown'
import generateApiWhitelistPlugin from './build/generate-api-whitelist'
import generateExamplesPlugin from './build/generate-examples'
import generateFaqsPlugin from './build/generate-faqs'
import generateLlmsFullPlugin from './build/generate-llms-full'
import generateNavPlugin from './build/generate-nav'
import { generateOgImages } from './build/generate-og-images'
import generatePageDatesPlugin from './build/generate-page-dates'
import generateRegistryPlugin from './build/generate-registry'
import generateSearchIndexPlugin from './build/generate-search-index'
import generateTestCountPlugin from './build/generate-test-count'
import generateTipsPlugin from './build/generate-tips'
import Markdown from './build/markdown'
import mdRoutesPlugin from './build/md-routes'
import { isIndexable, PROD_SITE_URL, robotsTxt } from './build/site'
import { getSkillzSlugs } from './build/skillz-tours'
import pkg from './package.json' with { type: 'json' }

// Types
import type { ViteSSGOptions } from 'vite-ssg'

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      // Vite's default input is the root `index.html` alone, so the design-system
      // example frames — separate documents by design, since a system's global
      // CSS cannot share one with the docs shell — are served in dev and then
      // missing from `dist`. Naming them here is what makes the built site's
      // `<iframe src="/sandbox/…">` resolve. Read from disk rather than listed,
      // so adding a system is one HTML file and no config edit.
      input: Object.fromEntries([
        ['index', fileURLToPath(new URL('index.html', import.meta.url))],
        ...readdirSync(fileURLToPath(new URL('sandbox', import.meta.url)))
          .filter(file => file.endsWith('.html'))
          .map(file => [
            `sandbox/${file.replace(/\.html$/, '')}`,
            fileURLToPath(new URL(`sandbox/${file}`, import.meta.url)),
          ]),
      ]),
    },
  },
  css: {
    transformer: 'postcss', // Use postcss instead of lightningcss to preserve color-mix syntax
  },
  ssgOptions: {
    // Disable beasties critical CSS extraction. Beasties inconsistently inlines
    // UnoCSS utilities (some classes get inlined, others don't) causing layout
    // shift when the external CSS loads. With this disabled, CSS loads as a
    // blocking resource - all styles available before first paint, zero CLS.
    beastiesOptions: false,
    dirStyle: 'nested',
    async includedRoutes (paths) {
      const [apiSlugs, skillzSlugs] = await Promise.all([
        getApiSlugs(),
        getSkillzSlugs(),
      ])
      // Drop every dynamic route, not just ':path'. Concrete routes are appended
      // below from the discovered slugs; any surviving placeholder (e.g.
      // '/api/:name') prerenders as an empty shell and lands in the sitemap.
      const filtered = paths.filter(p => !p.includes(':'))
      const apiRoutes = apiSlugs.map(slug => `/api/${slug}`)
      const skillzRoutes = skillzSlugs.map(slug => `/skillz/${slug}`)
      return [...filtered, ...apiRoutes, ...skillzRoutes, '/404']
    },
    async onFinished () {
      const indexable = isIndexable()
      if (indexable) {
        generateSitemap({
          hostname: PROD_SITE_URL,
          generateRobotsTxt: false,
          changefreq: 'daily',
          priority: 0.7,
          exclude: ['/404'],
        })
      }
      writeFileSync(
        fileURLToPath(new URL('dist/robots.txt', import.meta.url)),
        robotsTxt(indexable),
      )
      await generateOgImages()
    },
  } as ViteSSGOptions,
  plugins: [
    generateApiWhitelistPlugin(),
    VueRouter({
      dts: './src/typed-router.d.ts',
      extensions: ['.vue', '.md'],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
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
    generateApiMarkdownPlugin(),
    mdRoutesPlugin(),
    generateFaqsPlugin(),
    generateExamplesPlugin(),
    generateLlmsFullPlugin(),
    generateSearchIndexPlugin(),
    generateTestCountPlugin(),
    generateTipsPlugin(),
    generateNavPlugin(),
    generatePageDatesPlugin(),
    generateRegistryPlugin(),
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
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
        // Exclude mermaid diagram chunks from precache (loaded on demand)
        // Exclude large on-demand chunks from precache
        // - Mermaid/Cytoscape: diagram tools, loaded only when docs use them
        // - vue.worker/playground/jsx: Monaco editor assets, only needed in the playground
        globIgnores: ['**/*Diagram-*.js', '**/mermaid*.js', '**/cytoscape*.js', '**/vue.worker*.js', '**/playground-*.js', '**/jsx-*.js', '**/monaco-editor-*.js'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: null,
      },
    }),
  ],
  define: {
    'process.env': {},
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VERSION__': JSON.stringify(pkg.version),
    '__VITE_LOGGER_ENABLED__': process.env.VITE_LOGGER_ENABLED,
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@build': fileURLToPath(new URL('build', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      '@paper/genesis': fileURLToPath(new URL('../../packages/genesis/src', import.meta.url)),
      '@paper/bulma': fileURLToPath(new URL('../../packages/bulma/src', import.meta.url)),
      '@paper/emerald': fileURLToPath(new URL('../../packages/emerald/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      '#genesis': fileURLToPath(new URL('../../packages/genesis/src', import.meta.url)),
      '#bulma': fileURLToPath(new URL('../../packages/bulma/src', import.meta.url)),
      '#emerald': fileURLToPath(new URL('../../packages/emerald/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../../packages/*', '../../node_modules', '.'],
    },
    // Production copies `dev/dist` to /demo/emerald/ (see root `build:demo`).
    // Vite's SPA fallback would otherwise render the docs 404. Proxy the
    // subpath so the Dashboard card works in `pnpm dev` the same as on nginx.
    proxy: {
      '/demo/emerald': {
        target: process.env.VITE_EMERALD_DEMO ?? 'https://0.vuetifyjs.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

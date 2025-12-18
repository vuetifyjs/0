import { fileURLToPath, URL } from 'node:url'
import Layouts from 'vite-plugin-vue-layouts-next'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from './build/markdown'
import pkg from './package.json' with { type: 'json' }
import generateSitemap from 'vite-ssg-sitemap'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import Vue from 'unplugin-vue/rolldown'
import UnocssVitePlugin from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import type { ViteSSGOptions } from 'vite-ssg'
import { Features } from 'lightningcss'

export default defineConfig({
  css: {
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  ssr: {
    noExternal: ['@vuetify/one'],
  },
  ssgOptions: {
    dirStyle: 'nested',
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
    VueDevTools(),
    await Markdown(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: './src/components.d.ts',
    }),
    UnocssVitePlugin(),
    Layouts(),
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

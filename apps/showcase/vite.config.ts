import { fileURLToPath, URL } from 'node:url'

import UnocssVitePlugin from 'unocss/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'

import { paperAnalyzer } from './src/plugins/paper-analyzer'

export default defineConfig({
  plugins: [
    Vue(),
    UnocssVitePlugin(),
    paperAnalyzer({
      targets: [{
        slug: 'helix',
        package: '@paper/helix',
        manifestComponents: [],
        manifestComposables: [],
      }],
    }),
  ],
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
    __VERSION__: '"0.1.0"',
    __VITE_LOGGER_ENABLED__: 'false',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      '@paper/helix': fileURLToPath(new URL('../../packages/helix/src', import.meta.url)),
      '#helix': fileURLToPath(new URL('../../packages/helix/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../../packages/*', '../../node_modules', '.'],
    },
  },
})

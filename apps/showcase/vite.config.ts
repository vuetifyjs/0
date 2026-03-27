import { fileURLToPath, URL } from 'node:url'

import UnocssVitePlugin from 'unocss/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    UnocssVitePlugin(),
  ],
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
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
      '@paper/codex': fileURLToPath(new URL('../../packages/codex/src', import.meta.url)),
      '#codex': fileURLToPath(new URL('../../packages/codex/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../../packages/*', '../../node_modules', '.'],
    },
  },
})

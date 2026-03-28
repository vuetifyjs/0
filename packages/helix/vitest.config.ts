import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      '@paper/helix': fileURLToPath(new URL('src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      '#helix': fileURLToPath(new URL('src', import.meta.url)),
      // optional peer deps
      'shiki': fileURLToPath(new URL('__mocks__/shiki.ts', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__: '"0.0.1"',
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})

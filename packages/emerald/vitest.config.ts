import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '@paper/emerald': fileURLToPath(new URL('src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__: '"0.0.1"',
  },
  test: {
    name: 'emerald',
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})

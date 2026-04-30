import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
    __VERSION__: '"0.0.1"',
  },
  test: {
    projects: ['packages/*'],
    environment: 'happy-dom',
    pool: 'vmThreads',
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'packages/0/coverage',
      include: ['packages/0/src/**/*.{ts,vue}'],
      exclude: [
        '**/*.{test,spec,bench}.?(c|m)[jt]s',
        '**/index.ts',
        'packages/0/src/maturity.json',
      ],
    },
  },
})

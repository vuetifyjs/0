import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@paper/md1': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      // internal
      '#md1': fileURLToPath(new URL('src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
    },
  },
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__: '"0.0.1"',
  },
  test: {
    name: 'md1:unit',
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    // Component tests run in Chromium under vitest.browser.config.ts.
    exclude: ['**/*.browser.test.ts', '**/node_modules/**'],
  },
})

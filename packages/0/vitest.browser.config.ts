import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

import { commands } from './test/commands'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      '@test': fileURLToPath(new URL('test/index.ts', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    // Real browser environment: `process` does not exist, so these must be
    // evaluated at config time rather than injected as runtime expressions.
    '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
    '__VITE_LOGGER_ENABLED__': JSON.stringify(process.env.VITE_LOGGER_ENABLED ?? false),
    '__VERSION__': '"0.0.1"',
    // Node-flavored deps (e.g. @testing-library/vue) read process.env at
    // import time; give them an empty object since the browser has none.
    'process.env': '{}',
  },
  test: {
    name: 'v0:browser',
    globals: true,
    include: ['**/*.browser.test.{ts,tsx}'],
    testTimeout: 20_000,
    setupFiles: ['./test/setup.ts'],
    browser: {
      enabled: true,
      provider: playwright({
        actionTimeout: 5000,
        contextOptions: {
          reducedMotion: 'reduce',
        },
      }),
      headless: !process.env.TEST_BAIL,
      commands,
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
    },
  },
})

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
    // Vue esm-bundler feature flags. The dev/docs/playground apps inject these;
    // the browser test project must too, or every app creation logs a
    // "feature flags not explicitly defined" warning. Matches apps/docs.
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
    // Node-flavored deps (e.g. @testing-library/vue) read process.env at
    // import time; give them an empty object since the browser has none.
    'process.env': '{}',
  },
  test: {
    name: 'v0:browser',
    globals: true,
    include: ['**/*.browser.test.{ts,tsx}'],
    // Vitest's default benchmark.include is **/*.{bench,benchmark}.* — independent
    // of test.include. Without an empty list, `vitest bench` with no --project
    // re-runs every packages/0 *.bench.ts in Chromium and outputJson doubles each
    // file (unit happy-dom + browser). Canonical benches live on v0:unit only.
    benchmark: {
      include: [],
    },
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

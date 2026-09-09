import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

// No setupFiles / browser commands: packages/0's setup wires its own CDP
// commands (focus emulation, touch drag) and @testing-library/vue cleanup —
// all specific to that package's interaction tests. Markup conformance needs
// none of it; reduced motion is covered by the provider contextOptions below.
export default defineConfig({
  resolve: {
    alias: {
      '@paper/bulma': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      // internal
      '#bulma': fileURLToPath(new URL('src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    // Real browser environment: `process` does not exist, so these must be
    // evaluated at config time rather than injected as runtime expressions.
    '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
    '__VITE_LOGGER_ENABLED__': JSON.stringify(process.env.VITE_LOGGER_ENABLED ?? false),
    '__VERSION__': '"0.0.1"',
    // Vue esm-bundler feature flags — without these every app creation logs a
    // "feature flags not explicitly defined" warning. Matches packages/0.
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
    // Node-flavored deps read process.env at import time; the browser has none.
    'process.env': '{}',
  },
  test: {
    name: 'bulma:browser',
    globals: true,
    include: ['**/*.browser.test.{ts,tsx}'],
    // Keep `vitest bench` from re-running any *.bench.ts in Chromium —
    // canonical benches live on v0:unit only. Matches packages/0.
    benchmark: {
      include: [],
    },
    testTimeout: 20_000,
    browser: {
      enabled: true,
      provider: playwright({
        actionTimeout: 5000,
        contextOptions: {
          reducedMotion: 'reduce',
        },
      }),
      headless: !process.env.TEST_BAIL,
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
    },
  },
})

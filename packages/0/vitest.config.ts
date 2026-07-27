import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

// Benchmark apparatus selection. The metrics pipeline benches the built dist so
// the current point and every historical point share one fixed apparatus; dev
// (`pnpm bench`/`test:bench`) benches source. V0_BENCH_TARGET:
//   unset    → source (dev/test)
//   'dist'   → this package's built dist (current point — `pnpm metrics`)
//   <path>   → an installed version's dist (history harness)
function v0Target (): string {
  const target = process.env.V0_BENCH_TARGET
  if (!target) return fileURLToPath(new URL('src', import.meta.url))
  if (target === 'dist') return fileURLToPath(new URL('dist', import.meta.url))
  return target
}
const v0 = v0Target()

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': v0,
      '@vuetify/paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      '@test': fileURLToPath(new URL('test/index.ts', import.meta.url)),
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
    // Vue esm-bundler feature flags — silence the "not explicitly defined"
    // warning on app creation. Matches apps/docs and the browser config.
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  test: {
    name: 'v0:unit',
    projects: ['packages/*'],
    environment: 'happy-dom',
    pool: 'vmThreads',
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/*.browser.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
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

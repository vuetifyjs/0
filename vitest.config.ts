import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/0',
      'packages/0/vitest.browser.config.ts',
      'packages/paper',
      'apps/docs',
    ],
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      // 'json' (coverage-final.json) feeds the metrics pipeline; 'lcov' is what
      // we upload to Codecov — @vitest/coverage-v8 4.1.10 emits a coverage-final
      // shape Codecov 5 ingests but can't process (see PR #663 regression), and
      // lcov parses reliably regardless of the v8 json format.
      reporter: ['text', 'json', 'lcov'],
      include: ['packages/0/src/**/*.ts', 'packages/0/src/**/*.vue'],
      exclude: [
        '**/*.test.ts',
        '**/*.browser.test.ts',
        '**/*.spec.ts',
        '**/*.bench.ts',
        '**/*.d.ts',
        '**/types.ts',
        '**/adapter.ts',
        '**/fixtures/**',
        // Barrel re-exports only (not implementation files)
        'packages/0/src/index.ts',
        'packages/0/src/*/index.ts',
        'packages/0/src/components/*/index.ts',
        'packages/0/src/*/*/adapters/index.ts',
      ],
    },
  },
})

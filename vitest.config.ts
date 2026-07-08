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
      reporter: ['text', 'json'],
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
        // Components are exercised by the v0:browser project (real Chromium),
        // which is excluded from this coverage run — so don't count their
        // lines as uncovered here.
        'packages/0/src/components/**',
        // Barrel re-exports only (not implementation files)
        'packages/0/src/index.ts',
        'packages/0/src/*/index.ts',
        'packages/0/src/*/*/adapters/index.ts',
      ],
    },
  },
})

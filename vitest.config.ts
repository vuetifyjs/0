import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/docs'],
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/0/src/**/*.ts', 'packages/0/src/**/*.vue'],
      exclude: [
        '**/*.test.ts',
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

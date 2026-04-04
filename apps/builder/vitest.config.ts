import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: 20_000,
  },
})

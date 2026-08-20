import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
    },
  },
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__: '"0.0.1"',
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})

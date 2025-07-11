import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  test: {
    projects: ['packages/*'],
    environment: 'happy-dom',
    globals: true,
  },
})

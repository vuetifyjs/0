import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: { __DEV__: 'process.env.NODE_ENV !== \'production\'' },
  test: {
    projects: ['packages/*'],
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec,bench}.?(c|m)[jt]s?(x)'],
  },
})

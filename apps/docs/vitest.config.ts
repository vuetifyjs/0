import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

// Types
import type { Plugin } from 'vite'

function virtualPageDatesStub (): Plugin {
  return {
    name: 'virtual-page-dates-stub',
    resolveId (id) {
      if (id === 'virtual:page-dates') return '\0virtual:page-dates'
    },
    load (id) {
      if (id === '\0virtual:page-dates') return 'export default {}'
    },
  }
}

function virtualRegistryCatalogStub (): Plugin {
  return {
    name: 'virtual-registry-catalog-stub',
    resolveId (id) {
      if (id === 'virtual:registry-catalog') return '\0virtual:registry-catalog'
    },
    load (id) {
      if (id === '\0virtual:registry-catalog') return 'export const catalog = {}\n'
    },
  }
}

function virtualFeatureTestsStub (): Plugin {
  return {
    name: 'virtual-feature-tests-stub',
    resolveId (id) {
      if (id === 'virtual:feature-tests') return '\0virtual:feature-tests'
    },
    load (id) {
      if (id === '\0virtual:feature-tests') return 'export const featureTests = {}\n'
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@build': fileURLToPath(new URL('build', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/play': fileURLToPath(new URL('../../packages/play/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
    },
  },
  plugins: [Vue(), virtualPageDatesStub(), virtualRegistryCatalogStub(), virtualFeatureTestsStub()],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
    __VERSION__: '"0.0.1"',
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    testTimeout: 20_000,
  },
})

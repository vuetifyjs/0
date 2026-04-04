import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

import { commands } from './test/commands'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('src', import.meta.url)),
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
  },
  test: {
    name: 'v0:browser',
    globals: true,
    include: ['**/*.browser.test.{ts,tsx}'],
    testTimeout: 20_000,
    setupFiles: ['./test/setup.ts'],
    browser: {
      enabled: true,
      provider: playwright({
        actionTimeout: 5000,
        contextOptions: {
          reducedMotion: 'reduce',
        },
      }),
      headless: !process.env.TEST_BAIL,
      commands,
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
    },
  },
})

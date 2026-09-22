import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/play': fileURLToPath(new URL('../../packages/play/src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
    },
  },
  plugins: [Vue()],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__: '"0.0.1"',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})

import { defineConfig } from 'tsdown/config'
import { fileURLToPath } from 'node:url'

import Vue from 'unplugin-vue/rolldown'

const at = fileURLToPath(new URL('../src', import.meta.url))
const v0 = fileURLToPath(new URL('../../0/src', import.meta.url))

export default defineConfig([{
  plugins: [
    Vue({ isProduction: true }),
  ],
  platform: 'browser',
  dts: false,
  transform: {
    define: {
      __DEV__: 'false',
      __VITE_LOGGER_ENABLED__: 'false',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },
  entry: ['./src/index.ts'],
  name: 'vuetify/v0',
  alias: {
    '@': at,
    '#v0': v0,
  },
  outDir: './dist/browser',
}, {
  plugins: [
    Vue({ isProduction: true }),
  ],
  dts: {
    vue: true,
  },
  transform: {
    define: {
      __DEV__: 'process.env.NODE_ENV !== \'production\'',
      __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },
  entry: ['./src/*/index.ts', './src/index.ts'],
  name: 'vuetify/v0',
  alias: {
    '@': at,
    '#v0': v0,
  },
}])

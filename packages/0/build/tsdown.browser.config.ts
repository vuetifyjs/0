import { defineConfig } from 'tsdown/config'
import { fileURLToPath } from 'node:url'
import Vue from 'unplugin-vue/rolldown'
import pkg from '../package.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    Vue({ isProduction: true }),
  ],
  dts: false,
  define: {
    __DEV__: 'false',
    __VITE_LOGGER_ENABLED__: 'false',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    __VERSION__: JSON.stringify(pkg.version),
  },
  entry: ['./src/index.ts'],
  name: 'vuetify/v0',
  alias: {
    '@': fileURLToPath(new URL('../src', import.meta.url)),
    '#v0': fileURLToPath(new URL('../../0/src', import.meta.url)),
  },
  outDir: './dist/browser',
})

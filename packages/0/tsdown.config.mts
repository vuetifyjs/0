import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import Vue from 'unplugin-vue/rolldown'

import pkg from './package.json' with { type: 'json' }

const at = fileURLToPath(new URL('../src', import.meta.url))
const v0 = fileURLToPath(new URL('../../0/src', import.meta.url))
const __VERSION__ = JSON.stringify(pkg.version)

export default defineConfig([{
  plugins: [
    Vue({ isProduction: true }),
  ],
  platform: 'browser',
  dts: false,
  define: {
    __DEV__: 'false',
    __VITE_LOGGER_ENABLED__: 'false',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    __VERSION__,
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
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    __VERSION__,
  },
  entry: ['./src/*/index.ts', './src/*/adapters/**/index.ts', './src/index.ts'],
  name: 'vuetify/v0',
  exports: {
    devExports: 'development',
    customExports (pkg, ctx) {
      pkg['./browser'] = ctx.isPublish ? './dist/browser/index.js' : { ...pkg['.'], default: './dist/browser/index.js' }
      return pkg
    },
  },
  alias: {
    '@': at,
    '#v0': v0,
  },
}])

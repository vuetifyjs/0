import { defineConfig } from 'tsdown/config'
import { fileURLToPath } from 'node:url'
import sass from 'rollup-plugin-sass'
import pkg from './package.json' with { type: 'json' }

import Vue from 'unplugin-vue/rolldown'

const v0 = fileURLToPath(new URL('../../0/src', import.meta.url))
const paper = fileURLToPath(new URL('../src', import.meta.url))
const __VERSION__ = JSON.stringify(pkg.version)

export default defineConfig([{
  plugins: [
    Vue({ isProduction: true }),
    sass({
      api: 'modern',
      output: 'dist/index.css',
    }),
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
      __VERSION__,
    },
  },
  name: 'vuetify/paper',
  alias: {
    '#v0': v0,
    '#paper': paper,
  },
  outDir: './dist/browser',
}, {
  plugins: [
    Vue({ isProduction: true }),
    sass({
      api: 'modern',
      output: 'dist/index.css',
    }),
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
      __VERSION__,
    },
  },
  name: 'vuetify/paper',
  exports: {
    devExports: 'development',
    customExports (pkg, ctx) {
      pkg['./browser'] = ctx.isPublish ? './dist/browser/index.js' : { ...pkg['.'], default: './dist/browser/index.js' }
      return pkg
    },
  },
  alias: {
    '#v0': v0,
    '#paper': paper,
  },
}])

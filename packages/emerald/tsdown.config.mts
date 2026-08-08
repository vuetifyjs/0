import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import Vue from 'unplugin-vue/rolldown'

import pkg from './package.json' with { type: 'json' }

const v0 = fileURLToPath(new URL('../0/src', import.meta.url))
const emerald = fileURLToPath(new URL('src', import.meta.url))
const __VERSION__ = JSON.stringify(pkg.version)

export default defineConfig({
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
  name: 'paper/emerald',
  exports: {
    devExports: 'development',
    // scripts/bake-theme.ts writes dist/theme.css *after* tsdown runs, so tsdown
    // cannot discover it and prunes the entry from the regenerated exports map.
    // Declaring it here is the only edit that survives a build.
    customExports: {
      './theme.css': './dist/theme.css',
    },
  },
  alias: {
    '#v0': v0,
    '#emerald': emerald,
  },
})

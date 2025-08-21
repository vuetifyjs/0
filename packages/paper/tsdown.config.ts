import { defineConfig } from 'tsdown/config'
import { fileURLToPath } from 'node:url'
import sass from 'rollup-plugin-sass'

import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  plugins: [
    Vue({ isProduction: true }),
    sass({
      api: 'modern',
      output: 'dist/index.css',
    }),
  ],
  dts: {
    tsconfig: './tsconfig.app.json',
    vue: true,
  },
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  name: 'vuetify/paper',
  alias: {
    '#v0': fileURLToPath(new URL('../0/src/', import.meta.url)),
    '#paper': fileURLToPath(new URL('src/', import.meta.url)),
  },
})

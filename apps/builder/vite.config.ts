import { fileURLToPath, URL } from 'node:url'

import UnocssVitePlugin from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import VueRouter from 'vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: './src/typed-router.d.ts',
    }),
    Vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: './src/components.d.ts',
    }),
    UnocssVitePlugin(),
    Layouts(),
  ],
  define: {
    'process.env': {},
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../../packages/*', '../../node_modules', '.'],
    },
  },
})

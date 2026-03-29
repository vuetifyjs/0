import { fileURLToPath, URL } from 'node:url'

import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from 'unplugin-vue/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      dirs: [],
      resolvers: [
        name => {
          if (name.startsWith('Hx')) {
            return { name, from: fileURLToPath(new URL('../src', import.meta.url)) }
          }
        },
      ],
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '#helix': fileURLToPath(new URL('../src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../../../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../../packages/paper/src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../../packages/paper/src', import.meta.url)),
    },
  },
  define: {
    __DEV__: true,
    __VERSION__: '"dev"',
    __VITE_LOGGER_ENABLED__: '"false"',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  server: {
    fs: {
      allow: ['..', '../../../packages'],
    },
  },
})

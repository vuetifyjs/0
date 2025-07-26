import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from 'unplugin-vue/rolldown'

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    Vue({ isProduction: true }),
  ],
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../0/src/', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'Vuetify0',
      fileName: () => `index.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
    copyPublicDir: false,
  },
})

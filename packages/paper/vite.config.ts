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
    'process.env': {},
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      // internal - do not use it explicitly
      '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'VuetifyPaper',
      fileName: () => `index.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vuetify/0'],
    },
    copyPublicDir: false,
  },
})

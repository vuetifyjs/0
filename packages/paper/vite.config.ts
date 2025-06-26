import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    Vue(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetifyjs/v0': fileURLToPath(new URL('../v0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../paper/src', import.meta.url)),
      // internal - do not use it explicitly
      '#v0': fileURLToPath(new URL('../v0/src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/build.ts', import.meta.url)),
      name: 'VuetifyPaper',
      fileName: () => `index.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vuetifyjs/v0'],
    },
    copyPublicDir: false,
  },
})

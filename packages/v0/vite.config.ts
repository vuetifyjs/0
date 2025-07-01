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
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '#v0': fileURLToPath(new URL('../v0/src/', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'VuetifyV0',
      fileName: () => `index.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
    copyPublicDir: false,
  },
})

/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnocssVitePlugin from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    Vue(),
    UnocssVitePlugin(),
    Components({
      dirs: [
        './src/components',
      ],
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        'vitest',
      ],
      dirs: [
        './src/composables',
        './src/constants',
        './src/utils',
      ],
      dts: 'src/composables.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/build.ts', import.meta.url)),
      name: 'Vuetify',
      fileName: () => `vuetify0.mjs`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'focus-trap', '@vueuse/integrations'],
    },
    copyPublicDir: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})

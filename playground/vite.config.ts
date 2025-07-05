import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from 'unplugin-vue/rolldown'
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
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
      ],
      dts: 'src/composables.d.ts',
      eslintrc: {
        enabled: false,
      },
      vueTemplate: true,
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetifyjs/v0': fileURLToPath(new URL('../packages/v0/src', import.meta.url)),
      '@vuetifyjs/paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../packages/v0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../packages/*', '.'],
    },
  },
})

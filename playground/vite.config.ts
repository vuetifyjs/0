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
        '../packages/paper/src/components/',
        '../packages/v0/src/components/',
      ],
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
      ],
      dirs: [
        '../packages/paper/src/composables',
        '../packages/paper/src/utils',
        '../packages/v0/src/composables',
        '../packages/v0/src/constants',
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
      '@vuetify/v0': fileURLToPath(new URL('../packages/v0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
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

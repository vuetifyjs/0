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
      dirs: [
        '../packages/paper/src/components/',
        '../packages/0/src/components/',
      ],
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
      ],
      dirs: [
        '../packages/paper/src/composables',
        '../packages/paper/src/utilities',
        '../packages/0/src/composables',
        '../packages/0/src/constants',
        '../packages/0/src/utilities',
      ],
      dts: 'src/composables.d.ts',
      eslintrc: {
        enabled: false,
      },
      vueTemplate: true,
    }),
  ],
  define: { 'process.env': {}, '__DEV__': process.env.NODE_ENV !== 'production' },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/0': fileURLToPath(new URL('../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../packages/*', '.'],
    },
  },
})

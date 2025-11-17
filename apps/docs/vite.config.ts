import { fileURLToPath, URL } from 'node:url'
import Layouts from 'vite-plugin-vue-layouts-next'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from './build/markdown'
import pkg from './package.json' with { type: 'json' }

import { defineConfig } from 'vite'
import Vue from 'unplugin-vue/rolldown'
import UnocssVitePlugin from 'unocss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import type { ViteSSGOptions } from 'vite-ssg'
import { Features } from 'lightningcss'

export default defineConfig({
  css: {
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  ssr: {
    noExternal: ['@vuetify/one'],
  },
  ssgOptions: {
    dirStyle: 'nested',
  } as ViteSSGOptions,
  plugins: [
    VueRouter({
      dts: './src/typed-router.d.ts',
      extensions: ['.vue', '.md'],
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    VueDevTools(),
    await Markdown(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: './src/components.d.ts',
    }),
    UnocssVitePlugin(),
    Layouts(),
  ],
  define: {
    'process.env': {},
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VERSION__': JSON.stringify(pkg.version),
    '__VITE_LOGGER_ENABLED__': process.env.VITE_LOGGER_ENABLED,
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../../packages/paper/src', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: ['../packages/*', '.'],
    },
  },
})

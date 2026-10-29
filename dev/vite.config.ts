import { fileURLToPath, URL } from 'node:url'

import UnocssVitePlugin from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // Set when the app is built as the docs-site demo (see root build:demo);
  // ViteSSG feeds BASE_URL to the router, so routes follow the subpath.
  base: process.env.DEMO_BASE ?? '/',
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    Vue(),
    VueDevTools(),
    UnocssVitePlugin(),
    Components({
      dirs: [
        '../packages/paper/src/components/',
        '../packages/0/src/components/',
        '!../packages/0/src/components/fixtures',
        '../packages/emerald/src/components/',
      ],
      dts: 'src/components.d.ts',
    }),
    AutoImport({
      imports: [
        'vue',
        {
          from: fileURLToPath(new URL('../packages/0/src/utilities/helpers.ts', import.meta.url)),
          imports: [{ name: 'useId', priority: 2 }],
        },
      ],
      dirs: [
        '../packages/paper/src/composables',
        '../packages/paper/src/utilities',
        // types: false — the barrel's `export type { MatchRange }` collides
        // with the definition in utilities/diacritics.ts. Value exports stay.
        { glob: '../packages/0/src/composables', types: false },
        '../packages/0/src/constants',
        '../packages/0/src/utilities',
      ],
      // Drop names whose source file is gone. The default `append` keeps them.
      dtsMode: 'overwrite',
      dts: 'src/composables.d.ts',
      eslintrc: {
        enabled: false,
      },
      vueTemplate: true,
    }),
  ],
  define: {
    'process.env': {},
    // The md1 dashboard is excluded from the Emerald demo deploy at compile
    // time, so its chunks (and the account avatar) never reach that dist.
    '__MD1__': JSON.stringify(!(process.env.DEMO_BASE ?? '').includes('/demo/')),
    '__DEV__': process.env.NODE_ENV !== 'production',
    '__VITE_LOGGER_ENABLED__': JSON.stringify(process.env.VITE_LOGGER_ENABLED ?? 'false'),
    '__VERSION__': '"0.0.1"',
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'true',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'true',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '@vuetify/v0': fileURLToPath(new URL('../packages/0/src', import.meta.url)),
      '@vuetify/paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
      '@paper/bulma': fileURLToPath(new URL('../packages/bulma/src', import.meta.url)),
      '@paper/emerald': fileURLToPath(new URL('../packages/emerald/src', import.meta.url)),
      '@paper/md1': fileURLToPath(new URL('../packages/md1/src', import.meta.url)),
      // internal
      '#v0': fileURLToPath(new URL('../packages/0/src', import.meta.url)),
      '#paper': fileURLToPath(new URL('../packages/paper/src', import.meta.url)),
      '#bulma': fileURLToPath(new URL('../packages/bulma/src', import.meta.url)),
      '#emerald': fileURLToPath(new URL('../packages/emerald/src', import.meta.url)),
      '#md1': fileURLToPath(new URL('../packages/md1/src', import.meta.url)),
    },
  },
  // Beasties joins the `/demo/emerald/` base onto `dev/dist` and looks for
  // CSS that Vite wrote at `dev/dist/assets/`. Docs turns this off for the
  // same reason: inlining UnoCSS utilities is inconsistent and shifts layout.
  ssgOptions: {
    beastiesOptions: false,
  },
  build: {
    minify: false,
    sourcemap: true,
  },
  server: {
    fs: {
      allow: ['../packages/*', '.'],
    },
  },
})

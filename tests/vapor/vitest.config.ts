import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Resolve @vuetify/v0 (and its internal #v0 alias) to source, not built dist,
// so the Vapor graph compiles the real v0 TypeScript against Vue 3.6.
const v0Src = fileURLToPath(new URL('../../packages/0/src', import.meta.url))
const paperSrc = fileURLToPath(new URL('../../packages/paper/src', import.meta.url))

export default defineConfig({
  // Vapor is opted into per-SFC via the `vapor` attribute on <script setup>;
  // @vitejs/plugin-vue routes vapor descriptors to the vapor compiler with no
  // plugin-level option required.
  plugins: [vue()],
  resolve: {
    conditions: ['import', 'module', 'development', 'browser', 'default'],
    // Array form so `vue` can be matched EXACTLY via regex. Vue's `.` export
    // resolves the `node` condition to index.mjs → the full CJS build, which
    // does NOT re-export the Vapor runtime — so the compiled SFC's
    // `import { defineVaporComponent } from 'vue'` comes back undefined.
    // Redirect the bare `vue` specifier straight to the esm-bundler build,
    // which does `export * from "@vue/runtime-vapor"`. The `^vue$` regex
    // leaves subpaths like `vue/server-renderer` untouched.
    // The @vue/* esm-bundler builds re-export each other's @internal symbols
    // (e.g. runtime-vapor imports `initFeatureFlags` from runtime-dom, which
    // gets it via `export * from "@vue/runtime-core"`). The CJS builds strip
    // those internals, so a single CJS resolution anywhere in the chain breaks
    // linking. Pin every Vue runtime package to its esm-bundler build.
    alias: [
      { find: /^vue$/, replacement: 'vue/dist/vue.runtime.esm-bundler.js' },
      { find: /^@vue\/runtime-vapor$/, replacement: '@vue/runtime-vapor/dist/runtime-vapor.esm-bundler.js' },
      { find: /^@vue\/runtime-dom$/, replacement: '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js' },
      { find: /^@vue\/runtime-core$/, replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js' },
      { find: /^@vue\/reactivity$/, replacement: '@vue/reactivity/dist/reactivity.esm-bundler.js' },
      { find: /^@vue\/shared$/, replacement: '@vue/shared/dist/shared.esm-bundler.js' },
      { find: '@vuetify/v0', replacement: v0Src },
      { find: '@vuetify/paper', replacement: paperSrc },
      { find: '#v0', replacement: v0Src },
      { find: '#paper', replacement: paperSrc },
    ],
    // CRITICAL: v0 source physically lives next to a Vue 3.5 copy. Without
    // deduping, `import * as Vue from 'vue'` inside v0 would walk up to that
    // 3.5 install and the Vapor-only branch in utilities/instance.ts would
    // never fire. Force every Vue runtime package to the single 3.6 copy.
    dedupe: [
      'vue',
      '@vue/runtime-core',
      '@vue/runtime-dom',
      '@vue/runtime-vapor',
      '@vue/reactivity',
      '@vue/shared',
    ],
  },
  // v0 source references __DEV__/__VERSION__/__VITE_LOGGER_ENABLED__ (mirror
  // packages/0); the inlined Vue esm-bundler builds reference __DEV__ and the
  // __VUE_*__ feature flags. All must be replaced at transform time or the
  // externalized/transformed runtime throws on undefined globals.
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
    __VERSION__: '"0.0.0-vapor"',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['test/**/*.test.ts'],
    testTimeout: 20_000,
    server: {
      deps: {
        // Vapor symbols (defineVaporComponent, createVaporApp, …) are only
        // re-exported from Vue's ESM-bundler build. Externalized in Node,
        // `vue` resolves to the CJS entry which lacks them. Inlining forces
        // Vite to transform the runtime via the `import` condition.
        inline: [/^vue$/, /vue\/dist\//, /@vue\//],
      },
    },
  },
})

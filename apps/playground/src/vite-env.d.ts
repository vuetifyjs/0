/// <reference types="vite/client" />
/// <reference types="vue-router/auto" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

interface ImportMetaEnv {
  /** Docs origin that hosts `/registry/*` (default https://0.vuetifyjs.com). */
  readonly VITE_REGISTRY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Injected by apps/playground/vite.config.ts from build-meta.ts. */
declare const __PLAY_VERSION__: string
declare const __PLAY_COMMIT__: string
declare const __PLAY_COMMIT_FULL__: string
declare const __PLAY_DIRTY__: boolean
declare const __PLAY_BUILT__: string
declare const __PLAY_VUE__: string
declare const __PLAY_V0__: string
declare const __PLAY_GENESIS__: string

declare module '*.md' {
  // Types
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

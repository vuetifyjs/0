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

declare module '*.md' {
  // Types
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

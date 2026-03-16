/// <reference types="vite/client" />
/// <reference types="vue-router/auto" />
/// <reference types="vite-plugin-vue-layouts-next/client" />

declare module '*.md' {
  // Types
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

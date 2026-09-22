/// <reference types="vite/client" />

declare module 'virtual:uno.css'

// Compile-time constants — mirrors the `define` block in vite.config.ts. The v0
// sources typechecked through this app expect them to be declared.
declare const __DEV__: boolean | undefined
declare const __VERSION__: string | undefined
declare const __VITE_LOGGER_ENABLED__: string | undefined

// Utilities
import { useStore, useVueImportMap } from '@vue/repl'
import { computed, shallowRef } from 'vue'

// Types
import type { ReplStore } from '@vue/repl'
import type { ComputedRef, Ref } from 'vue'

export interface EditorStoreReturn {
  store: ReplStore
  replTheme: ComputedRef<'dark' | 'light'>
  previewOptions: ComputedRef<{ headHTML: string }>
}

export function useEditorStore (isDark: Readonly<Ref<boolean>>): EditorStoreReturn {
  const replTheme = computed(() => isDark.value ? 'dark' : 'light')

  const { importMap: builtinImportMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  const importMap = computed(() => ({
    imports: {
      ...builtinImportMap.value?.imports,
      '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
    },
  }))

  const store = useStore({
    builtinImportMap: importMap,
    vueVersion,
    showOutput: shallowRef(true),
  })

  // Wind4 preflight reset + @property defaults.
  // The UnoCSS runtime doesn't inject preflights or @property rules,
  // so we provide the essential reset and opacity defaults that
  // color-mix() based utilities (border-divider, bg-surface, etc.) rely on.
  const previewHead = computed(() => `<style>
    @property --un-border-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-bg-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-text-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-shadow-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-ring-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-divide-opacity { syntax: "<percentage>"; inherits: false; initial-value: 100% }
    @property --un-border-style { syntax: "*"; inherits: false; initial-value: solid }
    *, ::before, ::after, ::backdrop { box-sizing: border-box; margin: 0; padding: 0; border: 0 solid }
    html, :host { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; -webkit-tap-highlight-color: transparent }
    body { margin: 0; background-color: var(--v0-background, ${isDark.value ? '#121212' : '#ffffff'}) }
    #app { min-height: 100vh; opacity: 0 }
    button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer }
    *:focus-visible { outline: 2px solid var(--v0-primary); outline-offset: 2px }
    dialog::backdrop { background: rgb(0 0 0 / 0.3) }
  </style>`)

  const previewOptions = computed(() => ({ headHTML: previewHead.value }))

  return {
    store,
    replTheme,
    previewOptions,
  }
}

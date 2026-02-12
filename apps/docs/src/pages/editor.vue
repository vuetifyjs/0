<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useTheme } from '@vuetify/v0'

  // Utilities
  import { Repl, useStore, useVueImportMap } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import { computed, onMounted, ref, shallowRef } from 'vue'
  import '@vue/repl/style.css'

  // Data
  import { DEFAULT_CODE } from '@/data/editor-defaults'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  useHead({
    title: 'Editor - Vuetify0',
    meta: [
      { key: 'description', name: 'description', content: 'Interactive code editor for @vuetify/v0 composables and components' },
    ],
  })

  const theme = useTheme()
  const isDark = computed(() => theme.isDark.value)
  const replTheme = computed(() => isDark.value ? 'dark' : 'light')

  const { importMap: builtinImportMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  const importMap = computed(() => ({
    imports: {
      ...builtinImportMap.value?.imports,
      '@vuetify/v0': 'https://esm.sh/@vuetify/v0',
    },
  }))

  const store = useStore({
    builtinImportMap: importMap,
    vueVersion,
    showOutput: ref(true),
  })

  const isReady = shallowRef(false)

  onMounted(() => {
    store.setFiles({ 'App.vue': DEFAULT_CODE }, 'App.vue')
    isReady.value = true
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex items-center justify-between px-4 py-2 border-b border-divider">
      <RouterLink
        class="flex items-center gap-2 text-on-surface no-underline text-sm font-medium"
        to="/"
      >
        <span class="text-lg">←</span>
        <span>Back</span>
      </RouterLink>

      <span class="text-sm font-semibold text-on-surface">v0 Editor</span>

      <div class="w-16" />
    </div>

    <div v-if="isReady" class="editor-repl" :class="{ dark: isDark }">
      <Repl
        :auto-resize="true"
        :clear-console="true"
        :editor="Monaco"
        layout="horizontal"
        :preview-theme="true"
        :show-compile-output="false"
        :show-import-map="false"
        :show-ts-config="false"
        :store="store"
        :theme="replTheme"
      />
    </div>
  </div>
</template>

<style scoped>
  .editor-repl {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .editor-repl :deep(.vue-repl) {
    position: absolute;
    inset: 0;
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  /* Hide file tabs (single file mode) */
  .editor-repl :deep(.tab-buttons) {
    display: none !important;
  }

  /* Hide editor floating toggles (auto-save / show error) */
  .editor-repl :deep(.editor-floating) {
    display: none !important;
  }

  /* Give editor panel more space */
  .editor-repl :deep(.left) {
    flex: 1.2 !important;
  }

  .editor-repl :deep(.right) {
    flex: 0.8 !important;
  }

  /* Dark theme overrides for @vue/repl */
  .editor-repl.dark :deep(.vue-repl) {
    --bg: #1a1a1a;
    --bg-soft: #242424;
    --border: #383838;
    --text-light: #aaa;
  }
</style>

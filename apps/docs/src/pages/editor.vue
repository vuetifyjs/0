<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'

  // Utilities
  import { Repl, useStore, useVueImportMap } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import { computed, onMounted, shallowRef } from 'vue'
  import '@vue/repl/style.css'

  // Data
  import { DEFAULT_CODE, MAIN_TS, UNO_CONFIG_TS } from '@/data/editor-defaults'

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

  // ── Theme ──────────────────────────────────────────────────────────────
  const theme = useTheme()
  const isDark = computed(() => theme.isDark.value)
  const replTheme = computed(() => isDark.value ? 'dark' : 'light')

  // ── REPL Setup ─────────────────────────────────────────────────────────
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

  const previewHead = '<style>body{margin:0}#app{min-height:100vh}</style>'

  const isReady = shallowRef(false)
  const sidebarOpen = shallowRef(true)

  onMounted(async () => {
    await store.setFiles(
      {
        'src/main.ts': MAIN_TS,
        'src/uno.config.ts': UNO_CONFIG_TS,
        'src/App.vue': DEFAULT_CODE,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    store.setActive('src/App.vue')
    isReady.value = true
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
      <div class="flex items-center gap-3">
        <RouterLink
          aria-label="Back to docs"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Back to docs"
          to="/"
        >
          <AppIcon icon="arrow-left" :size="18" />
        </RouterLink>

        <span class="text-sm font-semibold text-on-surface">v0 Editor</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          aria-label="Toggle sidebar"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle sidebar"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon icon="menu" :size="18" />
        </button>

        <AppThemeToggle />
      </div>
    </header>

    <!-- REPL Editor -->
    <Transition name="fade">
      <div v-if="isReady" class="editor-repl flex-1 min-h-0 p-2" :class="{ dark: isDark }">
        <div class="editor-wrapper">
          <EditorFileTree v-if="sidebarOpen" :store="store" />

          <div class="editor-repl-container flex flex-col">
            <EditorTabs :store="store" />
            <EditorBreadcrumbs :store="store" />

            <Repl
              :auto-resize="true"
              class="flex-1 min-h-0"
              :clear-console="true"
              :editor="Monaco"
              layout="horizontal"
              :preview-options="{ headHTML: previewHead }"
              :preview-theme="true"
              :show-compile-output="false"
              :show-import-map="false"
              :show-ts-config="false"
              :store="store"
              :theme="replTheme"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .editor-repl {
    overflow: hidden;
  }

  .editor-wrapper {
    display: flex;
    height: 100%;
    border-radius: 8px;
    border: 1px solid var(--v0-divider);
    overflow: hidden;
  }

  .editor-repl-container {
    flex: 1;
    min-width: 0;
  }

  .editor-repl :deep(.vue-repl) {
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  /* Hide editor floating toggles (auto-save / show error) */
  .editor-repl :deep(.editor-floating) {
    display: none !important;
  }

  /* Hide REPL's built-in file tabs */
  .editor-repl :deep(.file-selector) {
    display: none !important;
  }

  /* Dark theme overrides for @vue/repl */
  .editor-repl.dark :deep(.vue-repl) {
    --bg: var(--v0-background);
    --bg-soft: var(--v0-surface);
    --border: var(--v0-divider);
    --text-light: var(--v0-on-surface-variant);
  }

  /* Fade on mount */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>

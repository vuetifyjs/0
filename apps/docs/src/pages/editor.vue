<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useEventListener, useHotkey, useStorage, useTheme, useToggleScope } from '@vuetify/v0'

  // Components
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorExamples from '@/components/editor/EditorExamples.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'

  // Composables
  import { decodeEditorHash } from '@/composables/editorLink'

  // Utilities
  import { Repl, useStore, useVueImportMap } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  import { computed, onMounted, shallowRef, watchEffect } from 'vue'

  // Data
  import { createMainTs, DEFAULT_CODE, UNO_CONFIG_TS } from '@/data/editor-defaults'

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
    body { margin: 0; background-color: ${isDark.value ? '#121212' : '#ffffff'} }
    #app { min-height: 100vh; opacity: 0; transition: opacity 0.15s }
    button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer }
    *:focus-visible { outline: 2px solid var(--v0-primary); outline-offset: 2px }
    dialog::backdrop { background: rgb(0 0 0 / 0.3) }
  </style>`)

  const previewOptions = computed(() => ({ headHTML: previewHead.value }))

  const isReady = shallowRef(false)
  const sidebarOpen = shallowRef(true)
  useHotkey('ctrl+b', () => {
    sidebarOpen.value = !sidebarOpen.value
  }, { inputs: true })
  const showExamples = shallowRef(false)
  const fileTreeKey = shallowRef(0)
  const editorTabs = shallowRef<InstanceType<typeof EditorTabs> | null>(null)
  const hasTabs = computed(() => editorTabs.value?.hasTabs ?? true)

  // ── Sidebar resize ─────────────────────────────────────────────────────
  const storage = useStorage()
  const sidebarWidth = storage.get<number>('editor-sidebar-width', 250)
  const isResizing = shallowRef(false)
  const resizeStartX = shallowRef(0)
  const resizeStartWidth = shallowRef(0)

  function onResizeStart (e: PointerEvent) {
    e.preventDefault()
    resizeStartX.value = e.clientX
    resizeStartWidth.value = sidebarWidth.value
    isResizing.value = true
  }

  useToggleScope(() => isResizing.value, () => {
    useEventListener(document, 'pointermove', (e: PointerEvent) => {
      sidebarWidth.value = Math.max(140, Math.min(400, resizeStartWidth.value + e.clientX - resizeStartX.value))
    })
    useEventListener(document, 'pointerup', () => {
      isResizing.value = false
    })
  })

  // Map nested file paths to their flat alias paths (e.g. src/dir/Foo.vue → src/Foo.vue)
  // so edits to nested files propagate to the alias the REPL uses for imports
  const aliasMap = shallowRef(new Map<string, string>())

  onMounted(async () => {
    const hash = window.location.hash.slice(1)
    const decoded = hash ? decodeEditorHash(hash) : null

    if (decoded) {
      await loadExample(decoded)
    } else {
      await store.setFiles(
        {
          'src/main.ts': createMainTs(isDark.value ? 'dark' : 'light'),
          'src/uno.config.ts': UNO_CONFIG_TS,
          'src/App.vue': DEFAULT_CODE,
        },
        'src/main.ts',
      )
      store.files['src/main.ts']!.hidden = true
      store.files['src/uno.config.ts']!.hidden = true
      store.setActive('src/App.vue')
    }

    isReady.value = true
  })

  async function loadExample (files: Record<string, string>) {
    showExamples.value = false

    // Create hidden flat aliases for nested files so the REPL's runtime
    // import resolution works. The REPL resolves all `./X` as `src/X`,
    // so `src/dir/Foo.vue` needs a hidden `src/Foo.vue` alias.
    const aliases: Record<string, string> = {}
    const nextAliasMap = new Map<string, string>()

    for (const [path, code] of Object.entries(files)) {
      const rel = path.replace(/^src\//, '')
      const parts = rel.split('/')
      if (parts.length > 1) {
        const flatPath = `src/${parts.at(-1)}`
        if (!files[flatPath]) {
          aliases[flatPath] = code
          nextAliasMap.set(path, flatPath)
        }
      }
    }

    aliasMap.value = nextAliasMap

    await store.setFiles(
      {
        'src/main.ts': createMainTs(isDark.value ? 'dark' : 'light'),
        'src/uno.config.ts': UNO_CONFIG_TS,
        ...files,
        ...aliases,
      },
      'src/main.ts',
    )
    store.files['src/main.ts']!.hidden = true
    store.files['src/uno.config.ts']!.hidden = true
    for (const key of Object.keys(aliases)) {
      if (store.files[key]) store.files[key]!.hidden = true
    }

    // Activate the first user file, not the generated App.vue wrapper
    const userFile = Object.keys(files).find(f => f !== 'src/App.vue') ?? 'src/App.vue'
    store.setActive(userFile)
    fileTreeKey.value++
  }

  // Sync edits from nested files to their flat aliases
  watchEffect(() => {
    const file = store.activeFile
    const flatPath = aliasMap.value.get(file.filename)
    if (flatPath && store.files[flatPath]) {
      store.files[flatPath]!.code = file.code
    }
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

        <img
          alt="Vuetify Play"
          class="h-8"
          :src="isDark
            ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
            : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
        >
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            aria-label="Load example"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            title="Load example"
            @click="showExamples = !showExamples"
          >
            <AppIcon icon="examples" :size="18" />
          </button>

          <div
            v-if="showExamples"
            class="fixed inset-0 z-40"
            @click="showExamples = false"
          />

          <div
            v-if="showExamples"
            class="absolute top-full right-0 mt-1 w-[280px] bg-surface border border-divider rounded-lg shadow-lg z-50"
          >
            <EditorExamples @select="loadExample" />
          </div>
        </div>

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
      <div v-if="isReady" class="editor-repl flex-1 min-h-0 px-2 pt-2" :class="{ dark: isDark }">
        <div class="editor-wrapper" :class="{ 'select-none': isResizing }">
          <EditorFileTree
            v-if="sidebarOpen"
            :key="fileTreeKey"
            :store="store"
            :style="{ width: `${sidebarWidth}px` }"
          />

          <div
            v-if="sidebarOpen"
            class="editor-resize-handle"
            :class="{ 'editor-resize-handle--active': isResizing }"
            @dblclick="sidebarWidth = 250"
            @pointerdown="onResizeStart"
          />

          <div class="editor-repl-container flex flex-col">
            <EditorTabs ref="editorTabs" :store="store" />
            <EditorBreadcrumbs v-if="hasTabs" :store="store" />

            <Repl
              v-show="hasTabs"
              :auto-resize="true"
              class="flex-1 min-h-0"
              :class="{ 'pointer-events-none': isResizing }"
              :clear-console="true"
              :editor="Monaco"
              layout="horizontal"
              :preview-options="previewOptions"
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
    border-radius: 8px 8px 0 0;
    border: 1px solid var(--v0-divider);
    border-bottom: none;
    overflow: hidden;
  }

  .editor-resize-handle {
    width: 4px;
    cursor: col-resize;
    background: transparent;
    transition: background 0.15s;
    flex-shrink: 0;
  }

  .editor-resize-handle:hover,
  .editor-resize-handle--active {
    background: var(--v0-primary);
  }

  .editor-repl-container {
    flex: 1;
    min-width: 0;
  }

  .editor-repl :deep(.vue-repl) {
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  /* Ensure editor fills available height */
  .editor-repl :deep(.editor-container) {
    height: 100%;
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

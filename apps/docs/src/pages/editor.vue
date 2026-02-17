<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { clamp, useBreakpoints, useClickOutside, useEventListener, useHotkey, useStack, useStorage, useTheme, useToggleScope } from '@vuetify/v0'

  // Components
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorExamples from '@/components/editor/EditorExamples.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'

  // Composables
  import { useEditorFiles } from '@/composables/useEditorFiles'
  import { useEditorStore } from '@/composables/useEditorStore'

  // Utilities
  import { Repl } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  import { shallowRef, useTemplateRef, watch } from 'vue'

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
  const isDark = theme.isDark

  // ── REPL Setup ─────────────────────────────────────────────────────────
  const { store, replTheme, previewOptions } = useEditorStore(isDark)

  // ── Editor files ─────────────────────────────────────────────────────
  const { isReady, fileTreeKey, loadExample: _loadExample } = useEditorFiles(store, () => isDark.value)

  const breakpoints = useBreakpoints()
  const isDesktop = breakpoints.mdAndUp
  const sidebarOpen = shallowRef(true)
  watch(isDesktop, v => {
    sidebarOpen.value = v
  })

  const stack = useStack()
  const ticket = stack.register({
    onDismiss: () => {
      sidebarOpen.value = false
    },
  })
  watch(() => sidebarOpen.value && !isDesktop.value, open => {
    if (open) ticket.select()
    else ticket.unselect()
  })

  useHotkey('ctrl+b', () => {
    sidebarOpen.value = !sidebarOpen.value
  }, { inputs: true })
  const showExamples = shallowRef(false)
  const examplesContainer = useTemplateRef<HTMLElement>('examplesContainer')
  const examplesButton = useTemplateRef<HTMLButtonElement>('examplesButton')

  useToggleScope(() => showExamples.value, () => {
    useClickOutside(examplesContainer, () => {
      showExamples.value = false
      examplesButton.value?.focus()
    })
    useHotkey('escape', () => {
      showExamples.value = false
      examplesButton.value?.focus()
    })
  })

  async function loadExample (files: Record<string, string>) {
    showExamples.value = false
    await _loadExample(files)
  }

  // ── Persistent settings ────────────────────────────────────────────────
  const storage = useStorage()
  const replLayout = storage.get<'horizontal' | 'vertical'>('editor-layout', 'horizontal')
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
      sidebarWidth.value = clamp(resizeStartWidth.value + e.clientX - resizeStartX.value, 140, 400)
    })
    useEventListener(document, 'pointerup', () => {
      isResizing.value = false
    })
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
        <RouterLink
          aria-label="Tutorial"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Tutorial"
          to="/skillz/tutorial/vue-basics"
        >
          <AppIcon icon="book" :size="18" />
        </RouterLink>

        <div ref="examplesContainer" class="relative">
          <button
            ref="examplesButton"
            :aria-expanded="showExamples"
            aria-haspopup="listbox"
            aria-label="Load example"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            title="Load example"
            @click="showExamples = !showExamples"
          >
            <AppIcon icon="examples" :size="18" />
          </button>

          <div
            v-if="showExamples"
            aria-label="Examples"
            class="absolute top-full right-0 mt-1 w-[280px] bg-surface border border-divider rounded-lg shadow-lg z-50"
            role="listbox"
          >
            <EditorExamples @select="loadExample" />
          </div>
        </div>

        <button
          v-if="isDesktop"
          :aria-label="replLayout === 'horizontal' ? 'Switch to vertical layout' : 'Switch to horizontal layout'"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          :title="replLayout === 'horizontal' ? 'Switch to vertical layout' : 'Switch to horizontal layout'"
          @click="replLayout = replLayout === 'horizontal' ? 'vertical' : 'horizontal'"
        >
          <AppIcon :icon="replLayout === 'horizontal' ? 'layout-vertical' : 'layout-horizontal'" :size="18" />
        </button>

        <button
          v-if="!isDesktop"
          :aria-expanded="sidebarOpen"
          :aria-label="sidebarOpen ? 'Close file browser' : 'Open file browser'"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle files"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon icon="folder" :size="18" />
        </button>

        <button
          v-if="isDesktop"
          :aria-expanded="sidebarOpen"
          :aria-label="sidebarOpen ? 'Close sidebar' : 'Open sidebar'"
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
          <!-- Desktop: inline sidebar -->
          <template v-if="isDesktop">
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
          </template>

          <!-- Mobile: fixed overlay -->
          <div
            v-if="!isDesktop && sidebarOpen"
            aria-label="File browser"
            class="fixed top-0 bottom-0 left-0 w-[260px] flex flex-col bg-surface"
            role="dialog"
            :style="{ zIndex: ticket.zIndex.value }"
          >
            <div class="flex items-center justify-end px-2 py-1">
              <button
                aria-label="Close file browser"
                class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
                @click="sidebarOpen = false"
              >
                <AppIcon icon="close" :size="18" />
              </button>
            </div>

            <EditorFileTree
              :key="fileTreeKey"
              class="flex-1 min-h-0"
              :store="store"
            />
          </div>

          <div class="editor-repl-container flex flex-col" :inert="!isDesktop && sidebarOpen ? true : undefined">
            <EditorTabs :store="store" />
            <EditorBreadcrumbs :store="store" />

            <Repl
              :auto-resize="true"
              class="flex-1 min-h-0"
              :class="{ 'pointer-events-none': isResizing }"
              :clear-console="true"
              :editor="Monaco"
              :layout="replLayout"
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

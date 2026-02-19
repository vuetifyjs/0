<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useBreakpoints, useClickOutside, useHotkey, useStack, useStorage, useTheme, useToggleScope } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorExamples from '@/components/editor/EditorExamples.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorIntroPanel from '@/components/editor/EditorIntroPanel.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'
  import EditorWorkspace from '@/components/editor/EditorWorkspace.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useEditorFiles } from '@/composables/useEditorFiles'
  import { useEditorStore } from '@/composables/useEditorStore'
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
  import { Repl } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  import { computed, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  definePage({
    meta: {
      layout: 'fullscreen',
      level: 1,
    },
  })

  useHead({
    title: 'Playground - Vuetify0',
    meta: [
      { key: 'description', name: 'description', content: 'Interactive code playground for @vuetify/v0 composables and components' },
    ],
  })

  // ── Back navigation ────────────────────────────────────────────────────
  // Vue Router 4 stores the previous path in history.state.back. Use it so
  // the back button returns the user to wherever they came from in the app.
  const router = useRouter()
  const backTo = computed(() => (router.currentRoute.value.redirectedFrom?.fullPath ?? window.history.state?.back) || '/')

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

  // ── Intro panel ───────────────────────────────────────────────────────
  const discovery = useDiscovery()

  // ── Persistent settings ────────────────────────────────────────────────
  const storage = useStorage()
  const replLayout = storage.get<'horizontal' | 'vertical'>('editor-layout', 'horizontal')
  const panelOpen = storage.get<boolean>('editor-panel-open', false)

  // Open panel when a tour becomes active or reaches the intro-panel step
  watch(discovery.isActive, active => {
    if (active) panelOpen.value = true
  })
  watch(discovery.selectedId, id => {
    if (id === 'intro-panel') panelOpen.value = true
  })

  // Panel resize (panel mode)
  const panelHandle = useResizeHandle({
    storageKey: 'editor-intro-width',
    defaultValue: 420,
    min: 280,
    max: 600,
    direction: 'horizontal',
  })

  // Sidebar resize (normal mode, desktop)
  const sidebarHandle = useResizeHandle({
    storageKey: 'editor-sidebar-width',
    defaultValue: 250,
    min: 140,
    max: 400,
    direction: 'horizontal',
  })

  const isPanelMode = computed(() => isDesktop.value && panelOpen.value)

  // EditorWorkspace renders Sandbox separately. showOutput=false prevents Repl from creating
  // its internal preview iframe (see patches/@vue__repl@4.7.1.patch), avoiding a duplicate
  // sandbox and the browser's allow-scripts+allow-same-origin warning.
  watch(isPanelMode, mode => {
    store.showOutput = !mode
  }, { immediate: true })
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
      <div class="flex items-center gap-3">
        <RouterLink
          aria-label="Go back"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Go back"
          :to="backTo"
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
        <Discovery.Activator as="span" class="inline-flex rounded" step="panel-toggle">
          <button
            :aria-expanded="panelOpen"
            :aria-label="panelOpen ? 'Close intro panel' : 'Open intro panel'"
            class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
            :title="panelOpen ? 'Close intro panel' : 'Open intro panel'"
            @click="panelOpen = !panelOpen"
          >
            <AppIcon icon="info" :size="18" />
          </button>
        </Discovery.Activator>

        <Discovery.Activator as="div" class="relative rounded" step="examples">
          <div ref="examplesContainer">
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
        </Discovery.Activator>

        <button
          v-if="!isPanelMode"
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

    <Transition name="fade">
      <div v-if="isReady" class="flex-1 min-h-0 overflow-hidden">
        <!-- Panel mode: intro panel + workspace (tutorial-style split) -->
        <div
          v-if="isPanelMode"
          class="flex h-full"
          :class="{ 'select-none': panelHandle.isResizing.value }"
        >
          <Discovery.Activator
            active-class="rounded-lg"
            as="div"
            class="shrink-0 border-r border-divider"
            step="intro-panel"
            :style="{ width: `${panelHandle.size.value}px` }"
          >
            <EditorIntroPanel @close="panelOpen = false" />
          </Discovery.Activator>

          <div
            class="editor-resize-handle"
            :class="{ 'editor-resize-handle--active': panelHandle.isResizing.value }"
            @dblclick="panelHandle.reset()"
            @pointerdown="panelHandle.onPointerDown"
          />

          <EditorWorkspace
            :external-resizing="panelHandle.isResizing.value"
            :file-tree-key="fileTreeKey"
            :is-dark="isDark"
            :is-desktop="isDesktop"
            :preview-options="previewOptions"
            :repl-theme="replTheme"
            :sidebar-open="sidebarOpen"
            :store="store"
          />
        </div>

        <!-- Normal mode: bordered editor with built-in Repl preview -->
        <div
          v-else
          class="editor-repl h-full px-2 pt-2"
          :class="{ dark: isDark }"
        >
          <div
            class="editor-wrapper"
            :class="{ 'select-none': sidebarHandle.isResizing.value }"
          >
            <!-- Desktop: file tree -->
            <template v-if="isDesktop">
              <Discovery.Activator
                v-if="sidebarOpen"
                active-class="rounded-lg"
                as="div"
                step="file-tree"
                :style="{ width: `${sidebarHandle.size.value}px` }"
              >
                <EditorFileTree
                  :key="fileTreeKey"
                  :store="store"
                />
              </Discovery.Activator>

              <div
                v-if="sidebarOpen"
                class="editor-resize-handle"
                :class="{ 'editor-resize-handle--active': sidebarHandle.isResizing.value }"
                @dblclick="sidebarHandle.reset()"
                @pointerdown="sidebarHandle.onPointerDown"
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

            <Discovery.Activator
              active-class="rounded-lg"
              as="div"
              class="editor-repl-container flex flex-col"
              :inert="!isDesktop && sidebarOpen ? true : undefined"
              step="editor"
            >
              <EditorTabs :store="store" />
              <EditorBreadcrumbs :store="store" />

              <Repl
                :auto-resize="true"
                class="flex-1 min-h-0"
                :class="{ 'pointer-events-none': sidebarHandle.isResizing.value }"
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
            </Discovery.Activator>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  /* Panel → workspace resize handle */
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

  /* Normal mode: bordered wrapper */
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

  .editor-repl-container {
    flex: 1;
    min-width: 0;
  }

  .editor-repl :deep(.vue-repl) {
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  .editor-repl :deep(.editor-container) {
    height: 100%;
  }

  .editor-repl :deep(.editor-floating) {
    display: none !important;
  }

  .editor-repl :deep(.file-selector) {
    display: none !important;
  }

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

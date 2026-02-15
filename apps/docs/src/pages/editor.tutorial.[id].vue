<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { clamp, useBreakpoints, useDocumentEventListener, useStorage, useToggleScope } from '@vuetify/v0'

  // Components
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorMarkdownPanel from '@/components/editor/EditorMarkdownPanel.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'

  // Composables
  import { useParams } from '@/composables/useRoute'
  import { useTutorial } from '@/composables/useTutorial'

  // Utilities
  import { Repl, Sandbox } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  import { computed, shallowRef, type ShallowRef, watch } from 'vue'

  definePage({
    meta: {
      layout: 'fullscreen',
    },
  })

  const params = useParams<{ id: string }>()
  const tutorialId = computed(() => params.value.id)

  const {
    store,
    isDark,
    replTheme,
    previewOptions,
    html,
    stepLabel,
    isFirst,
    isLast,
    isReady,
    fileTreeKey,
    nextStep,
    prevStep,
  } = useTutorial(tutorialId)

  // Hide the Repl's built-in preview — we render Sandbox separately
  store.showOutput = false

  useHead({
    title: computed(() => `Tutorial - Vuetify0`),
  })

  const breakpoints = useBreakpoints()
  const isDesktop = computed(() => breakpoints.mdAndUp.value)
  const sidebarOpen = shallowRef(true)
  watch(isDesktop, v => {
    sidebarOpen.value = v
  })

  // ── Resizable panels ────────────────────────────────────────────────
  const storage = useStorage()

  function useResizeHandle (options: {
    storageKey: string
    defaultValue: number
    min: number
    max: number
    direction: 'horizontal' | 'vertical'
  }): {
    size: ShallowRef<number>
    isResizing: ShallowRef<boolean>
    onPointerDown: (e: PointerEvent) => void
    reset: () => void
  } {
    const stored = storage.get<number>(options.storageKey, options.defaultValue)
    const size = shallowRef(stored.value)
    const isResizing = shallowRef(false)
    const startPos = shallowRef(0)
    const startSize = shallowRef(0)
    const containerSize = shallowRef(0)

    function onPointerDown (e: PointerEvent) {
      e.preventDefault()
      startPos.value = options.direction === 'horizontal' ? e.clientX : e.clientY
      startSize.value = size.value
      if (options.direction === 'vertical') {
        containerSize.value = (e.target as HTMLElement).parentElement?.offsetHeight ?? 1
      }
      isResizing.value = true
    }

    let rafId = 0

    useToggleScope(() => isResizing.value, () => {
      useDocumentEventListener('pointermove', (e: PointerEvent) => {
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          const pos = options.direction === 'horizontal' ? e.clientX : e.clientY
          const delta = pos - startPos.value
          size.value = options.direction === 'vertical' ? clamp(startSize.value + (delta / containerSize.value) * 100, options.min, options.max) : clamp(startSize.value + delta, options.min, options.max)
          rafId = 0
        })
      })
      useDocumentEventListener('pointerup', () => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
        stored.value = size.value
        isResizing.value = false
      })
    })

    function reset () {
      size.value = options.defaultValue
      stored.value = options.defaultValue
    }

    return { size, isResizing, onPointerDown, reset }
  }

  const markdownHandle = useResizeHandle({
    storageKey: 'tutorial-markdown-width', defaultValue: 350, min: 200, max: 600, direction: 'horizontal',
  })
  const splitHandle = useResizeHandle({
    storageKey: 'tutorial-split-percent', defaultValue: 50, min: 20, max: 80, direction: 'vertical',
  })
  const fileTreeHandle = useResizeHandle({
    storageKey: 'tutorial-filetree-width', defaultValue: 200, min: 140, max: 400, direction: 'horizontal',
  })

  const anyResizing = computed(() =>
    markdownHandle.isResizing.value || splitHandle.isResizing.value || fileTreeHandle.isResizing.value,
  )
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface shrink-0">
      <div class="flex items-center gap-3">
        <RouterLink
          aria-label="Back to editor"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors no-underline text-on-surface"
          title="Back to editor"
          to="/editor"
        >
          <AppIcon icon="arrow-left" :size="18" />
        </RouterLink>

        <span class="text-sm font-medium text-on-surface">Tutorial</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="!isDesktop"
          aria-label="Toggle files"
          class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
          title="Toggle files"
          @click="sidebarOpen = !sidebarOpen"
        >
          <AppIcon icon="folder" :size="18" />
        </button>

        <button
          v-if="isDesktop"
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

    <!-- Tutorial layout -->
    <Transition name="fade">
      <div
        v-if="isReady"
        class="flex-1 min-h-0 flex overflow-hidden"
        :class="[
          { dark: isDark, 'select-none': anyResizing },
          isDesktop ? 'flex-row' : 'flex-col',
        ]"
      >
        <!-- Markdown panel -->
        <div
          class="tutorial-markdown-panel overflow-hidden shrink-0"
          :class="isDesktop ? 'border-r border-divider' : 'border-b border-divider max-h-[40vh]'"
          :style="isDesktop ? { width: `${markdownHandle.size.value}px` } : undefined"
        >
          <EditorMarkdownPanel
            :html="html"
            :is-first="isFirst"
            :is-last="isLast"
            :step-label="stepLabel"
            @next="nextStep"
            @prev="prevStep"
          />
        </div>

        <!-- Markdown ↔ Right column handle -->
        <div
          v-if="isDesktop"
          class="tutorial-resize-handle tutorial-resize-handle--col"
          :class="{ 'tutorial-resize-handle--active': markdownHandle.isResizing.value }"
          @dblclick="markdownHandle.reset()"
          @pointerdown="markdownHandle.onPointerDown"
        />

        <!-- Right column -->
        <div class="flex flex-col flex-1 min-w-0 min-h-0">
          <!-- Editor area -->
          <div
            class="flex min-h-0 min-w-0 overflow-hidden"
            :style="isDesktop ? { height: `${splitHandle.size.value}%` } : { flex: '1' }"
          >
            <EditorFileTree
              v-if="sidebarOpen && isDesktop"
              :key="fileTreeKey"
              class="shrink-0"
              :store="store"
              :style="{ width: `${fileTreeHandle.size.value}px` }"
            />

            <!-- File tree ↔ Editor handle -->
            <div
              v-if="sidebarOpen && isDesktop"
              class="tutorial-resize-handle tutorial-resize-handle--col"
              :class="{ 'tutorial-resize-handle--active': fileTreeHandle.isResizing.value }"
              @dblclick="fileTreeHandle.reset()"
              @pointerdown="fileTreeHandle.onPointerDown"
            />

            <div
              class="tutorial-repl-wrapper flex flex-col flex-1 min-w-0 editor-repl"
              :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
            >
              <EditorTabs :store="store" />
              <EditorBreadcrumbs :store="store" />

              <Repl
                :auto-resize="true"
                class="flex-1 min-h-0"
                :clear-console="true"
                :editor="Monaco"
                layout="horizontal"
                :preview-options="previewOptions"
                :show-compile-output="false"
                :show-import-map="false"
                :show-ts-config="false"
                :store="store"
                :theme="replTheme"
              />
            </div>
          </div>

          <!-- Editor ↔ Preview handle -->
          <div
            v-if="isDesktop"
            class="tutorial-resize-handle tutorial-resize-handle--row"
            :class="{ 'tutorial-resize-handle--active': splitHandle.isResizing.value }"
            @dblclick="splitHandle.reset()"
            @pointerdown="splitHandle.onPointerDown"
          />

          <!-- Preview area -->
          <div
            class="tutorial-preview flex-1 min-w-0 min-h-0 editor-repl overflow-hidden"
            :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
          >
            <Sandbox
              :clear-console="false"
              :preview-options="previewOptions"
              :show="true"
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
  /* Resize handles */
  .tutorial-resize-handle {
    flex-shrink: 0;
    background: transparent;
    transition: background 0.15s;
  }

  .tutorial-resize-handle:hover,
  .tutorial-resize-handle--active {
    background: var(--v0-primary);
  }

  .tutorial-resize-handle--col {
    width: 4px;
    cursor: col-resize;
  }

  .tutorial-resize-handle--row {
    height: 4px;
    cursor: row-resize;
  }

  /* REPL theme variables */
  .editor-repl :deep(.vue-repl) {
    --header-height: 0px;
    --color-branding: var(--v0-primary);
    --color-branding-dark: var(--v0-primary);
  }

  .editor-repl.dark :deep(.vue-repl) {
    --bg: var(--v0-background);
    --bg-soft: var(--v0-surface);
    --border: var(--v0-divider);
    --text-light: var(--v0-on-surface-variant);
  }

  /* Hide REPL's built-in file tabs */
  .editor-repl :deep(.file-selector) {
    display: none !important;
  }

  /* Hide editor floating toggles */
  .editor-repl :deep(.editor-floating) {
    display: none !important;
  }

  /* Hide the Repl's preview pane — we render Sandbox separately */
  .tutorial-repl-wrapper :deep(.split-pane .right) {
    display: none !important;
  }

  .tutorial-repl-wrapper :deep(.split-pane .left) {
    width: 100% !important;
  }

  /* Hide the SplitPane divider */
  .tutorial-repl-wrapper :deep(.split-pane .divider) {
    display: none !important;
  }

  /* Sandbox fills container */
  .editor-repl :deep(.vue-repl),
  .editor-repl :deep(.iframe-container),
  .editor-repl :deep(iframe) {
    width: 100%;
    height: 100%;
  }

  /* Match iframe bg to preview body to prevent flash between steps */
  .tutorial-preview :deep(iframe) {
    background-color: var(--v0-background) !important;
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

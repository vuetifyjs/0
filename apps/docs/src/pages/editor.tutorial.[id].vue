<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'unplugin-vue-router/runtime'

  // Framework
  import { useBreakpoints } from '@vuetify/v0'

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
  import { computed, shallowRef, watch } from 'vue'

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
      <div v-if="isReady" class="tutorial-layout flex-1 min-h-0" :class="{ dark: isDark }">
        <!-- Markdown panel -->
        <div class="tutorial-markdown-panel border-r border-divider">
          <EditorMarkdownPanel
            :html="html"
            :is-first="isFirst"
            :is-last="isLast"
            :step-label="stepLabel"
            @next="nextStep"
            @prev="prevStep"
          />
        </div>

        <!-- Editor area (Repl with hidden preview) -->
        <div class="tutorial-editor-area flex flex-col min-w-0 border-b border-divider">
          <div class="flex min-h-0 flex-1">
            <EditorFileTree
              v-if="sidebarOpen && isDesktop"
              :key="fileTreeKey"
              class="w-[200px]"
              :store="store"
            />

            <div class="tutorial-repl-wrapper flex flex-col flex-1 min-w-0 editor-repl" :class="{ dark: isDark }">
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
        </div>

        <!-- Preview area (standalone Sandbox) -->
        <div class="tutorial-preview-area min-w-0 editor-repl" :class="{ dark: isDark }">
          <Sandbox
            :clear-console="false"
            :preview-options="previewOptions"
            :show="true"
            :store="store"
            :theme="replTheme"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .tutorial-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
  }

  .tutorial-markdown-panel {
    grid-row: 1 / -1;
    grid-column: 1;
    overflow: hidden;
  }

  .tutorial-editor-area {
    grid-row: 1;
    grid-column: 2;
  }

  .tutorial-preview-area {
    grid-row: 2;
    grid-column: 2;
  }

  /* Reuse REPL theme variables */
  .editor-repl :deep(.vue-repl) {
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
  .tutorial-preview-area :deep(.vue-repl),
  .tutorial-preview-area :deep(.iframe-container),
  .tutorial-preview-area :deep(iframe) {
    width: 100%;
    height: 100%;
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

  @media (max-width: 768px) {
    .tutorial-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr 1fr;
    }

    .tutorial-markdown-panel {
      grid-row: 1;
      grid-column: 1;
      max-height: 40vh;
      border-right: none;
      border-bottom: 1px solid var(--v0-divider);
    }

    .tutorial-editor-area {
      grid-row: 2;
      grid-column: 1;
    }

    .tutorial-preview-area {
      grid-row: 3;
      grid-column: 1;
    }
  }
</style>

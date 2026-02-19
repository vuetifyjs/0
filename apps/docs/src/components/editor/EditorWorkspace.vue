<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'
  import EditorBreadcrumbs from '@/components/editor/EditorBreadcrumbs.vue'
  import EditorFileTree from '@/components/editor/EditorFileTree.vue'
  import EditorTabs from '@/components/editor/EditorTabs.vue'

  // Composables
  import { useResizeHandle } from '@/composables/useResizeHandle'

  // Utilities
  import { Repl, Sandbox } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import { computed } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const props = withDefaults(defineProps<{
    store: ReplStore
    replTheme: 'dark' | 'light'
    previewOptions: { headHTML: string }
    isDark: boolean
    fileTreeKey: number
    sidebarOpen: boolean
    isDesktop: boolean
    externalResizing?: boolean
    hideFiles?: boolean
    hideTabs?: boolean
    hideBreadcrumbs?: boolean
  }>(), {
    externalResizing: false,
    hideFiles: false,
    hideTabs: false,
    hideBreadcrumbs: false,
  })

  const splitHandle = useResizeHandle({
    storageKey: 'workspace-split-percent',
    defaultValue: 50,
    min: 20,
    max: 80,
    direction: 'vertical',
  })

  const fileTreeHandle = useResizeHandle({
    storageKey: 'workspace-filetree-width',
    defaultValue: 200,
    min: 140,
    max: 400,
    direction: 'horizontal',
  })

  const anyResizing = computed(() =>
    props.externalResizing || splitHandle.isResizing.value || fileTreeHandle.isResizing.value,
  )

  const showFileTree = computed(() =>
    props.sidebarOpen && props.isDesktop && !props.hideFiles,
  )
</script>

<template>
  <div class="flex flex-col flex-1 min-w-0 min-h-0 bg-background">
    <!-- Editor area -->
    <div
      class="flex min-h-0 min-w-0 overflow-hidden"
      :style="isDesktop ? { height: `${splitHandle.size.value}%` } : { flex: '1' }"
    >
      <Discovery.Activator
        v-if="showFileTree"
        active-class="rounded-lg"
        as="div"
        class="shrink-0"
        step="file-tree"
        :style="{ width: `${fileTreeHandle.size.value}px` }"
      >
        <EditorFileTree
          :key="fileTreeKey"
          :store="store"
        />
      </Discovery.Activator>

      <!-- File tree ↔ Editor handle -->
      <div
        v-if="showFileTree"
        class="workspace-resize-handle workspace-resize-handle--col"
        :class="{ 'workspace-resize-handle--active': fileTreeHandle.isResizing.value }"
        @dblclick="fileTreeHandle.reset()"
        @pointerdown="fileTreeHandle.onPointerDown"
      />

      <Discovery.Activator
        active-class="rounded-lg"
        as="div"
        class="workspace-repl-wrapper flex flex-col flex-1 min-w-0 editor-repl"
        :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
        step="editor"
      >
        <EditorTabs v-if="!hideTabs" :store="store" />
        <EditorBreadcrumbs v-if="!hideBreadcrumbs" :store="store" />

        <Repl
          :auto-resize="true"
          class="flex-1 min-h-0"
          :clear-console="true"
          :editor="Monaco"
          :editor-options="{ monacoOptions: { padding: { top: 16 } } }"
          layout="horizontal"
          :preview-options="previewOptions"
          :show-compile-output="false"
          :show-import-map="false"
          :show-ts-config="false"
          :store="store"
          :theme="replTheme"
        />
      </Discovery.Activator>
    </div>

    <!-- Editor ↔ Preview handle -->
    <div
      v-if="isDesktop"
      class="workspace-resize-handle workspace-resize-handle--row"
      :class="{ 'workspace-resize-handle--active': splitHandle.isResizing.value }"
      @dblclick="splitHandle.reset()"
      @pointerdown="splitHandle.onPointerDown"
    />

    <!-- Preview area -->
    <Discovery.Activator
      active-class="rounded-lg"
      as="div"
      class="workspace-preview flex-1 min-w-0 min-h-0 editor-repl overflow-hidden"
      :class="{ dark: isDark, 'pointer-events-none': anyResizing, 'contain-strict': anyResizing }"
      step="preview"
    >
      <!-- auto-store-init=false: Repl already calls store.init(); a second call
           from standalone Sandbox would create duplicate watchers (double compilation,
           double builtinImportMap watches). See patches/@vue__repl@4.7.1.patch. -->
      <Sandbox
        :auto-store-init="false"
        :clear-console="false"
        :preview-options="previewOptions"
        :show="true"
        :store="store"
        :theme="replTheme"
      />
    </Discovery.Activator>
  </div>
</template>

<style scoped>
  /* Resize handles */
  .workspace-resize-handle {
    flex-shrink: 0;
    background: transparent;
    transition: background 0.15s;
  }

  .workspace-resize-handle:hover,
  .workspace-resize-handle--active {
    background: var(--v0-primary);
  }

  .workspace-resize-handle--col {
    width: 4px;
    cursor: col-resize;
  }

  .workspace-resize-handle--row {
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
  .workspace-repl-wrapper :deep(.split-pane .right) {
    display: none !important;
  }

  .workspace-repl-wrapper :deep(.split-pane .left) {
    width: 100% !important;
  }

  /* Hide the SplitPane divider */
  .workspace-repl-wrapper :deep(.split-pane .divider) {
    display: none !important;
  }

  /* Sandbox fills container */
  .editor-repl :deep(.vue-repl),
  .editor-repl :deep(.iframe-container),
  .editor-repl :deep(iframe) {
    width: 100%;
    height: 100%;
  }

  /* Match iframe bg to preview body to prevent flash */
  .workspace-preview :deep(iframe) {
    background-color: var(--v0-background) !important;
  }

  /* Disable @vue/repl's built-in fade transition on preview iframe */
  .workspace-preview :deep(.fade-enter-active),
  .workspace-preview :deep(.fade-leave-active) {
    transition: none !important;
  }
</style>

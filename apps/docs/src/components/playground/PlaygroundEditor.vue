<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Utilities
  import { Repl } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'

  // Types
  import type { ReplStore } from '@vue/repl'

  const { store, replTheme, previewOptions, isDark, anyResizing } = defineProps<{
    store: ReplStore
    replTheme: 'dark' | 'light'
    previewOptions: { headHTML: string }
    isDark: boolean
    anyResizing: boolean
  }>()
</script>

<template>
  <Discovery.Activator
    active-class="rounded-lg"
    as="div"
    class="workspace-repl-wrapper flex flex-col min-h-0 min-w-0 editor-repl"
    :class="{ dark: isDark, 'pointer-events-none': anyResizing }"
    step="editor"
  >
    <Repl
      :auto-resize="!anyResizing"
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
</template>

<style scoped>
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

  /* Hide editor floating toggles — we render Sandbox separately */
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
</style>

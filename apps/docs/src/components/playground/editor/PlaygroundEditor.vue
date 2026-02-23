<script lang="ts" setup>
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { Repl } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'

  const { store } = usePlayground()
  const theme = useTheme()
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 min-w-0 playground-repl">
    <Repl
      class="flex-1 min-h-0"
      :clear-console="true"
      :editor="Monaco"
      :editor-options="{ monacoOptions: { padding: { top: 16 } } }"
      layout="horizontal"
      :preview-options="{}"
      :show-compile-output="false"
      :show-import-map="false"
      :show-ts-config="false"
      :store
      :theme="theme.isDark.value ? 'dark' : 'light'"
    />
  </div>
</template>

<style scoped>
  /* Hide REPL's built-in file tabs */
  .playground-repl :deep(.file-selector) {
    display: none !important;
  }

  /* Hide editor floating toggles — we render Sandbox separately */
  .playground-repl :deep(.editor-floating) {
    display: none !important;
  }

  /* Hide the Repl's preview pane — we render Sandbox separately */
  .playground-repl :deep(.split-pane .right) {
    display: none !important;
  }

  .playground-repl :deep(.split-pane .dragger) {
    display: none !important;
  }

  .playground-repl :deep(.split-pane .left) {
    border: none !important;
    width: 100% !important;
  }

  /* Hide the SplitPane divider */
  .playground-repl :deep(.split-pane .divider) {
    display: none !important;
  }

  /* Sandbox fills container */
  .playground-repl :deep(.vue-repl),
  .playground-repl :deep(.iframe-container),
  .playground-repl :deep(iframe) {
    width: 100% !important;
    height: 100% !important;
  }

  .playground-repl :deep(.editor-container) {
    height: calc(100% + 1px) !important;
    width: 100% !important;
  }
</style>

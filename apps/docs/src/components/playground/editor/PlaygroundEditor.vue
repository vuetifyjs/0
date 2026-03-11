<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { defineAsyncComponent } from 'vue'

  const playground = usePlayground()
  const theme = useTheme()

  const Repl = defineAsyncComponent(() =>
    import('@vue/repl').then(m => m.Repl)
  )
  const Monaco = defineAsyncComponent(() =>
    import('@vue/repl/monaco-editor')
  )
</script>

<template>
  <div class="flex flex-col flex-1 min-h-0 min-w-0 playground-repl">
    <template v-if="playground.isReady.value">
      <Repl
        class="flex-1 min-h-0"
        :clear-console="true"
        :editor="Monaco"
        :editor-options="{ monacoOptions: { padding: { top: 16 } } }"
        layout="horizontal"
        :show-compile-output="false"
        :show-import-map="false"
        :show-ts-config="false"
        :store="playground.store"
        :theme="theme.isDark.value ? 'dark' : 'light'"
      />
    </template>

    <DocsSkeleton
      v-else
      class="flex-1 p-4"
      :lines="8"
      :widths="['w-3/4', 'w-1/2', 'w-5/6', 'w-2/3', 'w-4/5', 'w-1/3', 'w-3/5', 'w-2/5']"
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

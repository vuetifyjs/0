<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Utilities
  import { defineAsyncComponent, toRef, watch } from 'vue'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()
  const theme = useTheme()

  const Repl = defineAsyncComponent(() =>
    import('@vue/repl').then(m => m.Repl),
  )
  const Monaco = defineAsyncComponent(() =>
    import('@vue/repl/monaco-editor'),
  )

  const editorOptions = toRef(() => ({
    monacoOptions: {
      padding: { top: 16 },
      wordWrap: playground.wordWrap.value ? 'on' as const : 'off' as const,
    },
  }))

  // @vue/repl/monaco-editor's Monaco wrapper only reads
  // editorOptions.monacoOptions once, at editor creation time inside
  // onMounted() - toggling wordWrap afterward never reaches the
  // already-created editor instance through the prop, so it's also pushed
  // directly via editor.updateOptions(). This needs globalThis.monaco, set as
  // a side effect of the dynamic import below, but only once
  // MonacoEnvironment.globalAPI is set - see main.ts, which sets it before
  // this module can ever be imported.
  watch(() => playground.wordWrap.value, async wordWrapOn => {
    await import('@vue/repl/monaco-editor')
    const monaco = (globalThis as { monaco?: any }).monaco
    if (!monaco) return

    for (const editor of monaco.editor.getEditors()) {
      editor.updateOptions({ wordWrap: wordWrapOn ? 'on' : 'off' })
    }
  }, { immediate: true })
</script>

<template>
  <div
    class="flex flex-col flex-1 min-h-0 min-w-0 bg-surface playground-repl"
    :class="{ 'playground-repl--hide-errors': !playground.showErrors.value }"
  >
    <template v-if="playground.isReady.value">
      <Repl
        class="flex-1 min-h-0"
        :clear-console="true"
        :editor="Monaco"
        :editor-options
        layout="horizontal"
        :show-compile-output="false"
        :show-import-map="false"
        :show-ts-config="false"
        :store="playground.store"
        :theme="theme.isDark.value ? 'dark' : 'light'"
      />
    </template>

    <AppSkeleton
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

  /* @vue/repl uses .dark ancestor for dark mode but docs use [data-theme] */
  [data-theme="dark"] .playground-repl :deep(.vue-repl) {
    --bg: #1a1a1a;
    --bg-soft: #242424;
    --border: #383838;
    --text-light: #aaa;
    --color-branding: #42d392;
    --color-branding-dark: #89ddff;
  }

  /* .file-selector is hidden above, but @vue/repl still sizes .editor-container as
     calc(100% - var(--header-height)). Override so Monaco fills the full panel. */
  .playground-repl :deep(.editor-container) {
    height: 100% !important;
    width: 100% !important;
  }

  /* "Show errors" preference off: hide Monaco's inline squiggle decorations.
     Diagnostics computation (hover docs, autocomplete) is untouched - only the
     visual markers are suppressed, which is instant and doesn't depend on the
     async worker-based language service re-validating already-open models. */
  .playground-repl--hide-errors :deep(.squiggly-error),
  .playground-repl--hide-errors :deep(.squiggly-warning),
  .playground-repl--hide-errors :deep(.squiggly-info),
  .playground-repl--hide-errors :deep(.squiggly-hint),
  .playground-repl--hide-errors :deep(.squiggly-unnecessary) {
    background: none !important;
  }
</style>

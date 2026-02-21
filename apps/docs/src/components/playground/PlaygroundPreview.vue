<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Utilities
  import { Sandbox } from '@vue/repl'

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
    class="workspace-preview flex-1 min-w-0 min-h-0 editor-repl overflow-hidden"
    :class="{ dark: isDark, 'pointer-events-none': anyResizing }"
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

  /* Hide editor floating toggles */
  .editor-repl :deep(.editor-floating) {
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

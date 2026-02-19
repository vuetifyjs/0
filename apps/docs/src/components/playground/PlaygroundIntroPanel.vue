<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'

  // Composables
  import { useMarkdown } from '@/composables/useMarkdown'
  import { useMarkdownMount } from '@/composables/useMarkdownMount'

  // Utilities
  import { useTemplateRef } from 'vue'

  // Content
  import PlaygroundIntroPanelRaw from './PlaygroundIntroPanel.md?raw'

  defineEmits<{
    close: []
  }>()

  const { html } = useMarkdown(PlaygroundIntroPanelRaw)

  const contentRef = useTemplateRef<HTMLElement>('content')
  useMarkdownMount(contentRef, html)
</script>

<template>
  <div class="relative flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="relative z-[1] flex items-center justify-between px-4 py-2.5 border-b border-divider bg-surface shrink-0">
      <span class="text-sm font-semibold text-on-surface">Getting Started</span>
      <AppCloseButton label="Close panel" @click="$emit('close')" />
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      <div ref="content" class="markdown-body intro-content" v-html="html" />
    </div>
  </div>
</template>

<style scoped>
  /* Base text — markdown-body doesn't set these for the narrow panel context */
  .intro-content {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--v0-on-surface-variant);
  }

  /* Smaller headings than markdown-body's defaults (2.25rem / 1.875rem) */
  .intro-content :deep(h1) {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
    color: var(--v0-on-surface);
  }

  .intro-content :deep(h2) {
    font-size: 1rem;
    margin-top: 1.25rem;
    margin-bottom: 0.4rem;
    color: var(--v0-on-surface);
  }

  .intro-content :deep(strong) {
    color: var(--v0-on-surface);
  }
</style>

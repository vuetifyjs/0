<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import SkillzBadge from '@/components/skillz/SkillzBadge.vue'

  // Composables
  import { useMarkdownMount } from '@/composables/useMarkdownMount'

  // Utilities
  import { computed, useTemplateRef, watch } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

  const props = defineProps<{
    html: string
    stepLabel: string
    isFirst: boolean
    isLast: boolean
    level?: SkillLevel
  }>()

  const emit = defineEmits<{
    prev: []
    next: []
  }>()

  const theme = useTheme()
  const dataTheme = computed(() => theme.isDark.value ? 'dark' : 'light')

  // ── Dynamic component mounting ───────────────────────────────────────
  const contentRef = useTemplateRef<HTMLElement>('content')
  const scrollRef = useTemplateRef<HTMLElement>('scroll')

  // Mounts DocsCallout and DocsMarkup into the placeholder elements produced by useMarkdown
  const htmlRef = computed(() => props.html)
  useMarkdownMount(contentRef, htmlRef)

  // Scroll to top on each step transition
  watch(() => props.html, () => {
    scrollRef.value?.scrollTo(0, 0)
  })
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-divider bg-surface shrink-0">
      <SkillzBadge :level="props.level" />
      <span class="text-xs text-on-surface-variant">{{ props.stepLabel }}</span>
    </div>

    <!-- Markdown content -->
    <div ref="scroll" class="flex-1 overflow-y-auto px-5 py-4">
      <div ref="content" class="markdown-body tutorial-markdown" :data-theme="dataTheme" v-html="props.html" />
    </div>

    <!-- Step navigation -->
    <Discovery.Activator as="div" class="flex items-center justify-between px-4 py-3 border-t border-divider bg-surface shrink-0" step="step-nav">
      <button
        class="px-3 py-1.5 text-sm rounded bg-surface-tint text-on-surface disabled:opacity-40 transition-colors hover:bg-surface-variant"
        :disabled="props.isFirst"
        @click="emit('prev')"
      >
        <span class="flex items-center gap-1">
          <AppIcon icon="left" :size="14" />
          Previous
        </span>
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded bg-primary text-on-primary transition-colors"
        @click="emit('next')"
      >
        <span class="flex items-center gap-1">
          Next
          <AppIcon icon="right" :size="14" />
        </span>
      </button>
    </Discovery.Activator>
  </div>
</template>

<style scoped>
  .tutorial-markdown {
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .tutorial-markdown :deep(h1) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--v0-on-surface);
  }

  .tutorial-markdown :deep(h2) {
    font-size: 1.15rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--v0-on-surface);
  }

  .tutorial-markdown :deep(p) {
    margin-bottom: 0.75rem;
    color: var(--v0-on-surface-variant);
  }

  .tutorial-markdown :deep(ul),
  .tutorial-markdown :deep(ol) {
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
    color: var(--v0-on-surface-variant);
  }

  .tutorial-markdown :deep(li) {
    margin-bottom: 0.25rem;
  }

  .tutorial-markdown :deep(code) {
    font-size: 0.85em;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: var(--v0-surface-tint);
    color: var(--v0-primary);
  }

  .tutorial-markdown :deep(pre code) {
    background: transparent;
    color: inherit;
  }

  .tutorial-markdown :deep(.docs-markup) {
    margin: 0.75rem 0;
  }

  .tutorial-markdown :deep(strong) {
    color: var(--v0-on-surface);
    font-weight: 600;
  }

  .tutorial-markdown :deep(a) {
    color: var(--v0-primary);
    text-decoration: none;
  }

  .tutorial-markdown :deep(a:hover) {
    text-decoration: underline;
  }
</style>

<style>
  /* Unscoped — targets imperatively mounted DocsMarkup components */
  .tutorial-markdown .docs-markup .shiki code {
    padding: 0.75rem 1rem 1rem;
  }
</style>

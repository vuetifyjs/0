<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import DocsCallout from '@/components/docs/DocsCallout.vue'
  import DocsMarkup from '@/components/docs/DocsMarkup.vue'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, getCurrentInstance, h, nextTick, onBeforeUnmount, render, useTemplateRef, watch } from 'vue'

  const props = defineProps<{
    html: string
    stepLabel: string
    isFirst: boolean
    isLast: boolean
  }>()

  const emit = defineEmits<{
    prev: []
    next: []
  }>()

  const theme = useTheme()
  const dataTheme = computed(() => theme.isDark.value ? 'dark' : 'light')

  // ── Dynamic component mounting ───────────────────────────────────────
  const contentRef = useTemplateRef<HTMLElement>('content')
  const appContext = getCurrentInstance()?.appContext
  const mountedWrappers = new Set<HTMLElement>()

  watch(() => props.html, async () => {
    await nextTick()
    mountMarkupComponents()
    mountAlertComponents()
  })

  onBeforeUnmount(() => {
    for (const wrapper of mountedWrappers) {
      render(null, wrapper)
    }
    mountedWrappers.clear()
  })

  function mountMarkupComponents () {
    if (!contentRef.value) return

    for (const el of contentRef.value.querySelectorAll<HTMLElement>('[data-markup]')) {
      const code = el.dataset.code
      const language = el.dataset.language
      if (!code) continue

      const highlighted = el.innerHTML
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      const vnode = h(DocsMarkup, {
        code,
        language,
      }, {
        default: () => h('div', { innerHTML: highlighted }),
      })
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }

  function mountAlertComponents () {
    if (!contentRef.value) return

    for (const el of contentRef.value.querySelectorAll<HTMLElement>('[data-alert]')) {
      const type = el.dataset.type as 'tip' | 'info' | 'warning' | 'error'
      const encodedContent = el.dataset.content
      if (!type || !encodedContent) continue

      const content = decodeBase64(encodedContent)
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      const vnode = h(DocsCallout, { type }, {
        default: () => h('div', { innerHTML: content }),
      })
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-divider bg-surface shrink-0">
      <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Tutorial</span>
      <span class="text-xs text-on-surface-variant">{{ props.stepLabel }}</span>
    </div>

    <!-- Markdown content -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      <div ref="content" class="markdown-body tutorial-markdown" :data-theme="dataTheme" v-html="props.html" />
    </div>

    <!-- Step navigation -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-divider bg-surface shrink-0">
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
        class="px-3 py-1.5 text-sm rounded bg-primary text-on-primary disabled:opacity-40 transition-colors"
        :disabled="props.isLast"
        @click="emit('next')"
      >
        <span class="flex items-center gap-1">
          Next
          <AppIcon icon="right" :size="14" />
        </span>
      </button>
    </div>
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

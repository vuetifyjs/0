<script setup lang="ts">
  // Components
  import DocsCallout from './DocsCallout.vue'
  import DocsMarkup from './DocsMarkup.vue'
  import DocsMermaid from './DocsMermaid.vue'

  // Composables
  import { useMarkdown } from '@/composables/useMarkdown'
  import { useRouterLinks } from '@/composables/useRouterLinks'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { getCurrentInstance, h, nextTick, onBeforeUnmount, render, toRef, useTemplateRef, watch } from 'vue'

  const props = defineProps<{
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
  }>()

  const isUser = toRef(() => props.role === 'user')
  const isAssistant = toRef(() => props.role === 'assistant')
  const markdown = useMarkdown(toRef(() => isAssistant.value ? props.content : undefined))

  const contentRef = useTemplateRef<HTMLElement>('content')
  const appContext = getCurrentInstance()?.appContext

  useRouterLinks(contentRef)

  // Track mounted wrappers for cleanup
  const mountedWrappers = new Set<HTMLElement>()
  let mermaidMounted = false

  watch(markdown.html, async () => {
    await nextTick()
    mountDynamicComponents()
    mountAlertComponents()

    // Mount mermaid immediately if not streaming (e.g., conversation history)
    if (!props.isStreaming) {
      mountMermaidComponents()
    }
  })

  // Mount mermaid only after streaming completes (prevents re-initialization flicker)
  watch(() => props.isStreaming, async (streaming, wasStreaming) => {
    if (wasStreaming && !streaming && !mermaidMounted) {
      await nextTick()
      mountMermaidComponents()
    }
  })

  // Cleanup rendered vnodes on unmount to prevent memory leaks
  onBeforeUnmount(() => {
    for (const wrapper of mountedWrappers) {
      render(null, wrapper)
    }
    mountedWrappers.clear()
  })

  function mountDynamicComponents () {
    if (!contentRef.value) return

    // Mount DocsMarkup for code blocks
    const markupPlaceholders = contentRef.value.querySelectorAll<HTMLElement>('[data-markup]')
    for (const el of markupPlaceholders) {
      const code = el.dataset.code
      const language = el.dataset.language
      if (!code) continue

      // Get the highlighted content to pass as slot
      const highlighted = el.innerHTML

      // Create wrapper for the component
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      // Mount DocsMarkup with app context for icons/plugins
      const vnode = h(DocsMarkup, {
        code,
        language,
        playground: language === 'vue',
      }, {
        default: () => h('div', { innerHTML: highlighted }),
      })
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }

  function mountAlertComponents () {
    if (!contentRef.value) return

    const alertPlaceholders = contentRef.value.querySelectorAll<HTMLElement>('[data-alert]')
    for (const el of alertPlaceholders) {
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

  function mountMermaidComponents () {
    if (!contentRef.value || mermaidMounted) return

    const mermaidPlaceholders = contentRef.value.querySelectorAll<HTMLElement>('[data-mermaid]')
    if (mermaidPlaceholders.length === 0) return

    mermaidMounted = true

    for (const el of mermaidPlaceholders) {
      const code = el.dataset.code
      if (!code) continue

      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      const vnode = h(DocsMermaid, { code })
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }
</script>

<template>
  <div
    v-if="isUser"
    class="flex justify-end mb-4"
  >
    <div class="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed bg-primary text-on-primary">
      <div class="whitespace-pre-wrap break-words">{{ content }}</div>
    </div>
  </div>

  <div
    v-else
    class="text-sm leading-relaxed text-on-surface"
  >
    <!-- Rendered markdown -->
    <div
      v-if="markdown.html.value"
      ref="content"
      class="markdown-body"
      v-html="markdown.html.value"
    />

    <!-- Streaming indicator -->
    <span
      v-if="isStreaming && !content"
      class="inline-flex gap-1 text-on-surface-variant"
    >
      <span class="size-1.5 rounded-full bg-current animate-pulse" />
      <span class="size-1.5 rounded-full bg-current animate-pulse delay-75" />
      <span class="size-1.5 rounded-full bg-current animate-pulse delay-150" />
    </span>

    <!-- Cursor while streaming -->
    <span
      v-else-if="isStreaming"
      class="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"
    />
  </div>
</template>

<style scoped>
  .delay-75 {
    animation-delay: 75ms;
  }
  .delay-150 {
    animation-delay: 150ms;
  }
  .markdown-body :deep(.docs-markup),
  .markdown-body :deep(.docs-mermaid) {
    margin: 0.5em 0;
  }

  /* Scale down headings for chat context */
  .markdown-body :deep(h1) {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1em 0 0.5em;
  }
  .markdown-body :deep(h2) {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.875em 0 0.375em;
  }
  .markdown-body :deep(h3) {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0.75em 0 0.25em;
  }
  .markdown-body :deep(h4),
  .markdown-body :deep(h5),
  .markdown-body :deep(h6) {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0.5em 0 0.25em;
  }
</style>

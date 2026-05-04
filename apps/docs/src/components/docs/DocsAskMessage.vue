<script setup lang="ts">
  // Context
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

  function mountTo (selector: string, create: (el: HTMLElement) => ReturnType<typeof h> | null) {
    if (!contentRef.value) return
    for (const el of contentRef.value.querySelectorAll<HTMLElement>(selector)) {
      const vnode = create(el)
      if (!vnode) continue
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }

  function mountDynamicComponents () {
    mountTo('[data-markup]', el => {
      const code = el.dataset.code
      if (!code) return null
      const highlighted = el.innerHTML
      return h(DocsMarkup, {
        code,
        language: el.dataset.language,
        playground: el.dataset.language === 'vue',
      }, {
        default: () => h('div', { innerHTML: highlighted }),
      })
    })
  }

  function mountAlertComponents () {
    mountTo('[data-alert]', el => {
      const type = el.dataset.type as 'tip' | 'info' | 'warning' | 'error'
      const encoded = el.dataset.content
      if (!type || !encoded) return null
      return h(DocsCallout, { type }, {
        default: () => h('div', { innerHTML: decodeBase64(encoded) }),
      })
    })
  }

  function mountMermaidComponents () {
    if (!contentRef.value || mermaidMounted) return
    const placeholders = contentRef.value.querySelectorAll<HTMLElement>('[data-mermaid]')
    if (placeholders.length === 0) return
    mermaidMounted = true
    mountTo('[data-mermaid]', el => {
      const code = el.dataset.code
      return code ? h(DocsMermaid, { code }) : null
    })
  }
</script>

<template>
  <div
    v-if="isUser"
    class="flex justify-end my-4"
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

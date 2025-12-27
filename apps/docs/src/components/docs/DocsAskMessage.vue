<script lang="ts" setup>
  // Components
  import DocsMarkup from './DocsMarkup.vue'

  // Composables
  import { useMarkdown } from '@/composables/useMarkdown'

  // Utilities
  import { getCurrentInstance, h, nextTick, render, toRef, useTemplateRef, watch } from 'vue'

  const props = defineProps<{
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
  }>()

  const isUser = toRef(() => props.role === 'user')
  const isAssistant = toRef(() => props.role === 'assistant')
  const { html } = useMarkdown(toRef(() => isAssistant.value ? props.content : undefined))

  const contentRef = useTemplateRef<HTMLElement>('content')
  const appContext = getCurrentInstance()?.appContext

  watch(html, async () => {
    await nextTick()
    mountMarkupComponents()
  })

  function mountMarkupComponents () {
    if (!contentRef.value) return

    const placeholders = contentRef.value.querySelectorAll<HTMLElement>('[data-markup]')
    for (const el of placeholders) {
      const code = el.dataset.code
      const language = el.dataset.language
      if (!code) continue

      // Get the highlighted content to pass as slot
      const highlighted = el.innerHTML

      // Create wrapper for the component
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)

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
</script>

<template>
  <div
    v-if="isUser"
    class="flex justify-end"
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
      v-if="html"
      ref="content"
      class="markdown-body"
      v-html="html"
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
  .markdown-body :deep(.docs-markup) {
    margin: 0.5em 0;
  }
  .markdown-body :deep(.docs-markup pre) {
    padding-top: 2.5rem;
    padding-right: 5rem;
  }
</style>

<script lang="ts" setup>
  import { computed, toRef } from 'vue'

  import { useMarkdown } from '@/composables/useMarkdown'

  const props = defineProps<{
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
  }>()

  const isUser = computed(() => props.role === 'user')
  const { html } = useMarkdown(toRef(() => props.role === 'assistant' ? props.content : undefined))
</script>

<template>
  <!-- User message: bubble aligned right -->
  <div
    v-if="isUser"
    class="flex justify-end"
  >
    <div class="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed bg-primary text-on-primary">
      <div class="whitespace-pre-wrap break-words">{{ content }}</div>
    </div>
  </div>

  <!-- Assistant message: plain text -->
  <div
    v-else
    class="text-sm leading-relaxed text-on-surface"
  >
    <!-- Rendered markdown -->
    <div
      v-if="html"
      class="markdown-content"
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

  .markdown-content :deep(p) {
    margin: 0.5em 0;
  }
  .markdown-content :deep(p:first-child) {
    margin-top: 0;
  }
  .markdown-content :deep(p:last-child) {
    margin-bottom: 0;
  }
  .markdown-content :deep(code) {
    background: var(--v0-surface);
    padding: 0.125em 0.25em;
    border-radius: 0.25em;
    font-size: 0.875em;
  }
  .markdown-content :deep(pre) {
    background: var(--v0-pre);
    padding: 0.75em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin: 0.5em 0;
  }
  .markdown-content :deep(pre code) {
    background: none;
    padding: 0;
  }
  .markdown-content :deep(ul) {
    margin: 0.5em 0;
    padding-left: 1.5em;
    list-style-type: disc;
  }
  .markdown-content :deep(ol) {
    margin: 0.5em 0;
    padding-left: 1.5em;
    list-style-type: decimal;
  }
  .markdown-content :deep(li) {
    margin: 0.25em 0;
    display: list-item;
  }
  .markdown-content :deep(strong) {
    font-weight: 600;
  }
  .markdown-content :deep(a) {
    color: var(--v0-primary);
    text-decoration: underline;
  }
  .markdown-content :deep(h1),
  .markdown-content :deep(h2),
  .markdown-content :deep(h3) {
    font-weight: 600;
    margin: 0.75em 0 0.5em;
  }
  .markdown-content :deep(blockquote) {
    border-left: 3px solid var(--v0-divider);
    padding-left: 1em;
    margin: 0.5em 0;
    opacity: 0.8;
  }
</style>

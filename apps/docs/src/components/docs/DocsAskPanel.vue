<script setup lang="ts">
  // Framework
  import { isNull, useBreakpoints } from '@vuetify/v0'

  // Components
  import DocsAskMessage from './DocsAskMessage.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import { Discovery } from '@/components/discovery'

  // Composables
  import { getBinUrl } from '@/composables/bin'
  import { useAsk } from '@/composables/useAsk'
  import { useClipboard } from '@/composables/useClipboard'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, nextTick, useTemplateRef, watch } from 'vue'

  // Types
  import type { Message } from '@/composables/useAsk'

  const props = defineProps<{
    messages: readonly Message[]
    isLoading: boolean
    error: string | null
    fullscreen?: boolean
  }>()

  const emit = defineEmits<{
    'close': []
    'submit': [question: string]
    'clear': []
    'stop': []
    'update:fullscreen': [value: boolean]
  }>()

  const breakpoints = useBreakpoints()
  const ask = useAsk()
  const clipboard = useClipboard()
  const settings = useSettings()

  const messagesRef = useTemplateRef<{ $el: HTMLElement } | null>('messages')
  const formRef = useTemplateRef<{ focus: () => void }>('form')

  const isDesktop = computed(() => breakpoints.lgAndUp.value)

  // Auto-scroll until response fills the viewport
  let shouldAutoScroll = true
  let lockedScrollTop: number | null = null

  function getMessagesEl () {
    return messagesRef.value?.$el
  }

  function updateScroll () {
    const container = getMessagesEl()
    if (!container) return

    // If we've locked the scroll position, maintain it
    if (!isNull(lockedScrollTop)) {
      container.scrollTop = lockedScrollTop
      return
    }

    if (!shouldAutoScroll) return

    // Scroll to bottom first
    container.scrollTop = container.scrollHeight

    // Find the user's question (second-to-last message)
    const messages = [...container.querySelectorAll(':scope > *')]
    const userMessage = messages.at(-2)
    if (!userMessage) return

    const containerRect = container.getBoundingClientRect()
    const userRect = userMessage.getBoundingClientRect()
    const padding = Number.parseFloat(getComputedStyle(container).paddingTop) || 0

    // Lock scroll when user's question reaches the container top
    if (userRect.top <= containerRect.top + padding) {
      shouldAutoScroll = false
      // Keep user's question at the top
      const offset = userRect.top - (containerRect.top + padding)
      lockedScrollTop = container.scrollTop + offset
      container.scrollTop = lockedScrollTop
    }
  }

  watch(
    () => props.messages,
    async () => {
      await nextTick()
      updateScroll()
    },
    { deep: true },
  )

  // Reset auto-scroll when starting a new message
  watch(
    () => props.isLoading,
    loading => {
      if (!loading) return

      shouldAutoScroll = true
      lockedScrollTop = null
    },
  )

  function onSubmit (question: string) {
    if (props.isLoading) return
    emit('submit', question)
  }

  function getConversationMarkdown () {
    return props.messages
      .map(msg => msg.role === 'user'
        ? `**User:** ${msg.content}`
        : `**Assistant:**\n\n${msg.content}`)
      .join('\n\n---\n\n')
  }

  function openInBin () {
    const url = getBinUrl(getConversationMarkdown(), 'markdown', 'Ask AI Conversation')
    window.open(url, '_blank')
  }

  function copyConversation () {
    clipboard.copy(getConversationMarkdown())
  }

  function focus () {
    formRef.value?.focus()
  }

  watch(ask.focusTrigger, () => {
    if (ask.isOpen.value) {
      nextTick(() => focus())
    }
  })

  defineExpose({ focus })
</script>

<template>
  <aside
    aria-labelledby="ask-title"
    :aria-modal="!isDesktop"
    :class="[
      'flex flex-col z-50',
      settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface',
      isDesktop && fullscreen
        ? 'fixed inset-4 rounded-lg border border-divider shadow-lg'
        : isDesktop
          ? 'fixed right-4 top-23 w-[clamp(280px,calc(100vw-230px-688px-64px),500px)] h-[calc(100vh-137px)] rounded-lg border border-divider shadow-lg'
          : 'fixed inset-0',
    ]"
    :role="isDesktop ? 'complementary' : 'dialog'"
  >
    <!-- Header -->
    <Discovery.Activator
      class="rounded-lg"
      :padding="-4"
      step="ask-ai-features"
    >
      <header
        :class="[
          'shrink-0 px-4 py-2 border-b border-divider flex items-center justify-between bg-surface',
          isDesktop ? 'rounded-t-lg' : '',
        ]"
      >
        <div class="flex items-center gap-2">
          <AppIcon class="text-primary" icon="create" />
          <span id="ask-title" class="font-medium">Ask AI</span>
        </div>

        <div class="flex items-center gap-0.5">
          <button
            v-if="messages.length > 0"
            class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
            title="Open in Bin"
            type="button"
            @click="openInBin"
          >
            <AppIcon icon="vuetify-bin" size="16" />
          </button>

          <button
            v-if="messages.length > 0"
            class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
            :title="clipboard.copied.value ? 'Copied!' : 'Copy conversation'"
            type="button"
            @click="copyConversation"
          >
            <AppIcon :icon="clipboard.copied.value ? 'success' : 'copy'" size="16" />
          </button>

          <button
            v-if="messages.length > 0"
            class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
            title="Reset conversation"
            type="button"
            @click="emit('clear')"
          >
            <AppIcon icon="restart" size="16" />
          </button>

          <button
            v-if="isDesktop"
            class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant"
            :title="fullscreen ? 'Exit fullscreen' : 'Fullscreen'"
            type="button"
            @click="emit('update:fullscreen', !fullscreen)"
          >
            <AppIcon :icon="fullscreen ? 'fullscreen-exit' : 'fullscreen'" size="16" />
          </button>

          <AppCloseButton @click="emit('close')" />
        </div>
      </header>
    </Discovery.Activator>

    <!-- Messages -->
    <Discovery.Activator
      ref="messages"
      as="div"
      class="rounded-lg flex-1 h-full pa-4 overflow-y-auto"
      :padding="-4"
      step="ask-ai-panel"
    >
      <!-- Empty state -->
      <div
        v-if="messages.length === 0"
        class="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/60"
      >
        <AppIcon class="mb-3 opacity-40" icon="chat" size="48" />
        <p class="text-sm">Responses are generated using AI</p>
        <p class="text-xs mt-1 opacity-60">and may contain mistakes</p>
      </div>

      <!-- Message list -->
      <DocsAskMessage
        v-for="msg in messages"
        :key="msg.id"
        :content="msg.content"
        :is-streaming="isLoading && msg === messages[messages.length - 1] && msg.role === 'assistant'"
        :role="msg.role"
      />

      <!-- Error message -->
      <div
        v-if="error"
        class="rounded-lg bg-error/10 text-error px-4 py-3 text-sm"
      >
        {{ error }}
      </div>
    </Discovery.Activator>

    <!-- Input -->
    <footer class="shrink-0 p-3">
      <DocsAskForm
        ref="form"
        aria-label="Ask a follow-up question"
        :is-loading
        @stop="emit('stop')"
        @submit="onSubmit"
      />
    </footer>
  </aside>
</template>

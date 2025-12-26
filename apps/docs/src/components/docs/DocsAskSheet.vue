<script lang="ts" setup>
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import DocsAskMessage from './DocsAskMessage.vue'

  // Utilities
  import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { Message } from '@/composables/useAsk'

  const props = defineProps<{
    messages: readonly Message[]
    isLoading: boolean
    error: string | null
  }>()

  const emit = defineEmits<{
    close: []
    submit: [question: string]
    clear: []
    stop: []
  }>()

  const messagesRef = useTemplateRef<HTMLElement | null>('messages')
  const textareaRef = useTemplateRef<HTMLTextAreaElement | null>('textarea')
  const question = shallowRef('')
  const isFullscreen = shallowRef(false)

  // Auto-scroll to bottom on new messages
  watch(
    () => props.messages,
    async () => {
      await nextTick()
      if (!messagesRef.value) return

      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    },
    { deep: true },
  )

  function onSubmit () {
    const q = question.value.trim()
    if (!q || props.isLoading) return

    emit('submit', q)
    question.value = ''
    resizeTextarea()
  }

  function onKeydown (e: KeyboardEvent) {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  function resizeTextarea () {
    if (!textareaRef.value) return
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`
  }

  function toggleFullscreen () {
    isFullscreen.value = !isFullscreen.value
  }

  function focus () {
    textareaRef.value?.focus()
  }

  defineExpose({ focus })
</script>

<template>
  <aside
    aria-labelledby="ask-ai-title"
    aria-modal="true"
    :class="[
      'fixed top-0 right-0 h-full bg-background border-l border-divider shadow-xl z-50 flex flex-col',
      isFullscreen ? 'w-full max-w-full' : 'w-full max-w-md',
    ]"
    role="dialog"
  >
    <!-- Header -->
    <header class="shrink-0 px-4 py-3 border-b border-divider flex items-center justify-between bg-surface">
      <div class="flex items-center gap-2">
        <AppIcon class="text-primary" icon="chat" />
        <span id="ask-ai-title" class="font-medium">Ask AI</span>
      </div>

      <div class="flex items-center gap-1">
        <button
          v-if="messages.length > 0"
          class="inline-flex p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface"
          title="Reset conversation"
          type="button"
          @click="emit('clear')"
        >
          <AppIcon icon="restart" size="18" />
        </button>

        <button
          class="inline-flex p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface"
          :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
          type="button"
          @click="toggleFullscreen"
        >
          <AppIcon :icon="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" size="18" />
        </button>

        <button
          class="inline-flex p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface"
          title="Close"
          type="button"
          @click="emit('close')"
        >
          <AppIcon icon="close" size="18" />
        </button>
      </div>
    </header>

    <!-- Messages -->
    <div
      ref="messages"
      class="flex-1 overflow-y-auto p-4 space-y-4"
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
    </div>

    <!-- Input -->
    <footer class="shrink-0 p-4 border-t border-divider bg-surface">
      <form
        class="flex items-end gap-2"
        @submit.prevent="onSubmit"
      >
        <textarea
          ref="textarea"
          v-model="question"
          aria-label="Ask a follow-up question"
          class="flex-1 rounded-lg bg-surface-variant px-4 py-2.5 text-sm text-on-surface border-none outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none min-h-[42px] max-h-[120px]"
          :disabled="isLoading"
          placeholder="Ask a question..."
          rows="1"
          @input="resizeTextarea"
          @keydown="onKeydown"
        />

        <button
          v-if="isLoading"
          aria-label="Stop generating"
          class="shrink-0 size-10 rounded-lg bg-error text-on-error flex items-center justify-center hover:opacity-90 transition-opacity"
          title="Stop generating"
          type="button"
          @click="emit('stop')"
        >
          <AppIcon icon="stop" size="18" />
        </button>

        <button
          v-else
          aria-label="Send question"
          class="shrink-0 size-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!question.trim()"
          title="Send"
          type="submit"
        >
          <AppIcon icon="send" size="18" />
        </button>
      </form>
    </footer>
  </aside>
</template>

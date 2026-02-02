<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  defineProps<{
    isLoading?: boolean
    ariaLabel?: string
    showKeyboardHint?: boolean
  }>()

  const emit = defineEmits<{
    submit: [question: string]
    stop: []
    focus: []
  }>()

  const inputRef = useTemplateRef<HTMLInputElement>('input')
  const question = shallowRef('')
  const settings = useSettings()

  function onSubmit () {
    const q = question.value.trim()
    if (!q) return

    emit('submit', q)
    question.value = ''
  }

  function focus () {
    inputRef.value?.focus()
  }

  function onFocus () {
    emit('focus')
  }

  defineExpose({ focus })
</script>

<template>
  <form
    :class="['rounded-full border border-divider flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 hover:border-primary/50 focus-within:border-primary focus-within:hover:border-primary transition-colors', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']"
    @submit.prevent="onSubmit"
  >
    <AppIcon
      class="shrink-0 text-on-surface opacity-60"
      icon="create"
      size="14"
    />

    <input
      ref="input"
      v-model="question"
      :aria-label="ariaLabel ?? 'Ask a question'"
      class="flex-1 bg-transparent border-none outline-none text-base text-on-surface placeholder:text-on-surface-tint"
      :disabled="isLoading"
      placeholder="Ask a question..."
      type="text"
      @focus="onFocus"
    >

    <kbd
      v-if="showKeyboardHint && !question"
      class="shrink-0 px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-[10px] font-mono inline-flex items-center"
    >Ctrl+/</kbd>

    <button
      v-if="isLoading"
      aria-label="Stop generating"
      class="shrink-0 size-6 rounded-full bg-error text-on-error flex items-center justify-center hover:opacity-90 transition-opacity"
      title="Stop generating"
      type="button"
      @click="emit('stop')"
    >
      <AppIcon icon="stop" size="12" />
    </button>

    <button
      v-else
      aria-label="Send question"
      class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!question.trim()"
      title="Send"
      type="submit"
    >
      <AppIcon icon="send" size="12" />
    </button>
  </form>
</template>

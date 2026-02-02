<script setup lang="ts">
  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { shallowRef } from 'vue'

  const ask = useAsk()
  const settings = useSettings()
  const question = shallowRef('')

  function onSubmit () {
    const q = question.value.trim()
    if (!q) return

    ask.ask(q)
    question.value = ''
  }
</script>

<template>
  <form
    :class="['rounded-full border border-divider flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 hover:border-primary/50 focus-within:border-primary focus-within:hover:border-primary transition-colors max-w-sm', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']"
    @submit.prevent="onSubmit"
  >
    <AppIcon
      class="shrink-0 text-on-surface opacity-60"
      icon="create"
      size="14"
    />

    <input
      v-model="question"
      aria-label="Ask a question"
      class="flex-1 bg-transparent border-none outline-none text-base text-on-surface placeholder:text-on-surface-tint"
      placeholder="Ask a question..."
      type="text"
    >

    <button
      aria-label="Send question"
      class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!question.trim()"
      type="submit"
    >
      <AppIcon icon="send" size="12" />
    </button>
  </form>
</template>

<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

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

    <AppTooltip
      v-if="isLoading"
      aria-label="Stop generating"
      class="shrink-0 size-6 rounded-full bg-error text-on-error flex items-center justify-center hover:opacity-90 transition-opacity"
      text="Stop generating"
      @click="emit('stop')"
    >
      <AppIcon icon="stop" size="12" />
    </AppTooltip>

    <Tooltip.Root
      v-else
      :close-delay="200"
      :open-delay="500"
    >
      <!-- Renderless: the trigger is a native type="submit" button; binding
           attrs + styles keeps the tooltip wiring without the activator forcing
           type="button". Requires Tooltip.Activator exposing anchor styles. -->
      <Tooltip.Activator v-slot="{ attrs, styles }" renderless>
        <button
          aria-label="Send question"
          class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          :style="styles"
          v-bind="{ ...attrs, type: 'submit', disabled: !question.trim() }"
        >
          <AppIcon icon="send" size="12" />
        </button>
      </Tooltip.Activator>

      <Tooltip.Content
        class="max-w-64 whitespace-normal rounded border border-divider bg-surface px-2 py-1 text-xs text-on-surface shadow-lg"
        :style="{ margin: '6px 0' }"
      >
        Send
      </Tooltip.Content>
    </Tooltip.Root>
  </form>
</template>

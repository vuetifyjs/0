<script lang="ts" setup>
  import { useWindowEventListener } from '@vuetify/v0'
  import { onMounted, ref } from 'vue'

  const props = defineProps<{
    hasMessages?: boolean
  }>()

  const emit = defineEmits<{
    submit: [question: string]
    reopen: []
  }>()

  const inputRef = ref<HTMLInputElement | null>(null)
  const question = ref('')
  const isNearBottom = ref(false)

  function handleSubmit () {
    const q = question.value.trim()
    if (!q) return

    emit('submit', q)
    question.value = ''
  }

  function focus () {
    inputRef.value?.focus()
  }

  function handleFocus () {
    if (props.hasMessages) {
      emit('reopen')
    }
  }

  function checkScroll () {
    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const docHeight = document.documentElement.scrollHeight
    const distanceFromBottom = docHeight - (scrollTop + windowHeight)
    isNearBottom.value = distanceFromBottom < 200
  }

  useWindowEventListener('scroll', checkScroll, { passive: true })

  onMounted(() => {
    checkScroll()
  })

  defineExpose({ focus })
</script>

<template>
  <Transition name="fade">
    <div
      v-show="!isNearBottom"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4"
    >
      <form
        class="glass-surface rounded-full shadow-lg border border-divider flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 hover:border-primary/50 focus-within:border-primary focus-within:hover:border-primary transition-colors"
        @submit.prevent="handleSubmit"
      >
        <AppIcon
          class="shrink-0 text-on-surface opacity-60"
          icon="chat"
          size="14"
        />

        <input
          ref="inputRef"
          v-model="question"
          aria-label="Ask a question about this page"
          class="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Ask a question..."
          type="text"
          @focus="handleFocus"
        >

        <kbd
          v-if="!question"
          class="shrink-0 px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant text-[10px] font-mono inline-flex items-center"
        >Ctrl+K</kbd>

        <button
          aria-label="Send question"
          class="shrink-0 size-6 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!question.trim()"
          type="submit"
        >
          <AppIcon icon="send" size="12" />
        </button>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>

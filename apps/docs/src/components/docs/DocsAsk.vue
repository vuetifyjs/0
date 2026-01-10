<script setup lang="ts">
  // Framework
  import { useBreakpoints, useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsAskInput from './DocsAskInput.vue'
  import DocsAskSheet from './DocsAskSheet.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, toRef, nextTick, shallowRef, useTemplateRef } from 'vue'

  const breakpoints = useBreakpoints()
  const isDesktop = computed(() => breakpoints.lgAndUp.value)
  const fullscreen = shallowRef(false)
  const { prefersReducedMotion } = useSettings()

  const fadeTransition = toRef(() => prefersReducedMotion.value ? undefined : 'fade')
  const sheetTransition = toRef(() => {
    if (prefersReducedMotion.value) return undefined
    return isDesktop.value ? 'fade' : 'slide'
  })

  useScrollLock(() => isOpen.value && fullscreen.value && isDesktop.value)

  const {
    messages,
    isOpen,
    isLoading,
    error,
    ask,
    clear,
    close,
    open,
    stop,
  } = useAsk()

  const inputRef = useTemplateRef<InstanceType<typeof DocsAskInput>>('input')
  const sheetRef = useTemplateRef<InstanceType<typeof DocsAskSheet>>('sheet')

  const hasMessages = toRef(() => messages.value.length > 0)

  async function onSubmit (question: string) {
    await ask(question)
  }

  async function onReopen () {
    open()
    await nextTick()
    sheetRef.value?.focus()
  }

  // Keyboard shortcut: Cmd/Ctrl + / to focus input
  function onKeydown (e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault()
      if (isOpen.value) {
        close()
      } else {
        inputRef.value?.focus()
      }
    }

    // Escape to close sheet
    if (e.key === 'Escape' && isOpen.value) {
      e.preventDefault()
      close()
    }
  }

  useDocumentEventListener('keydown', onKeydown)
</script>

<template>
  <!-- Floating input (visible when sheet is closed) -->
  <DocsAskInput
    v-show="!isOpen"
    ref="input"
    :has-messages="hasMessages"
    @reopen="onReopen"
    @submit="onSubmit"
  />

  <!-- Backdrop (mobile only) -->
  <Transition :name="fadeTransition">
    <div
      v-if="isOpen && !isDesktop"
      class="fixed inset-0 bg-black/30 z-40"
      @click="close"
    />
  </Transition>

  <!-- Chat sheet -->
  <Transition :name="sheetTransition">
    <DocsAskSheet
      v-if="isOpen"
      ref="sheet"
      v-model:fullscreen="fullscreen"
      :error="error"
      :is-loading="isLoading"
      :messages="messages"
      @clear="clear"
      @close="close"
      @stop="stop"
      @submit="onSubmit"
    />
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

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }
</style>

<script setup lang="ts">
  // Framework
  import { useBreakpoints, useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsAskInput from './DocsAskInput.vue'
  import DocsAskPanel from './DocsAskPanel.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  const breakpoints = useBreakpoints()
  const isDesktop = computed(() => breakpoints.lgAndUp.value)
  const fullscreen = shallowRef(false)
  const settings = useSettings()

  const fadeTransition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'fade')
  const panelTransition = toRef(() => {
    if (settings.prefersReducedMotion.value) return undefined
    return isDesktop.value ? 'fade' : 'slide'
  })

  const ask = useAsk()

  useScrollLock(() => ask.isOpen.value && fullscreen.value && isDesktop.value)

  const panelRef = useTemplateRef<InstanceType<typeof DocsAskPanel>>('panel')
  const triggerRef = shallowRef<HTMLElement | null>(null)

  const hasMessages = toRef(() => ask.messages.value.length > 0)

  // Restore focus when closing
  watch(ask.isOpen, async opened => {
    if (!opened) {
      await nextTick()
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  async function onSubmit (question: string) {
    await ask.ask(question)
  }

  async function onReopen () {
    triggerRef.value = document.activeElement as HTMLElement | null
    ask.open()
    await nextTick()
    panelRef.value?.focus()
  }

  // Keyboard shortcut: Cmd/Ctrl + / to focus input
  function onKeydown (e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault()
      if (ask.isOpen.value) {
        ask.close()
      } else {
        ask.focus()
      }
    }

    // Escape to close panel
    if (e.key === 'Escape' && ask.isOpen.value) {
      e.preventDefault()
      ask.close()
    }
  }

  useDocumentEventListener('keydown', onKeydown)
</script>

<template>
  <!-- Floating input (visible when panel is closed) -->
  <DocsAskInput
    v-show="!ask.isOpen.value"
    :has-messages="hasMessages"
    @reopen="onReopen"
    @submit="onSubmit"
  />

  <!-- Backdrop (mobile only) -->
  <Transition :name="fadeTransition">
    <div
      v-if="ask.isOpen.value && !isDesktop"
      class="fixed inset-0 bg-black/30 z-40"
      @click="ask.close"
    />
  </Transition>

  <!-- Chat panel -->
  <Transition :name="panelTransition">
    <DocsAskPanel
      v-if="ask.isOpen.value"
      ref="panel"
      v-model:fullscreen="fullscreen"
      :error="ask.error.value"
      :is-loading="ask.isLoading.value"
      :messages="ask.messages.value"
      @clear="ask.clear"
      @close="ask.close"
      @stop="ask.stop"
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

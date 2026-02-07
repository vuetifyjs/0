<script setup lang="ts">
  // Framework
  import { useDocumentEventListener, useStack } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'

  // Utilities
  import { defineAsyncComponent, nextTick, shallowRef, useTemplateRef, watch } from 'vue'

  const DocsAskPanel = defineAsyncComponent(() => import('@/components/docs/DocsAskPanel.vue'))

  const ask = useAsk()
  const stack = useStack()

  const panelRef = useTemplateRef<{ focus: () => void }>('panel')
  const triggerRef = shallowRef<HTMLElement | null>(null)

  // Register with stack for z-index coordination
  const ticket = stack.register({
    onDismiss: () => ask.close(),
  })

  watch(ask.isOpen, isOpen => {
    if (isOpen) ticket.select()
    else ticket.unselect()
  }, { immediate: true })

  // Focus panel when it becomes available (handles async component loading)
  watch(panelRef, panel => {
    if (panel && ask.isOpen.value) {
      panel.focus()
    }
  })

  // Capture/restore focus on open/close
  watch(ask.isOpen, async opened => {
    if (opened) {
      triggerRef.value = document.activeElement as HTMLElement | null
    } else {
      await nextTick()
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  async function onSubmit (question: string) {
    await ask.ask(question)
  }

  function onKeydown (e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault()
      if (ask.isOpen.value) ask.close()
      else ask.focus()
    }

    if (e.key === 'Escape' && ask.isOpen.value) {
      e.preventDefault()
      ask.close()
    }

    if (e.key === 'Tab' && ask.isOpen.value) {
      const dialog = document.querySelector('[role="dialog"]') as HTMLElement
      if (!dialog) return

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable.at(-1)

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  useDocumentEventListener('keydown', onKeydown)
</script>

<template>
  <Transition name="fade">
    <div
      v-if="ask.isOpen.value"
      aria-label="Ask AI"
      aria-modal="true"
      class="fixed inset-0 flex items-center justify-center p-4"
      role="dialog"
      :style="{ zIndex: ticket.zIndex.value }"
    >
      <div
        class="absolute inset-0 bg-black/30"
        @click="ask.close"
      />

      <DocsAskPanel
        ref="panel"
        class="relative !inset-auto !w-full !max-w-2xl !h-[80vh] !rounded-xl !shadow-2xl overflow-hidden"
        :error="ask.error.value"
        :is-loading="ask.isLoading.value"
        :messages="ask.messages.value"
        @clear="ask.clear"
        @close="ask.close"
        @stop="ask.stop"
        @submit="onSubmit"
      />
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>

<script setup lang="ts">
  // Note: For SSR applications, install the plugin in main.ts:
  // import { createStackPlugin } from '@vuetify/v0'
  // app.use(createStackPlugin())
  import { Scrim, useStack } from '@vuetify/v0'
  import { computed, onScopeDispose, shallowRef, watch } from 'vue'
  import { provideOverlays } from './context'
  import type { Overlay } from './context'

  const stack = useStack()

  // Block body scroll when overlays are active
  watch(() => stack.isActive.value, active => {
    document.body.style.overflow = active ? 'hidden' : ''
  }, { immediate: true })

  onScopeDispose(() => {
    document.body.style.overflow = ''
  })

  // Define overlays with their own isOpen state
  const overlays: Overlay[] = [
    { id: 'modal-1', title: 'Settings', isOpen: shallowRef(false) },
    { id: 'modal-2', title: 'Confirm', isOpen: shallowRef(false) },
    { id: 'modal-3', title: 'Alert', isOpen: shallowRef(false), blocking: true },
  ]

  const activeCount = computed(() =>
    overlays.filter(o => o.isOpen.value).length,
  )

  function open (id: string) {
    const overlay = overlays.find(o => o.id === id)
    if (overlay) overlay.isOpen.value = true
  }

  function close (id: string) {
    const overlay = overlays.find(o => o.id === id)
    if (overlay) overlay.isOpen.value = false
  }

  function closeAll () {
    for (const o of overlays) {
      o.isOpen.value = false
    }
  }

  provideOverlays({
    overlays,
    stack,
    activeCount,
    open,
    close,
    closeAll,
  })
</script>

<template>
  <div class="relative">
    <slot />

    <!-- Scrim renders one backdrop per overlay for cumulative opacity -->
    <Scrim class="fixed inset-0 bg-black/30 transition-opacity" />
  </div>
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

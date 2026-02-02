<script setup lang="ts">
  // Note: For SSR applications, install the plugin in main.ts:
  // import { createStackPlugin } from '@vuetify/v0'
  // app.use(createStackPlugin())
  import { Scrim, stack } from '@vuetify/v0'
  import { onScopeDispose, watch } from 'vue'
  import { overlayDefinitions, provideOverlaySelection } from './context'

  // Provide selection context and register overlays
  const selection = provideOverlaySelection()

  for (const overlay of overlayDefinitions) {
    selection.register({
      id: overlay.id,
      value: overlay,
    })
  }

  // Block body scroll when overlays are active
  watch(() => stack.isActive.value, active => {
    document.body.style.overflow = active ? 'hidden' : ''
  }, { immediate: true })

  onScopeDispose(() => {
    document.body.style.overflow = ''
  })
</script>

<template>
  <div class="relative">
    <slot />

    <!-- Scrim (shared backdrop for all overlays) -->
    <Scrim class="fixed inset-0 bg-black/50 transition-opacity" />
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

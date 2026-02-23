<script lang="ts" setup>
  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { onUnmounted } from 'vue'

  const playground = usePlayground()

  const ticket = playground.register({ id: 'playground-right' })

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <div
    v-if="ticket.isSelected.value"
    class="bg-surface h-full flex-1 min-w-0"
  >
    <slot />
  </div>
</template>

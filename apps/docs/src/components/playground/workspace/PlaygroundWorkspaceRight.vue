<script setup lang="ts">
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted } from 'vue'

  const playground = usePlayground()
  const ticket = playground.register({ id: 'workspace-right' })

  onMounted(() => ticket.select())

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <div
    v-if="ticket.isSelected.value"
    class="flex flex-col flex-1 min-w-0"
  >
    <slot />
  </div>
</template>

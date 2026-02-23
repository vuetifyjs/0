<script setup lang="ts">
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted } from 'vue'

  const playground = usePlayground()
  const ticket = playground.register({ id: 'workspace-bottom' })

  onMounted(() => ticket.select())

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <div
    v-if="ticket.isSelected.value"
    class="flex flex-1"
  >
    <slot />
  </div>
</template>

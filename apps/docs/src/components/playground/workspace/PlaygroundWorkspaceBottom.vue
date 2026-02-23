<script lang="ts" setup>
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onUnmounted } from 'vue'

  const playground = usePlayground()
  const ticket = playground.register({ id: 'workspace-bottom' })

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

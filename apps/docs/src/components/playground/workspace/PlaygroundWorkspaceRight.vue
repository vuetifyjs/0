<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const ticket = playground.register({ id: 'workspace-right' })

  onMounted(() => {
    if (!breakpoints.isMobile.value) ticket.select()
  })

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

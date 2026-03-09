<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

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
  <SplitterPanel :default-size="50" :min-size="20">
    <div
      v-if="ticket.isSelected.value"
      class="flex flex-col min-w-0 h-full"
    >
      <slot />
    </div>
  </SplitterPanel>
</template>

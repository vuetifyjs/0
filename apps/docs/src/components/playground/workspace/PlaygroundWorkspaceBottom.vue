<script setup lang="ts">
  // Framework
  import { useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'
  import { Discovery } from '@/components/discovery'

  // Utilities
  import { onMounted, onUnmounted } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const side = storage.get('playground-preview-right', false)
  const left = storage.get('playground-left-open', true)

  const ticket = playground.register({ id: 'workspace-bottom' })

  onMounted(() => {
    if (breakpoints.isMobile.value || (!side.value || left.value)) ticket.select()
  })

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <Discovery.Activator
    v-if="ticket.isSelected.value"
    active-class="rounded-lg"
    as="div"
    class="flex flex-1"
    step="preview"
  >
    <slot />
  </Discovery.Activator>
</template>

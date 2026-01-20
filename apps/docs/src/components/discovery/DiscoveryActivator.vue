<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef } from 'vue'

  const {
    step,
    as = 'span',
  } = defineProps<{
    step: string | number
    as?: string
  }>()

  const discovery = useDiscovery()

  const activatorRef = useTemplateRef<HTMLElement>('activator')
  const ticket = discovery.register({ id: step, type: 'activator', element: activatorRef })

  onBeforeUnmount(() => {
    discovery.unregister(step)
  })

  // CSS anchor positioning: set anchor-name so Content can position relative to this
  const style = toRef(() => ({
    anchorName: `--discovery-${ticket.id}`,
  }))
</script>

<template>
  <component :is="as" ref="activator" :style>
    <slot />
  </component>
</template>

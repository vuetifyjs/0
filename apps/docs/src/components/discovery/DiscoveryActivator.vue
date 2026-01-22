<script setup lang="ts">
  // Framework
  import { toArray } from '@vuetify/v0'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef } from 'vue'

  type ID = string | number

  const {
    step,
    as = 'span',
    padding,
  } = defineProps<{
    step: ID | ID[]
    as?: string
    /** Padding around the highlighted area */
    padding?: number
  }>()

  const discovery = useDiscovery()
  const activatorRef = useTemplateRef<HTMLElement>('activator')

  const steps = toArray(step)
  const tickets = steps.map(id => discovery.register({ id, type: 'activator', element: activatorRef, padding }))

  onBeforeUnmount(() => {
    for (const ticket of tickets) {
      discovery.unregister(ticket.id, 'activator')
    }
  })

  // CSS anchor positioning: set anchor-name so Content can position relative to this
  const style = toRef(() => ({
    anchorName: tickets.map(t => `--discovery-${t.id}`).join(', '),
  }))
</script>

<template>
  <component :is="as" ref="activator" :style>
    <slot />
  </component>
</template>

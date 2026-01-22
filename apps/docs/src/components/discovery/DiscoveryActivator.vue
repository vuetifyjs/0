<script setup lang="ts">
  // Framework
  import { toArray } from '@vuetify/v0'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { nextTick, onBeforeUnmount, onMounted, toRef, useTemplateRef, watch } from 'vue'

  type ID = string | number

  const {
    step,
    as = 'span',
    padding,
    scrollDelay = 0,
  } = defineProps<{
    step: ID | ID[]
    as?: string
    /** Padding around the highlighted area */
    padding?: number
    /** Delay in ms before scrolling into view (for animated elements) */
    scrollDelay?: number
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

  // Scroll into view when this step becomes active
  async function scrollIntoViewIfActive () {
    if (!steps.includes(discovery.selectedId.value as ID)) return
    await nextTick()
    if (scrollDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, scrollDelay))
    }
    activatorRef.value?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }

  // Handle dynamically mounted activators (step already active when mounted)
  onMounted(scrollIntoViewIfActive)

  // Handle step becoming active after mount
  watch(() => discovery.selectedId.value, scrollIntoViewIfActive)

  // CSS anchor positioning: set anchor-name so Content can position relative to this
  // scroll-margin-bottom provides extra room when scrollIntoView with block: 'end'
  const style = toRef(() => ({
    anchorName: tickets.map(t => `--discovery-${t.id}`).join(', '),
    scrollMarginBottom: '100px',
  }))
</script>

<template>
  <component :is="as" ref="activator" :style>
    <slot />
  </component>
</template>

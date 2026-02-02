<script setup lang="ts">
  // Framework
  import { toArray } from '@vuetify/v0'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { nextTick, onBeforeUnmount, onMounted, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0/types'

  const {
    step,
    as = 'span',
    padding,
    activeClass,
  } = defineProps<{
    step: ID | ID[]
    as?: string
    /** Padding around the highlighted area */
    padding?: number
    /** Class to apply when this step is active */
    activeClass?: string
  }>()

  const discovery = useDiscovery()
  const activatorRef = useTemplateRef<HTMLElement>('activator')

  const steps = toArray(step)
  const tickets = steps.map(id => discovery.activators.register({ id, element: activatorRef, padding }))

  onBeforeUnmount(() => {
    for (const ticket of tickets) {
      discovery.activators.unregister(ticket.id)
    }
  })

  // Scroll into view when this step becomes active
  async function scrollIntoViewIfActive () {
    if (!steps.includes(discovery.selectedId.value as ID)) return
    await nextTick()
    activatorRef.value?.scrollIntoView({ block: 'end', behavior: 'instant' })
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

  const isActive = toRef(() => steps.includes(discovery.selectedId.value as ID))
</script>

<template>
  <component :is="as" ref="activator" :class="isActive && activeClass" :style>
    <slot />
  </component>
</template>

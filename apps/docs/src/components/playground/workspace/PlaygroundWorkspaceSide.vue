<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'
  import { Discovery } from '@/components/discovery'

  // Utilities
  import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

  // Types
  import type { SplitterPanelExpose } from '@vuetify/v0'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const side = storage.get('playground-preview-right', false)
  const left = storage.get('playground-left-open', true)

  const ticket = playground.register({ id: 'preview-side' })
  const panel = useTemplateRef<SplitterPanelExpose>('panel')

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  onMounted(() => {
    if (!breakpoints.isMobile.value && side.value && !left.value) ticket.select()
    else nextTick(() => panel.value?.collapse())
  })

  // Ticket drives collapse/expand
  watch(() => ticket.isSelected.value, selected => {
    if (selected) panel.value?.expand()
    else panel.value?.collapse()
  })

</script>

<template>
  <PlaygroundSplitterHandle
    direction="horizontal"
    :hidden="!ticket.isSelected.value"
  />

  <SplitterPanel
    ref="panel"
    :collapsed-size="0"
    collapsible
    :default-size="30"
    :max-size="55"
    :min-size="15"
  >
    <Discovery.Activator
      v-if="ticket.isSelected.value"
      active-class="rounded-lg"
      as="div"
      class="flex flex-col h-full"
      step="preview"
    >
      <slot />
    </Discovery.Activator>
  </SplitterPanel>
</template>

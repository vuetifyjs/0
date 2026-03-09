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

  const ticket = playground.register({ id: 'workspace-bottom' })
  const panel = useTemplateRef<SplitterPanelExpose>('panel')

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  onMounted(() => {
    if (breakpoints.isMobile.value || !side.value || left.value) ticket.select()
    else nextTick(() => panel.value?.collapse())
  })

  watch(() => ticket.isSelected.value, selected => {
    if (selected) panel.value?.expand()
    else panel.value?.collapse()
  })

</script>

<template>
  <SplitterPanel
    ref="panel"
    :collapsed-size="0"
    collapsible
    :default-size="40"
    :min-size="10"
  >
    <Discovery.Activator
      v-if="ticket.isSelected.value"
      active-class="rounded-lg"
      as="div"
      class="flex flex-1 h-full"
      step="preview"
    >
      <slot />
    </Discovery.Activator>
  </SplitterPanel>
</template>

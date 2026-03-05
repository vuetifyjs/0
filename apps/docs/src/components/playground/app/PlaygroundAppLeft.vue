<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const left = storage.get('playground-left-open', true)

  const ticket = playground.register({ id: 'playground-left' })

  const isMobile = breakpoints.isMobile

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })

  // Bridge between Splitter collapse/expand and playground ticket
  const panelApi = ref<{ collapse: () => void, expand: () => void }>()

  function capture (slot: { collapse: () => void, expand: () => void }) {
    panelApi.value = slot
    return false
  }

  // Select ticket then collapse if not visible
  onMounted(() => {
    if (left.value && !isMobile.value) ticket.select()
    else nextTick(() => panelApi.value?.collapse())
  })

  // Ticket drives collapse/expand
  watch(() => ticket.isSelected.value, selected => {
    if (isMobile.value) return
    if (selected) panelApi.value?.expand()
    else panelApi.value?.collapse()
  })

  // Drag-to-collapse drives ticket
  function onResize (size: number) {
    if (isMobile.value) return
    if (size === 0 && ticket.isSelected.value) {
      left.value = false
      ticket.unselect()
    } else if (size > 0 && !ticket.isSelected.value) {
      left.value = true
      ticket.select()
    }
  }

  const stack = useStack()
  const stackTicket = stack.register({ onDismiss: () => playground.toggle('playground-left') })

  watch(() => ticket.isSelected.value && isMobile.value, open => {
    if (open) stackTicket.select()
    else stackTicket.unselect()
  }, { immediate: true })

</script>

<template>
  <!-- Panel always rendered for stable Splitter indexing -->
  <SplitterPanel
    v-slot="slot"
    :collapsed-size="0"
    collapsible
    :default-size="30"
    :max-size="45"
    :min-size="30"
    @resize="onResize"
  >
    <template v-if="capture(slot)" />

    <!-- Desktop: inline content -->
    <div
      v-if="!isMobile && !slot.isCollapsed"
      class="bg-glass-surface h-full flex flex-col"
    >
      <slot />
    </div>
  </SplitterPanel>

  <PlaygroundSplitterHandle
    direction="horizontal"
    :hidden="isMobile || !ticket.isSelected.value"
  />

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed inset-0 bg-surface border-r border-divider flex flex-col transition-transform duration-200"
    :class="ticket.isSelected.value ? 'translate-x-0' : '-translate-x-full'"
    :inert="ticket.isSelected.value ? undefined : true"
    :style="{ zIndex: stackTicket.zIndex.value }"
  >
    <slot />
  </div>
</template>

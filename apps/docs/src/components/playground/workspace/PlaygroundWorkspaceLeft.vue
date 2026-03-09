<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()

  const ticket = playground.register({ id: 'workspace-left' })

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
    if (isMobile.value) {
      nextTick(() => panelApi.value?.collapse())
    } else {
      ticket.select()
    }
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
    if (size === 0 && ticket.isSelected.value) ticket.unselect()
    else if (size > 0 && !ticket.isSelected.value) ticket.select()
  }

  const stack = useStack()
  const stackTicket = stack.register({ onDismiss: () => playground.toggle('workspace-left') })

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
    :default-size="20"
    :max-size="35"
    :min-size="15"
    @resize="onResize"
  >
    <template v-if="capture(slot)" />

    <!-- Desktop: inline content -->
    <div v-if="!isMobile && !slot.isCollapsed">
      <slot />
    </div>
  </SplitterPanel>

  <PlaygroundSplitterHandle
    direction="horizontal"
    :hidden="isMobile || !ticket.isSelected.value || !playground.selectedIds.has('workspace-right')"
  />

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed top-0 bottom-0 left-0 w-[280px] bg-surface border-r border-divider flex flex-col transition-transform duration-200"
    :class="ticket.isSelected.value ? 'translate-x-0' : '-translate-x-full'"
    :inert="ticket.isSelected.value ? undefined : true"
    :style="{ zIndex: stackTicket.zIndex.value }"
  >
    <header class="shrink-0 px-4 py-3 border-b border-divider flex items-center justify-between">
      <div class="flex items-center gap-2">
        <AppIcon aria-hidden="true" icon="folder" />
        <span class="font-medium">Tree</span>
      </div>

      <AppCloseButton label="Close file tree" @click="playground.toggle('workspace-left')" />
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack } from '@vuetify/v0'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { toRef, watch } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const isMobile = breakpoints.isMobile
  const open = toRef(() => playground.left.value)

  const stack = useStack()
  const ticket = stack.register({ onDismiss: () => {
    playground.left.value = false
  } })

  watch(() => open.value && isMobile.value, visible => {
    if (visible) ticket.select()
    else ticket.unselect()
  }, { immediate: true })
</script>

<template>
  <!-- Desktop: SplitterPanel is ALWAYS mounted to preserve registration order
       with the SplitterRoot. Unmounting on mobile would cause it to re-register
       at the end, inverting panel order and breaking drag direction. -->
  <SplitterPanel
    :default-size="30"
    :max-size="45"
    :min-size="open && !isMobile ? 30 : 0"
  >
    <div
      v-if="!isMobile && open"
      class="bg-surface h-full min-w-0 flex flex-col overflow-hidden"
    >
      <slot />
    </div>
  </SplitterPanel>

  <PlaygroundSplitterHandle
    v-if="!isMobile"
    direction="horizontal"
    :hidden="!open"
  />

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed inset-0 bg-surface border-e border-divider flex flex-col transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'"
    :inert="open ? undefined : true"
    :style="{ zIndex: ticket.zIndex.value }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed, toRef, watch } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const isMobile = breakpoints.isMobile
  const open = toRef(() => !playground.left.value)

  // Splitter always collapsed on mobile; synced with context on desktop
  const collapsed = computed({
    get: () => isMobile.value || playground.left.value,
    set: v => {
      playground.left.value = v
    },
  })

  const stack = useStack()
  const stackTicket = stack.register({ onDismiss: () => {
    playground.left.value = true
  } })

  watch(() => open.value && isMobile.value, visible => {
    if (visible) stackTicket.select()
    else stackTicket.unselect()
  }, { immediate: true })
</script>

<template>
  <!-- Panel always rendered for stable Splitter indexing -->
  <SplitterPanel
    v-model:collapsed="collapsed"
    :collapsed-size="0"
    collapsible
    :default-size="30"
    :max-size="45"
    :min-size="30"
  >
    <!-- Desktop: inline content -->
    <div
      v-if="!isMobile && open"
      class="bg-glass-surface h-full flex flex-col"
    >
      <slot />
    </div>
  </SplitterPanel>

  <PlaygroundSplitterHandle
    direction="horizontal"
    :hidden="isMobile || !open"
  />

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed inset-0 bg-surface border-r border-divider flex flex-col transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    :inert="open ? undefined : true"
    :style="{ zIndex: stackTicket.zIndex.value }"
  >
    <slot />
  </div>
</template>

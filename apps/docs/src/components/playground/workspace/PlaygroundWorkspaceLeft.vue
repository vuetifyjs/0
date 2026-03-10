<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { computed, toRef, watch } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const isMobile = breakpoints.isMobile
  const open = toRef(() => !playground.tree.value)

  // Splitter always collapsed on mobile; synced with context on desktop
  const collapsed = computed({
    get: () => isMobile.value || playground.tree.value,
    set: v => {
      playground.tree.value = v
    },
  })

  const stack = useStack()
  const ticket = stack.register({ onDismiss: () => {
    playground.tree.value = true
  } })

  watch(() => open.value && isMobile.value, visible => {
    if (visible) ticket.select()
    else ticket.unselect()
  }, { immediate: true })
</script>

<template>
  <!-- Panel always rendered for stable Splitter indexing -->
  <SplitterPanel
    v-model:collapsed="collapsed"
    :collapsed-size="0"
    collapsible
    :default-size="20"
    :max-size="35"
    :min-size="15"
  >
    <!-- Desktop: inline content -->
    <div v-if="!isMobile && open">
      <slot />
    </div>
  </SplitterPanel>

  <PlaygroundSplitterHandle
    direction="horizontal"
    :hidden="isMobile || !open || !playground.editor.value"
  />

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed top-0 bottom-0 left-0 w-[280px] bg-surface border-r border-divider flex flex-col transition-transform duration-200"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    :inert="open ? undefined : true"
    :style="{ zIndex: ticket.zIndex.value }"
  >
    <header class="shrink-0 px-4 py-3 border-b border-divider flex items-center justify-between">
      <div class="flex items-center gap-2">
        <AppIcon aria-hidden="true" icon="folder" />
        <span class="font-medium">Tree</span>
      </div>

      <AppCloseButton label="Close file tree" @click="playground.tree.value = true" />
    </header>

    <slot />
  </div>
</template>

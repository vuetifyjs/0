<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints, useStack } from '@vuetify/v0'

  // Components
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
  <!-- Desktop: only render SplitterPanel when open. When closed, the panel
       is removed entirely so PlaygroundAppRight takes full width naturally.
       No collapse timing issues — the Splitter never needs to redistribute. -->
  <template v-if="!isMobile && open">
    <SplitterPanel
      :default-size="30"
      :max-size="45"
      :min-size="30"
    >
      <div class="bg-surface h-full min-w-0 flex flex-col overflow-hidden">
        <slot />
      </div>
    </SplitterPanel>

    <PlaygroundSplitterHandle direction="horizontal" />
  </template>

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

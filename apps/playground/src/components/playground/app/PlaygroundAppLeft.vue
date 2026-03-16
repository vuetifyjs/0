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
  const open = toRef(() => playground.left.value)

  const collapsed = computed({
    get: () => !playground.left.value,
    set: v => {
      playground.left.value = !v
    },
  })

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
  <template v-if="!isMobile">
    <SplitterPanel
      v-model:collapsed="collapsed"
      :collapsed-size="0"
      collapsible
      :default-size="30"
      :max-size="45"
      :min-size="30"
    >
      <div
        v-if="open"
        class="bg-surface h-full min-w-0 flex flex-col overflow-hidden"
      >
        <slot />
      </div>
    </SplitterPanel>

    <PlaygroundSplitterHandle
      direction="horizontal"
      :hidden="!open"
    />
  </template>

  <!-- Mobile: fixed drawer -->
  <div
    v-if="isMobile"
    class="fixed inset-0 bg-surface border-e border-divider flex flex-col transition-transform duration-200"
    :class="open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'"
    :inert="open ? undefined : true"
    :style="{ zIndex: ticket.zIndex.value }"
  >
    <slot />
  </div>
</template>

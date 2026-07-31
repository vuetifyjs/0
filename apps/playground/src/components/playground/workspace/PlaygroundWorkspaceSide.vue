<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()

  // Drag-to-collapse must flip placement, not just hide the side preview.
  // side/bottom are mutually exclusive (see onSide/onIntro) — collapsing the
  // side panel without setting bottom leaves the preview mounted nowhere.
  const collapsed = computed({
    get: () => !playground.side.value,
    set: v => {
      playground.side.value = !v
      playground.bottom.value = v
    },
  })
</script>

<template>
  <template v-if="!isMobile">
    <PlaygroundSplitterHandle
      direction="horizontal"
      :hidden="!playground.side.value"
    />

    <SplitterPanel
      v-model:collapsed="collapsed"
      :collapsed-size="0"
      collapsible
      :default-size="30"
      :max-size="55"
      :min-size="15"
    >
      <div
        v-if="playground.side.value"
        class="flex flex-col h-full"
      >
        <slot />
      </div>
    </SplitterPanel>
  </template>
</template>

<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()

  const collapsed = computed({
    get: () => !playground.bottom.value,
    set: v => {
      playground.bottom.value = !v
    },
  })
</script>

<template>
  <!-- Desktop: splitter panel for bottom preview -->
  <SplitterPanel
    v-if="!isMobile && !playground.side.value"
    v-model:collapsed="collapsed"
    :collapsed-size="0"
    collapsible
    :default-size="40"
    :min-size="10"
  >
    <div
      v-if="playground.bottom.value"
      class="flex flex-1 h-full"
    >
      <slot />
    </div>
  </SplitterPanel>

  <!-- Mobile: full-height preview when editor is hidden -->
  <div
    v-else-if="isMobile && !playground.editor.value"
    class="flex flex-1 min-h-0"
  >
    <slot />
  </div>
</template>

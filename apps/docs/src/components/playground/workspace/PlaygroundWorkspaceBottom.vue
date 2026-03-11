<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'
  import { Discovery } from '@/components/discovery'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()
</script>

<template>
  <!-- Desktop: splitter panel for bottom preview -->
  <SplitterPanel
    v-if="!isMobile && playground.side.value"
    v-model:collapsed="playground.bottom.value"
    :collapsed-size="0"
    collapsible
    :default-size="40"
    :min-size="10"
  >
    <Discovery.Activator
      v-if="!playground.bottom.value"
      active-class="rounded-lg"
      as="div"
      class="flex flex-1 h-full"
      step="preview"
    >
      <slot />
    </Discovery.Activator>
  </SplitterPanel>

  <!-- Mobile: full-height preview when editor is hidden -->
  <div
    v-else-if="isMobile && !playground.editor.value"
    class="flex flex-1 min-h-0"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

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

  <!-- Mobile: keep preview mounted so the iframe survives editor↔preview toggles.
       CSS hide instead of v-if to match how WorkspaceTop keeps the editor alive. -->
  <div
    v-else-if="isMobile"
    class="flex min-h-0"
    :class="!playground.editor.value ? 'flex-1' : 'h-0 overflow-hidden'"
  >
    <slot />
  </div>
</template>

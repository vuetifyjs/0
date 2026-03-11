<script setup lang="ts">
  // Framework
  import { SplitterPanel, useBreakpoints } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()
</script>

<template>
  <SplitterPanel v-if="!isMobile" :default-size="50" :min-size="20">
    <div
      v-if="playground.editor.value"
      class="flex flex-col min-w-0 h-full"
    >
      <slot />
    </div>
  </SplitterPanel>

  <div
    v-else-if="playground.editor.value"
    class="flex flex-col min-w-0 flex-1"
  >
    <slot />
  </div>
</template>

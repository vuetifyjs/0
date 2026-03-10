<script setup lang="ts">
  // Framework
  import { SplitterPanel } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()
</script>

<template>
  <SplitterPanel :default-size="50" :min-size="20">
    <div
      v-if="playground.editor.value"
      class="flex flex-col min-w-0 h-full"
    >
      <slot />
    </div>
  </SplitterPanel>
</template>

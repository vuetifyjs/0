<script setup lang="ts">
  // Framework
  import { SplitterPanel } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'
  import { Discovery } from '@/components/discovery'

  const playground = usePlayground()
</script>

<template>
  <SplitterPanel
    v-if="playground.side.value"
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
</template>

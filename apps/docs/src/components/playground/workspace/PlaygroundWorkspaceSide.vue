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
  <template v-if="!isMobile">
    <PlaygroundSplitterHandle
      direction="horizontal"
      :hidden="playground.side.value"
    />

    <SplitterPanel
      v-model:collapsed="playground.side.value"
      :collapsed-size="0"
      collapsible
      :default-size="30"
      :max-size="55"
      :min-size="15"
    >
      <Discovery.Activator
        v-if="!playground.side.value"
        active-class="rounded-lg"
        as="div"
        class="flex flex-col h-full"
        step="preview"
      >
        <slot />
      </Discovery.Activator>
    </SplitterPanel>
  </template>
</template>

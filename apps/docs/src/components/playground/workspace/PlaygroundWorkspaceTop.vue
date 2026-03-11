<script setup lang="ts">
  // Framework
  import { SplitterPanel, SplitterRoot, useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()

  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-top-h-sizes', [])

  function onLayout (values: number[]) {
    sizes.value = values
  }

  const rootEl = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  onMounted(() => {
    if (sizes.value.length > 0) rootEl.value?.distribute(sizes.value)
  })
</script>

<template>
  <!-- Desktop: splitter layout -->
  <template v-if="!isMobile">
    <SplitterPanel :default-size="60" :max-size="playground.side.value ? 80 : 100" :min-size="20">
      <SplitterRoot ref="root" class="h-full" orientation="horizontal" @layout="onLayout">
        <slot />
      </SplitterRoot>
    </SplitterPanel>

    <PlaygroundSplitterHandle
      v-if="playground.side.value"
      direction="vertical"
    />
  </template>

  <!-- Mobile: editor takes full height when visible -->
  <div v-else-if="playground.editor.value" class="flex-1 min-h-0 flex">
    <slot />
  </div>
</template>

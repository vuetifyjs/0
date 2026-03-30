<script setup lang="ts">
  // Framework
  import { SplitterPanel, SplitterRoot, useBreakpoints, useStorage } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()

  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-top-h-sizes', [])

  function onLayout (values: number[]) {
    // Don't persist collapsed distributions — preserve the user's
    // preferred split so it can be restored when the panel reopens.
    if (values[0]! > 0) sizes.value = values
  }

  const rootEl = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  onMounted(() => {
    if (sizes.value.length === 0) return

    // If tree is collapsed, zero out its size and give it to the editor
    if (!playground.tree.value && sizes.value.length >= 2) {
      const adjusted = [...sizes.value]
      adjusted[1]! += adjusted[0]!
      adjusted[0] = 0
      rootEl.value?.distribute(adjusted)
    } else {
      rootEl.value?.distribute(sizes.value)
    }
  })
</script>

<template>
  <!-- Desktop: splitter layout -->
  <template v-if="!isMobile">
    <SplitterPanel :default-size="60" :max-size="!playground.side.value ? 80 : 100" :min-size="20">
      <SplitterRoot ref="root" class="h-full" orientation="horizontal" @layout="onLayout">
        <slot />
      </SplitterRoot>
    </SplitterPanel>

    <PlaygroundSplitterHandle
      v-if="!playground.side.value"
      direction="vertical"
    />
  </template>

  <!-- Mobile: always render so tree drawer (position:fixed) stays mounted -->
  <div
    v-else
    class="flex min-h-0"
    :class="playground.editor.value ? 'flex-1' : 'h-0 overflow-hidden'"
  >
    <slot />
  </div>
</template>

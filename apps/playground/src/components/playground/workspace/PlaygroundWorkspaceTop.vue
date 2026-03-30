<script setup lang="ts">
  // Framework
  import { SplitterPanel, SplitterRoot, useBreakpoints, useStorage } from '@vuetify/v0'

  // Utilities
  import { nextTick, onMounted, useTemplateRef, watch } from 'vue'

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

  function distribute () {
    if (sizes.value.length < 2) return

    if (playground.tree.value) {
      rootEl.value?.distribute(sizes.value)
    } else {
      const adjusted = [...sizes.value]
      adjusted[1]! += adjusted[0]!
      adjusted[0] = 0
      rootEl.value?.distribute(adjusted)
    }
  }

  onMounted(distribute)

  watch(() => playground.tree.value, () => nextTick(distribute), { flush: 'post' })
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

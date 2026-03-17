<script setup lang="ts">
  // Framework
  import { SplitterRoot, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  const playground = usePlayground()
  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-h-sizes', [])

  function onLayout (values: number[]) {
    sizes.value = values
  }

  const root = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  onMounted(() => {
    if (!playground.left.value) {
      // SplitterPanel's collapsed watch (immediate + flush:post) fires before
      // sibling panels register, so collapse() silently fails. By onMounted,
      // all panels are registered — force the collapsed layout directly.
      root.value?.distribute([0, 100])
    } else if (sizes.value.length > 0) {
      root.value?.distribute(sizes.value)
    }
  })
</script>

<template>
  <SplitterRoot
    ref="root"
    class="flex-1 min-h-0"
    orientation="horizontal"
    @layout="onLayout"
  >
    <slot />
  </SplitterRoot>
</template>

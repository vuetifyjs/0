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

  // Only restore persisted sizes when the left panel is open.
  // When closed, the SplitterPanel's collapsed model handles sizing
  // via collapse() — distributing stale sizes here would override it.
  onMounted(() => {
    if (sizes.value.length > 0 && playground.left.value) {
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

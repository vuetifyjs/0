<script setup lang="ts">
  // Framework
  import { SplitterRoot, useBreakpoints, useStorage } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  const { isMobile } = useBreakpoints()

  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-v-sizes', [])

  function onLayout (values: number[]) {
    sizes.value = values
  }

  const rootEl = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  onMounted(() => {
    if (sizes.value.length > 0) rootEl.value?.distribute(sizes.value)
  })
</script>

<template>
  <SplitterRoot
    v-if="!isMobile"
    ref="root"
    class="h-full select-none"
    orientation="vertical"
    @layout="onLayout"
  >
    <slot />
  </SplitterRoot>

  <div v-else class="h-full select-none flex flex-col">
    <slot />
  </div>
</template>

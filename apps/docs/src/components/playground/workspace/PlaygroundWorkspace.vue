<script setup lang="ts">
  // Framework
  import { SplitterRoot, useStorage } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-v-sizes', [])

  function onLayout (values: number[]) {
    sizes.value = values
  }

  const root = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  onMounted(() => {
    if (sizes.value.length > 0) root.value?.distribute(sizes.value)
  })
</script>

<template>
  <SplitterRoot ref="root" class="h-full select-none" orientation="vertical" @layout="onLayout">
    <slot />
  </SplitterRoot>
</template>

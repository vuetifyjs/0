<script setup lang="ts">
  // Framework
  import { SplitterRoot, useBreakpoints, useStorage } from '@vuetify/v0'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { nextTick, onMounted, useTemplateRef, watch } from 'vue'

  const playground = usePlayground()
  const { isMobile } = useBreakpoints()
  const storage = useStorage()
  const sizes = storage.get<number[]>('playground-h-sizes', [])

  function onLayout (values: number[]) {
    // Don't persist collapsed distributions — preserve the user's
    // preferred split so it can be restored when the panel reopens.
    if (values[0]! > 0) sizes.value = values
  }

  const root = useTemplateRef<{ distribute: (sizes: number[]) => void }>('root')

  function distribute () {
    // On mobile or when left panel is closed, collapse to zero.
    // The SplitterPanel stays mounted to preserve registration order,
    // so its flex must be explicitly zeroed.
    if (isMobile.value || !playground.left.value) {
      root.value?.distribute([0, 100])
    } else if (sizes.value.length > 0) {
      root.value?.distribute(sizes.value)
    }
  }

  onMounted(distribute)

  // The chooser unmounts this splitter. onMounted does not run again when
  // it comes back, so a closed intro would keep the default 30% gap.
  watch(root, value => {
    if (!value) return
    nextTick(distribute)
  }, { flush: 'post' })

  // Re-distribute when left panel toggles or viewport changes.
  // flush: 'post' + nextTick ensures this runs after the Splitter's
  // own auto-redistribute watcher has settled.
  watch(
    () => [playground.left.value, isMobile.value] as const,
    () => nextTick(distribute),
    { flush: 'post' },
  )
</script>

<template>
  <PlaygroundChoose v-if="playground.choosing.value" />

  <SplitterRoot
    v-else
    ref="root"
    class="flex-1 min-h-0"
    orientation="horizontal"
    @layout="onLayout"
  >
    <slot />
  </SplitterRoot>
</template>

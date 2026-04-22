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

  // Snapshot preferred sizes immediately — layout events during mount
  // (including HMR-triggered auto-redistribution) can overwrite storage
  // with default values before our distribute() runs.
  let preferred = sizes.value.length > 0 ? [...sizes.value] : []

  let settled = false

  function onLayout (values: number[]) {
    if (!settled) return
    // Don't persist collapsed distributions — preserve the user's
    // preferred split so it can be restored when the panel reopens.
    if (values[0]! > 0) {
      preferred = values
      sizes.value = values
    }
  }

  const rootEl = useTemplateRef<{ distribute: (sizes: number[]) => void, dragging: boolean }>('root')

  function distribute () {
    if (preferred.length < 2) return

    if (playground.tree.value) {
      rootEl.value?.distribute(preferred)
    } else {
      const adjusted = [...preferred]
      adjusted[1]! += adjusted[0]!
      adjusted[0] = 0
      rootEl.value?.distribute(adjusted)
    }
  }

  onMounted(() => {
    distribute()
    nextTick(() => {
      settled = true
    })
  })

  // Snapshot preferred BEFORE nextTick — SplitterPanel's collapsed watcher
  // (also flush: post, fires after ours) triggers expand() → onLayout
  // which would overwrite preferred before the nextTick can use it.
  // Skip during drag — the Splitter positions the panel directly.
  watch(() => playground.tree.value, () => {
    if (rootEl.value?.dragging) return

    const snapshot = [...preferred]
    nextTick(() => {
      if (snapshot.length < 2) return

      if (playground.tree.value) {
        rootEl.value?.distribute(snapshot)
      } else {
        snapshot[1]! += snapshot[0]!
        snapshot[0] = 0
        rootEl.value?.distribute(snapshot)
      }
    })
  }, { flush: 'post' })
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

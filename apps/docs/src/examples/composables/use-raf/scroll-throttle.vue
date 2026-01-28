<script setup lang="ts">
  import { useRaf } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const containerRef = useTemplateRef<HTMLElement>('container')
  const scrollTop = shallowRef(0)
  const scrollPercent = shallowRef(0)
  const updateCount = shallowRef(0)

  // useRaf deduplicates rapid scroll events to one update per frame
  const updateScroll = useRaf(() => {
    if (!containerRef.value) return

    const el = containerRef.value
    scrollTop.value = Math.round(el.scrollTop)
    scrollPercent.value = Math.round(
      (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100,
    )
    updateCount.value++
  })

  function onScroll () {
    // Each scroll event triggers a RAF request
    // Rapid events are deduplicated - only one callback per frame
    updateScroll()
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4 text-sm">
      <div class="px-3 py-1.5 rounded bg-surface-variant text-on-surface-variant">
        Scroll: <span class="font-mono">{{ scrollTop }}px</span>
      </div>
      <div class="px-3 py-1.5 rounded bg-surface-variant text-on-surface-variant">
        Progress: <span class="font-mono">{{ scrollPercent }}%</span>
      </div>
      <div class="px-3 py-1.5 rounded bg-primary text-on-primary">
        RAF updates: <span class="font-mono">{{ updateCount }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-2 bg-surface-variant rounded-full overflow-hidden">
      <div
        class="h-full bg-primary transition-all duration-75"
        :style="{ width: `${scrollPercent}%` }"
      />
    </div>

    <div
      ref="container"
      class="h-48 overflow-y-auto border border-divider rounded-lg"
      @scroll="onScroll"
    >
      <div class="p-4 space-y-4">
        <div
          v-for="i in 20"
          :key="i"
          class="p-4 rounded bg-surface-variant"
        >
          <p class="font-medium text-on-surface">Item {{ i }}</p>
          <p class="text-sm text-on-surface-variant">
            Scroll to see RAF throttling in action
          </p>
        </div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant text-center">
      Scroll rapidly - notice how RAF updates are throttled to one per frame
    </p>
  </div>
</template>

<script setup lang="ts">
  // Framework
  import { SplitterHandle, useSplitterRoot } from '@vuetify/v0'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { watch } from 'vue'

  const {
    direction,
    hidden = false,
  } = defineProps<{
    direction: 'horizontal' | 'vertical'
    hidden?: boolean
  }>()

  const splitter = useSplitterRoot()

  // Set document cursor during drag so it persists when moving off the handle
  watch(splitter.dragging, dragging => {
    if (!IN_BROWSER) return
    document.documentElement.style.cursor = dragging ? 'grabbing' : ''
  })

  function onDblclick (attrs: Record<string, unknown>) {
    const controlsId = attrs['aria-controls'] as string | undefined
    if (!controlsId) return

    const p = splitter.panels.get(controlsId)
    if (!p) return

    const index = p.index
    const after = splitter.panel(index + 1)
    if (!after) return

    const total = p.size + after.size

    // Use actual minSize/maxSize, not aria values (which include collapsedSize)
    const min = Math.max(p.minSize, total - after.maxSize)
    const max = Math.min(p.maxSize, total - after.minSize)

    // Cycle: if closer to max, snap to min; otherwise snap to max
    const mid = (min + max) / 2
    const target = p.size > mid ? min : max

    const sizes = splitter.panels.values().map(t => t.size)
    sizes[index] = target
    sizes[index + 1] = total - target
    splitter.distribute([...sizes])
  }
</script>

<template>
  <SplitterHandle v-slot="{ state, attrs }" renderless>
    <div
      v-bind="attrs"
      class="hidden md:block bg-divider relative hover:bg-primary transition-colors shrink-0"
      :class="[
        state !== 'drag' && (direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'),
        direction === 'horizontal' && 'w-[4px]',
        direction === 'vertical' && 'h-[4px]',
      ]"
      :style="hidden ? { display: 'none' } : undefined"
      @dblclick="onDblclick(attrs)"
    >
      <span
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-1 rounded inline-flex items-center justify-center bg-surface text-on-surface border border-divider"
        :class="[
          direction === 'horizontal' ? 'w-4 h-6' : 'w-6 h-4',
          state === 'drag' ? 'cursor-grabbing' : 'cursor-grab',
        ]"
      >
        <AppIcon
          :icon="direction === 'horizontal' ? 'drag-vertical' : 'drag-horizontal'"
          :size="16"
        />
      </span>
    </div>
  </SplitterHandle>
</template>

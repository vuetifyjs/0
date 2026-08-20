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
  <SplitterHandle v-slot="{ state, pending, attrs }" renderless>
    <div
      v-bind="attrs"
      class="hidden md:block bg-divider relative hover:bg-primary transition-colors shrink-0"
      :class="[
        state !== 'drag' && (direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'),
        direction === 'horizontal' && (pending ? 'w-[6px]' : 'w-[4px]'),
        direction === 'vertical' && (pending ? 'h-[6px]' : 'h-[4px]'),
        pending && '!bg-primary',
      ]"
      :style="hidden ? { display: 'none' } : undefined"
      @dblclick="onDblclick(attrs)"
    >
      <span
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-1 rounded inline-flex items-center justify-center bg-surface border transition-colors"
        :class="[
          direction === 'horizontal' ? 'w-4 h-6' : 'w-6 h-4',
          state === 'drag' ? 'cursor-grabbing' : 'cursor-grab',
          pending ? 'border-primary text-primary' : 'border-divider text-on-surface',
        ]"
      >
        <AppIcon
          :icon="direction === 'horizontal' ? 'drag-vertical' : 'drag-horizontal'"
          :size="16"
        />
      </span>

      <span
        v-if="pending"
        class="absolute left-1/2 top-1/2 z-2 whitespace-nowrap rounded border border-primary bg-surface px-2 py-1 text-xs font-medium text-primary shadow-sm pointer-events-none"
        :class="direction === 'horizontal' ? 'translate-x-3 -translate-y-1/2' : '-translate-x-1/2 translate-y-3'"
      >
        {{ pending === 'collapse' ? 'Release to hide' : 'Release to open' }}
      </span>
    </div>
  </SplitterHandle>
</template>

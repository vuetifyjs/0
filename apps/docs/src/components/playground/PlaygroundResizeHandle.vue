<script setup lang="ts">
// Utilities
  import { computed } from 'vue'

  const { direction, isResizing = false } = defineProps<{
    direction: 'col' | 'row'
    isResizing?: boolean
  }>()

  const emit = defineEmits<{
    pointerdown: [event: PointerEvent]
    dblclick: []
  }>()

  const classes = computed(() => ({
    'w-[4px]': direction === 'col',
    'cursor-col-resize': direction === 'col' && !isResizing,
    'h-[4px]': direction === 'row',
    'cursor-row-resize': direction === 'row' && !isResizing,
    'bg-primary cursor-grabbing': isResizing,
  }))
</script>

<template>
  <div
    class="bg-divider relative z-10 hover:bg-primary transition-colors"
    :class="classes"
    @dblclick="emit('dblclick')"
    @pointerdown="emit('pointerdown', $event)"
  >
    <span
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded inline-flex items-center justify-center bg-surface text-on-surface border border-divider"
      :class="direction === 'col' ? 'w-4 h-6' : 'w-6 h-4'"
    >
      <AppIcon
        :icon="direction === 'col' ? 'drag-vertical' : 'drag-horizontal'"
        :size="16"
      />
    </span>
  </div>
</template>

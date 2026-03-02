<script setup lang="ts">
  import { createTimeline, useProxyRegistry } from '@vuetify/v0'
  import { computed, shallowRef, toRef } from 'vue'
  import { provideCanvas } from './context'
  import type { Stroke } from './context'

  const timeline = createTimeline<{ value: Stroke }>({ size: 20, events: true })
  const proxy = useProxyRegistry(timeline)

  const redoStackSize = shallowRef(0)
  const canUndo = toRef(() => proxy.size > 0)
  const canRedo = toRef(() => redoStackSize.value > 0)

  const strokes = computed(() => proxy.values.map(t => t.value))
  const size = computed(() => proxy.size)

  function add (stroke: Stroke) {
    timeline.register({ value: [...stroke] })
    redoStackSize.value = 0
  }

  function undo () {
    if (proxy.size === 0) return
    timeline.undo()
    redoStackSize.value++
  }

  function redo () {
    if (redoStackSize.value === 0) return
    timeline.redo()
    redoStackSize.value--
  }

  function clear () {
    timeline.clear()
    redoStackSize.value = 0
  }

  provideCanvas({ strokes, size, canUndo, canRedo, add, undo, redo, clear })
</script>

<template>
  <slot />
</template>

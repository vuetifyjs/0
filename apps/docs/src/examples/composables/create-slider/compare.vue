<script setup lang="ts">
  import CompareDisplay from './CompareDisplay.vue'
  import { useCompare } from './useCompare'

  const { split, dragging, track, onPointerdown } = useCompare()
</script>

<template>
  <div
    :ref="(el: HTMLElement) => { track = el }"
    class="max-w-lg mx-auto"
    :class="dragging && 'cursor-grabbing'"
  >
    <CompareDisplay :on-pointerdown="onPointerdown" :split="split" />
  </div>
</template>

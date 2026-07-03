<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { onBeforeUnmount, onMounted, toRef, useTemplateRef } from 'vue'

  import type { NavEntry, OverflowNav } from './useOverflowNav'

  const { nav, item, index } = defineProps<{
    nav: OverflowNav
    item: NavEntry
    index: number
  }>()

  const el = useTemplateRef<HTMLElement>('el')

  const visible = toRef(() => index < nav.overflow.capacity.value)
  const active = toRef(() => nav.active.value === item.id)

  // Measure once while every item is still visible (capacity starts at
  // Infinity before the ResizeObserver reports a width), then never re-measure.
  // Keeping the width in the map even after v-show hides the item lets capacity
  // recompute correctly when the container grows back.
  onMounted(() => nav.measure(index, el.value))
  onBeforeUnmount(() => nav.measure(index, null))
</script>

<template>
  <li
    v-show="visible"
    ref="el"
    class="shrink-0"
  >
    <Button.Root
      class="whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors"
      :class="active ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-variant'"
      @click="nav.select(item.id)"
    >
      {{ item.label }}
    </Button.Root>
  </li>
</template>

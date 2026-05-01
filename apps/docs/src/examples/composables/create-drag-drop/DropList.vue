<script setup lang="ts">
  import { useDragDrop } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  import DragItem from './DragItem.vue'

  type Item = { id: number, label: string }
  type Kinds = { type: 'item', value: Item }
  type Side = 'left' | 'right'

  const { items, side } = defineProps<{
    items: Item[]
    side: Side
  }>()

  const emit = defineEmits<{
    (e: 'move', item: Item, toSide: Side, toIndex: number): void
  }>()

  const dnd = useDragDrop<Kinds>()
  const el = useTemplateRef<HTMLElement | null>('el')

  const zone = dnd.zones.register({
    el,
    accept: ['item'],
    orientation: 'vertical',
    onDrop: (drag, position) => {
      if (position.index === undefined) return
      emit('move', drag.value, side, position.index)
    },
  })
</script>

<template>
  <div
    ref="el"
    v-bind="zone.attrs.value"
    class="flex-1 min-h-32 p-2 border rounded flex flex-col gap-2 transition-colors"
    :class="zone.isOver.value && zone.willAccept.value
      ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
      : 'border-divider bg-surface'"
  >
    <DragItem v-for="item in items" :key="item.id" :item />
  </div>
</template>

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
      // position.index is undefined when the zone has no children to resolve
      // against — fall back to the end of the list so empty-zone drops land.
      emit('move', drag.value, side, position.index ?? items.length)
    },
  })
</script>

<template>
  <div
    ref="el"
    v-bind="zone.attrs.value"
    class="flex-1 min-h-32 p-2 border rounded flex flex-col gap-2 transition-colors border-divider bg-surface data-[accepts]:border-primary data-[accepts]:bg-primary/10 data-[accepts]:ring-2 data-[accepts]:ring-primary/40"
  >
    <DragItem v-for="item in items" :key="item.id" :item />
  </div>
</template>

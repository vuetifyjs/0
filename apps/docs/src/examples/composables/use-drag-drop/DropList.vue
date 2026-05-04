<script setup lang="ts">
  import type { DragDropContext } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  import DragItem from './DragItem.vue'

  type Item = { id: number, label: string }
  type Kinds = { type: 'item', value: Item }
  type Side = 'left' | 'right'

  const { dnd, items, side } = defineProps<{
    dnd: DragDropContext<Kinds>
    items: Item[]
    side: Side
  }>()

  const emit = defineEmits<{
    (e: 'move', item: Item, toSide: Side, toIndex: number): void
  }>()

  const el = useTemplateRef<HTMLElement>('el')

  const zone = dnd.zones.register({
    el,
    accept: ['item'],
    orientation: 'vertical',
    onDrop: (drag, position) => {
      emit('move', drag.value, side, position.index ?? 0)
    },
  })
</script>

<template>
  <div
    ref="el"
    v-bind="zone.attrs.value"
    class="basis-48 grow min-h-32 p-2 border rounded flex flex-col gap-2 transition-colors border-divider bg-surface data-[accepts]:border-primary data-[accepts]:bg-primary/10 data-[accepts]:ring-2 data-[accepts]:ring-primary/40"
  >
    <DragItem v-for="item in items" :key="item.id" :dnd :item />
  </div>
</template>

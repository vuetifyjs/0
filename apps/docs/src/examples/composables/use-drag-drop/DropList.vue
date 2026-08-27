<script setup lang="ts">
  import { onBeforeUnmount, toRef, useTemplateRef } from 'vue'
  import { isNull, type DragDropContext } from '@vuetify/v0'

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
  const wrap = useTemplateRef<HTMLElement>('wrap')

  const zone = dnd.zones.register({
    el,
    accept: ['item'],
    orientation: 'vertical',
    onDrop: (drag, position) => {
      emit('move', drag.value, side, position.index ?? 0)
    },
  })

  const indicatorStyle = toRef(() => {
    const ind = zone.indicator.value
    const wrapEl = wrap.value
    if (isNull(ind) || isNull(wrapEl)) return undefined

    const wrapRect = wrapEl.getBoundingClientRect()
    const y = ind.edge === 'before' ? ind.rect.top : ind.rect.bottom

    return {
      top: `${y - wrapRect.top}px`,
      left: `${ind.rect.left - wrapRect.left}px`,
      width: `${ind.rect.width}px`,
    }
  })

  onBeforeUnmount(() => zone.unregister())
</script>

<template>
  <div ref="wrap" class="relative basis-48 grow">
    <div
      ref="el"
      class="min-h-32 p-2 border rounded flex flex-col gap-2 transition-colors border-divider bg-surface data-[accepts]:border-primary data-[accepts]:bg-primary/10 data-[accepts]:ring-2 data-[accepts]:ring-primary/40"
      :data-accepts="(zone.isOver.value && zone.willAccept.value) || undefined"
      data-dropzone
      :data-over="zone.isOver.value || undefined"
      role="list"
    >
      <DragItem v-for="item in items" :key="item.id" :dnd :item />
    </div>

    <div
      v-if="zone.indicator.value"
      aria-hidden="true"
      class="pointer-events-none absolute z-10 h-0.5 rounded-full bg-primary -translate-y-1/2"
      :style="indicatorStyle"
    />
  </div>
</template>

<script setup lang="ts">
  import { createDragDrop, useDragDrop } from '@vuetify/v0'
  import { defineComponent, h, ref, useTemplateRef } from 'vue'

  type Item = { id: number, label: string }
  type Kinds = { type: 'item', value: Item }

  const left = ref<Item[]>([
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
  ])
  const right = ref<Item[]>([])

  const dnd = createDragDrop<Kinds>()

  function move (value: Item, fromSide: 'left' | 'right', toSide: 'left' | 'right', toIndex: number) {
    const source = fromSide === 'left' ? left : right
    const target = toSide === 'left' ? left : right
    source.value = source.value.filter(i => i.id !== value.id)
    target.value.splice(toIndex, 0, value)
  }

  const DropList = defineComponent({
    props: {
      items: { type: Array as () => Item[], required: true },
      side: { type: String as () => 'left' | 'right', required: true },
    },
    setup (props) {
      const ctx = useDragDrop<Kinds>()
      const zoneEl = useTemplateRef<HTMLElement | null>('zone')
      const zone = ctx.zones.register({
        el: zoneEl,
        accept: ['item'],
        orientation: 'vertical',
        onDrop: (drag, position) => {
          const fromSide = left.value.some(i => i.id === drag.value.id) ? 'left' : 'right'
          move(drag.value, fromSide, props.side, position.index ?? props.items.length)
        },
      })

      return () => h('div', {
        ref: 'zone',
        class: [
          'flex-1 min-h-32 p-2 border rounded flex flex-col gap-2 transition-colors',
          zone.isOver.value && zone.willAccept.value
            ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
            : 'border-divider bg-surface',
        ],
      }, props.items.map(item => h(DragItem, { key: item.id, item })))
    },
  })

  const DragItem = defineComponent({
    props: { item: { type: Object as () => Item, required: true } },
    setup (props) {
      const ctx = useDragDrop<Kinds>()
      const itemEl = useTemplateRef<HTMLElement | null>('item')
      const ticket = ctx.draggables.register({
        el: itemEl,
        type: 'item',
        value: props.item,
      })

      return () => h('div', {
        'ref': 'item',
        'class': [
          'p-2 bg-primary text-on-primary rounded select-none',
          ticket.isDragging.value ? 'cursor-grabbing' : 'cursor-grab',
        ],
        'data-dragging': ticket.isDragging.value ? '' : undefined,
      }, props.item.label)
    },
  })
</script>

<template>
  <div class="flex gap-4" :class="dnd.isDragging.value && 'cursor-grabbing'">
    <DropList :items="left" side="left" />
    <DropList :items="right" side="right" />
  </div>
</template>

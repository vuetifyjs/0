<script setup lang="ts">
  import { createSortable, useDragDrop, useProxyRegistry } from '@vuetify/v0'
  import { onBeforeUnmount, toRef, useTemplateRef } from 'vue'

  import type { ID, SortableTicketInput } from '@vuetify/v0'

  import DraggableItem from './DraggableItem.vue'
  import { initialItems, type Item } from './data'

  interface ItemTicket extends SortableTicketInput {
    value: Item
  }

  type Kinds = { type: 'item', value: ID }

  const dnd = useDragDrop<Kinds>()
  const sortable = createSortable<ItemTicket>()

  sortable.onboard(initialItems.map(value => ({ value })))

  const proxy = useProxyRegistry(sortable)
  const container = useTemplateRef<HTMLElement>('container')
  const outer = useTemplateRef<HTMLElement>('outer')

  const zone = dnd.zones.register({
    el: container,
    accept: ['item'],
    orientation: 'vertical',
    onDrop: (drag, position) => {
      // `position.index` is computed against the pre-move list; sortable.move
      // removes the source first, so dragging downward needs a -1 adjustment.
      const from = sortable.get(drag.value)?.index ?? 0
      const to = position.index ?? 0
      sortable.move(drag.value, to > from ? to - 1 : to)
    },
  })

  onBeforeUnmount(() => zone.unregister())

  const indicatorStyle = toRef(() => {
    const ind = zone.indicator.value
    const wrapEl = outer.value
    const ulEl = container.value
    if (!ind || !wrapEl || !ulEl) return null

    const wrap = wrapEl.getBoundingClientRect()
    const kids = [...ulEl.children]
    if (kids.length === 0) return null

    let top
    if (ind.index <= 0) {
      top = kids[0]!.getBoundingClientRect().top
    } else if (ind.index >= kids.length) {
      top = kids.at(-1)!.getBoundingClientRect().bottom
    } else {
      const above = kids[ind.index - 1]!.getBoundingClientRect().bottom
      const below = kids[ind.index]!.getBoundingClientRect().top
      top = (above + below) / 2
    }

    const ref = kids[Math.min(ind.index, kids.length - 1)]!.getBoundingClientRect()

    return {
      top: `${top - wrap.top}px`,
      left: `${ref.left - wrap.left}px`,
      width: `${ref.width}px`,
      transform: 'translateY(-50%)',
    }
  })
</script>

<template>
  <div ref="outer" class="relative">
    <ul
      ref="container"
      class="flex flex-col gap-1 data-[dragging]:cursor-grabbing"
      :data-dragging="dnd.isDragging.value || undefined"
    >
      <TransitionGroup name="list">
        <DraggableItem
          v-for="ticket in proxy.values"
          :id="ticket.id"
          :key="ticket.id"
          :dnd
          :label="ticket.value!.label"
        />
      </TransitionGroup>
    </ul>

    <div
      v-if="zone.indicator.value"
      aria-hidden="true"
      class="indicator pointer-events-none absolute z-10 h-0.5 rounded-full bg-primary"
      :style="indicatorStyle"
    />
  </div>
</template>

<style scoped>
.list-move {
  transition: transform 0.25s ease-out;
}
.list-move[data-dragging] {
  transition: none;
}
.indicator {
  transition: top 0.12s ease-out, left 0.12s ease-out, width 0.12s ease-out;
}
</style>

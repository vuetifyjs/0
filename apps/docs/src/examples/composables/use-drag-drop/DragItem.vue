<script setup lang="ts">
  import { onBeforeUnmount, useTemplateRef } from 'vue'
  import type { DragDropContext } from '@vuetify/v0'

  type Item = { id: number, label: string }
  type Kinds = { type: 'item', value: Item }

  const { dnd, item } = defineProps<{
    dnd: DragDropContext<Kinds>
    item: Item
  }>()

  const el = useTemplateRef<HTMLElement>('el')

  const ticket = dnd.draggables.register({
    el,
    type: 'item',
    value: item,
  })

  onBeforeUnmount(() => ticket.unregister())
</script>

<template>
  <div
    ref="el"
    aria-roledescription="draggable"
    class="touch-none p-2 bg-primary text-on-primary rounded select-none cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:opacity-50"
    data-draggable
    :data-dragging="ticket.isDragging.value || undefined"
    role="listitem"
    tabindex="0"
  >
    {{ item.label }}
  </div>
</template>

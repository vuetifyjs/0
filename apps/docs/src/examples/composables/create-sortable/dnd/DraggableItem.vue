<script setup lang="ts">
  import { onBeforeUnmount, useTemplateRef } from 'vue'

  import type { DragDropContext, ID } from '@vuetify/v0'

  type Kinds = { type: 'item', value: ID }

  const { id, dnd } = defineProps<{
    id: ID
    label: string
    dnd: DragDropContext<Kinds>
  }>()

  const el = useTemplateRef<HTMLElement>('el')

  const ticket = dnd.draggables.register({
    el,
    type: 'item',
    value: id,
  })

  onBeforeUnmount(() => ticket.unregister())
</script>

<template>
  <li
    ref="el"
    aria-roledescription="draggable"
    class="flex items-center gap-2 rounded border border-divider bg-surface px-3 py-2 cursor-grab select-none touch-none data-[dragging]:cursor-grabbing data-[dragging]:opacity-50"
    data-draggable
    :data-dragging="ticket.isDragging.value || undefined"
    tabindex="0"
  >
    <span>{{ label }}</span>
  </li>
</template>

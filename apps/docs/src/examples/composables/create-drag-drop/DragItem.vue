<script setup lang="ts">
  import { useDragDrop } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  type Item = { id: number, label: string }
  type Kinds = { type: 'item', value: Item }

  const { item } = defineProps<{ item: Item }>()

  const dnd = useDragDrop<Kinds>()
  const el = useTemplateRef<HTMLElement | null>('el')

  const ticket = dnd.draggables.register({
    el,
    type: 'item',
    value: item,
  })
</script>

<template>
  <div
    ref="el"
    v-bind="ticket.attrs.value"
    class="p-2 bg-primary text-on-primary rounded select-none"
    :class="ticket.isDragging.value ? 'cursor-grabbing' : 'cursor-grab'"
  >
    {{ item.label }}
  </div>
</template>

<script setup lang="ts">
  import { createDragDrop } from '@vuetify/v0'
  import { ref } from 'vue'

  import DropList from './DropList.vue'

  type Item = { id: number, label: string }
  type Side = 'left' | 'right'
  type Kinds = { type: 'item', value: Item }

  const left = ref<Item[]>([
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry' },
  ])
  const right = ref<Item[]>([])

  const dnd = createDragDrop<Kinds>()

  function onMove (item: Item, toSide: Side, toIndex: number) {
    const fromList = left.value.some(i => i.id === item.id) ? left : right
    const toList = toSide === 'left' ? left : right
    fromList.value = fromList.value.filter(i => i.id !== item.id)
    toList.value.splice(toIndex, 0, item)
  }
</script>

<template>
  <div class="flex gap-4" :class="dnd.isDragging.value && 'cursor-grabbing'">
    <DropList :items="left" side="left" @move="onMove" />
    <DropList :items="right" side="right" @move="onMove" />
  </div>
</template>

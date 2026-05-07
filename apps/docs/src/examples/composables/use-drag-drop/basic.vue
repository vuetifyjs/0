<script setup lang="ts">
  import { useDragDrop } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

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
  const announcement = shallowRef('')

  const dnd = useDragDrop<Kinds>()

  function onMove (item: Item, toSide: Side, toIndex: number) {
    const fromList = left.value.some(i => i.id === item.id) ? left : right
    const toList = toSide === 'left' ? left : right
    fromList.value = fromList.value.filter(i => i.id !== item.id)
    toList.value.splice(toIndex, 0, item)
    announcement.value = `${item.label} moved to ${toSide}, position ${toIndex + 1}`
  }
</script>

<template>
  <div
    class="flex flex-wrap gap-4 data-[dragging]:cursor-grabbing"
    :data-dragging="dnd.isDragging.value || undefined"
  >
    <DropList :dnd :items="left" side="left" @move="onMove" />
    <DropList :dnd :items="right" side="right" @move="onMove" />
    <div aria-live="polite" class="sr-only" role="status">{{ announcement }}</div>
  </div>
</template>

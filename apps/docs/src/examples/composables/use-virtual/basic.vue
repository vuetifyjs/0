<script setup lang="ts">
  import { shallowRef, computed } from 'vue'
  import { useVirtual } from '@vuetify/v0'

  const items = shallowRef(
    Array.from({ length: 10_000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    })),
  )

  const {
    element,
    items: virtualItems,
    offset,
    size,
    scroll,
    scrollTo,
  } = useVirtual(items, { itemHeight: 40 })

  const stats = computed(() => ({
    total: items.value.length,
    rendered: virtualItems.value.length,
  }))

  const jumpTo = shallowRef('')
  function handleJumpTo () {
    const index = Number.parseInt(jumpTo.value) - 1

    if (index < 0 || index > items.value.length) return

    scrollTo(index)
  }

  function addItems () {
    const newItems = Array.from({ length: 100 }, (_, i) => ({
      id: items.value.length + i,
      name: `Item ${items.value.length + i + 1}`,
      value: Math.floor(Math.random() * 1000),
    }))
    items.value = [...items.value, ...newItems]
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center text-sm flex-wrap">
      <input
        v-model="jumpTo"
        class="px-2 py-1 border rounded w-24 flex-1 md:flex-none"
        placeholder="Jump to..."
        type="number"
        @keyup.enter="handleJumpTo"
      >

      <button class="px-3 py-1 border rounded hover:bg-gray-50" @click="handleJumpTo">
        Jump
      </button>

      <button class="px-3 py-1 border rounded hover:bg-gray-50" @click="addItems">
        Add 100
      </button>

      <span class="text-gray-600 ml-auto">
        {{ stats.rendered }} (rendered) / {{ stats.total }}
      </span>
    </div>

    <div
      ref="element"
      class="h-[300px] overflow-y-auto border rounded"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <div
        v-for="item in virtualItems"
        :key="item.index"
        class="h-[40px] px-4 flex items-center justify-between border-b hover:bg-gray-50"
      >
        <span class="font-mono text-sm">{{ item.raw.name }}</span>
        <span class="text-gray-600">{{ item.raw.value }}</span>
      </div>

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Framework
  import { useVirtual } from '@vuetify/v0'

  // Utilities
  import { computed, shallowRef } from 'vue'

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
        class="px-2 py-1 border border-divider bg-surface text-on-surface rounded w-24 flex-1 md:flex-none"
        placeholder="Jump to..."
        type="number"
        @keyup.enter="handleJumpTo"
      >

      <button class="px-3 py-1 border border-divider rounded hover:bg-surface-tint" @click="handleJumpTo">
        Jump
      </button>

      <button class="px-3 py-1 border border-divider rounded hover:bg-surface-tint" @click="addItems">
        Add 100
      </button>

      <span class="text-on-surface opacity-60 ml-auto">
        {{ stats.rendered }} (rendered) / {{ stats.total }}
      </span>
    </div>

    <div
      ref="element"
      class="h-[300px] overflow-y-auto border border-divider rounded"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <div
        v-for="item in virtualItems"
        :key="item.index"
        class="h-[40px] px-4 flex items-center justify-between border-b border-divider hover:bg-surface-tint"
      >
        <span class="font-mono text-sm text-on-surface">{{ item.raw.name }}</span>
        <span class="text-on-surface opacity-60">{{ item.raw.value }}</span>
      </div>

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>

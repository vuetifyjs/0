<script setup lang="ts">
  import { Button, NumberField, clamp, createVirtual } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'
  import type { Person } from './useDirectory'

  const { rows } = defineProps<{ rows: Person[] }>()

  const virtual = createVirtual(toRef(() => rows), { itemHeight: 44 })
  const { element, items, offset, size, scroll, scrollTo } = virtual

  const total = toRef(() => rows.length)
  const rendered = toRef(() => items.value.length)

  const target = shallowRef<number | null>(1)

  function onJump () {
    if (target.value == null) return

    const index = clamp(target.value - 1, 0, total.value - 1)
    scrollTo(index, { behavior: 'smooth' })
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2 flex-wrap text-sm">
      <NumberField.Root v-model="target" class="flex items-center" :max="total" :min="1">
        <NumberField.Decrement class="px-2 py-1 border border-divider rounded-l hover:bg-surface-tint disabled:opacity-50">
          &minus;
        </NumberField.Decrement>

        <NumberField.Control
          class="w-20 text-center border-y border-divider py-1 outline-none bg-surface text-on-surface"
          @keyup.enter="onJump"
        />

        <NumberField.Increment class="px-2 py-1 border border-divider rounded-r hover:bg-surface-tint disabled:opacity-50">
          +
        </NumberField.Increment>
      </NumberField.Root>

      <Button.Root class="px-3 py-1 border border-divider rounded hover:bg-surface-tint" @click="onJump">
        Jump to row
      </Button.Root>

      <span class="ml-auto text-on-surface-variant tabular-nums">
        Rendering {{ rendered }} of {{ total.toLocaleString() }} rows
      </span>
    </div>

    <div
      ref="element"
      class="h-[320px] overflow-y-auto border border-divider rounded bg-surface"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <div
        v-for="item in items"
        :key="item.index"
        class="h-[44px] px-4 flex items-center gap-3 border-b border-divider"
      >
        <span class="w-14 text-xs text-on-surface-variant tabular-nums">#{{ item.index + 1 }}</span>
        <span class="font-medium text-on-surface">{{ item.raw.name }}</span>
        <span class="text-xs text-on-surface-variant">{{ item.raw.role }}</span>
        <span class="ml-auto text-xs text-on-surface-variant">{{ item.raw.location }}</span>
      </div>

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>

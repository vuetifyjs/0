<script setup lang="ts">
  import { createRating } from '@vuetify/v0'

  const rating = createRating({ size: 5 })
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-1">
      <button
        v-for="item in rating.items.value"
        :key="item.value"
        class="size-8 text-xl transition-transform hover:scale-110 focus:outline-none"
        :class="item.state === 'full' ? 'text-amber-500' : 'text-on-surface-variant/40'"
        @click="rating.select(item.value)"
      >
        {{ item.state === 'full' ? '★' : '☆' }}
      </button>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="text-sm px-2 py-1 rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="rating.isFirst.value"
        @click="rating.prev()"
      >
        Prev
      </button>

      <span class="text-sm text-on-surface-variant tabular-nums">
        {{ rating.value.value }} / {{ rating.size }}
      </span>

      <button
        class="text-sm px-2 py-1 rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="rating.isLast.value"
        @click="rating.next()"
      >
        Next
      </button>
    </div>
  </div>
</template>

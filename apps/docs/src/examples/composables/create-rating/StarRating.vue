<script setup lang="ts">
  import type { StarRating } from './useStarRating'

  const { review } = defineProps<{ review: StarRating }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <div class="flex gap-1" @mouseleave="review.clearHover()">
        <div
          v-for="item in review.display.value"
          :key="item.value"
          class="relative size-9 text-3xl leading-none"
        >
          <span class="absolute inset-0 select-none text-on-surface-variant/25">☆</span>

          <span
            class="absolute inset-0 overflow-hidden select-none text-amber-500"
            :class="{
              'w-full': item.state === 'full',
              'w-1/2': item.state === 'half',
              'w-0': item.state === 'empty',
            }"
          >★</span>

          <button
            :aria-label="`Rate ${item.value - 0.5} stars`"
            class="absolute inset-y-0 left-0 z-10 w-1/2 focus:outline-none"
            type="button"
            @click="review.select(item.value - 0.5)"
            @mouseenter="review.setHover(item.value - 0.5)"
          />

          <button
            :aria-label="`Rate ${item.value} stars`"
            class="absolute inset-y-0 right-0 z-10 w-1/2 focus:outline-none"
            type="button"
            @click="review.select(item.value)"
            @mouseenter="review.setHover(item.value)"
          />
        </div>
      </div>

      <span class="text-sm font-medium text-on-surface">
        {{ review.label.value }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button
        class="px-2 py-1 text-sm rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="review.isFirst.value"
        type="button"
        @click="review.prev()"
      >
        Half down
      </button>

      <span class="text-sm text-on-surface-variant tabular-nums">
        {{ review.value.value }} / 5
      </span>

      <button
        class="px-2 py-1 text-sm rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="review.isLast.value"
        type="button"
        @click="review.next()"
      >
        Half up
      </button>
    </div>
  </div>
</template>

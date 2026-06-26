<script setup lang="ts">
  import type { CalendarCell } from './useCalendar'

  defineProps<{
    weekdays: string[]
    weeks: CalendarCell[][]
    monthYear: string
    prev: () => void
    next: () => void
    today: () => void
    select: (date: unknown) => void
  }>()
</script>

<template>
  <div class="w-72 mx-auto select-none rounded-lg border border-divider bg-surface p-4">
    <div class="flex items-center justify-between mb-3">
      <button
        class="size-7 rounded text-on-surface-variant hover:bg-surface-tint"
        type="button"
        @click="prev()"
      >
        &larr;
      </button>

      <div class="flex flex-col items-center leading-tight">
        <span class="font-semibold text-sm text-on-surface">{{ monthYear }}</span>

        <button
          class="text-xs text-primary hover:underline"
          type="button"
          @click="today()"
        >
          Today
        </button>
      </div>

      <button
        class="size-7 rounded text-on-surface-variant hover:bg-surface-tint"
        type="button"
        @click="next()"
      >
        &rarr;
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center">
      <div
        v-for="day in weekdays"
        :key="day"
        class="py-1 text-xs font-medium text-on-surface-variant"
      >
        {{ day }}
      </div>

      <template v-for="(week, w) in weeks" :key="w">
        <button
          v-for="(cell, d) in week"
          :key="`${w}-${d}`"
          class="aspect-square rounded text-sm text-on-surface transition-colors hover:bg-surface-tint data-[outside]:opacity-40 data-[today]:ring-1 data-[today]:ring-primary data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:ring-0 data-[selected]:hover:bg-primary"
          :data-outside="cell.outside || undefined"
          :data-selected="cell.selected || undefined"
          :data-today="cell.today || undefined"
          type="button"
          @click="select(cell.date)"
        >
          {{ cell.day }}
        </button>
      </template>
    </div>
  </div>
</template>

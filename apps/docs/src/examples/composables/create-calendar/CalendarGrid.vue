<script setup lang="ts">
  import type { CalendarCell } from '@vuetify/v0'
  import type { CalendarMark } from './month'

  const {
    label,
    weekdays,
    weeks,
    mark,
    select,
    prev,
    next,
  } = defineProps<{
    label: string
    weekdays: string[]
    weeks: CalendarCell[][]
    mark: (iso: string) => CalendarMark | undefined
    select: (iso: string) => void
    prev: () => void
    next: () => void
  }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <button
        class="rounded border border-divider px-2 py-1"
        type="button"
        @click="prev()"
      >
        Prev
      </button>

      <span>{{ label }}</span>

      <button
        class="rounded border border-divider px-2 py-1"
        type="button"
        @click="next()"
      >
        Next
      </button>
    </div>

    <div class="grid grid-cols-7 text-center text-xs">
      <span
        v-for="(name, index) in weekdays"
        :key="index"
      >
        {{ name }}
      </span>
    </div>

    <div
      v-for="(week, weekIndex) in weeks"
      :key="weekIndex"
      class="grid grid-cols-7"
    >
      <button
        v-for="cell in week"
        :key="cell.iso"
        class="h-8 data-[disabled=true]:opacity-40 data-[outside=true]:opacity-40 data-[mark=between]:bg-primary/20 data-[mark=between]:text-primary data-[mark=day]:rounded data-[mark=day]:bg-primary data-[mark=day]:text-on-primary data-[mark=start]:rounded-s data-[mark=start]:bg-primary data-[mark=start]:text-on-primary data-[mark=end]:rounded-e data-[mark=end]:bg-primary data-[mark=end]:text-on-primary data-[today=true]:rounded data-[today=true]:border data-[today=true]:border-divider"
        :data-disabled="cell.disabled || undefined"
        :data-mark="mark(cell.iso)"
        :data-outside="cell.outside || undefined"
        :data-today="cell.today || undefined"
        :disabled="cell.disabled || cell.outside"
        type="button"
        @click="select(cell.iso)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>

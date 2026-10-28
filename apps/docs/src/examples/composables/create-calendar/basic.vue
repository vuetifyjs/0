<script setup lang="ts">
  import { createCalendar } from '@vuetify/v0'

  const calendar = createCalendar({
    month: '2026-08',
    min: '2026-08-10',
    unavailable: (iso: string) => iso === '2026-08-15' || iso === '2026-08-16',
  })

  const { month, label, weekdays, value } = calendar
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <button
        class="rounded border border-divider px-2 py-1"
        type="button"
        @click="calendar.prev()"
      >
        Prev
      </button>

      <span>{{ label }}</span>

      <button
        class="rounded border border-divider px-2 py-1"
        type="button"
        @click="calendar.next()"
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
      v-for="(week, weekIndex) in month.weeks"
      :key="weekIndex"
      class="grid grid-cols-7"
    >
      <button
        v-for="cell in week"
        :key="cell.iso"
        class="h-8 rounded data-[disabled=true]:opacity-40 data-[outside=true]:opacity-40 data-[selected=true]:bg-primary data-[selected=true]:text-on-surface data-[today=true]:border data-[today=true]:border-divider data-[unavailable=true]:line-through"
        :data-disabled="cell.disabled || undefined"
        :data-outside="cell.outside || undefined"
        :data-selected="cell.selected || undefined"
        :data-today="cell.today || undefined"
        :data-unavailable="cell.unavailable || undefined"
        type="button"
        @click="calendar.select(cell.iso)"
      >
        {{ cell.day }}
      </button>
    </div>

    <p class="text-sm">
      {{ value ?? 'No date' }}
    </p>
  </div>
</template>

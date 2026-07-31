<script setup lang="ts">
  import CalendarGrid from './CalendarGrid.vue'
  import { useCalendar } from './useCalendar'

  const {
    weekdays,
    weeks,
    monthYear,
    selectedLabel,
    locale,
    prev,
    next,
    today,
    select,
  } = useCalendar()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-sm mx-auto">
    <CalendarGrid
      :month-year
      :next
      :prev
      :select
      :today
      :weekdays
      :weeks
    />

    <div class="flex items-center justify-between rounded-lg border border-divider bg-surface px-4 py-3">
      <div class="flex flex-col leading-tight">
        <span class="text-xs text-on-surface-variant">Selected</span>
        <span class="text-sm font-medium text-on-surface">{{ selectedLabel }}</span>
      </div>

      <span class="font-mono text-xs text-on-surface-variant">{{ locale }}</span>
    </div>
  </div>
</template>

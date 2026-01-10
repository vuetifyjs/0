<script setup lang="ts">
  import { useDate } from '@vuetify/v0'
  import { computed, shallowRef } from 'vue'

  const { adapter } = useDate()

  const current = shallowRef(adapter.date()!)
  const weekdays = computed(() => adapter.getWeekdays(0, 'narrow'))
  const weeks = computed(() => {
    const allWeeks = adapter.getWeekArray(current.value)
    // Always show exactly 5 weeks for consistent height
    if (allWeeks.length >= 5) return allWeeks.slice(0, 5)
    // Pad with next month's week if only 4 weeks (e.g., Feb 2025)
    const nextMonth = adapter.getNextMonth(current.value)
    const nextWeeks = adapter.getWeekArray(nextMonth)
    return [...allWeeks, nextWeeks[1]].slice(0, 5)
  })
  const monthYear = computed(() => adapter.format(current.value, 'monthAndYear'))

  function prev () {
    current.value = adapter.getPreviousMonth(current.value)
  }

  function next () {
    current.value = adapter.getNextMonth(current.value)
  }

  function isToday (date: typeof current.value) {
    const today = adapter.date()
    return today ? adapter.isSameDay(date, today) : false
  }

  function isCurrentMonth (date: typeof current.value) {
    return adapter.isSameMonth(date, current.value)
  }
</script>

<template>
  <div class="w-64 mx-auto">
    <div class="flex items-center justify-between mb-2 px-2">
      <button
        class="p-1 rounded hover:bg-surface-tint"
        type="button"
        @click="prev"
      >
        &larr;
      </button>
      <span class="font-semibold text-sm">{{ monthYear }}</span>
      <button
        class="p-1 rounded hover:bg-surface-tint"
        type="button"
        @click="next"
      >
        &rarr;
      </button>
    </div>

    <div class="grid grid-cols-7 gap-px text-center text-xs">
      <div
        v-for="day in weekdays"
        :key="day"
        class="p-1 font-medium opacity-60"
      >
        {{ day }}
      </div>

      <template v-for="(week, i) in weeks" :key="i">
        <div
          v-for="(date, j) in week"
          :key="j"
          class="p-1 rounded"
          :class="{
            'bg-primary text-on-primary': isToday(date),
            'opacity-40': !isCurrentMonth(date),
          }"
        >
          {{ adapter.getDate(date) }}
        </div>
      </template>
    </div>
  </div>
</template>

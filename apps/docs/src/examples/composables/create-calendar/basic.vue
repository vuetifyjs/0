<script setup lang="ts">
  import CalendarGrid from './CalendarGrid.vue'
  import { caption, day, mark } from './month'
  import { createCalendar } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const mode = shallowRef<'single' | 'range'>('range')

  const calendar = createCalendar({
    mode,
    min: day(10),
    disabled: (iso: string) => iso === day(15) || iso === day(16),
    value: { start: day(12), end: day(20) },
  })

  const { month, label, weekdays, value } = calendar

  const summary = toRef(() => caption(value.value, mode.value))

  function paint (iso: string) {
    return mark(value.value, iso)
  }
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <CalendarGrid
      :label
      :mark="paint"
      :next="calendar.next"
      :prev="calendar.prev"
      :select="calendar.select"
      :weekdays
      :weeks="month.weeks"
    />

    <div class="flex items-center justify-center gap-2">
      <button
        class="rounded border border-divider px-2 py-1 data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        :data-state="mode === 'single' ? 'on' : undefined"
        type="button"
        @click="mode = 'single'"
      >
        Single
      </button>

      <button
        class="rounded border border-divider px-2 py-1 data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        :data-state="mode === 'range' ? 'on' : undefined"
        type="button"
        @click="mode = 'range'"
      >
        Range
      </button>
    </div>

    <p class="text-sm">
      {{ summary }}
    </p>
  </div>
</template>

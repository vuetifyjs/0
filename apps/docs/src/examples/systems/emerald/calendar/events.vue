<script setup lang="ts">
  import {
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
  } from '@paper/emerald'

  import type { EmCalendarEvent } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const day = shallowRef('')

  const now = new Date()

  // Anchored to the visible month so the example is never empty.
  function on (offset: number) {
    return new Date(now.getFullYear(), now.getMonth(), offset)
  }

  const events: EmCalendarEvent[] = [
    { date: on(4), title: 'Design review', time: '10:00', tone: 'primary' },
    { date: on(4), title: 'Retro', time: '16:30', tone: 'neutral' },
    { date: on(4), title: 'Deploy window', time: '18:00', tone: 'info' },
    { date: on(11), title: 'Offsite', allDay: true, tone: 'secondary' },
    { date: on(18), title: 'Invoice due', time: '09:00', tone: 'alert' },
    { date: on(23), title: 'Contract expires', allDay: true, tone: 'danger' },
  ]
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCalendar v-model="day" :events>
      <EmCalendarHeader>
        <EmCalendarPrev />

        <EmCalendarTitle />

        <EmCalendarNext />
      </EmCalendarHeader>

      <EmCalendarGrid />
    </EmCalendar>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 460px;
  }
</style>

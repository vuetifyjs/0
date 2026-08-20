<script setup lang="ts">
  import {
    EmCalendar,
    EmCalendarHeader,
    EmCalendarMini,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
  } from '@paper/emerald'

  import type { EmCalendarEvent } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const day = shallowRef('')

  const now = new Date()

  function on (offset: number) {
    return new Date(now.getFullYear(), now.getMonth(), offset)
  }

  const events: EmCalendarEvent[] = [
    { date: on(6), title: 'Standup', tone: 'primary' },
    { date: on(6), title: 'Sync', tone: 'info' },
    { date: on(14), title: 'Release', tone: 'primary' },
    { date: on(21), title: 'Renewal', tone: 'alert' },
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

      <EmCalendarMini />
    </EmCalendar>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 260px;
  }
</style>

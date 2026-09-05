<script setup lang="ts">
  import {
    EmButton,
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
    EmCalendarToday,
  } from '@paper/emerald'

  import { ref, shallowRef } from 'vue'

  const day = shallowRef('')
  const month = ref(new Date())

  function onJump () {
    month.value = new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1)
  }
</script>

<template>
  <div class="emerald-docs-calendar">
    <EmCalendar v-model="day" v-model:month="month">
      <EmCalendarHeader>
        <EmCalendarPrev />

        <EmCalendarTitle />

        <EmCalendarNext />

        <EmCalendarToday />
      </EmCalendarHeader>

      <EmCalendarGrid />
    </EmCalendar>

    <div class="emerald-docs-row">
      <EmButton size="sm" variant="secondary" @click="onJump">Jump a year ahead</EmButton>
    </div>
  </div>
</template>

<style>
  .emerald-docs-calendar {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>

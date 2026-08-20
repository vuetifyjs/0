<script setup lang="ts">
  import {
    EmCalendar,
    EmCalendarGrid,
    EmCalendarHeader,
    EmCalendarNext,
    EmCalendarPrev,
    EmCalendarTitle,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const day = shallowRef('')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCalendar v-model="day">
      <EmCalendarHeader>
        <EmCalendarPrev />

        <EmCalendarTitle />

        <EmCalendarNext />
      </EmCalendarHeader>

      <EmCalendarGrid />
    </EmCalendar>

    <p v-if="day" class="emerald-docs-note">
      Selected: <code>{{ day }}</code>
    </p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-note {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant);
  }
</style>

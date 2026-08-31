<script setup lang="ts">
  import { EmCalendar } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const day = shallowRef('')
</script>

<template>
  <div class="emerald-docs-calendar">
    <EmCalendar v-model="day">
      <EmCalendar.Header>
        <EmCalendar.Prev />

        <EmCalendar.Title />

        <EmCalendar.Next />
      </EmCalendar.Header>

      <EmCalendar.Grid />
    </EmCalendar>

    <p v-if="day" class="emerald-docs-note">
      Selected: <code>{{ day }}</code>
    </p>
  </div>
</template>

<style>
  .emerald-docs-calendar {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .emerald-docs-note {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant);
  }
</style>
